export type OpcaoEntrega = {
  id: string;
  nome: string;
  taxa: number;
  tempoEstimado: string;
  status: boolean;
};

export const defaultDeliveryOption: OpcaoEntrega = {
  id: '',
  nome: '',
  taxa: 0,
  tempoEstimado: '',
  status: true
};