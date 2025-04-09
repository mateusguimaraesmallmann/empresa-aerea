
export type TransacaoMilhas = {
    id: string;
    dataHora: string;
    codigoReserva: string | null;
    valorReais: number | null;
    quantidadeMilhas: number;
    descricao: string;
    tipo: 'ENTRADA' | 'SAÍDA';
  };
  
  export type ExtratoMilhasProps = {
    transacoes: TransacaoMilhas[];
  };