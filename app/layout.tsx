import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa Fanano — Prenotazioni",
  description: "Calendario e prenotazioni della casa in montagna a Fanano",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#386138",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-bosco-50 text-bosco-900 antialiased">{children}</body>
    </html>
  );
}
