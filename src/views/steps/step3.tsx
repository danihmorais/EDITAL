import React from "react";
import { open } from "@tauri-apps/plugin-dialog";

export default function Step3({ dados, atualizarDados }: any) {
  const handleValorChange = (e: any) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v === "") {
      atualizarDados({ valor: "" });
      return;
    }
    const valNum = parseInt(v, 10) / 100;
    const formatado = valNum.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    atualizarDados({ valor: formatado });
  };

  const vigenciaArr = (dados.vigencia || "").split(" ");
  const numVigencia = vigenciaArr.length > 0 && !isNaN(Number(vigenciaArr[0])) ? vigenciaArr[0] : "";
  const unitVigencia = vigenciaArr.length > 1 ? vigenciaArr[1] : "meses";

  const declAdicionaisArray = Array.isArray(dados.declAdicionais) 
    ? dados.declAdicionais 
    : (typeof dados.declAdicionais === 'string' && dados.declAdicionais.trim() !== '' ? [dados.declAdicionais] : []);

  const selecionarArquivo = async (chave: string) => {
    const selected = await open({
      multiple: false,
      filters: [{
        name: "Documentos",
        extensions: ["doc", "docx"]
      }]
    });

    if (selected && typeof selected === "string") {
      const nameStr = selected.split(/[\\/]/).pop() || selected;
      atualizarDados({ [chave]: { name: nameStr, path: selected } });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Vigência</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              value={numVigencia}
              onChange={(e) => atualizarDados({ vigencia: `${e.target.value} ${unitVigencia}`.trim() })}
              style={{ width: "60%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
              placeholder="Ex: 12"
            />
            <select
              value={unitVigencia}
              onChange={(e) => atualizarDados({ vigencia: `${numVigencia} ${e.target.value}`.trim() })}
              style={{ width: "40%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            >
              <option value="dias">Dias</option>
              <option value="meses">Meses</option>
              <option value="anos">Anos</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Valor Estimado</label>
          <input
            type="text"
            value={dados.valor || ""}
            onChange={handleValorChange}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            placeholder="R$ 0,00"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Exclusivo para ME/EPP</label>
          <select
            value={dados.exclusivo || "NAO"}
            onChange={(e) => atualizarDados({ exclusivo: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          >
            <option value="NAO">Não</option>
            <option value="SIM">Sim</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Permitir Prorrogação?</label>
          <select
            value={dados.prorrogacaoCheck || "NAO"}
            onChange={(e) => atualizarDados({ prorrogacaoCheck: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          >
            <option value="NAO">Não</option>
            <option value="SIM">Sim</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px", background: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <h3 style={{ margin: "0 0 4px 0", color: "var(--text-main)", fontSize: "16px", fontWeight: "bold" }}>Anexar Documentos de Referência</h3>
        <p style={{ margin: "0 0 12px 0", color: "var(--text-muted)", fontSize: "13px" }}>Os documentos abaixo serão mesclados automaticamente nas tags de substituição do modelo.</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "14px", fontWeight: "bold" }}>Documento de Formalização da Demanda (DFD) — insere em {"{{DFD}}"}</label>
            <button
              type="button"
              onClick={() => selecionarArquivo("arquivoDfd")}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", display: dados.arquivoDfd ? "none" : "block", cursor: "pointer", textAlign: "left" }}
            >
              Selecionar arquivo...
            </button>
            {dados.arquivoDfd && (
              <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--btn-success)", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-base)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <span>✓ {dados.arquivoDfd.name} selecionado.</span>
                <button
                  type="button"
                  onClick={() => atualizarDados({ arquivoDfd: null })}
                  style={{ padding: "4px 10px", background: "transparent", color: "var(--btn-danger)", border: "1px solid var(--btn-danger)", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "14px", fontWeight: "bold" }}>Estudo Técnico Preliminar (ETP) — insere em {"{{ETP}}"}</label>
            <button
              type="button"
              onClick={() => selecionarArquivo("arquivoEtp")}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", display: dados.arquivoEtp ? "none" : "block", cursor: "pointer", textAlign: "left" }}
            >
              Selecionar arquivo...
            </button>
            {dados.arquivoEtp && (
              <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--btn-success)", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-base)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <span>✓ {dados.arquivoEtp.name} selecionado.</span>
                <button
                  type="button"
                  onClick={() => atualizarDados({ arquivoEtp: null })}
                  style={{ padding: "4px 10px", background: "transparent", color: "var(--btn-danger)", border: "1px solid var(--btn-danger)", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "14px", fontWeight: "bold" }}>Termo de Referência (TR) — insere em {"{{TR}}"}</label>
            <button
              type="button"
              onClick={() => selecionarArquivo("arquivoTr")}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", display: dados.arquivoTr ? "none" : "block", cursor: "pointer", textAlign: "left" }}
            >
              Selecionar arquivo...
            </button>
            {dados.arquivoTr && (
              <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--btn-success)", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-base)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <span>✓ {dados.arquivoTr.name} selecionado.</span>
                <button
                  type="button"
                  onClick={() => atualizarDados({ arquivoTr: null })}
                  style={{ padding: "4px 10px", background: "transparent", color: "var(--btn-danger)", border: "1px solid var(--btn-danger)", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px", background: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <h3 style={{ margin: "0 0 4px 0", color: "var(--text-main)", fontSize: "16px", fontWeight: "bold" }}>Documentos Adicionais</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {(dados.documentosAdicionais || []).map((doc: string, index: number) => (
            <div key={index} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={doc}
                onChange={(e) => {
                  const novosDocs = [...(dados.documentosAdicionais || [])];
                  novosDocs[index] = e.target.value;
                  atualizarDados({ documentosAdicionais: novosDocs });
                }}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
                placeholder="Nome do documento adicional"
              />
              <button
                type="button"
                onClick={() => {
                  const novosDocs = (dados.documentosAdicionais || []).filter((_: any, i: number) => i !== index);
                  atualizarDados({ documentosAdicionais: novosDocs });
                }}
                style={{ padding: "0 15px", background: "transparent", color: "var(--btn-danger)", border: "1px solid var(--btn-danger)", borderRadius: "8px", cursor: "pointer" }}
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const novosDocs = [...(dados.documentosAdicionais || []), ""];
              atualizarDados({ documentosAdicionais: novosDocs });
            }}
            style={{ padding: "10px", background: "transparent", border: "1.5px dashed var(--btn-primary)", color: "var(--btn-primary)", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "8px" }}
          >
            + Adicionar Documento Adicional
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px", background: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <h3 style={{ margin: "0 0 4px 0", color: "var(--text-main)", fontSize: "16px", fontWeight: "bold" }}>Declarações Adicionais</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {declAdicionaisArray.map((decl: string, index: number) => (
            <div key={index} style={{ display: "flex", gap: "8px" }}>
              <textarea
                value={decl}
                onChange={(e) => {
                  const novasDecls = [...declAdicionaisArray];
                  novasDecls[index] = e.target.value;
                  atualizarDados({ declAdicionais: novasDecls });
                }}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "60px", resize: "vertical" }}
                placeholder="Insira a declaração adicional..."
              />
              <button
                type="button"
                onClick={() => {
                  const novasDecls = declAdicionaisArray.filter((_: any, i: number) => i !== index);
                  atualizarDados({ declAdicionais: novasDecls });
                }}
                style={{ padding: "0 15px", background: "transparent", color: "var(--btn-danger)", border: "1px solid var(--btn-danger)", borderRadius: "8px", cursor: "pointer" }}
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const novasDecls = [...declAdicionaisArray, ""];
              atualizarDados({ declAdicionais: novasDecls });
            }}
            style={{ padding: "10px", background: "transparent", border: "1.5px dashed var(--btn-primary)", color: "var(--btn-primary)", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "8px" }}
          >
            + Adicionar Declaração
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Cláusulas Adicionais da Contratante</label>
        <textarea
          value={dados.contratante || ""}
          onChange={(e) => atualizarDados({ contratante: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "120px" }}
          placeholder="Insira as cláusulas adicionais da contratante (separe uma a uma com quebra de linha)..."
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Cláusulas Adicionais da Contratada</label>
        <textarea
          value={dados.contratada || ""}
          onChange={(e) => atualizarDados({ contratada: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "120px" }}
          placeholder="Insira as cláusulas adicionais da contratada (separe uma a uma com quebra de linha)..."
        />
      </div>
    </div>
  );
}