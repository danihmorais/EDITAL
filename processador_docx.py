from docx import Document
from docx.enum.text import WD_COLOR_INDEX
import os

def preencher_documento(caminho_modelo: str, caminho_saida: str, dados: dict) -> str:
    doc = Document(caminho_modelo)
    
    e_arp = dados.get("E_ARP", False)
    
    for paragrafo in doc.paragraphs:
        if not e_arp:
            for run in paragrafo.runs:
                if run.font.highlight_color in [WD_COLOR_INDEX.BRIGHT_GREEN, WD_COLOR_INDEX.GREEN]:
                    run.text = ""
        
        for chave, valor in dados.items():
            if chave == "E_ARP":
                continue
            marcador = chave if chave.startswith("{{") and chave.endswith("}}") else f"{{{{{chave}}}}}"
            if marcador in paragrafo.text:
                paragrafo.text = paragrafo.text.replace(marcador, str(valor))
                
    for tabela in doc.tables:
        for linha in tabela.rows:
            for celula in linha.cells:
                for paragrafo in celula.paragraphs:
                    if not e_arp:
                        for run in paragrafo.runs:
                            if run.font.highlight_color in [WD_COLOR_INDEX.BRIGHT_GREEN, WD_COLOR_INDEX.GREEN]:
                                run.text = ""
                                
                    for chave, valor in dados.items():
                        if chave == "E_ARP":
                            continue
                        marcador = chave if chave.startswith("{{") and chave.endswith("}}") else f"{{{{{chave}}}}}"
                        if marcador in paragrafo.text:
                            paragrafo.text = paragrafo.text.replace(marcador, str(valor))
                            
    doc.save(caminho_saida)
    return caminho_saida