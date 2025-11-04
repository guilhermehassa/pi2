"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser } from '@/utils/data/users';

export default function LoginForm() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authenticateUser({ user, password });
      
      if (!userData) {
        setError('Usuário ou senha inválidos');
        return;
      }

      console.log('Login bem sucedido:', userData);

      // Salvar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Dados salvos no localStorage');
      
      // Redirecionar com base no papel do usuário
      console.log('Redirecionando usuário com role:', userData.role);
      if (userData.role === 'admin') {
        console.log('Redirecionando para /admin');
        window.location.href = '/admin';
      } else {
        console.log('Redirecionando para /home');
        window.location.href = '/home';
      }
    } catch (error) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-amber-900 mb-2">
        Login
      </h1>
      <p className="text-center text-gray-500 mb-4">
        Faça seu login para continuar
      </p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-md disabled:bg-gray-400"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="flex justify-between items-center mt-2 text-sm">
        <a href="#" className="text-amber-700 hover:underline">Esqueceu a senha?</a>
        <a href="#" className="text-amber-700 hover:underline">Criar conta</a>
      </div>
    </div>
  )
}