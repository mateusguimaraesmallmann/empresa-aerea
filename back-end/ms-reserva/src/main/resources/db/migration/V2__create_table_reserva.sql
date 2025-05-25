CREATE TABLE reserva (
    codigo_reserva VARCHAR(6) PRIMARY KEY,
    codigo_voo VARCHAR(8) NOT NULL,
	data_reserva TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    valor_reserva NUMERIC(10,2) NOT NULL,
    milhas_utilizadas INTEGER NOT NULL,
    quantidade_poltronas INTEGER NOT NULL,
    id_cliente INTEGER NOT NULL,
	id_estado_reserva INTEGER NOT NULL,
	CONSTRAINT fk_estado_reserva FOREIGN KEY (id_estado_reserva) REFERENCES estado_reserva(id_estado_reserva)
);