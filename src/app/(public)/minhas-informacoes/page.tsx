'use client';

import { useState, useEffect } from 'react';
import { db } from '@/services/firebaseConnection';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { UserProps, AddressProps } from '@/utils/types/users';
import { formatPhone, formatCEP, fetchAddressByCEP } from '@/utils/functions/masks';

export default function MinhasInformacoes() {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<AddressProps & {name: string, phone: string}>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

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

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'usuarios', user.id);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data() as UserProps;
          setUserData(data);
          setFormData({
            name: data.name || '',
            phone: data.phone || '',
            ...(data.address || {
              cep: '',
              street: '',
              number: '',
              complement: '',
              neighborhood: '',
              city: '',
              state: ''
            })
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar máscaras conforme o campo
    if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    const requiredFields = ['name', 'phone', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
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

      const userRef = doc(db, 'usuarios', user.id);
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: {
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state
        }
      };

      await updateDoc(userRef, updateData);
      alert('Informações atualizadas com sucesso!');
      setEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
      alert('Erro ao atualizar informações. Tente novamente.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Minhas Informações</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone*</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CEP*</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Endereço*</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número*</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Complemento</label>
            <input
              type="text"
              name="complement"
              value={formData.complement}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bairro*</label>
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cidade*</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado*</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          {!editMode ? (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Editar Informações
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Salvar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}