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
        "{{N.MODALIDADE}}": dados.numeroModalidade || "",
        "{{N.PROCESSO}}": dados.numeroProcesso || "",
        "{{OBJETO}}": dados.objeto || "",
        "{{CRITERIO}}": dados.criterio || "ITEM",
        "{{GESTOR}}": dados.gestor || "",
        "{{FISCAL}}": dados.fiscal || "",
        "{{DATA DO EDITAL}}": dados.dataEdital || "",
        "{{DATA DA SESSAO}}": dados.dataSessao || "",
        "{{DATA REC PROP1}}": dados.dataRecProp1 || "",
        "{{DATA REC PROP2}}": dados.dataRecProp2 || "",
        "{{HORA SESSAO}}": dados.horaSessao || "",
        "{{HORA_SESSAO}}": dados.horaSessao || "",
        "{{VALOR_ESTIMADO}}": valorEstimadoFormatado,
        "{{ITENS}}": JSON.stringify(itens),
        "{{MODALIDADE}}": dados.modalidade || "PREGAO_ELETRONICO",
        "{{MODALIDADE_NOME}}": modalidadeFormatada
    },
    arquivoBase: arquivoBase
  };
};