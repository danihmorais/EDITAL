import config
from datetime import datetime, timedelta

CHAVES_RAW = {
    "RAW_EXECUCAO",
    "RAW_MOTIVO_CRITERIO",
    "RAW_MOTIVO_MODALIDADE",
    "RAW_PAC",
    "INSTRUCOES_EXTRAS",
    "REQUISITOS_ETP_ANTERIOR",
}

SIM_VALORES = {"sim", "s", "x", "true", "1"}
NAO_VALORES = {"não", "nao", "n", "", "false", "0"}

def _normalizar_sim_nao(valor) -> str:
    return str(valor).strip().casefold()

def _converter_para_sim(valor) -> bool:
    return _normalizar_sim_nao(valor) in SIM_VALORES

def _formatar_lista_assinaturas(nomes_str: str, cargos_str: str):
    nomes = [nome.strip() for nome in nomes_str.split(",") if nome.strip()]
    cargos = [cargo.strip() for cargo in cargos_str.split(",") if cargo.strip()]
    resultado = []
    for index, nome in enumerate(nomes):
        cargo = cargos[index] if index < len(cargos) else ""
        resultado.append(f"{nome} ({cargo})" if cargo else nome)
    return resultado

def _formatar_hora_min(hora_str: str) -> str:
    if not hora_str:
        return ""
    try:
        t = datetime.strptime(hora_str, "%H:%M")
        return t.strftime("%Hh%Mmin")
    except Exception:
        return hora_str

def _subtrair_15_min(hora_str: str) -> str:
    if not hora_str:
        return ""
    try:
        t = datetime.strptime(hora_str, "%H:%M")
        t_sub = t - timedelta(minutes=15)
        return t_sub.strftime("%Hh%Mmin")
    except Exception:
        return hora_str

def _formatar_multiplos(valor: str) -> str:
    if not valor:
        return ""
    return str(valor).replace(",", "\n").replace(";", "\n")

