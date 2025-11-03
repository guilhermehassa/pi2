"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiEye } from 'react-icons/fi';
import { OrderProps } from '@/utils/types/orders';
import { orders } from '@/utils/data/orders';
import { showInBrazilianValue } from '@/utils/functions/functions';

import { db } from '@/services/firebaseConnection';
import { doc, updateDoc } from 'firebase/firestore';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<OrderProps[]>([]);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<OrderProps | null>(null);

  const calcularTotal = (pedido: OrderProps) => {
    const subtotal = pedido.items.reduce((acc, item) => acc + (item.value! * (item.quantity || 1)), 0);
    return subtotal + pedido.deliveryMethod.taxa;
  };

  const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Busca pedidos ao montar o componente
  useEffect(() => {
    async function fetchOrders() {
      const fetchedOrders = await orders();
      setPedidos(fetchedOrders);
    }

    fetchOrders();
  }, []);

  const handleAbrirDetalhes = (pedido: OrderProps) => {
    setPedidoSelecionado(pedido);
    setModalDetalhes(true);
  };

  const handleMudarStatus = async (pedidoId: string, novoStatus: OrderProps['status']) => {
    if (!confirm(`Deseja alterar o status do pedido para ${novoStatus}?`)) return;

    try {
      await updateDoc(doc(db, "carts", pedidoId), {
        status: novoStatus
      });

      setPedidos(pedidos.map(pedido => 
        pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
      ));

      alert('Status atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  return (
    <div className="container mx-auto px-3 my-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Pedidos</h1>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {modalDetalhes && pedidoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div id="printable-area">
              <h2 className="text-2xl font-bold mb-4">Detalhes do Pedido</h2>
              <div className="space-y-4">
              <div>
                <p className="font-semibold">Cliente:</p>
                <p>{pedidoSelecionado.name}</p>
              </div>
              <div>
                <p className="font-semibold">Telefone:</p>
                <p>{pedidoSelecionado.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p className="capitalize">{pedidoSelecionado.status}</p>
              </div>
              <div>
                <p className="font-semibold">Data do Pedido:</p>
                <p>{formatarDataHora(pedidoSelecionado.createdAt)}</p>
              </div>
              <div>
                <p className="font-semibold">Endereço de Entrega:</p>
                <p>{pedidoSelecionado.address}</p>
              </div>
              <div>
                <p className="font-semibold">Método de Entrega:</p>
                <p>{pedidoSelecionado.deliveryMethod.nome} - {showInBrazilianValue(pedidoSelecionado.deliveryMethod.taxa)}</p>
                <p className="text-sm text-gray-600">Tempo estimado: {pedidoSelecionado.deliveryMethod.tempoEstimado}</p>
              </div>
              <div>
                <p className="font-semibold">Itens do Pedido:</p>
                <div className="mt-2">
                  {pedidoSelecionado.items.map((item, index) => (
                    <div key={index} className="flex justify-between border-b py-2">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{showInBrazilianValue(item.value! * (item.quantity || 1))}</span>
                    </div>
                  ))}
                </div>
              </div>
              {pedidoSelecionado.observations && (
                <div>
                  <p className="font-semibold">Observações:</p>
                  <p className="text-gray-700">{pedidoSelecionado.observations}</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-sm text-gray-600">Subtotal: {showInBrazilianValue(pedidoSelecionado.items.reduce((acc, item) => acc + (item.value! * (item.quantity || 1)), 0))}</p>
                <p className="text-sm text-gray-600">Taxa de Entrega: {showInBrazilianValue(pedidoSelecionado.deliveryMethod.taxa)}</p>
                <p className="font-semibold text-lg">Total: {showInBrazilianValue(calcularTotal(pedidoSelecionado))}</p>
              </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 no-print"
                onClick={() => window.print()}
              >
                Imprimir Pedido
              </button>
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 no-print"
                onClick={() => setModalDetalhes(false)}
              >
                Fechar
              </button>
            </div>

            <style jsx global>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .no-print {
                  display: none !important;
                }
                #printable-area, #printable-area * {
                  visibility: visible;
                }
                #printable-area {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
              }
            `}</style>

          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Data</th>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4">{formatarDataHora(pedido.createdAt)}</td>
                <td className="p-4">{pedido.name}</td>
                <td className="p-4">
                  <select
                    value={pedido.status}
                    onChange={(e) => handleMudarStatus(pedido.id, e.target.value as OrderProps['status'])}
                    className="p-2 border rounded-md"
                  >
                    <option value="solicitado">Solicitado</option>
                    <option value="produzindo">Produzindo</option>
                    <option value="em entrega">Em Entrega</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </td>
                <td className="p-4">{showInBrazilianValue(calcularTotal(pedido))}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleAbrirDetalhes(pedido)}
                    className="text-amber-900 hover:text-amber-700"
                  >
                    <FiEye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}