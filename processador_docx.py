from docx import Document
from docx.enum.text import WD_COLOR_INDEX
import os

def preencher_documento(caminho_modelo: str, caminho_saida: str, dados: dict) -> str:
    doc = Document(caminho_modelo)
    e_arp = dados.get("E_ARP", False)
    
    for paragrafo in doc.paragraphs:
        _processar_paragrafo(paragrafo, dados, e_arp)
                
    for tabela in doc.tables:
        colunas_para_remover = []
        for i, coluna in enumerate(tabela.columns):
            remover_esta = False
            for cell in coluna.cells:
                if "__REMOVER_COLUNA__" in cell.text:
                    remover_esta = True
                    break
            if remover_esta:
                colunas_para_remover.append(i)
        
        for col_idx in reversed(colunas_para_remover):
            for row in tabela.rows:
                try:
                    tc = row.cells[col_idx]._tc
                    tc.getparent().remove(tc)
                except Exception:
                    pass
                    
        for linha in tabela.rows:
            for celula in linha.cells:
                for paragrafo in celula.paragraphs:
                    _processar_paragrafo(paragrafo, dados, e_arp)
                    
    doc.save(caminho_saida)
    return caminho_saida

def _processar_paragrafo(paragrafo, dados, e_arp):
    if not e_arp:
        for run in paragrafo.runs:
            if run.font.highlight_color in [WD_COLOR_INDEX.BRIGHT_GREEN, WD_COLOR_INDEX.GREEN]:
                run.text = ""
                
    for run in paragrafo.runs:
        for chave, valor in dados.items():
            if chave == "E_ARP":
                continue
            marcador = chave if chave.startswith("{{") and chave.endswith("}}") else f"{{{{{chave}}}}}"
            if marcador in run.text:
                run.text = run.text.replace(marcador, str(valor))