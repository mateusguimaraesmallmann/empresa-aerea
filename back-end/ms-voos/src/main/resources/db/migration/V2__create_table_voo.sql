CREATE TABLE voo (
    id VARCHAR(255) PRIMARY KEY,
    codigo VARCHAR(8) UNIQUE NOT NULL,
    data_hora TIMESTAMPTZ NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    poltronas INTEGER NOT NULL,
    poltronas_ocupadas INTEGER DEFAULT 0,
    origem_id VARCHAR(3) NOT NULL,
    destino_id VARCHAR(3) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    CONSTRAINT fk_voo_origem FOREIGN KEY (origem_id) REFERENCES aeroporto(codigo_aeroporto),
    CONSTRAINT fk_voo_destino FOREIGN KEY (destino_id) REFERENCES aeroporto(codigo_aeroporto)
);