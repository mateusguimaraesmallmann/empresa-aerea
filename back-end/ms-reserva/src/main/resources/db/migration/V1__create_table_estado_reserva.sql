CREATE TABLE estado_reserva (
	id_estado_reserva INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	sigla_estado_reserva VARCHAR(5) NOT NULL UNIQUE,
	tipo_estado_reserva VARCHAR(50) NOT NULL UNIQUE
);