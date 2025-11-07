'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderProps } from '@/utils/types/orders';
import { getUserOrders } from '@/utils/data/orders';
import { db } from '@/services/firebaseConnection';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { formatarEndereco } from '@/utils/functions/functions';

export default function MeusPedidos() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersData = await getUserOrders(user.id);
        console.log(user.id);

        setOrders(ordersData);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      'solicitado': { label: 'Solicitado', color: 'bg-yellow-500' },
      'produzindo': { label: 'Em Produção', color: 'bg-blue-500' },
      'em entrega': { label: 'Em Entrega', color: 'bg-purple-500' },
      'finalizado': { label: 'Finalizado', color: 'bg-green-500' }
    };

    return statusMap[status] || { label: status, color: 'bg-gray-500' };
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Você ainda não possui pedidos.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Pedido #{order.id.slice(-6)}</h2>
                  <p className="text-gray-600">
                    Realizado em: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className={`${getStatusLabel(order.status).color} text-white px-4 py-2 rounded-full`}>
                  {getStatusLabel(order.status).label}
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Dados do Pedido</h3>
                  <p><strong>Nome:</strong> {order.name}</p>
                  <p><strong>Telefone:</strong> {order.phone}</p>
                  <p><strong>Endereço:</strong> {formatarEndereco(order.address)}</p>
                  <p><strong>Método de Entrega:</strong> {order.deliveryMethod.nome}</p>
                  {order.observations && (
                    <p><strong>Observações:</strong> {order.observations}</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Itens do Pedido</h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R$ {((item.value || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Subtotal:</span>
                    <span>R$ {order.items.reduce((acc, item) => acc + ((item.value || 0) * (item.quantity || 1)), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Taxa de Entrega:</span>
                    <span>R$ {order.deliveryMethod.taxa.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold mt-2">
                    <span>Total:</span>
                    <span>R$ {(order.items.reduce((acc, item) => acc + ((item.value || 0) * (item.quantity || 1)), 0) + order.deliveryMethod.taxa).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}