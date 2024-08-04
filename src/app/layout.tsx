import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import Sidebar from "@/components/sidebar";
import { Panel } from "@/components/panel";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grocery List",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-svh`}>
        <Providers>
          <Sidebar />
          <Panel />
          <main className="h-full overflow-y-auto overflow-x-hidden">
            <Navbar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
