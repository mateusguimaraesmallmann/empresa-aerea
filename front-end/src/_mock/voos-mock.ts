// src/_mock/voos-mock.ts

export type Voo = {
    id: string;
    origem: string;
    destino: string;
    dataHora: string;
    preco: number;
  };
  
  function parseDate(dateStr: string): string {
    const [dd, mm, yyyy] = dateStr.split('/');
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return date.toISOString();
  }
  
  export const voosMockados: Voo[] = [
    {
      id: "1",
      origem: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
      destino: "Aeroporto Internacional de Salvador - Salvador (SSA)",
      dataHora: parseDate("30/03/2025"),
      preco: 100,
    },
    {
      id: "2",
      origem: "Aeroporto Santos Dumont - Rio de Janeiro (SDU)",
      destino: "Aeroporto do Galeão - Rio de Janeiro (GIG)",
      dataHora: parseDate("01/04/2025"),
      preco: 150,
    },
    {
      id: "3",
      origem: "Aeroporto Internacional de Brasília - Brasília (BSB)",
      destino: "Aeroporto Internacional de Confins - Belo Horizonte (CNF)",
      dataHora: parseDate("10/04/2025"),
      preco: 200,
    },
    {
      id: "4",
      origem: "Aeroporto Afonso Pena - Curitiba (CWB)",
      destino: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
      dataHora: parseDate("20/04/2025"),
      preco: 220,
    },
    {
      id: "5",
      origem: "Aeroporto Afonso Pena - Curitiba (CWB)",
      destino: "Aeroporto Internacional de Guarulhos - São Paulo (GRU)",
      dataHora: parseDate("22/04/2025"),
      preco: 210,
    },
    {
      id: "6",
      origem: "Aeroporto Internacional de Porto Alegre - Porto Alegre (POA)",
      destino: "Aeroporto Internacional de Brasília - Brasília (BSB)",
      dataHora: parseDate("25/04/2025"),
      preco: 190,
    },
    {
      id: "7",
      origem: "Aeroporto Internacional de Fortaleza - Fortaleza (FOR)",
      destino: "Aeroporto Internacional de Recife - Recife (REC)",
      dataHora: parseDate("27/04/2025"),
      preco: 170,
    },
    {
      id: "8",
      origem: "Aeroporto Internacional de Vitória - Vitória (VIX)",
      destino: "Aeroporto Internacional de Campinas - Campinas (VCP)",
      dataHora: parseDate("29/04/2025"),
      preco: 160,
    },
    {
      id: "9",
      origem: "Aeroporto Internacional de Foz do Iguaçu - Foz do Iguaçu (IGU)",
      destino: "Aeroporto Internacional de Belém - Belém (BEL)",
      dataHora: parseDate("02/05/2025"),
      preco: 230,
    },
    {
      id: "10",
      origem: "Aeroporto Internacional de Maceió - Maceió (MCZ)",
      destino: "Aeroporto Internacional de João Pessoa - João Pessoa (JPA)",
      dataHora: parseDate("05/05/2025"),
      preco: 180,
    },
  ];  