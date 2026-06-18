import React from "react";

export default function Step3({ dados, atualizarDados }: any) {

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Vigência do Contrato/Ata</label>
        <input
          type="text"
          value={dados.vigencia || ""}
          onChange={(e) => atualizarDados({ vigencia: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          placeholder="Ex: 12 (doze) meses"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Declarações Adicionais</label>
        <textarea
          value={dados.declAdicionais || ""}
          onChange={(e) => atualizarDados({ declAdicionais: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "150px" }}
          placeholder={"Insira as declarações adicionais (uma por linha).\nExemplo:\nm.\tconhece plenamente as condições e peculiaridades do objeto, em especial quanto às suas dimensões, locais, padrões e todos os demais aspectos relacionados ao objeto, ciente de que não poderá ser alegado equívoco no dimensionamento de sua proposta e se comprometendo em refazer, às suas expensas, os serviços que estiverem em desacordo com o solicitado pela Administração, nos termos do §3 art. 63 da Lei Federal nº 14.133/2021."}
        />
      </div>
    </div>
  );
}