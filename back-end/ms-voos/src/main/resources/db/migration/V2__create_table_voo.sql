CREATE TABLE voo (
    codigo_voo VARCHAR(8) PRIMARY KEY,
    data_voo TIMESTAMPTZ NOT NULL,
    valor_passagem NUMERIC(10, 2) NOT NULL,
    quantidade_poltronas_total INTEGER NOT NULL,
    quantidade_poltronas_ocupadas INTEGER DEFAULT 0,
    codigo_aeroporto_origem VARCHAR(3) NOT NULL,
    codigo_aeroporto_destino VARCHAR(3) NOT NULL,
	id_estado_voo INTEGER NOT NULL,
    CONSTRAINT fk_voo_aeroporto_origem FOREIGN KEY (codigo_aeroporto_origem) REFERENCES aeroporto(codigo_aeroporto),
    CONSTRAINT fk_voo_aeroporto_destino FOREIGN KEY (codigo_aeroporto_destino) REFERENCES aeroporto(codigo_aeroporto),
	CONSTRAINT fk_voo_estado_voo FOREIGN KEY (id_estado_voo) REFERENCES estado_voo(id_estado_voo)
);