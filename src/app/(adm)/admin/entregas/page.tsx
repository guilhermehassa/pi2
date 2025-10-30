"use client"

import { use, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { OpcaoEntrega, defaultDeliveryOption } from '@/utils/types/delivery';
import { db } from '@/services/firebaseConnection';
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deliveries } from '@/utils/data/delivery';
import { showInBrazilianValue } from '@/utils/functions/functions';




export default function EntregasPage() {
  const [opcoes, setOpcoes] = useState<OpcaoEntrega[]>([]);

  const [modalNovaOpcao, setModalNovaOpcao] = useState(false);
  const [novaOpcao, setNovaOpcao] = useState<OpcaoEntrega>(defaultDeliveryOption);
  useState(() => {
    async function fetchDeliveries() {
      const fetchedDeliveries = await deliveries();
      setOpcoes(fetchedDeliveries);
    }
    fetchDeliveries();
  });

  const [modalEditarOpcao, setModalEditarOpcao] = useState(false);
  const [opcaoEditar, setOpcaoEditar] = useState<OpcaoEntrega>(defaultDeliveryOption);


  async function handleAdicionarOpcao() {
    if (!novaOpcao.nome) {
      alert('Defina um nome para a opção de entrega.');
      return;
    }

    try {
      // Adiciona a nova opção ao Firestore
      const addedDelivery = await addDoc(collection(db, 'entregas'), {
        nome: novaOpcao.nome,
        taxa: novaOpcao.taxa,
        tempoEstimado: novaOpcao.tempoEstimado,
        status: novaOpcao.status,
      });
      // Atualiza o estado local
      setOpcoes([...opcoes, { ...novaOpcao, id: addedDelivery.id }]);
      setModalNovaOpcao(false);
      setNovaOpcao(defaultDeliveryOption);
      alert('Opção de entrega adicionada com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar opção de entrega:', err);
      alert('Erro ao adicionar opção de entrega. Tente novamente.');
    }
  };

  function handleOpenModalEditarOpcao(opcao: OpcaoEntrega) {
    setOpcaoEditar(opcao);
    setModalEditarOpcao(true);
  }

  async function handleSalvarOpcaoEditada() {
    if (!opcaoEditar.nome) {
      alert('Defina um nome para a opção de entrega.');
      return;
    }
    try {
      const opcaoRef = doc(db, 'entregas', opcaoEditar.id);
      await updateDoc(opcaoRef, {
        nome: opcaoEditar.nome,
        taxa: opcaoEditar.taxa,
        tempoEstimado: opcaoEditar.tempoEstimado,
        status: opcaoEditar.status,
      });
      const updatedOpcoes = opcoes.map((opcao) =>
        opcao.id === opcaoEditar.id ? opcaoEditar : opcao
      );
      setOpcoes(updatedOpcoes);
      setModalEditarOpcao(false);
      alert('Opção de entrega atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar opção de entrega:', err);
      alert('Erro ao atualizar opção de entrega. Tente novamente.');
    }
  }

  async function handleExcluirOpcao(id: string) {
    if(confirm('Tem certeza que deseja excluir esta opção de entrega?\nEsta ação não pode ser desfeita.')) {
      await deleteDoc(doc(db, 'entregas', id));
      setOpcoes(opcoes.filter(opcao => opcao.id !== id));
      alert('Opção de entrega excluída com sucesso!');
    }
  }
  

  return (
    <div className="container mx-auto px-3 my-10 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Tipos de Entrega</h1>
        </div>
        <button 
          onClick={() => setModalNovaOpcao(!modalNovaOpcao)}
          className="bg-amber-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700"
        >
          <FiPlus /> Adicionar Opção
        </button>
      </div>

      {modalNovaOpcao && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nova Opção de Entrega</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={novaOpcao.nome}
                onChange={(e) => setNovaOpcao({...novaOpcao, nome: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxa (R$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={novaOpcao.taxa}
                onChange={(e) => setNovaOpcao({...novaOpcao, taxa: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Estimado</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={novaOpcao.tempoEstimado}
                onChange={(e) => setNovaOpcao({...novaOpcao, tempoEstimado: e.target.value})}
                placeholder="Ex: 30-45 min"
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <button onClick={() => setNovaOpcao({...novaOpcao, status: !novaOpcao.status})}>
              {novaOpcao.status ? (
                <span className="flex items-center gap-1 text-green-600">
                  <FiToggleRight /> Ativo
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <FiToggleLeft /> Inativo
                </span>
              )}
            </button>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setModalNovaOpcao(false)}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={handleAdicionarOpcao}
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {modalEditarOpcao && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Editar Opção de Entrega</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={opcaoEditar.nome}
                onChange={(e) => setOpcaoEditar({...opcaoEditar, nome: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxa (R$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={opcaoEditar.taxa}
                onChange={(e) => setOpcaoEditar({...opcaoEditar, taxa: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Estimado</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={opcaoEditar.tempoEstimado}
                onChange={(e) => setOpcaoEditar({...opcaoEditar, tempoEstimado: e.target.value})}
                placeholder="Ex: 30-45 min"
              />
            </div>

          </div>
          <div className="flex items-center mb-4">
            <button onClick={() => setOpcaoEditar({...opcaoEditar, status: !opcaoEditar.status})}>
              {opcaoEditar.status ? (
                <span className="flex items-center gap-1 text-green-600">
                  <FiToggleRight /> Ativo
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <FiToggleLeft /> Inativo
                </span>
              )}
            </button>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setModalEditarOpcao(false)}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => handleSalvarOpcaoEditada()}
            >
              Salvar
            </button>
          </div>
        </div>    
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Taxa</th>
              <th className="p-4 text-left">Tempo Estimado</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {opcoes.length > 0 &&
              opcoes.map((opcao) => (
                <tr key={opcao.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-4">{opcao.nome}</td>
                  <td className="p-4">{opcao.taxa === 0 ? 'Grátis' : showInBrazilianValue(opcao.taxa)}</td>
                  <td className="p-4">{opcao.tempoEstimado}</td>
                  <td className="p-4">
                    {opcao.status ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <FiToggleRight /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <FiToggleLeft /> Inativo
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        className="text-amber-900 hover:text-amber-700"
                        onClick={() => handleOpenModalEditarOpcao(opcao)}
                        >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleExcluirOpcao(opcao.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}