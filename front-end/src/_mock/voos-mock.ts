export type Voo = {
  id: string;
  origem: string;
  destino: string;
  dataHora: string;
  preco: number;
};

// Função auxiliar para converter "dd/mm/yyyy" + hora
function parseDate(dateStr: string, hora: string = '12:00'): string {
  const [dd, mm, yyyy] = dateStr.split('/');
  const [hh, min] = hora.split(':');
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min));
  return date.toISOString();
}

// Voos dinâmicos para testes de check-in (48h)
const agora = new Date();
const vooDentroDe2h = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
const vooDentroDe30h = new Date(agora.getTime() + 30 * 60 * 60 * 1000);
const vooDentroDe40h = new Date(agora.getTime() + 40 * 60 * 60 * 1000);
const vooDentroDe12h = new Date(agora.getTime() + 12 * 60 * 60 * 1000);

export const voosMockados: Voo[] = [
  {
    id: "11",
    origem: "Aeroporto Internacional de Florianópolis - Hercílio Luz (FLN)",
    destino: "Aeroporto Internacional de Congonhas - São Paulo (CGH)",
    dataHora: vooDentroDe2h.toISOString(),
    preco: 250,
  },
  {
    id: "12",
    origem: "Aeroporto Internacional Pinto Martins - Fortaleza (FOR)",
    destino: "Aeroporto Internacional de Salvador (SSA)",
    dataHora: vooDentroDe30h.toISOString(),
    preco: 300,
  },
  {
    id: "13",
    origem: "Aeroporto Internacional de Confins - Belo Horizonte (CNF)",
    destino: "Aeroporto Internacional de Brasília (BSB)",
    dataHora: vooDentroDe40h.toISOString(),
    preco: 220,
  },
  {
    id: "14",
    origem: "Aeroporto Internacional de Porto Alegre - Salgado Filho (POA)",
    destino: "Aeroporto Internacional de Curitiba - Afonso Pena (CWB)",
    dataHora: vooDentroDe12h.toISOString(),
    preco: 210,
  },

  // Voos fixos do mock original
  {
    id: "1",
    origem: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
    destino: "Aeroporto Internacional de Salvador - Salvador (SSA)",
    dataHora: parseDate("30/03/2025", "10:00"),
    preco: 100,
  },
  {
    id: "2",
    origem: "Aeroporto Santos Dumont - Rio de Janeiro (SDU)",
    destino: "Aeroporto do Galeão - Rio de Janeiro (GIG)",
    dataHora: parseDate("01/04/2025", "14:30"),
    preco: 150,
  },
  {
    id: "3",
    origem: "Aeroporto Internacional de Brasília - Brasília (BSB)",
    destino: "Aeroporto Internacional de Confins - Belo Horizonte (CNF)",
    dataHora: parseDate("10/04/2025", "08:15"),
    preco: 200,
  },
  {
    id: "4",
    origem: "Aeroporto Afonso Pena - Curitiba (CWB)",
    destino: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
    dataHora: parseDate("20/04/2025", "16:45"),
    preco: 220,
  },
  {
    id: "5",
    origem: "Aeroporto Afonso Pena - Curitiba (CWB)",
    destino: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
    dataHora: parseDate("22/04/2025", "18:00"),
    preco: 210,
  },
  {
    id: "6",
    origem: "Aeroporto Internacional de Porto Alegre - Porto Alegre (POA)",
    destino: "Aeroporto Internacional de Brasília - Brasília (BSB)",
    dataHora: parseDate("25/04/2025", "07:30"),
    preco: 190,
  },
  {
    id: "7",
    origem: "Aeroporto Internacional de Fortaleza - Fortaleza (FOR)",
    destino: "Aeroporto Internacional de Recife - Recife (REC)",
    dataHora: parseDate("27/04/2025", "11:00"),
    preco: 170,
  },
  {
    id: "8",
    origem: "Aeroporto Internacional de Vitória - Vitória (VIX)",
    destino: "Aeroporto Internacional de Campinas - Campinas (VCP)",
    dataHora: parseDate("29/04/2025", "19:20"),
    preco: 160,
  },
  {
    id: "9",
    origem: "Aeroporto Internacional de Foz do Iguaçu - Foz do Iguaçu (IGU)",
    destino: "Aeroporto Internacional de Belém - Belém (BEL)",
    dataHora: parseDate("02/05/2025", "13:00"),
    preco: 230,
  },
  {
    id: "10",
    origem: "Aeroporto Internacional de Maceió - Maceió (MCZ)",
    destino: "Aeroporto Internacional de João Pessoa - João Pessoa (JPA)",
    dataHora: parseDate("05/05/2025", "09:45"),
    preco: 180,
  },
];
