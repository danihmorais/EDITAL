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

def _limpar_valor_numerico(valor) -> float:
    try:
        v_str = str(valor).strip()
        if not v_str:
            return 0.0
        v_str = v_str.replace('R$', '').strip()
        if v_str.count(',') == 1 and v_str.count('.') >= 0:
            v_str = v_str.replace('.', '').replace(',', '.')
        return float(v_str)
    except Exception:
        return 0.0

def _formatar_valor(valor: float) -> str:
    try:
        return f"{valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return str(valor)

def _valor_por_extenso(valor: float) -> str:
    try:
        unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"]
        dez1 = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"]
        dezenas = ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"]
        centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"]

        def converte_bloco(n):
            if n == 0: return ""
            if n == 100: return "cem"
            c = n // 100
            d = (n % 100) // 10
            u = n % 10
            res = []
            if c > 0: res.append(centenas[c])
            if d == 1:
                res.append(dez1[u])
            else:
                if d > 1: res.append(dezenas[d])
                if u > 0: res.append(unidades[u])
            return " e ".join(res)

        inteiro = int(valor)
        centavos = int(round((valor - inteiro) * 100))
        
        if inteiro == 0 and centavos == 0: 
            return "zero reais"
        
        partes = []
        if inteiro > 0:
            milhoes = inteiro // 1000000
            milhares = (inteiro % 1000000) // 1000
            unids = inteiro % 1000
            
            if milhoes > 0:
                partes.append(converte_bloco(milhoes) + (" milhões" if milhoes > 1 else " milhão"))
            if milhares > 0:
                partes.append(converte_bloco(milhares) + " mil")
            if unids > 0:
                str_unids = converte_bloco(unids)
                if milhoes > 0 or milhares > 0:
                    if unids <= 100 or unids % 100 == 0:
                        partes.append("e " + str_unids)
                    else:
                        partes.append(str_unids)
                else:
                    partes.append(str_unids)
            
            str_inteiro = " ".join(partes)
            if milhoes > 0 and milhares == 0 and unids == 0:
                str_inteiro += " de reais"
            else:
                str_inteiro += " reais" if inteiro > 1 else " real"
        else:
            str_inteiro = ""
            
        str_centavos = ""
        if centavos > 0:
            str_centavos = converte_bloco(centavos) + (" centavos" if centavos > 1 else " centavo")
            
        if str_inteiro and str_centavos:
            return f"{str_inteiro} e {str_centavos}"
        elif str_inteiro:
            return str_inteiro
        else:
            return str_centavos
    except Exception:
        return ""

