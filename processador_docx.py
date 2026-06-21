from docx import Document
from docx.enum.text import WD_COLOR_INDEX
import os

def preencher_documento(caminho_modelo: str, caminho_saida: str, dados: dict) -> str:
    doc = Document(caminho_modelo)
    e_arp = dados.get("E_ARP", False)
    
    remover_amostra = dados.get("__REMOVER_AMOSTRA__", False)
    remover_vistoria = dados.get("__REMOVER_VISTORIA__", False)
    
    if not e_arp:
        remover_resto = False
        paragrafos_para_remover = []
        for p in doc.paragraphs:
            if "ANEXO VII - MINUTA DA ATA DE REGISTRO DE PREÇOS" in p.text:
                remover_resto = True
            if remover_resto:
                paragrafos_para_remover.append(p)
        for p in paragrafos_para_remover:
            p_element = p._element
            p_element.getparent().remove(p_element)
            
        tabelas_para_remover = []
        remover_resto_tabela = False
        for body_element in doc.element.body:
            if body_element.tag.endswith('p'):
                p_text = "".join(body_element.itertext())
                if "ANEXO VII - MINUTA DA ATA DE REGISTRO DE PREÇOS" in p_text:
                    remover_resto_tabela = True
            elif body_element.tag.endswith('tbl') and remover_resto_tabela:
                body_element.getparent().remove(body_element)

    paragrafos_titulos_remover = []
    for p in doc.paragraphs:
        texto_upper = p.text.strip().upper()
        if remover_amostra and "AMOSTRA" in texto_upper and len(texto_upper) < 60:
            paragrafos_titulos_remover.append(p)
        if remover_vistoria and "VISTORIA" in texto_upper and len(texto_upper) < 60:
            paragrafos_titulos_remover.append(p)
            
    for p in paragrafos_titulos_remover:
        try:
            p._element.getparent().remove(p._element)
        except Exception:
            pass

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
                    
    for section in doc.sections:
        for header in [section.header, section.first_page_header, section.even_page_header]:
            if header:
                for paragrafo in header.paragraphs:
                    _processar_paragrafo(paragrafo, dados, e_arp)
                for tabela in header.tables:
                    for linha in tabela.rows:
                        for celula in linha.cells:
                            for paragrafo in celula.paragraphs:
                                _processar_paragrafo(paragrafo, dados, e_arp)
        for footer in [section.footer, section.first_page_footer, section.even_page_footer]:
            if footer:
                for paragrafo in footer.paragraphs:
                    _processar_paragrafo(paragrafo, dados, e_arp)
                for tabela in footer.tables:
                    for linha in tabela.rows:
                        for celula in linha.cells:
                            for paragrafo in celula.paragraphs:
                                _processar_paragrafo(paragrafo, dados, e_arp)

    doc.save(caminho_saida)
    return caminho_saida

def _processar_paragrafo(paragrafo, dados, e_arp):
    apagou_algo = False
    
    if not e_arp:
        for run in paragrafo.runs:
            if run.font.highlight_color in [WD_COLOR_INDEX.BRIGHT_GREEN, WD_COLOR_INDEX.GREEN]:
                if run.text:
                    run.text = ""
                    apagou_algo = True

    texto_completo = paragrafo.text
    for chave, valor in dados.items():
        if chave in ["E_ARP", "__REMOVER_AMOSTRA__", "__REMOVER_VISTORIA__"]:
            continue
            
        marcador = chave if chave.startswith("{{") and chave.endswith("}}") else f"{{{{{chave}}}}}"
        
        if marcador in texto_completo:
            found_in_run = False
            for run in paragrafo.runs:
                if marcador in run.text:
                    if not str(valor).strip() and run.text.strip() == marcador:
                        apagou_algo = True
                    run.text = run.text.replace(marcador, str(valor))
                    found_in_run = True
            
            if not found_in_run:
                texto = paragrafo.text
                if marcador in texto:
                    novo_texto = texto.replace(marcador, str(valor))
                    if paragrafo.runs:
                        primeiro_run = paragrafo.runs[0]
                        for run in paragrafo.runs:
                            run.text = ""
                        primeiro_run.text = novo_texto

    for run in paragrafo.runs:
        if "**" in run.text:
            run.text = run.text.replace("**", "")
            run.font.bold = True
            run.font.italic = True
            run.font.underline = True

    if apagou_algo and not paragrafo.text.strip():
        try:
            p_element = paragrafo._element
            p_element.getparent().remove(p_element)
        except Exception:
            pass