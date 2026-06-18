import React from "react";

export default function Step2({ dados, atualizarDados }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Nº da Modalidade</label>
          <input
            type="text"
            value={dados.numeroModalidade || ""}
            onChange={(e) => atualizarDados({ numeroModalidade: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Nº do Processo</label>
          <input
            type="text"
            value={dados.numeroProcesso || ""}
            onChange={(e) => atualizarDados({ numeroProcesso: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Data do Edital</label>
        <input
          type="date"
          value={dados.dataEdital || ""}
          onChange={(e) => atualizarDados({ dataEdital: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
        />
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Data da Sessão</label>
          <input
            type="date"
            value={dados.dataSessao || ""}
            onChange={(e) => atualizarDados({ dataSessao: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Horário da Sessão</label>
          <input
            type="time"
            value={dados.horaSessao || ""}
            onChange={(e) => atualizarDados({ horaSessao: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Início Rec. Propostas</label>
          <input
            type="date"
            value={dados.dataRecProp1 || ""}
            onChange={(e) => atualizarDados({ dataRecProp1: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Fim Rec. Propostas</label>
          <input
            type="date"
            value={dados.dataRecProp2 || ""}
            onChange={(e) => atualizarDados({ dataRecProp2: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Gestor(es)</label>
        <input
          type="text"
          placeholder="Nome do(s) Gestor(es) separados por vírgula"
          value={dados.gestor || ""}
          onChange={(e) => atualizarDados({ gestor: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Fiscal(is)</label>
        <input
          type="text"
          placeholder="Nome do(s) Fiscal(is) separados por vírgula"
          value={dados.fiscal || ""}
          onChange={(e) => atualizarDados({ fiscal: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Local / Plataforma</label>
        <input
          type="text"
          value={dados.localSessao || ""}
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
            checked={dados.anexosProntos || false}
            onChange={(e) => atualizarDados({ anexosProntos: e.target.checked })}
            style={{ width: "18px", height: "18px" }}
          />
          Confirmo que o DFD, ETP e TR já estão finalizados.
        </label>
      </div>
    </div>
  );
}