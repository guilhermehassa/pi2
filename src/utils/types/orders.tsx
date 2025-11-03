import { CartProps } from './cart';
import { OpcaoEntrega } from './delivery';

export interface OrderProps extends CartProps {
  id: string;
  status: 'solicitado' | 'produzindo' | 'em entrega' | 'finalizado';
  name: string;
  address: string;
  phone: string;
  deliveryMethod: OpcaoEntrega;
  observations: string;
  createdAt: string;
}