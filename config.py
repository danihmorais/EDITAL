import config
from datetime import datetime

CHAVES_RAW = {
    "RAW_OBJETO",
    "RAW_PROCESSO",
}

SIM_VALORES = {"sim", "s", "x", "true", "1"}

def _normalizar_sim_nao(valor) -> str:
    return str(valor).strip().casefold()

def _converter_para_sim(valor) -> bool:
    return _normalizar_sim_nao(valor) in SIM_VALORES

def montar_variaveis_fixas(dados_usuario: dict) -> dict:
    resultado = {}

    for chave, valor in dados_usuario.items():
        chave_limpa = chave.strip("{}")
        if chave_limpa in CHAVES_RAW or chave in CHAVES_RAW:
            continue
        resultado[chave] = valor

    data_sessao = dados_usuario.get("{{DATA_SESSAO}}", "")
    if data_sessao:
        try:
            data_obj = datetime.strptime(data_sessao, "%Y-%m-%d")
            resultado["{{DATA_SESSAO_FORMATADA}}"] = data_obj.strftime("%d/%m/%Y")
            resultado["{{DIA_SESSAO}}"] = data_obj.strftime("%d")
            resultado["{{MES_SESSAO}}"] = data_obj.strftime("%m")
            resultado["{{ANO_SESSAO}}"] = data_obj.strftime("%Y")
        except ValueError:
            resultado["{{DATA_SESSAO_FORMATADA}}"] = data_sessao
            resultado["{{DIA_SESSAO}}"] = ""
            resultado["{{MES_SESSAO}}"] = ""
            resultado["{{ANO_SESSAO}}"] = ""

    return resultado

def filtrar_chaves_docx(dados: dict) -> dict:
    return {k: v for k, v in dados.items() if k.startswith("{{") and k.endswith("}}")}