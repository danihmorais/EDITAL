import React from "react";

export default function Step1({ dados, atualizarDados }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Número do Processo</label>
          <input
            type="text"
            value={dados.numeroProcesso || ""}
            onChange={(e) => atualizarDados({ numeroProcesso: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            placeholder="Ex: 25/2026"
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Número do Edital</label>
          <input
            type="text"
            value={dados.numeroModalidade || ""}
            onChange={(e) => atualizarDados({ numeroModalidade: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            placeholder="Ex: 05/2026"
          />
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Modalidade</label>
          <select
            value={dados.modalidade || "PREGAO_ELETRONICO"}
            onChange={(e) => atualizarDados({ modalidade: e.target.value, arquivoMagnetico: e.target.value !== "PREGAO_PRESENCIAL" ? false : dados.arquivoMagnetico })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          >
            <option value="PREGAO_ELETRONICO">Pregão Eletrônico</option>
            <option value="PREGAO_PRESENCIAL">Pregão Presencial</option>
            <option value="DISPENSA">Dispensa Eletrônica</option>
            <option value="DISPENSA_BLL">Dispensa Eletrônica BLL</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Critério de Julgamento</label>
          <select
            value={dados.criterios || "ITEM"}
            onChange={(e) => atualizarDados({ criterios: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          >
            <option value="ITEM">Menor Preço por Item</option>
            <option value="LOTE">Menor Preço por Lote</option>
            <option value="GLOBAL">Menor Preço Global</option>
          </select>
        </div>
      </div>

      {dados.modalidade === "PREGAO_PRESENCIAL" && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <input
            type="checkbox"
            checked={dados.arquivoMagnetico || false}
            onChange={(e) => atualizarDados({ arquivoMagnetico: e.target.checked })}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
            id="chkArquivoMagnetico"
          />
          <label htmlFor="chkArquivoMagnetico" style={{ color: "var(--text-main)", fontWeight: "bold", cursor: "pointer" }}>
            Exigir Arquivo Magnético
          </label>
        </div>
      )}

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
    </div>
  );
}