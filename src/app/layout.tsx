import "./globals.css";
export const metadata = {
  title: "Sistema de Reservas",
  description: "Aplicación de reservas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
