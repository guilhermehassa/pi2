"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { CategoriesProps } from '@/utils/types/categories';
import { categories } from '@/utils/data/categories';

import { db } from '@/services/firebaseConnection';
import { collection, addDoc, query, orderBy, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';


export default function CategoriasPage() {
  const defaultCategoria: CategoriesProps = {
    id: '',
    name: '',
    order: 1,
  };

  const [categorias, setCategorias] = useState<CategoriesProps[]>([]);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      const fetchedCategories = await categories();
      setCategorias(fetchedCategories);

      console.log('Fetched categories:', categorias);
    }

    fetchCategories();
  }, []);


  const [novaCategoriaAberta, setNovaCategoriaAberta] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState<Omit<CategoriesProps, 'id'>>(defaultCategoria);

  const [modalEditarCategoria, setModalEditarCategoria] = useState<Boolean>(false);
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<CategoriesProps>(defaultCategoria);

  const handleExcluir = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        // Exclui a categoria do Firestore
        await deleteDoc(doc(db, 'categorias', id));

        // Atualiza o estado local
        setCategorias(categorias.filter(cat => cat.id !== id));

        alert('Categoria excluída com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir categoria:', err);
        alert('Erro ao excluir categoria. Tente novamente.');
      }
    }
  };

  async function handleAdicionarCategoria () {
    if (!novaCategoria.name) {
      alert('Defina um nome para a categoria.');
      return;
    }
    if (!novaCategoria.order || novaCategoria.order < 1 || novaCategoria.order > 100) {
      alert('Defina uma ordem de prioridade para a categoria entre 1 e 100.');
      return;
    }

    try{
      const addedCategory = await addDoc(collection(db, `categorias`), {
        name: novaCategoria.name,
        order: novaCategoria.order,
      });
      alert('Categoria Cadastrada com sucesso!');
      setNovaCategoriaAberta(false);
      setNovaCategoria(defaultCategoria);

      setCategorias([...categorias, {
        id: addedCategory.id as unknown as string,
        name: novaCategoria.name,
        order: novaCategoria.order,
      }]);

    }catch(err){
      console.error("Erro ao registrar tarefa:", err);
    }

  };

  const handleAbrirEdicao = (categoria: CategoriesProps) => {
    setCategoriaEmEdicao(categoria);
    setModalEditarCategoria(!modalEditarCategoria);
  }

  const handleEditarCategoria = async (categoria: CategoriesProps) => {
    if (!categoria.name) {
      alert("Defina um nome para a categoria.");
      return;
    }
    if (!categoria.order || categoria.order < 1 || categoria.order > 100) {
      alert("Defina uma ordem de prioridade para a categoria entre 1 e 100.");
      return;
    }

    try {
      // Atualiza a categoria no Firestore
      await updateDoc(doc(db, "categorias", categoria.id), {
        name: categoria.name,
        order: categoria.order,
      });

      // Atualiza o estado local
      setCategorias((prevCategorias) =>
        prevCategorias.map((cat) =>
          cat.id === categoria.id ? { ...cat, name: categoria.name, order: categoria.order } : cat
        )
      );

      alert("Categoria atualizada com sucesso!");
      setModalEditarCategoria(false);
    } catch (err) {
      console.error("Erro ao editar categoria:", err);
    }
  };

  return (
    <div className="container mx-auto px-3 my-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Categorias</h1>
        </div>
        <button 
          onClick={() => setNovaCategoriaAberta(!novaCategoriaAberta)}
          className="bg-amber-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700"
        >
          <FiPlus /> Adicionar Categoria
        </button>
      </div>

      {novaCategoriaAberta && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nova Categoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={novaCategoria.name}
                onChange={(e) => setNovaCategoria({ ...novaCategoria, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={novaCategoria.order}
                min={1} max={100}
                onChange={(e) => setNovaCategoria({ ...novaCategoria, order: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setNovaCategoriaAberta(false)}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={handleAdicionarCategoria}
            >
              Salvar
            </button>
          </div>
        </div>
      )}
      {modalEditarCategoria && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nova Categoria</h2>
          <input type="number" value={categoriaEmEdicao.id}  className='hidden'/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={categoriaEmEdicao.name}
                onChange={(e) => setCategoriaEmEdicao({ ...categoriaEmEdicao, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                min={1} max={100}
                value={categoriaEmEdicao.order}
                onChange={(e) => setCategoriaEmEdicao({ ...categoriaEmEdicao, order: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setModalEditarCategoria(!modalEditarCategoria)}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={() => handleEditarCategoria(categoriaEmEdicao)}
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
              <th className="p-4 text-left">Ordem</th>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length > 0 && 
              categorias.sort((a, b) => (a.order || 0) - (b.order || 0)).map((categoria) => (
                <tr key={categoria.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-4">{categoria.order}</td>
                  <td className="p-4">{categoria.name}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        className="text-amber-900 hover:text-amber-700"
                        onClick={() => handleAbrirEdicao(categoria)}
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleExcluir(categoria.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}