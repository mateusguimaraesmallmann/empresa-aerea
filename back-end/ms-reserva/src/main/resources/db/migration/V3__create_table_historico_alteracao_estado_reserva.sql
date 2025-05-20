CREATE TABLE historico_alteracao_estado_reserva (
    id_historico_alteracao_estado_reserva SERIAL PRIMARY KEY,
    data_alteracao_estado_reserva TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	codigo_reserva VARCHAR(6) NOT NULL UNIQUE,
    id_estado_reserva_origem INTEGER NOT NULL,
    id_estado_reserva_destino INTEGER NOT NULL,
	CONSTRAINT fk_historico_alteracao_estado_reserva_estado_reserva FOREIGN KEY (codigo_reserva) REFERENCES reserva(codigo_reserva),
    CONSTRAINT fk_historico_alteracao_estado_reserva_origem FOREIGN KEY (id_estado_reserva_origem) REFERENCES estado_reserva(id_estado_reserva),
    CONSTRAINT fk_historico_alteracao_estado_reserva_destino FOREIGN KEY (id_estado_reserva_destino) REFERENCES estado_reserva(id_estado_reserva)
);