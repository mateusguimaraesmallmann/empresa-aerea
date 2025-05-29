CREATE TABLE milhas (
    id_milhas INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    data_transacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_reais NUMERIC(10,2) NOT NULL,
    quantidade_milhas INTEGER NOT NULL,
    descricao VARCHAR(50) NOT NULL DEFAULT 'COMPRA DE MILHAS',
    id_cliente INTEGER NOT NULL,
    transacao VARCHAR(7) NOT NULL,
    tipo_transacao VARCHAR(20) NOT NULL DEFAULT 'ENTRADA',
    CONSTRAINT fk_milhas_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);