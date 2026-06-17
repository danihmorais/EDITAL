export const mapearDadosWizard = (dados: any) => {
  const itens = dados.itens || [];
  const totalItens = itens.reduce((acc: number, i: any) => acc + (Number(i.qtd || 0) * Number(i.valor || 0)), 0);
  const valorEstimadoFormatado = totalItens.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  let modalidadeFormatada = "";
  let arquivoBase = "";
  
  switch(dados.modalidade) {
    case "PREGAO_ELETRONICO":
      modalidadeFormatada = "Pregão Eletrônico";
      arquivoBase = "Pregão xx Proc xx -  MINUTA PE 15.04.2026.docx";
      break;
    case "PREGAO_PRESENCIAL":
      modalidadeFormatada = "Pregão Presencial";
      arquivoBase = "Pregão xx Proc xx -  MINUTA PP 15.04.2026.docx";
      break;
    case "DISPENSA":
      modalidadeFormatada = "Dispensa Eletrônica";
      arquivoBase = "Dispensa xx Proc xx -  MINUTA DE 15.04.2026.docx";
      break;
    case "DISPENSA_BLL":
      modalidadeFormatada = "Dispensa Eletrônica BLL";
      arquivoBase = "Dispensa xx Proc xx -  MINUTA DP 15.04.2026.docx";
      break;
    default:
      modalidadeFormatada = "Pregão Eletrônico";
      arquivoBase = "Pregão xx Proc xx -  MINUTA PE 15.04.2026.docx";
  }

  return {
    dadosMapeados: {
        "{{NUMERO_PROCESSO}}": dados.numeroProcesso || "",
        "{{NUMERO_EDITAL}}": dados.numeroEdital || "",
        "{{OBJETO}}": dados.objeto || "",
        "{{DATA_SESSAO}}": dados.dataSessao || "",
        "{{HORA_SESSAO}}": dados.horaSessao || "",
        "{{LOCAL_SESSAO}}": dados.localSessao || "",
        "{{UASG}}": dados.uasg || "",
        "{{VALOR_ESTIMADO}}": valorEstimadoFormatado,
        "{{ITENS}}": JSON.stringify(itens),
        "{{MODALIDADE}}": dados.modalidade || "PREGAO_ELETRONICO",
        "{{MODALIDADE_NOME}}": modalidadeFormatada,
        "{{CRITERIO}}": dados.criterio || "ITEM"
    },
    arquivoBase: arquivoBase
  };
};