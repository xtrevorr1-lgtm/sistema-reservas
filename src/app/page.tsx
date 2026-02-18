export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-lg text-center bg-white p-10 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold mb-4">
          Sistema de Reservas
        </h1>

        <p className="text-gray-600 mb-6">
          Gestiona tus reservas de forma rápida y sencilla.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </a>

          <a
            href="/register"
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </main>
  );
}
