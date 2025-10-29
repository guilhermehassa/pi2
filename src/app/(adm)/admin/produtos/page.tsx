"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductsProps, defaultProduct, defaultVariation } from '@/utils/types/products';
import { products } from '@/utils/data/products';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getCheaperVariation, showInBrazilianValue, uploadImage } from '@/utils/functions/functions';
import { CategoriesProps } from '@/utils/types/categories';
import { categories } from '@/utils/data/categories';
import { db, storage } from '@/services/firebaseConnection';
import { ref, deleteObject } from "firebase/storage";
import { collection, addDoc, query, orderBy, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';


export default function ProdutosPage() {
  

  const [categorias, setCategorias] = useState<CategoriesProps[]>([]);
  
  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      const fetchedCategories = await categories();
      setCategorias(fetchedCategories);
    }

    fetchCategories();
  }, []);
  const [produtos, setProdutos] = useState<ProductsProps[]>();
  const [produtosFiltrados, setProdutosFiltrados] = useState<ProductsProps[]>([]);
  const [filtroBusca, setFiltroBusca] = useState('');

  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [novoProduto, setNovoProduto] = useState<ProductsProps>(defaultProduct);

  const [modalEditarProduto, setModalEditarProduto] = useState(false);
  const [produtoEditar, setProdutoEditar] = useState<ProductsProps>(defaultProduct);

  useEffect(() => {
    async function fetchProducts() {
      const fetchedProducts = await products();
      setProdutos(fetchedProducts);
      setProdutosFiltrados(
         fetchedProducts.filter(
          produto => produto.name.toLowerCase().includes(filtroBusca.toLowerCase())
        )
      );
    }

    fetchProducts();
  }, []);

  async function deleteFileByUrl(fileUrl: string) {
    try {
      const url = new URL(fileUrl);
      const fullPath = decodeURIComponent(
        url.pathname
          .split('/o/')[1]
          .split('?')[0]
      );

      // Criar referência ao arquivo
      const fileRef = ref(storage, fullPath);

      // Apagar o arquivo
      await deleteObject(fileRef);
      
      return true;
    } catch (error) {
      throw error;
    }
  }
  

  const handleBusca = (termo: string) => {
    setFiltroBusca(termo); 
    if (produtos) {
      const produtosFiltrados = produtos.filter(produto =>
        produto.name.toLowerCase().includes(termo.toLowerCase())
      );
      setProdutosFiltrados(produtosFiltrados);
    }
  };

  async function handleAdicionarProduto() {
    if (!novoProduto.name) {
      alert('Defina um nome para o produto.');
      return;
    }
    if (!novoProduto.categoryId) {
      alert('Defina uma categoria para o produto.');
      return;
    }
    if (!novoProduto.hasVariations && (novoProduto.value === undefined || novoProduto.value <= 0)) {
      alert('Defina um valor válido para o produto.');
      return;
    }

    try {
      let imageUrl = '';

      // Criar cópia do produto para não alterar o estado antes de salvar
      const produtoParaSalvar = { ...novoProduto };

      const addedProduct = await addDoc(collection(db, 'produtos'), {
        name: produtoParaSalvar.name,
        categoryId: produtoParaSalvar.categoryId,
        description: produtoParaSalvar.description || '',
        hasVariations: produtoParaSalvar.hasVariations,
        value: produtoParaSalvar.value || 0,
        imageUrl: '',
        status: produtoParaSalvar.status,
        variationPluralName: produtoParaSalvar.variationPluralName || '',
        variationSingularName: produtoParaSalvar.variationSingularName || '',
        variations: produtoParaSalvar.variations || [],
      });

      // Atualizar imagem principal com o ID do produto
      const generalImageInput = document.getElementById('generalImage') as HTMLInputElement;
      if (generalImageInput.files && generalImageInput.files[0]) {
        const file = generalImageInput.files[0];
        const extension = file.name.split('.').pop();
        const renamedFile = new File([file], `${addedProduct.id}.${extension}`, { type: file.type });
        imageUrl = await uploadImage(renamedFile, '/produtos');
        await updateDoc(doc(db, 'produtos', addedProduct.id), { imageUrl });
      }

      if (produtoParaSalvar.hasVariations && produtoParaSalvar.variations) {
        for (let i = 0; i < produtoParaSalvar.variations.length; i++) {
          const variationImageInput = document.getElementById(`variationImage-${i}`) as HTMLInputElement;
          if (variationImageInput && variationImageInput.files && variationImageInput.files[0]) {
            const file = variationImageInput.files[0];
            const extension = file.name.split('.').pop();
            const renamedFile = new File([file], `${addedProduct.id}-${produtoParaSalvar.variations[i].id}.${extension}`, { type: file.type });
            const variacaoImageUrl = await uploadImage(renamedFile, '/produtos');
            produtoParaSalvar.variations[i].image = variacaoImageUrl;
          } 
        }

        // Atualizar as variações no Firestore
        await updateDoc(doc(db, 'produtos', addedProduct.id), {
          variations: produtoParaSalvar.variations,
        });
      }

      // Atualizar estado com dados salvos
      const produtoAdicionado = {
        ...produtoParaSalvar,
        id: addedProduct.id,
        imageUrl,
      };

      setProdutos([...produtos!, produtoAdicionado]);
      setProdutosFiltrados([...produtosFiltrados!, produtoAdicionado]);
      setNovoProduto(defaultProduct);
      setModalNovoProduto(false);

      alert('Produto adicionado com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      alert('Erro ao adicionar produto. Tente novamente.');
    }
  }

  function handleAbrirModalEdicao(produto: ProductsProps) {
    setProdutoEditar(produto);
    setModalEditarProduto(true);
  }

  async function handleExcluirImagemPrincipal(produto: ProductsProps) {
    if (confirm('Deseja realmente excluir a imagem desse produto?\n\nA exclusão vai ser efetuada independente do salvamento do formulário de edição e não pode ser desfeita.')) {
       
      try {
        await deleteFileByUrl(produto.imageUrl);
        const produtoRef = await doc(db, 'produtos', produto.id);
        await updateDoc(produtoRef, {
          imageUrl: ''
        });
        setProdutoEditar({ ...produtoEditar, imageUrl: '' });
        alert('Imagem excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        alert('Erro ao excluir imagem. Tente novamente.');
      }
    }
  }

  async function handleExcluirImagemVariação(produto: ProductsProps, variacaoId : number) {
    if (confirm('Deseja realmente excluir a imagem dessa variação?\n\nA exclusão vai ser efetuada independente do salvamento do formulário de edição e não pode ser desfeita.')) {
      try {
        const variacao = produto.variations?.find(variation => variation.id === variacaoId);
        if (!variacao || !variacao.image) {
          alert('Variação ou imagem não encontrada.');
          return;
        }
        await deleteFileByUrl(variacao.image);
        const produtoRef = doc(db, 'produtos', produto.id);
        const novasVariacoes = produto.variations?.map(variation => {
          if (variation.id === variacaoId) {
            return { ...variation, image: '' };
          }
          return variation;
        }) || [];
        await updateDoc(produtoRef, {
          variations: novasVariacoes
        });
        setProdutoEditar({ ...produtoEditar, variations: novasVariacoes });
        alert('Imagem da variação excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir imagem da variação:', error);
        alert('Erro ao excluir imagem da variação. Tente novamente.');
      }
    }
  }

  async function handleExcluirVariacao(produto: ProductsProps, variacaoId : number) {
    if (confirm('Deseja realmente excluir essa variação?\n\nA exclusão vai ser efetuada independente do salvamento do formulário de edição e não pode ser desfeita.')) {
      try {
        const variacao = produto.variations?.find(variation => variation.id === variacaoId);
        if (!variacao) {
          alert('Variação não encontrada.');
          return;
        }
        if (variacao.image) {
          await deleteFileByUrl(variacao.image);
        }
        const produtoRef = doc(db, 'produtos', produto.id);
        const novasVariacoes = produto.variations?.filter(variation => variation.id !== variacaoId) || [];
        await updateDoc(produtoRef, {
          variations: novasVariacoes
        });
        setProdutoEditar({ ...produtoEditar, variations: novasVariacoes });
        alert('Variação excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir variação:', error);
        alert('Erro ao excluir variação. Tente novamente.');
      }
    }
  }

  async function handleEditarProduto() {
    if(!produtoEditar.name) {
      alert('O nome do produto não pode estar vazio.');
      return;
    }

    if(!produtoEditar.categoryId) {
      alert('A categoria do produto não pode estar vazia.');
      return
    }

    if(!produtoEditar.hasVariations && (produtoEditar.value === undefined || produtoEditar.value <= 0)) {
      alert('Defina um valor válido para o produto.');
      return;
    }

    try {
      const produtoRef = doc(db, 'produtos', produtoEditar.id);

      const produtoAtualizado = {
        name: produtoEditar.name,
        categoryId: produtoEditar.categoryId,
        description: produtoEditar.description || '',
        value: produtoEditar.value !== undefined ? produtoEditar.value : null,
        status: produtoEditar.status,
        hasVariations: produtoEditar.hasVariations,
        variationPluralName: produtoEditar.variationPluralName || '',
        variationSingularName: produtoEditar.variationSingularName || '',
        variations: produtoEditar.variations?.map(variation => ({
          ...variation,
          image: variation.image !== undefined ? variation.image : null, // Garantir que image não seja undefined
        })) || [],
      };

      await updateDoc(produtoRef, produtoAtualizado);

      setProdutos(produtos!.map(produto => produto.id === produtoEditar.id ? produtoEditar : produto));
      setProdutosFiltrados(produtosFiltrados!.map(produto => produto.id === produtoEditar.id ? produtoEditar : produto));
      setModalEditarProduto(false);
      alert('Produto editado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      alert('Erro ao editar produto. Tente novamente.');
    }

  }

  async function handleUploadImageOnEdition(product: ProductsProps, image: File, type: 'general' | 'variation', variationId?: number) {
    try {
      const extension = image.name.split('.').pop();
      let renamedFile: File;
      if (type === 'general') {
        renamedFile = new File([image], `${product.id}.${extension}`, { type: image.type });
      } else {
        renamedFile = new File([image], `${product.id}-${variationId}.${extension}`, { type: image.type });
      }
      const imageUrl = await uploadImage(renamedFile, '/produtos');
      const produtoRef = doc(db, 'produtos', product.id);
      if (type === 'general') {
        await updateDoc(produtoRef, { imageUrl });
        setProdutoEditar({ ...produtoEditar, imageUrl });
      } else {
        const novasVariacoes = product.variations?.map(variation => {
          if (variation.id === variationId) {
            return { ...variation, image: imageUrl };
          }
          return variation;
        }) || [];
        await updateDoc(produtoRef, { variations: novasVariacoes });
        setProdutoEditar({ ...produtoEditar, variations: novasVariacoes });
      }
      alert('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Erro ao enviar imagem. Tente novamente.');
    }

  }

  async function handleDeleteProduct(product: ProductsProps) {
    if (confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      try {
        if(product.imageUrl) {
          await deleteFileByUrl(product.imageUrl);
        }
        if(product.variations) {
          for (let i = 0; i < product.variations.length; i++) {
            const variation = product.variations[i];
            if (variation.image) {
              await deleteFileByUrl(variation.image);
            }
          }
        }

        await deleteDoc(doc(db, 'produtos', product.id));
        setProdutos(produtos!.filter(produto => produto.id !== product.id));
        setProdutosFiltrados(produtosFiltrados!.filter(produto => produto.id !== product.id));
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto. Tente novamente.');
      }
    }
  }

  return (
    <div className="container mx-auto px-3 my-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Produtos</h1>
        </div>
        <button 
          onClick={() => setModalNovoProduto(!modalNovoProduto)}
          className="bg-amber-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700"
        >
          <FiPlus /> Adicionar Produto
        </button>
      </div>

      {modalNovoProduto && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Novo Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={novoProduto.name}
                onChange={(e) => setNovoProduto({ ...novoProduto, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setNovoProduto({ ...novoProduto, categoryId: String (e.target.value) })}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="descricao" id="descricao"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setNovoProduto({ ...novoProduto, description: e.target.value })}
                style={{resize: 'none'}}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem
              </label>
              <input
                type="file"
                id='generalImage'
                accept='.jpg,.jpeg,.png,.webp,.svg'
                className="w-full px-3 py-2 border border-gray-300 bg-gray-300 rounded-md placeholder:"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNovoProduto({ ...novoProduto, imageUrl: event.target?.result as string });
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <label>
                <input
                  type='radio'
                  checked={novoProduto.status === true}
                  onChange={() => setNovoProduto({ ...novoProduto, status: true })}
                /> Disponível
              </label>
              <label>
                <input
                  type='radio'
                  className="ml-4"
                  checked={novoProduto.status === false}
                  onChange={() => setNovoProduto({ ...novoProduto, status: false })}
                /> Indisponível
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto Com Variações</label>
              <label>
                <input
                  type='radio'
                  className="mr-2"
                  checked={novoProduto.hasVariations === true}
                  onChange={() => setNovoProduto({ ...novoProduto, hasVariations: true })}
                /> Sim
              </label>
              <label>
                <input
                  type='radio'
                  className="ml-4"
                  checked={novoProduto.hasVariations === false}
                  onChange={() => setNovoProduto({ ...novoProduto, hasVariations: false })}
                /> Não
              </label>
            </div>
            
            {!novoProduto.hasVariations && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setNovoProduto({ ...novoProduto, value: Number(e.target.value) })}
                />
              </div>
            )} 
          </div>
          {novoProduto.hasVariations && (
            <div>
              <label className="block text-2xl font-bold text-gray-900 border-t-2 pt-2 mb-1">Variações</label>
              <div className='inline-block my-3 mr-5'>
                <h3>Nome da Variação (plural)</h3>
                <input
                  type="text"
                  placeholder='EX: Sabores'
                  className="my-1 border border-gray-300 rounded-md px-2 py-1 mr-2"
                  onChange={(e) => setNovoProduto({ ...novoProduto, variationPluralName: e.target.value })}
                  />
              </div>

              <div className='inline-block my-3'>
                <h3>Nome da Variação(singular)</h3>
                <input
                  type="text"
                  placeholder='EX: Sabor'
                  className="my-1 border border-gray-300 rounded-md px-2 py-1 mr-2"
                  onChange={(e) => setNovoProduto({ ...novoProduto, variationSingularName: e.target.value })}
                  />
              </div>
              <ul>
                {novoProduto.variations && novoProduto.variations.map((variacao, index) => (
                  <li key={index} className='flex flex-wrap justify-between mb-4 border-b-2 pb-2'>
                    <div className='flex flex-col w-[100%] lg:w-[48%]'>
                      <h3>Nome</h3>
                      <input
                        type="text"
                        placeholder="Nome"
                        value={variacao.name || ''} // Garantir que seja uma string
                        className="border border-gray-300 rounded-md px-2 py-1 mr-2 mb-2"
                        onChange={(e) => {
                          const novasVariacoes = [...(novoProduto.variations || [])];
                          novasVariacoes[index].name = e.target.value || ''; // Garantir que seja uma string
                          setNovoProduto({ ...novoProduto, variations: novasVariacoes });
                        }}
                      />
                      <h3>Preço</h3>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md px-2 py-1 mr-2 mb-2"
                        placeholder="Valor"
                        value={variacao.value || 1} // Garantir que seja um número
                        onChange={(e) => {
                          const novasVariacoes = [...(novoProduto.variations || [])];
                          novasVariacoes[index].value = Number(e.target.value) || 0; // Garantir que seja um número
                          setNovoProduto({ ...novoProduto, variations: novasVariacoes });
                        }}
                        />
                    </div>
                    <div className='w-[100%] lg:w-[48%]'>
                      <input 
                        type="file"
                        id={`variationImage-${index}`}
                        accept=".jpg,.jpeg,.png,.webp,.svg" 
                        className='border bg-gray-300 border-gray-300 rounded-md px-2 py-1 mr-2 mb-2'
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const novasVariacoes = [...(novoProduto.variations || [])];
                              novasVariacoes[index].image = event.target?.result as string;
                              setNovoProduto({ ...novoProduto, variations: novasVariacoes });
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <button 
                className="bg-amber-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700"
                onClick={() => {
                  const novasVariacoes = novoProduto.variations ? [...novoProduto.variations] : [];
                  const novoId = novasVariacoes.length > 0 ? novasVariacoes[novasVariacoes.length - 1].id + 1 : 1;
                  novasVariacoes.push({ ...defaultVariation, id: novoId });
                  setNovoProduto({ ...novoProduto, variations: novasVariacoes });
                }}
              >
                <FiPlus /> Adicionar Variação
              </button>

            </div>
          )}
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => {setModalNovoProduto(false), setNovoProduto(defaultProduct)}}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={handleAdicionarProduto}
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {modalEditarProduto && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Editar Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={produtoEditar.name}
                onChange={(e) => setProdutoEditar({ ...produtoEditar, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setProdutoEditar({ ...produtoEditar, categoryId: String (e.target.value) })}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id} selected={produtoEditar.categoryId === categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="descricao" id="descricao"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setProdutoEditar({ ...produtoEditar, description: e.target.value })}
                style={{resize: 'none'}}
              >
                {produtoEditar.description}
              </textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem Principal
              </label>
              { produtoEditar.imageUrl ? (
                <div
                  className="w-fit"
                  >
                  <img
                    id="produtoEditarImagemPrincipal"
                    src={produtoEditar.imageUrl} alt={produtoEditar.name}
                    className="w-auto max-w-[100%] h-24 object-cover rounded-md mb-2"
                  />
                  <button
                    className="p-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => (handleExcluirImagemPrincipal(produtoEditar))}
                    >
                    Excluir Essa Imagem
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  id='generalImage'
                  accept='.jpg,.jpeg,.png,.webp,.svg'
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-300 rounded-md placeholder:"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUploadImageOnEdition(
                        produtoEditar,
                        e.target.files[0],
                        'general'
                      );
                    }
                  }}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <label>
                <input
                  type='radio'
                  checked={produtoEditar.status === true}
                  onChange={() => setProdutoEditar({ ...produtoEditar, status: true })}
                /> Disponível
              </label>
              <label>
                <input
                  type='radio'
                  className="ml-4"
                  checked={produtoEditar.status === false}
                  onChange={() => setProdutoEditar({ ...produtoEditar, status: false })}
                /> Indisponível
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto Com Variações</label>
              <label>
                <input
                  type='radio'
                  className="mr-2"
                  checked={produtoEditar.hasVariations === true}
                  onChange={() => setProdutoEditar({ ...produtoEditar, hasVariations: true })}
                /> Sim
              </label>
              <label>
                <input
                  type='radio'
                  className="ml-4"
                  checked={produtoEditar.hasVariations === false}
                  onChange={() => setProdutoEditar({ ...produtoEditar, hasVariations: false })}
                /> Não
              </label>
            </div>
            
            {!produtoEditar.hasVariations && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setProdutoEditar({ ...produtoEditar, value: Number(e.target.value) })}
                />
              </div>
            )}
            
          </div>
          {produtoEditar.hasVariations && (
            <div>
              <label className="block text-2xl font-bold text-gray-900 border-t-2 pt-2 mb-1">Variações</label>
              <div className='inline-block my-3 mr-5'>
                <h3>Nome da Variação (plural)</h3>
                <input
                  type="text"
                  placeholder='EX: Sabores'
                  className="my-1 border border-gray-300 rounded-md px-2 py-1 mr-2"
                  value={produtoEditar.variationPluralName || ''}
                  onChange={(e) => setProdutoEditar({ ...produtoEditar, variationPluralName: e.target.value })}
                  />
              </div>

              <div className='inline-block my-3'>
                <h3>Nome da Variação(singular)</h3>
                <input
                  type="text"
                  placeholder='EX: Sabor'
                  className="my-1 border border-gray-300 rounded-md px-2 py-1 mr-2"
                  value={produtoEditar.variationSingularName || ''}
                  onChange={(e) => setProdutoEditar({ ...produtoEditar, variationSingularName: e.target.value })}
                  />
              </div>
              <ul>
                {produtoEditar.variations && produtoEditar.variations.map((variacao, index) => (
                  <li key={index} className='flex flex-wrap justify-between mb-4 border-b-2 pb-2'>
                    <div className='flex flex-col w-[100%] lg:w-[48%]'>
                      <h3>Nome</h3>
                      <input
                        type="text"
                        placeholder="Nome"
                        value={variacao.name || ''} 
                        className="border border-gray-300 rounded-md px-2 py-1 mr-2 mb-2"
                        onChange={(e) => {
                          const novasVariacoes = [...(produtoEditar.variations || [])];
                          novasVariacoes[index].name = e.target.value || ''; 
                          setProdutoEditar({ ...produtoEditar, variations: novasVariacoes });
                        }}
                      />
                      <h3>Preço</h3>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md px-2 py-1 mr-2 mb-2"
                        placeholder="Valor"
                        value={variacao.value || 1} // Garantir que seja um número
                        onChange={(e) => {
                          const novasVariacoes = [...(produtoEditar.variations || [])];
                          novasVariacoes[index].value = Number(e.target.value) || 0; // Garantir que seja um número
                          setProdutoEditar({ ...produtoEditar, variations: novasVariacoes });
                        }}
                        />

                    </div>
                    <div className='w-[100%] lg:w-[48%]'>
                      {(variacao.image && variacao.image != '') ? (
                        <>
                          <img
                            src={variacao.image}
                            alt={variacao.name}
                            className="w-auto max-w-[100%] h-24 object-cover rounded-md mb-2"
                          />
                          <button
                            className="p-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                            onClick={() => {
                              handleExcluirImagemVariação(produtoEditar, variacao.id);
                            }}
                            >
                            Excluir Imagem da Variação
                          </button>
                        </>
                      ) : (
                        <input 
                          type="file"
                          id={`variationImage-${index}`}
                          accept=".jpg,.jpeg,.png,.webp,.svg" 
                          className='border bg-gray-300 border-gray-300 rounded-md px-2 py-1 mr-2 mb-2'
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleUploadImageOnEdition(
                                produtoEditar,
                                e.target.files[0],
                                'variation',
                                variacao.id
                              );
                            }
                          }}
                        />
                      )}
                    </div>
                    <button
                      className="p-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                      onClick={() => (handleExcluirVariacao(produtoEditar, variacao.id))}
                      >
                      Excluir variação
                    </button>
                  </li>
                ))}
              </ul>
              <button 
                className="bg-amber-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700"
                onClick={() => {
                  const novasVariacoes = produtoEditar.variations ? [...produtoEditar.variations] : [];
                  const novoId = novasVariacoes.length > 0 ? novasVariacoes[novasVariacoes.length - 1].id + 1 : 1;
                  novasVariacoes.push({ ...defaultVariation, id: novoId });
                  setProdutoEditar({ ...produtoEditar, variations: novasVariacoes });
                }}
              >
                <FiPlus /> Adicionar Variação
              </button>

            </div>
          )}
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setModalEditarProduto(false)}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={handleEditarProduto}
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Campo de Busca */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={filtroBusca}
            onChange={(e) => handleBusca(e.target.value)}
          />
        </div>

        {/* Lista de Produtos */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Preço</th>
                <th className="p-4 text-left">Imagem</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.length > 0 &&
                produtosFiltrados!.map((produto) => (
                  <tr key={produto.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4">{produto.name}</td>
                    <td className="p-4">
                      {produto.value ? (
                        showInBrazilianValue(produto.value)
                      ) : (
                        <>
                          A partir de: &nbsp;
                          {getCheaperVariation(produto)}
                        </>
                      )}
                    </td>
                    <td className="p-4">
                      {produto.imageUrl != '' ? (
                        <img src={produto.imageUrl} alt={produto.name} className="w-16 h-16 object-cover rounded-md" />
                      ) : (
                        <span className="text-gray-500">Sem imagem</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${produto.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {produto.status ? 'Disponível' : 'Indisponível'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="text-amber-900 hover:text-amber-700" onClick={() => handleAbrirModalEdicao(produto)}>
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(produto)}
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
    </div>
  );
}