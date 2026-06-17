from docx import Document
import os

def preencher_documento(caminho_modelo: str, caminho_saida: str, dados: dict) -> str:
    doc = Document(caminho_modelo)
    
    for paragrafo in doc.paragraphs:
        for chave, valor in dados.items():
            marcador = f"{{{{{chave}}}}}"
            if marcador in paragrafo.text:
                paragrafo.text = paragrafo.text.replace(marcador, str(valor))
                
    for tabela in doc.tables:
        for linha in tabela.rows:
            for celula in linha.cells:
                for paragrafo in celula.paragraphs:
                    for chave, valor in dados.items():
                        marcador = f"{{{{{chave}}}}}"
                        if marcador in paragrafo.text:
                            paragrafo.text = paragrafo.text.replace(marcador, str(valor))
                            
    doc.save(caminho_saida)
    return caminho_saida