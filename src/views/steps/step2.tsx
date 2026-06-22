import React from "react";

interface Pessoa {
  nome: string;
  cargo: string;
}

interface PessoaListProps {
  label: string;
  singularLabel: string;
  items: Pessoa[];
  onChange: (items: Pessoa[]) => void;
}

function PessoaList({ label, singularLabel, items, onChange }: PessoaListProps) {
  const add = () => onChange([...items, { nome: "", cargo: "" }]);

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const update = (i: number, field: keyof Pessoa, value: string) => {
    const next = items.map((p, idx) => (idx === i ? { ...p, [field]: value } : p));
    onChange(next);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: "var(--text-main)",
            fontWeight: "bold",
          }}
        >
        {label}
      </label>

        <button
          type="button"
          onClick={add}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 12px",
            background: "transparent",
            border: "1.5px solid var(--btn-primary)",
            borderRadius: "var(--radius)",
            color: "var(--btn-primary)",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
          Adicionar {singularLabel}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.length === 0 && (
          <p
            style={{
              margin: 0,
              padding: "14px 16px",
              fontSize: "13px",
              color: "var(--text-light)",
              background: "var(--bg-subtle)",
              border: "1.5px dashed var(--border)",
              borderRadius: "var(--radius)",
              textAlign: "center",
            }}
          >
            Nenhum {singularLabel} adicionado ainda.
          </p>
        )}

        {items.map((pessoa, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "8px",
              alignItems: "center",
              padding: "10px 12px",
              background: "var(--bg-subtle)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                  background: "rgba(37,99,235,0.12)",
                  borderRadius: "50%",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--btn-primary)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-light)", fontWeight: 500 }}>
                {singularLabel}
              </span>
            </div>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-light)", marginBottom: "4px", fontWeight: 500 }}>
                Nome
              </div>
              <input
                type="text"
                placeholder={`Nome do ${singularLabel.toLowerCase()}`}
                value={pessoa.nome}
                onChange={(e) => update(i, "nome", e.target.value)}
                style={{ padding: "8px 10px" }}
              />
            </div>

            <div>
              <div style={{ fontSize: "11px", color: "var(--text-light)", marginBottom: "4px", fontWeight: 500 }}>
                Cargo
              </div>
              <input
                type="text"
                placeholder="Ex: Diretor, Coordenador…"
                value={pessoa.cargo}
                onChange={(e) => update(i, "cargo", e.target.value)}
                style={{ padding: "8px 10px" }}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(i)}
              title="Remover"
              style={{
                alignSelf: "flex-end",
                marginBottom: "1px",
                width: "34px",
                height: "34px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--text-light)",
                fontSize: "16px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--btn-danger)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--btn-danger)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-light)";
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Step2({ dados, atualizarDados }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Tipo de Objeto</label>
          <select
            value={dados.tipoObjeto || "AQUISICAO"}
            onChange={(e) => atualizarDados({ tipoObjeto: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          >
            <option value="AQUISICAO">Aquisição</option>
            <option value="SERVICO">Serviço</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Quantidade de Itens</label>
          <input
            type="number"
            value={dados.quantidadeItens || ""}
            onChange={(e) => atualizarDados({ quantidadeItens: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            placeholder="Ex: 5"
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Quantidade de Lotes</label>
          <input
            type="number"
            value={dados.quantidadeLotes || ""}
            onChange={(e) => atualizarDados({ quantidadeLotes: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
            placeholder="Ex: 2"
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Dotação Orçamentária</label>
        <textarea
          value={dados.dotacao || ""}
          onChange={(e) => atualizarDados({ dotacao: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "100px", marginBottom: "12px" }}
          placeholder="Descreva a dotação orçamentária ou cole as informações de texto com quebras de linha..."
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            atualizarDados({ dotacaoImagens: files });
          }}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
        />
        {dados.dotacaoImagens && dados.dotacaoImagens.length > 0 && (
          <div style={{ marginTop: "8px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "bold" }}>
            {dados.dotacaoImagens.length} imagem(ns) de dotação selecionada(s).
          </div>
        )}
      </div>

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
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Local e Prazo de Execução / Entrega</label>
        <textarea
          value={dados.execucao || ""}
          onChange={(e) => atualizarDados({ execucao: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "120px" }}
          placeholder="Descreva as condições, prazos e locais de execução ou entrega (pode usar quebras de linha para separar os itens)..."
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Prazo de Devolução / Substituição</label>
        <input
          type="text"
          value={dados.prazoDevolucao || ""}
          onChange={(e) => atualizarDados({ prazoDevolucao: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)" }}
          placeholder="Ex: 5"
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "bold" }}>Especificações Especiais</label>
        <textarea
          value={dados.especificacoesEspeciais || ""}
          onChange={(e) => atualizarDados({ especificacoesEspeciais: e.target.value })}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "120px" }}
          placeholder="Insira especificações especiais (pode usar quebras de linha para separar os itens)..."
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px", background: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            checked={dados.vistoria || false}
            onChange={(e) => atualizarDados({ vistoria: e.target.checked })}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
            id="chkVistoria"
          />
          <label htmlFor="chkVistoria" style={{ color: "var(--text-main)", fontWeight: "bold", cursor: "pointer" }}>
            Exigir Vistoria
          </label>
        </div>
        {dados.vistoria && (
          <textarea
            value={dados.textoVistoria || ""}
            onChange={(e) => atualizarDados({ textoVistoria: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "100px" }}
            placeholder="Descreva as condições da vistoria (pode colar com quebras de linha)..."
          />
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px", background: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            checked={dados.amostra || false}
            onChange={(e) => atualizarDados({ amostra: e.target.checked })}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
            id="chkAmostra"
          />
          <label htmlFor="chkAmostra" style={{ color: "var(--text-main)", fontWeight: "bold", cursor: "pointer" }}>
            Exigir Amostra
          </label>
        </div>
        {dados.amostra && (
          <textarea
            value={dados.textoAmostra || ""}
            onChange={(e) => atualizarDados({ textoAmostra: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-main)", minHeight: "100px" }}
            placeholder="Descreva as condições da amostra (pode colar com quebras de linha)..."
          />
        )}
      </div>

      <PessoaList
        label="Gestores"
        singularLabel="Gestor"
        items={dados.gestores ?? []}
        onChange={(items) => atualizarDados({ gestores: items })}
      />

      <PessoaList
        label="Fiscais"
        singularLabel="Fiscal"
        items={dados.fiscais ?? []}
        onChange={(items) => atualizarDados({ fiscais: items })}
      />
    </div>
  );
}