export const mapearDadosWizard = (dados: any) => {
  const itens = dados.itens || [];
  const totalItens = itens.reduce((acc: number, i: any) => acc + (Number(i.qtd || 0) * Number(i.valor || 0)), 0);
  const valorEstimadoFormatado = totalItens.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const valorEstimadoPuro = totalItens.toFixed(2);
  
  let modalidadeFormatada = "";
  let arquivoBase = "";
  
  switch(dados.modalidade) {
    case "PREGAO_ELETRONICO":
      modalidadeFormatada = "Pregão Eletrônico";
      arquivoBase = "pregao_eletronico";
      break;
    case "PREGAO_PRESENCIAL":
      modalidadeFormatada = "Pregão Presencial";
      arquivoBase = "pregao_presencial";
      break;
    case "DISPENSA":
      modalidadeFormatada = "Dispensa Eletrônica";
      arquivoBase = "dispensa";
      break;
    case "DISPENSA_BLL":
      modalidadeFormatada = "Dispensa Eletrônica BLL";
      arquivoBase = "dispensa_bll";
      break;
    default:
      modalidadeFormatada = "Pregão Eletrônico";
      arquivoBase = "pregao_eletronico";
  }

  const gestoresNomes = (dados.gestores || []).map((g: any) => g.nome).join(", ");
  const gestoresCargos = (dados.gestores || []).map((g: any) => g.cargo).join(", ");
  
  const fiscaisNomes = (dados.fiscais || []).map((f: any) => f.nome).join(", ");
  const fiscaisCargos = (dados.fiscais || []).map((f: any) => f.cargo).join(", ");

  return {
    dadosMapeados: {
        "{{N.MODALIDADE}}": dados.numeroModalidade || "",
        "{{N.PROCESSO}}": dados.numeroProcesso || "",
        "{{OBJETO}}": dados.objeto || "",
        "{{CRITERIOS}}": dados.criterios || "ITEM",
        "{{GESTOR}}": gestoresNomes,
        "{{GESTOR_CARGO}}": gestoresCargos,
        "{{FISCAL}}": fiscaisNomes,
        "{{FISCAL_CARGO}}": fiscaisCargos,
        "{{DATA DO EDITAL}}": dados.dataEdital || "",
        "{{DATA DA SESSAO}}": dados.dataSessao || "",
        "{{DATA REC PROP1}}": dados.dataRecProp1 || "",
        "{{DATA REC PROP2}}": dados.dataRecProp2 || "",
        "{{HORA SESSAO}}": dados.horaSessao || "",
        "{{HORA_SESSAO}}": dados.horaSessao || "",
        "{{VALOR_ESTIMADO}}": valorEstimadoFormatado,
        "{{VALOR}}": dados.valor || valorEstimadoPuro,
        "{{EXCLUSIVO}}": dados.exclusivo || "NAO",
        "{{ITENS}}": JSON.stringify(itens),
        "{{MODALIDADE}}": dados.modalidade || "PREGAO_ELETRONICO",
        "{{MODALIDADE_NOME}}": modalidadeFormatada,
        "{{DECL.ADICIONAIS}}": dados.declAdicionais || "",
        "{{VIGENCIA}}": dados.vigencia || ""
    },
    arquivoBase: arquivoBase
  };
};