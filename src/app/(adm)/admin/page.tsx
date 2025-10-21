import Link from 'next/link';
import { FiPackage, FiTag, FiTruck, FiShoppingBag } from 'react-icons/fi';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-3 my-10">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card de Produtos */}
        <Link href="/admin/produtos">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Produtos</h2>
              <FiPackage className="text-2xl text-amber-900" />
            </div>
            <p className="text-gray-600">Gerenciar produtos e suas variações</p>
          </div>
        </Link>

        {/* Card de Categorias */}
        <Link href="/admin/categorias">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Categorias</h2>
              <FiTag className="text-2xl text-amber-900" />
            </div>
            <p className="text-gray-600">Gerenciar categorias de produtos</p>
          </div>
        </Link>

        {/* Card de Tipos de Entrega */}
        <Link href="/admin/entregas">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tipos de Entrega</h2>
              <FiTruck className="text-2xl text-amber-900" />
            </div>
            <p className="text-gray-600">Configurar opções de entrega</p>
          </div>
        </Link>

        {/* Card de Pedidos */}
        <Link href="/admin/pedidos">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pedidos</h2>
              <FiShoppingBag className="text-2xl text-amber-900" />
            </div>
            <p className="text-gray-600">Visualizar e gerenciar pedidos</p>
          </div>
        </Link>
      </div>
    </div>
  );
}