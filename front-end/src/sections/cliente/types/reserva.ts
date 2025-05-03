// Tipo principal utilizado nas tabelas, ver e cancelar reserva
export type Reserva = {
    id: string;
    dataHora: string;
    origem: string;
    destino: string;
    codigo: string;
    valorReais: number;
    milhasGastas: number;
    estado: string;
};

// Tipo que representa os dados salvos no localStorage após efetuar uma reserva
export type ReservaStorage = {
    codigo: string;
    voo: {
        id: string;
        origem: string;
        destino: string;
        dataHora: string;
        preco: number;
    };
    quantidade: number;
    milhasUsadas: number;
    restanteEmDinheiro: number;
    estado: string;
    dataHoraCancelamento?: string;
};

// Função que converte ReservaStorage em Reserva
export function adaptarReservaStorageParaReserva(r: ReservaStorage): Reserva {
    return {
        id: r.voo.id,
        dataHora: r.voo.dataHora,
        origem: r.voo.origem,
        destino: r.voo.destino,
        codigo: r.codigo,
        valorReais: r.restanteEmDinheiro,
        milhasGastas: r.milhasUsadas,
        estado: r.estado,
    };
}

// Função pra buscar e adaptar todas as reservas do localStorage
export function getReservasDoLocalStorageAdaptadas(): Reserva[] {
    const salvas = JSON.parse(localStorage.getItem('reservas') || '[]') as ReservaStorage[];
    return salvas.map(adaptarReservaStorageParaReserva);
}
