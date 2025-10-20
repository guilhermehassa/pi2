export default function LoginForm() {

  return(
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-amber-900 mb-2">
        Login
      </h1>
      <p className="text-center text-gray-500 mb-4">
        Faça seu login para continuar
      </p>
      <form className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-md"
        >
          Entrar
        </button>
      </form>
      <div className="flex justify-between items-center mt-2 text-sm">
        <a href="#" className="text-amber-700 hover:underline">Esqueceu a senha?</a>
        <a href="#" className="text-amber-700 hover:underline">Criar conta</a>
      </div>
    </div>
  )

}