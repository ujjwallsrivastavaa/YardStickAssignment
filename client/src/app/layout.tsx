
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Personal Finance Tracker",
  description: "Track your expenses, set budgets, and gain financial insights",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Header/> 
        <SidebarProvider>
        <div className="flex overflow-hidden w-full">
          <div className="hidden md:block">
          <AppSidebar />

          </div>
            <main className="flex-1 overflow-y-auto p-8 mt-12 w-full bg-[#e2e8f0]">{children}</main>
          </div>
        </SidebarProvider>

      </body>
    </html>
  );
}
