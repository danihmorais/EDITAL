import React from "react";

export default function Step3({ dados, atualizarDados }: any) {
  const adicionarItem = () => {
    atualizarDados({ itens: [...dados.itens, { numero: dados.itens.length + 1, descricao: "", un: "UN", qtd: 1, valor: 0 }] });
  };

  const removerItem = (index: number) => {
    const novos = [...dados.itens];
    novos.splice(index, 1);
    atualizarDados({ itens: novos });
  };

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novos = [...dados.itens];
    novos[index] = { ...novos[index], [campo]: valor };
    atualizarDados({ itens: novos });
  };

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
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <label style={{ color: "var(--text-main)", fontWeight: "bold", margin: 0 }}>Itens da Licitação</label>
          <button onClick={adicionarItem} style={{ padding: "6px 12px", background: "var(--bg-subtle)", color: "var(--text-main)", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>+ Adicionar Item</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {dados.itens.map((item: any, index: number) => (
            <div key={index} style={{ display: "flex", gap: "12px", alignItems: "center", background: "var(--bg-subtle)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <input type="text" value={item.descricao} onChange={(e) => atualizarItem(index, "descricao", e.target.value)} placeholder="Descrição do item" style={{ flex: 2, padding: "8px", borderRadius: "4px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }} />
              <input type="text" value={item.un} onChange={(e) => atualizarItem(index, "un", e.target.value)} placeholder="UN" style={{ width: "60px", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }} />
              <input type="number" value={item.qtd} onChange={(e) => atualizarItem(index, "qtd", parseFloat(e.target.value))} placeholder="Qtd" style={{ width: "80px", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }} />
              <input type="number" value={item.valor} onChange={(e) => atualizarItem(index, "valor", parseFloat(e.target.value))} placeholder="Valor Unit." style={{ width: "100px", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }} />
              <button onClick={() => removerItem(index)} style={{ padding: "8px", background: "var(--btn-danger)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>X</button>
            </div>
          ))}
          {dados.itens.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>Nenhum item adicionado.</p>}
        </div>
      </div>
    </div>
  );
}