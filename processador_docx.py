from docx import Document
from docx.enum.text import WD_COLOR_INDEX
from docx.oxml import OxmlElement
from docx.text.paragraph import Paragraph
import copy
import os
import re

def preencher_documento(caminho_modelo: str, caminho_saida: str, dados: dict) -> str:
    doc = Document(caminho_modelo)
    e_arp = dados.get("E_ARP", False)
    
    remover_amostra = dados.get("__REMOVER_AMOSTRA__", False)
    remover_vistoria = dados.get("__REMOVER_VISTORIA__", False)

    paragrafos_remover_set = set()
    for i, p in enumerate(doc.paragraphs):
        texto_upper = p.text.strip().upper()
        
        is_amostra = remover_amostra and "AMOSTRA" in texto_upper and len(texto_upper) < 60
        is_vistoria = remover_vistoria and "VISTORIA" in texto_upper and len(texto_upper) < 60
        
        if is_amostra or is_vistoria:
            paragrafos_remover_set.add(p)
            
            idx = i + 1
            while idx < len(doc.paragraphs):
                next_p = doc.paragraphs[idx]
                txt = next_p.text.strip()
                if not txt or (remover_amostra and "{{AMOSTRA}}" in txt) or (remover_vistoria and "{{VISTORIA}}" in txt):
                    paragrafos_remover_set.add(next_p)
                    idx += 1
                else:
                    break
                    
            idx = i - 1
            while idx >= 0:
                prev_p = doc.paragraphs[idx]
                if not prev_p.text.strip():
                    paragrafos_remover_set.add(prev_p)
                    idx -= 1
                else:
                    break

    for p in paragrafos_remover_set:
        try:
            p._element.getparent().remove(p._element)
        except Exception:
            pass

    for paragrafo in list(doc.paragraphs):
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
                for paragrafo in list(celula.paragraphs):
                    _processar_paragrafo(paragrafo, dados, e_arp)
                    
    for section in doc.sections:
        for header in [section.header, section.first_page_header, section.even_page_header]:
            if header:
                for paragrafo in list(header.paragraphs):
                    _processar_paragrafo(paragrafo, dados, e_arp)
                for tabela in header.tables:
                    for linha in tabela.rows:
                        for celula in linha.cells:
                            for paragrafo in list(celula.paragraphs):
                                _processar_paragrafo(paragrafo, dados, e_arp)
        for footer in [section.footer, section.first_page_footer, section.even_page_footer]:
            if footer:
                for paragrafo in list(footer.paragraphs):
                    _processar_paragrafo(paragrafo, dados, e_arp)
                for tabela in footer.tables:
                    for linha in tabela.rows:
                        for celula in linha.cells:
                            for paragrafo in list(celula.paragraphs):
                                _processar_paragrafo(paragrafo, dados, e_arp)

    if not e_arp:
        body = doc.element.body
        remover = False
        elementos_para_remover = []
        for child in body:
            if child.tag.endswith('p'):
                texto = "".join(child.itertext()).strip().upper()
                if "MINUTA DA ATA DE REGISTRO DE PREÇOS" in texto:
                    remover = True
            if remover:
                elementos_para_remover.append(child)
        
        for el in elementos_para_remover:
            try:
                el.getparent().remove(el)
            except Exception:
                pass

    doc.save(caminho_saida)
    return caminho_saida

def _inserir_multilinhas(paragrafo, valor_str, primeira_substituicao_callback):
    linhas = str(valor_str).split('\n')
    primeira_substituicao_callback(linhas[0])
    
    paragrafo_atual = paragrafo
    for linha in linhas[1:]:
        if not linha.strip():
            continue
            
        novo_p = OxmlElement("w:p")
        paragrafo_atual._p.addnext(novo_p)
        
        if paragrafo_atual._p.pPr is not None:
            novo_p.append(copy.deepcopy(paragrafo_atual._p.pPr))
            
        novo_paragrafo_obj = Paragraph(novo_p, paragrafo_atual._parent)
        novo_paragrafo_obj.add_run(linha)
        paragrafo_atual = novo_paragrafo_obj

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
        valor_str = str(valor)
        
        if marcador in texto_completo:
            found_in_run = False
            for run in paragrafo.runs:
                if marcador in run.text:
                    if not valor_str.strip() and run.text.strip() == marcador:
                        apagou_algo = True
                    
                    if '\n' in valor_str:
                        def set_primeira_linha(texto):
                            run.text = run.text.replace(marcador, texto)
                        _inserir_multilinhas(paragrafo, valor_str, set_primeira_linha)
                    else:
                        run.text = run.text.replace(marcador, valor_str)
                        
                    found_in_run = True
            
            if not found_in_run:
                texto = paragrafo.text
                if marcador in texto:
                    novo_texto = texto.replace(marcador, valor_str)
                    if paragrafo.runs:
                        primeiro_run = paragrafo.runs[0]
                        for run in paragrafo.runs:
                            run.text = ""
                        
                        if '\n' in novo_texto:
                            def set_primeira_linha_fallback(texto_linha):
                                primeiro_run.text = texto_linha
                            _inserir_multilinhas(paragrafo, novo_texto, set_primeira_linha_fallback)
                        else:
                            primeiro_run.text = novo_texto

    texto_p = paragrafo.text
    if "***" in texto_p or "**" in texto_p:
        parts = re.split(r'(\*\*\*.*?\*\*\*|\*\*.*?\*\*)', texto_p)
        if len(parts) > 1:
            p_font_name = None
            p_font_size = None
            if paragrafo.runs:
                p_font_name = paragrafo.runs[0].font.name
                p_font_size = paragrafo.runs[0].font.size
                
            for r in paragrafo.runs:
                r.text = ""
                
            for part in parts:
                if not part: continue
                run_new = paragrafo.add_run()
                if p_font_name: run_new.font.name = p_font_name
                if p_font_size: run_new.font.size = p_font_size
                
                if part.startswith('***') and part.endswith('***'):
                    run_new.text = part[3:-3]
                    run_new.font.bold = True
                    run_new.font.italic = True
                    run_new.font.underline = True
                elif part.startswith('**') and part.endswith('**'):
                    run_new.text = part[2:-2]
                    run_new.font.bold = True
                else:
                    run_new.text = part

    if apagou_algo and not paragrafo.text.strip():
        try:
            p_element = paragrafo._element
            p_element.getparent().remove(p_element)
        except Exception:
            pass