def montar_variaveis_fixas(dados_usuario: dict) -> dict:
    resultado = {}

    for chave, valor in dados_usuario.items():
        chave_limpa = chave.strip("{}")
        if chave_limpa in CHAVES_RAW or chave in CHAVES_RAW:
            continue
        resultado[chave] = valor
    
    amostra_opt = dados_usuario.get("{{AMOST}}", "nao")
    texto_amostra = config.TEXTOS.get("amostra_tr", "") if _converter_para_sim(amostra_opt) else ""
    resultado["{{AMOSTRA}}"] = texto_amostra
    resultado["{{AMOSTRA_TR}}"] = texto_amostra

    vistoria_opt = dados_usuario.get("{{VIST}}", "nao")
    texto_vistoria = config.TEXTOS.get("vistoria_tr", "") if _converter_para_sim(vistoria_opt) else ""
    resultado["{{VISTORIA}}"] = texto_vistoria
    resultado["{{VISTORIA_TR}}"] = texto_vistoria

    instrumento_raw = dados_usuario.get("{{INSTRUMENTO}}", "CONTRATO")
    resultado["E_ARP"] = True if instrumento_raw == "ATA" else False

    modalidade_raw = dados_usuario.get("{{MODALIDADE}}", "PREGAO_ELETRONICO")

    prorroga = dados_usuario.get("{{PRORROGA}}", "NÃO")
    
    if instrumento_raw == "ATA":
        if _converter_para_sim(prorroga):
            clausula_prorroga = config.TEXTOS.get("clausula_ata", "")
            if not clausula_prorroga:
                clausula_prorroga = config.TEXTOS.get("clausula_padrao", "")
            texto_prorroga = "podendo ser prorrogado por igual período, nos termos do art. 84 da Lei Federal nº 14.133/2021"
            texto_prorroga_sn = "Sim"
        else:
            clausula_prorroga = ""
            texto_prorroga = "e será improrrogável"
            texto_prorroga_sn = "Não"
    else:
        if _converter_para_sim(prorroga):
            clausula_prorroga = config.TEXTOS.get("clausula_padrao", "")
            texto_prorroga = "podendo ser prorrogado por igual período, nos termos dos arts. 106 e 107 da Lei Federal nº 14.133/2021, e art. 68 do Decreto Municipal nº 2056/24"
            texto_prorroga_sn = "Sim"
        else:
            clausula_prorroga = ""
            texto_prorroga = "e será improrrogável"
            texto_prorroga_sn = "Não"
        
    resultado["{{PRORROGA_CLAUS}}"] = clausula_prorroga
    resultado["{{PRORROGA}}"] = texto_prorroga
    resultado["{{PRORROGA_SN}}"] = texto_prorroga_sn

    meepp = dados_usuario.get("{{ME_EPP}}", "NAO")
    if _converter_para_sim(meepp):
        texto_meepp = config.TEXTOS.get("meepp_exclusivo", "")
    else:
        texto_meepp = config.TEXTOS.get("meepp_nao_exclusivo", "")
    resultado["{{ME_EPP_TR}}"] = texto_meepp

    resultado["{{ME_EPP}}"] = (
        "Exclusiva para ME/EPP" if _converter_para_sim(meepp)
        else "Não exclusiva para ME/EPP"
    )

    criterio_raw = dados_usuario.get("{{CRITERIOS}}", "ITEM")
    if criterio_raw == "LOTE":
        resultado["{{LOTE}}"] = "Quando a licitação se der por lote, o Pregoeiro convocará o licitante vencedor para readequar, INCLUSIVE e ESPECIALMENTE, os valores unitários.\n\tO Pregoeiro estipulará o prazo para readequação de que trata este item, conforme a complexidade do objeto."
    else:
        resultado["{{LOTE}}"] = ""

    gestores_str = dados_usuario.get("{{GESTOR}}", "")
    cargos_gestores_str = dados_usuario.get("{{GESTOR_CARGO}}", "")
    fiscais_str = dados_usuario.get("{{FISCAL}}", "")
    cargos_fiscais_str = dados_usuario.get("{{FISCAL_CARGO}}", "")

    resultado["{{GESTOR}}"] = _formatar_multiplos(gestores_str)
    resultado["{{FISCAL}}"] = _formatar_multiplos(fiscais_str)

    blocos_ges_fis = []

    if gestores_str and gestores_str != "[Não informado]":
        nomes_g = [n.strip() for n in gestores_str.split(",") if n.strip()]
        cargos_g = [c.strip() for c in cargos_gestores_str.split(",") if c.strip()]
        for i, nome in enumerate(nomes_g):
            cargo = cargos_g[i] if i < len(cargos_g) else ""
            bloco = f"**GESTOR:**\nNome: {nome}\nCargo (se for o caso): {cargo}\nCPF:\n**Assinatura:** ______________________________________________________"
            blocos_ges_fis.append(bloco)

    if fiscais_str and fiscais_str != "[Não informado]":
        nomes_f = [n.strip() for n in fiscais_str.split(",") if n.strip()]
        cargos_f = [c.strip() for c in cargos_fiscais_str.split(",") if c.strip()]
        for i, nome in enumerate(nomes_f):
            cargo = cargos_f[i] if i < len(cargos_f) else ""
            bloco = f"**FISCAL:**\nNome: {nome}\nCargo (se for o caso): {cargo}\nCPF:\n**Assinatura:** ______________________________________________________"
            blocos_ges_fis.append(bloco)

    resultado["{{GES.FIS.ANEXOS}}"] = "\n\n".join(blocos_ges_fis) if blocos_ges_fis else ""

    resultado["{{GESTORES}}"] = (
        "; ".join(_formatar_lista_assinaturas(gestores_str, cargos_gestores_str))
        if gestores_str and gestores_str != "[Não informado]"
        else "[Não informado]"
    )

    hora_sessao = dados_usuario.get("{{HORA_SESSAO}}", "")
    if not hora_sessao and "{{HORA SESSAO}}" in dados_usuario:
        hora_sessao = dados_usuario["{{HORA SESSAO}}"]
        
    if hora_sessao:
        resultado["{{HORA SESSAO}}"] = _formatar_hora_min(hora_sessao)
        resultado["{{HORA_SESSAO}}"] = _formatar_hora_min(hora_sessao)
        resultado["{{HORA FIM DO REC}}"] = _subtrair_15_min(hora_sessao)
        
        if modalidade_raw == "PREGAO_PRESENCIAL":
            resultado["{{HORA INICIO CRED}}"] = _subtrair_15_min(hora_sessao)
        else:
            resultado["{{HORA INICIO CRED}}"] = ""

    decl_adicionais = dados_usuario.get("{{DECL.ADICIONAIS}}", "")
    if decl_adicionais:
        resultado["{{DECL.ADICIONAIS}}"] = "\n".join([d.strip() for d in decl_adicionais.split("\n") if d.strip()])
    else:
        resultado["{{DECL.ADICIONAIS}}"] = ""

    vigencia = dados_usuario.get("{{VIGENCIA}}", "")
    resultado["{{VIGENCIA}}"] = vigencia

    return resultado

def filtrar_chaves_docx(dados: dict) -> dict:
    return {k: v for k, v in dados.items() if (k.startswith("{{") and k.endswith("}}")) or k == "E_ARP"}