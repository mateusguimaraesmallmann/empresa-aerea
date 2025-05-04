export type Voo = {
  codigo: string;
  id: string;
  origem: string;
  destino: string;
  dataHora: string;
  preco: number;
  poltronas: number;
  poltronasOcupadas: number;
  milhas: number;
  estado: string;
};

// Função auxiliar para converter "dd/mm/yyyy" + hora
function parseDate(dateStr: string, hora: string = '12:00'): string {
  const [dd, mm, yyyy] = dateStr.split('/');
  const [hh, min] = hora.split(':');
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min));
  return date.toISOString();
}

// Voos dinâmicos para testes de check-in 
const agora = new Date();
const vooDentroDe2h = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
const vooDentroDe12h = new Date(agora.getTime() + 12 * 60 * 60 * 1000);
const vooDentroDe24h = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
const vooDentroDe30h = new Date(agora.getTime() + 30 * 60 * 60 * 1000);
const vooDentroDe40h = new Date(agora.getTime() + 40 * 60 * 60 * 1000);

export const voosMockados: Voo[] = [
  {
    id: "11",
    codigo: "TADS0011",
    origem: "Aeroporto Internacional de Florianópolis - Hercílio Luz (FLN)",
    destino: "Aeroporto Internacional de Congonhas - São Paulo (CGH)",
    dataHora: vooDentroDe2h.toISOString(),
    preco: 250,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(250 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "12",
    codigo: "TADS0012",
    origem: "Aeroporto Internacional Pinto Martins - Fortaleza (FOR)",
    destino: "Aeroporto Internacional de Salvador (SSA)",
    dataHora: vooDentroDe30h.toISOString(),
    preco: 300,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(300 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "13",
    codigo: "TADS0013",
    origem: "Aeroporto Internacional de Confins - Belo Horizonte (CNF)",
    destino: "Aeroporto Internacional de Brasília (BSB)",
    dataHora: vooDentroDe40h.toISOString(),
    preco: 220,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(220 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "14",
    codigo: "TADS0014",
    origem: "Aeroporto Internacional de Porto Alegre - Salgado Filho (POA)",
    destino: "Aeroporto Internacional de Curitiba - Afonso Pena (CWB)",
    dataHora: vooDentroDe12h.toISOString(),
    preco: 210,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(210 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "15",
    codigo: "TADS0015",
    origem: "Aeroporto Internacional de Recife - Recife (REC)",
    destino: "Aeroporto Internacional de Belém - Belém (BEL)",
    dataHora: vooDentroDe24h.toISOString(),
    preco: 270,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(270 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "16",
    codigo: "TADS0016",
    origem: "Aeroporto Internacional de João Pessoa - João Pessoa (JPA)",
    destino: "Aeroporto Internacional de Maceió - Maceió (MCZ)",
    dataHora: vooDentroDe30h.toISOString(),
    preco: 195,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(195 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "1",
    codigo: "TADS0001",
    origem: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
    destino: "Aeroporto Internacional de Salvador - Salvador (SSA)",
    dataHora: parseDate("30/03/2025", "10:00"),
    preco: 100,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(100 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "2",
    codigo: "TADS0002",
    origem: "Aeroporto Santos Dumont - Rio de Janeiro (SDU)",
    destino: "Aeroporto do Galeão - Rio de Janeiro (GIG)",
    dataHora: parseDate("01/04/2025", "14:30"),
    preco: 150,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(150 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "3",
    codigo: "TADS0003",
    origem: "Aeroporto Internacional de Brasília - Brasília (BSB)",
    destino: "Aeroporto Internacional de Confins - Belo Horizonte (CNF)",
    dataHora: parseDate("10/04/2025", "08:15"),
    preco: 200,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(200 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "4",
    codigo: "TADS0004",
    origem: "Aeroporto Internacional de Curitiba - Afonso Pena (CWB)",
    destino: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
    dataHora: parseDate("20/04/2025", "16:45"),
    preco: 220,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(220 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "5",
    codigo: "TADS0005",
    origem: "Aeroporto Internacional de Curitiba - Afonso Pena (CWB)",
    destino: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
    dataHora: parseDate("22/04/2025", "18:00"),
    preco: 210,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(210 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "6",
    codigo: "TADS0006",
    origem: "Aeroporto Internacional de Porto Alegre - Porto Alegre (POA)",
    destino: "Aeroporto Internacional de Brasília - Brasília (BSB)",
    dataHora: parseDate("25/04/2025", "07:30"),
    preco: 190,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(190 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "7",
    codigo: "TADS0007",
    origem: "Aeroporto Internacional de Fortaleza - Fortaleza (FOR)",
    destino: "Aeroporto Internacional de Recife - Recife (REC)",
    dataHora: parseDate("27/04/2025", "11:00"),
    preco: 170,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(170 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "8",
    codigo: "TADS0008",
    origem: "Aeroporto Internacional de Vitória - Vitória (VIX)",
    destino: "Aeroporto Internacional de Campinas - Campinas (VCP)",
    dataHora: parseDate("29/04/2025", "19:20"),
    preco: 160,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(160 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "9",
    codigo: "TADS0009",
    origem: "Aeroporto Internacional de Foz do Iguaçu - Foz do Iguaçu (IGU)",
    destino: "Aeroporto Internacional de Belém - Belém (BEL)",
    dataHora: parseDate("02/05/2025", "13:00"),
    preco: 230,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(230 / 5),
    estado: "CONFIRMADO",
  },
  {
    id: "10",
    codigo: "TADS0010",
    origem: "Aeroporto Internacional de Maceió - Maceió (MCZ)",
    destino: "Aeroporto Internacional de João Pessoa - João Pessoa (JPA)",
    dataHora: parseDate("05/05/2025", "09:45"),
    preco: 180,
    poltronas: 150,
    poltronasOcupadas: 0,
    milhas: Math.floor(180 / 5),
    estado: "CONFIRMADO",
  },
];
