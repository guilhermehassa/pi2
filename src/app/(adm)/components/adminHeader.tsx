"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiLogOut } from 'react-icons/fi';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      router.push('/home');
    }
  };

  return (
    <header className="bg-amber-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/home"
              className="flex items-center gap-2 hover:text-amber-200 transition-colors"
            >
              <FiHome size={20} />
              <span>Home</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-amber-200 transition-colors"
            >
              <FiLogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}