import React from "react";

export default function Step3({ dados, atualizarDados }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Vigência</label>
          <input
            type="text"
            value={dados.vigencia || ""}
            onChange={(e) => atualizarDados({ vigencia: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            placeholder="Ex: 12 meses"
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Valor Estimado</label>
          <input
            type="text"
            value={dados.valor || ""}
            onChange={(e) => atualizarDados({ valor: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            placeholder="Ex: R$ 50.000,00"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
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
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px", background: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <h3 style={{ margin: "0 0 4px 0", color: "var(--text-main)", fontSize: "16px", fontWeight: "bold" }}>Anexar Documentos de Referência</h3>
        <p style={{ margin: "0 0 12px 0", color: "var(--text-muted)", fontSize: "13px" }}>Os documentos abaixo serão mesclados automaticamente nas tags de substituição do modelo.</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "14px", fontWeight: "bold" }}>Documento de Formalização da Demanda (DFD) — insere em {"{{DFD}}"}</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                atualizarDados({ arquivoDfd: file });
              }}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            />
            {dados.arquivoDfd && (
              <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--btn-success)", fontWeight: "bold" }}>
                ✓ {dados.arquivoDfd.name} selecionado.
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "14px", fontWeight: "bold" }}>Estudo Técnico Preliminar (ETP) — insere em {"{{ETP}}"}</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                atualizarDados({ arquivoEtp: file });
              }}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            />
            {dados.arquivoEtp && (
              <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--btn-success)", fontWeight: "bold" }}>
                ✓ {dados.arquivoEtp.name} selecionado.
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", color: "var(--text-main)", fontSize: "14px", fontWeight: "bold" }}>Termo de Referência (TR) — insere em {"{{TR}}"}</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                atualizarDados({ arquivoTr: file });
              }}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            />
            {dados.arquivoTr && (
              <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--btn-success)", fontWeight: "bold" }}>
                ✓ {dados.arquivoTr.name} selecionado.
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Declarações Adicionais</label>
        <textarea
          value={dados.declAdicionais || ""}
          onChange={(e) => atualizarDados({ declAdicionais: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "100px" }}
          placeholder="Insira outras declarações necessárias..."
        />
      </div>
    </div>
  );
}