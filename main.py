from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import uvicorn
from processador_docx import preencher_documento

app = FastAPI()

class EditalRequest(BaseModel):
    tipo_edital: str
    dados_preenchimento: dict

MODELOS_DISPONIVEIS = {
    "dispensa": "modelos/Dispensa xx Proc xx -  MINUTA DE 15.04.2026.docx",
    "dispensa_bll": "modelos/Dispensa xx Proc xx -  MINUTA DP 15.04.2026.docx",
    "pregao_eletronico": "modelos/Preg o xx Proc xx -  MINUTA PE 15.04.2026.docx",
    "pregao_presencial": "modelos/Preg o xx Proc xx -  MINUTA PP 15.04.2026.docx"
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
    caminho_saida = os.path.join(diretorio_saida, f"Edital_Gerado_{request.tipo_edital}.docx")

    try:
        arquivo_final = preencher_documento(caminho_modelo, caminho_saida, request.dados_preenchimento)
        return {"sucesso": True, "caminho_arquivo": arquivo_final}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)