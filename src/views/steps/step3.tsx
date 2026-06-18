import React from "react";

export default function Step3({ dados, atualizarDados }: any) {

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Objeto do Edital</label>
        <textarea
          value={dados.objeto}
          onChange={(e) => atualizarDados({ objeto: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "120px" }}
          placeholder="Descreva o objeto da licitação (conforme consta no TR)..."
        />
      </div>
    </div>
  );
}