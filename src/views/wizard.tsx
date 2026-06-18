import React, { useState, useEffect, useRef, useContext } from "react";
import { invoke } from "@tauri-apps/api/core";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import { mapearDadosWizard } from "../utils/mapearDados";
import { ThemeContext } from "../context/ThemeContext";

export default function Wizard() {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [dados, setDados] = useState({
    numeroProcesso: "",
    numeroModalidade: "",
    modalidade: "PREGAO_ELETRONICO",
    criterios: "ITEM",
    tipoObjeto: "AQUISICAO",
    dotacao: "",
    dotacaoImagens: [],
    quantidadeItens: "",
    quantidadeLotes: "",
    arquivoMagnetico: false,
    dataEdital: "",
    dataSessao: "",
    horaSessao: "",
    dataRecProp1: "",
    dataRecProp2: "",
    objeto: "",
    gestores: [],
    fiscais: [],
    vistoria: false,
    textoVistoria: "",
    amostra: false,
    textoAmostra: "",
    vigencia: "",
    documentosAdicionais: [],
    declAdicionais: "",
    valor: "",
    exclusivo: "NAO",
    itens: [],
    arquivoDfd: null,
    arquivoEtp: null,
    arquivoTr: null
  });
  
  const [carregando, setCarregando] = useState(false);
  const [statusTexto, setStatusTexto] = useState("Iniciando...");
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [geracaoSucesso, setGeracaoSucesso] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const atualizarDados = (novosDados: Partial<typeof dados>) => {
    setDados((prev) => ({ ...prev, ...novosDados }));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [etapaAtual]);

  const validarEtapa = () => {
    switch (etapaAtual) {
      case 0:
        return dados.numeroProcesso.trim() !== "" && dados.numeroModalidade.trim() !== "";
      case 1:
        return dados.objeto.trim() !== "";
      case 2:
        return dados.vigencia.trim() !== "";
      default:
        return true;
    }
  };

  const avancar = () => {
    if (etapaAtual < 2) {
      setEtapaAtual(etapaAtual + 1);
    } else {
      confeccionarDocumentos();
    }
  };

  const voltar = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const confeccionarDocumentos = async () => {
    setCarregando(true);
    setErroMsg(null);
    setGeracaoSucesso(false);
    setStatusTexto("A compilar o Edital...");

    try {
      const { dadosMapeados, arquivoBase } = mapearDadosWizard(dados);

      await invoke("gerar_documentos", {
        dadosUsuario: dadosMapeados,
        dadosIa: {},
        arquivosBase: [arquivoBase]
      });

      setGeracaoSucesso(true);
    } catch (erro: any) {
      let msg: string;
      if (typeof erro === "string") {
        msg = erro;
      } else if (erro?.message) {
        msg = erro.message;
      } else {
        try { msg = JSON.stringify(erro, null, 2); } catch { msg = ""; }
      }
      if (!msg || msg === "{}" || msg === "null" || msg === "undefined") {
        msg = "Erro desconhecido ao gerar o Edital.";
      }
      setErroMsg(msg);
    }
  };

  const renderizarEtapa = () => {
    switch (etapaAtual) {
      case 0: return <Step1 dados={dados} atualizarDados={atualizarDados} />;
      case 1: return <Step2 dados={dados} atualizarDados={atualizarDados} />;
      case 2: return <Step3 dados={dados} atualizarDados={atualizarDados} />;
      default: return null;
    }
  };

  if (carregando) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "var(--bg-base)" }}>
        <div style={{ background: "var(--bg-panel)", padding: "40px", borderRadius: "24px", boxShadow: "var(--shadow-lg)", textAlign: "center", width: "100%", maxWidth: "620px" }}>
          {erroMsg && (
            <>
              <div style={{ fontSize: "44px", marginBottom: "12px" }}>⚠️</div>
              <h2 style={{ margin: "0 0 16px 0", color: "var(--btn-danger)", fontSize: "22px" }}>Erro na Geração</h2>
              <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--btn-danger)", borderRadius: "10px", padding: "16px", marginBottom: "24px", textAlign: "left", maxHeight: "260px", overflowY: "auto" }}>
                <pre style={{ color: "var(--btn-danger)", fontSize: "13px", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "inherit" }}>{erroMsg}</pre>
              </div>
              <button onClick={() => { setCarregando(false); setErroMsg(null); }} style={{ padding: "12px 32px", background: "var(--btn-primary)", color: "#ffffff", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>← Voltar e Tentar Novamente</button>
            </>
          )}

          {geracaoSucesso && !erroMsg && (
            <>
              <div style={{ fontSize: "44px", marginBottom: "12px" }}>✅</div>
              <h2 style={{ margin: "0 0 16px 0", color: "var(--btn-success)", fontSize: "22px" }}>Edital Gerado com Sucesso!</h2>
              <p style={{ color: "var(--text-muted)", margin: "0 0 24px 0", fontSize: "14px" }}>
                Os arquivos foram salvos na pasta{" "}
                <span onClick={() => invoke("abrir_pasta_documentos")} style={{ color: "var(--btn-primary)", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>Documentos_Gerados</span>.
              </p>
              <button onClick={() => { setCarregando(false); setGeracaoSucesso(false); setEtapaAtual(0); }} style={{ padding: "12px 32px", background: "var(--btn-success)", color: "#ffffff", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>✓ Concluir</button>
            </>
          )}

          {!erroMsg && !geracaoSucesso && (
            <>
              <h2 style={{ margin: "0 0 16px 0", color: "var(--text-main)", fontSize: "24px" }}>Gerando Edital</h2>
              <p style={{ color: "var(--text-muted)", margin: "0 0 24px 0" }}>{statusTexto}</p>
              <div style={{ width: "100%", height: "6px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: "50%", height: "100%", background: "var(--btn-primary)", transition: "width 0.3s", animation: "progress 2s infinite" }} />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const podeAvancar = validarEtapa();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "var(--bg-base)", transition: "background-color 0.3s", fontFamily: "sans-serif" }}>
      <div style={{ padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", color: "var(--text-main)" }}>
              {etapaAtual === 0 && "Etapa 1: Processo, Modalidade e Sessão"}
              {etapaAtual === 1 && "Etapa 2: Objeto, Gestores e Fiscais"}
              {etapaAtual === 2 && "Etapa 3: Vigência e Declarações"}
            </h1>
            <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "14px" }}>
              Insira os dados da licitação e confirme a base do TR/ETP/DFD.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "var(--text-muted)", fontWeight: "bold", fontSize: "14px" }}>Passo {etapaAtual + 1} de 3</span>
          <button onClick={toggleTheme} style={{ width: "44px", height: "44px", borderRadius: "8px", border: "none", cursor: "pointer", background: "var(--bg-subtle)", color: "var(--text-main)" }}>
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 40px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "var(--bg-panel)", borderRadius: "24px", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)", padding: "16px" }}>
          <div ref={scrollRef} style={{ height: "100%", overflowY: "auto", padding: "16px" }}>
            {renderizarEtapa()}
          </div>
        </div>
      </div>
      <div style={{ padding: "24px 40px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={voltar} disabled={etapaAtual === 0} style={{ width: "140px", height: "44px", borderRadius: "12px", border: "2px solid var(--border)", background: "transparent", color: "var(--text-main)", fontWeight: "bold", fontSize: "14px", cursor: etapaAtual === 0 ? "not-allowed" : "pointer", opacity: etapaAtual === 0 ? 0.5 : 1 }}>Voltar</button>
        <button onClick={avancar} disabled={!podeAvancar} style={{ width: "140px", height: "44px", borderRadius: "12px", border: "none", background: !podeAvancar ? "var(--text-light)" : (etapaAtual === 2 ? "var(--btn-success)" : "var(--btn-primary)"), color: "#ffffff", fontWeight: "bold", fontSize: "14px", cursor: !podeAvancar ? "not-allowed" : "pointer" }}>{etapaAtual === 2 ? "Gerar Edital" : "Avançar"}</button>
      </div>
    </div>
  );
}