from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import uvicorn
from processador_docx import preencher_documento
from montador_variaveis import montar_variaveis_fixas

app = FastAPI()

class EditalRequest(BaseModel):
    tipo_edital: str
    dados_preenchimento: dict

MODELOS_DISPONIVEIS = {
    "dispensa": "modelos/Dispensa xx Proc xx -  MINUTA DE 15.04.2026.docx",
    "dispensa_bll": "modelos/Dispensa xx Proc xx -  MINUTA DP 15.04.2026.docx",
    "pregao_eletronico": "modelos/Pregão xx Proc xx -  MINUTA PE 15.04.2026.docx",
    "pregao_presencial": "modelos/Pregão xx Proc xx -  MINUTA PP 15.04.2026.docx"
}

MOD_ABR_MAP = {
    "PREGAO_PRESENCIAL": "PP",
    "PREGAO_ELETRONICO": "PE",
    "DISPENSA_BLL": "DE",
    "DISPENSA": "DP"
}

MODALIDADE_TEXTO = {
    "PREGAO_ELETRONICO": "Pregão Eletrônico",
    "DISPENSA": "Dispensa Eletrônica",
    "DISPENSA_BLL": "Dispensa Eletrônica BLL",
    "PREGAO_PRESENCIAL": "Pregão Presencial"
}

@app.post("/gerar")
def gerar_edital(request: EditalRequest):
    caminho_modelo = MODELOS_DISPONIVEIS.get(request.tipo_edital)
    
    if not caminho_modelo:
        raise HTTPException(status_code=400, detail="Tipo de edital inválido.")
        
    if not os.path.exists(caminho_modelo):
        raise HTTPException(status_code=404, detail="Arquivo de modelo não encontrado no servidor.")

    diretorio_saida = "editais_gerados"
    os.makedirs(diretorio_saida, exist_ok=True)
    
    dados_processados = montar_variaveis_fixas(request.dados_preenchimento)
    
    modalidade_raw = dados_processados.get("{{MODALIDADE}}", "PREGAO_ELETRONICO")
    mod_abr = MOD_ABR_MAP.get(modalidade_raw, "PE")
    modalidade_nome = MODALIDADE_TEXTO.get(modalidade_raw, "Pregão Eletrônico")
    
    num_mod = dados_processados.get("{{N.MODALIDADE}}", "00")
    num_proc = dados_processados.get("{{N.PROCESSO}}", "00")
    
    dados_edital = dados_processados.copy()
    dados_edital["{{MINUTA DE}}"] = ""
    nome_arq_edital = f"{modalidade_nome} {num_mod} Proc {num_proc} - {mod_abr} 15.04.2026.docx"
    caminho_edital = os.path.join(diretorio_saida, nome_arq_edital)
    preencher_documento(caminho_modelo, caminho_edital, dados_edital)
    
    dados_minuta = dados_processados.copy()
    dados_minuta["{{N.MODALIDADE}}"] = "XX"
    dados_minuta["{{MINUTA DE}}"] = "MINUTA DE "
    nome_arq_minuta = f"{modalidade_nome} XX Proc {num_proc} - MINUTA DE {mod_abr} 15.04.2026.docx"
    caminho_minuta = os.path.join(diretorio_saida, nome_arq_minuta)
    preencher_documento(caminho_modelo, caminho_minuta, dados_minuta)

    return {
        "sucesso": True, 
        "caminhos": [caminho_edital, caminho_minuta],
        "caminho_arquivo": caminho_edital
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)