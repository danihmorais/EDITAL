// src/views/steps/step3.tsx
import React from "react";

export default function Step3({ dados, atualizarDados }: any) {
  const addDoc = () => atualizarDados({ documentosAdicionais: [...(dados.documentosAdicionais || []), ""] });
  const updateDoc = (index: number, val: string) => {
    const next = [...(dados.documentosAdicionais || [])];
    next[index] = val;
    atualizarDados({ documentosAdicionais: next });
  };
  const removeDoc = (index: number) => {
    const next = [...(dados.documentosAdicionais || [])];
    next.splice(index, 1);
    atualizarDados({ documentosAdicionais: next });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Vigência</label>
        <input
          type="text"
          value={dados.vigencia || ""}
          onChange={(e) => atualizarDados({ vigencia: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          placeholder="Ex: 12 (doze) meses"
        />
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ color: "var(--text-main)", fontWeight: "bold" }}>Documentos Adicionais de Habilitação</label>
            <button type="button" onClick={addDoc} style={{ padding: "6px 12px", background: "transparent", border: "1.5px solid var(--btn-primary)", borderRadius: "6px", color: "var(--btn-primary)", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>+ Adicionar Documento</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(dados.documentosAdicionais || []).length === 0 && (
                <p style={{ margin: 0, padding: "14px", fontSize: "13px", color: "var(--text-light)", background: "var(--bg-subtle)", border: "1.5px dashed var(--border)", borderRadius: "8px", textAlign: "center" }}>
                    Nenhum documento adicional inserido.
                </p>
            )}
            {(dados.documentosAdicionais || []).map((doc: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        value={doc}
                        onChange={(e) => updateDoc(i, e.target.value)}
                        style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
                        placeholder={`Descrição do documento ${12 + i}`}
                    />
                    <button type="button" onClick={() => removeDoc(i)} style={{ padding: "10px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-light)", cursor: "pointer" }}>✕</button>
                </div>
            ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Declarações Adicionais</label>
        <textarea
          value={dados.declAdicionais || ""}
          onChange={(e) => atualizarDados({ declAdicionais: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "100px" }}
          placeholder="Insira declarações adicionais (se houver)..."
        />
      </div>
    </div>
  );
}