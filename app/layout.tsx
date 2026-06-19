import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RecySmart | Admin Dashboard",
  description: "Panel de administración central para la plataforma RecySmart: Gestión de basureros IoT, gamificación y usuarios en Lima Metropolitana.",
  applicationName: "RecySmart Admin",
  authors: [{ name: "RecySmart Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
