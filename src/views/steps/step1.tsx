import React from "react";

export default function Step1({ dados, atualizarDados }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Número do Processo</label>
        <input
          type="text"
          value={dados.numeroProcesso}
          onChange={(e) => atualizarDados({ numeroProcesso: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          placeholder="Ex: 1234/2026"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Número do Edital</label>
        <input
          type="text"
          value={dados.numeroEdital}
          onChange={(e) => atualizarDados({ numeroEdital: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          placeholder="Ex: 001/2026"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>UASG / Órgão</label>
        <input
          type="text"
          value={dados.uasg}
          onChange={(e) => atualizarDados({ uasg: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          placeholder="Ex: 987654"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Modalidade</label>
        <select
          value={dados.modalidade}
          onChange={(e) => atualizarDados({ modalidade: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
        >
          <option value="PREGAO_ELETRONICO">Pregão Eletrônico</option>
          <option value="PREGAO_PRESENCIAL">Pregão Presencial</option>
          <option value="DISPENSA">Dispensa Eletrônica</option>
          <option value="DISPENSA_BLL">Dispensa Eletrônica BLL</option>
        </select>
      </div>
    </div>
  );
}