def montar_variaveis_fixas(dados_usuario: dict) -> dict:
    resultado = {}

    for chave, valor in dados_usuario.items():
        chave_limpa = chave.strip("{}")
        if chave_limpa in CHAVES_RAW or chave in CHAVES_RAW:
            continue
        resultado[chave] = valor
    
    amostra_check = _converter_para_sim(dados_usuario.get("{{AMOSTRA_CHECK}}", "NAO"))
    if amostra_check:
        resultado["{{AMOSTRA}}"] = dados_usuario.get("{{AMOSTRA_TXT}}", "")
    else:
        resultado["{{AMOSTRA}}"] = ""

    vistoria_check = _converter_para_sim(dados_usuario.get("{{VISTORIA_CHECK}}", "NAO"))
    if vistoria_check:
        resultado["{{VISTORIA}}"] = dados_usuario.get("{{VISTORIA_TXT}}", "")
    else:
        resultado["{{VISTORIA}}"] = ""
        
    resultado["{{DOTACAO}}"] = dados_usuario.get("{{DOTACAO}}", "")
    
    tipo_objeto = dados_usuario.get("{{TIPO_OBJETO}}", "AQUISICAO")
    if tipo_objeto == "SERVICO":
        resultado["{{PRAZO PUB}}"] = "*(...)\nII - no caso de serviços e obras:\n***10 (dez) dias úteis***, quando adotados os critérios de julgamento de menor preço ou de maior desconto, no caso de serviços comuns e de obras e serviços comuns de engenharia; (grifo nosso)*"
        resultado["{{UNID}}"] = "__REMOVER_COLUNA__"
    else:
        resultado["{{PRAZO PUB}}"] = "*I - para aquisição de bens:\n***8 (oito) dias úteis***, quando adotados os critérios de julgamento de menor preço ou de maior desconto; (grifo nosso)*"
        resultado["{{UNID}}"] = "MARCA/MODELO"

    arq_mag = _converter_para_sim(dados_usuario.get("{{ARQ_MAG_CHECK}}", "NAO"))
    if arq_mag:
        resultado["{{ARQ MAG}}"] = "Adicionalmente, o licitante deverá OBRIGATORIAMENTE preencher o arquivo magnético e armazená-lo em um pen-drive próprio, às suas custas, INDEPENDENTEMENTE DE QUANTOS ITENS FOR PARTICIPAR, devendo ele estar acondicionado dentro do envelope “01 – PROPOSTA COMERCIAL” junto com a proposta impressa.\n\tA instrução de acondicionar o pen-drive dentro do envelope vista orientar licitantes que somente enviem suas propostas via Correios. No caso de licitantes credenciados, poderá ser aceito a entrega do arquivo magnético em mãos, fora do envelope.\nO arquivo para preenchimento estará disponível, junto com o tutorial, no site da prefeitura municipal, em link próprio, junto do presente Edital, com o nome “ARQUIVO MAGNÉTICO”.\nCaso haja necessidade, o licitante poderá solicitar o arquivo magnético para preenchimento previamente à sessão pública, junto com o tutorial, no e-mail licitacao@saofrancisco.sp.gov.br.\nQuaisquer dúvidas sobre o funcionamento do arquivo magnético deverão ser dirimidas ANTES da sessão pública por meio do telefone (17) 3693-1101 ou e-mail licitacao@saofrancisco.sp.gov.br."
        resultado["{{ARQ MAG 2}}"] = "ou operar o arquivo magnético"
        resultado["{{ARQ MAG 3}}"] = "ou arquivo magnético"
    else:
        resultado["{{ARQ MAG}}"] = ""
        resultado["{{ARQ MAG 2}}"] = ""
        resultado["{{ARQ MAG 3}}"] = ""

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

    valor_raw = dados_usuario.get("{{VALOR}}", "")
    if valor_raw:
        valor_float = _limpar_valor_numerico(valor_raw)
        resultado["{{VALOR}}"] = _formatar_valor(valor_float)
        resultado["{{VALOR EXT}}"] = _valor_por_extenso(valor_float)
    else:
        resultado["{{VALOR}}"] = ""
        resultado["{{VALOR EXT}}"] = ""

    exclusivo_raw = dados_usuario.get("{{EXCLUSIVO}}", "NAO")
    if _converter_para_sim(exclusivo_raw):
        resultado["{{EXCLUSIVO}}"] = "SIM"
        resultado["{{EXCLUSIVO TXT}}"] = "Nos termos do art. 47 e 48 da LCP 123/2006, que versa que a Administração Pública “deverá realizar processo licitatório destinado exclusivamente à participação de microempresas e empresas de pequeno porte nos itens de contratação cujo valor seja de até R$ 80.000,00 (oitenta mil reais)”, e considerando ainda que este tipo de contratação é comumente realizado por empresas de pequeno porte em valores de mercado, hipótese no qual não haverá risco de oportunidade significativos, **esta licitação SERÁ exclusiva para ME/EPP.**"
    else:
        resultado["{{EXCLUSIVO}}"] = "NÃO"
        resultado["{{EXCLUSIVO TXT}}"] = "Nos termos do art. 47, 48 e 49 da LCP 123/2006, que versa que “o tratamento diferenciado e simplificado para as microempresas e empresas de pequeno porte” pode ser afastado quando “não for vantajoso para a administração pública ou representar prejuízo ao conjunto ou complexo do objeto a ser contratado” e, considerando ainda a justificativa apresentada no bojo do Estudo Técnico Preliminar e no Termo de referência,  **esta licitação NÃO será exclusiva para ME/EPP, sendo concedido, porém, o benefício do empate ficto e demais tratamentos diferenciados para tais empresas.**"

    return resultado

def filtrar_chaves_docx(dados: dict) -> dict:
    return {k: v for k, v in dados.items() if (k.startswith("{{") and k.endswith("}}")) or k == "E_ARP"}