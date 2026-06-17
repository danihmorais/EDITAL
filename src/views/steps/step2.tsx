import React from "react";

export default function Step2({ dados, atualizarDados }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Data da Sessão</label>
        <input
          type="date"
          value={dados.dataSessao}
          onChange={(e) => atualizarDados({ dataSessao: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Horário da Sessão</label>
        <input
          type="time"
          value={dados.horaSessao}
          onChange={(e) => atualizarDados({ horaSessao: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Local / Plataforma</label>
        <input
          type="text"
          value={dados.localSessao}
          onChange={(e) => atualizarDados({ localSessao: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          placeholder="Ex: www.gov.br/compras ou BLL Compras"
        />
      </div>
      <div style={{ padding: "16px", borderRadius: "8px", background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Anexar Artefatos (DFD, ETP, TR)</label>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 12px 0" }}>Nesta etapa, o sistema confirma que os artefatos base estão prontos e aprovados para compor o processo do Edital.</p>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-main)", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={dados.anexosProntos}
            onChange={(e) => atualizarDados({ anexosProntos: e.target.checked })}
            style={{ width: "18px", height: "18px" }}
          />
          Confirmo que o DFD, ETP e TR já estão finalizados.
        </label>
      </div>
    </div>
  );
}