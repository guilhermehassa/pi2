import { CartProps } from './cart';
import { OpcaoEntrega } from './delivery';
import { AddressProps } from './users';

export interface OrderProps extends CartProps {
  id: string;
  status: 'solicitado' | 'produzindo' | 'em entrega' | 'finalizado';
  name: string;
  address: string | AddressProps;
  phone: string;
  deliveryMethod: OpcaoEntrega;
  observations: string;
  createdAt: string;
}