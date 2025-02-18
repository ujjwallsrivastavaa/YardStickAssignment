"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, CreditCard, Home, PieChart, Wallet } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";

export const menuItems = [
  { title: "Dashboard", icon: Home, href: "/" },
  { title: "Transactions", icon: CreditCard, href: "/transactions" },
  { title: "Budget", icon: Wallet, href: "/budget" },
  
]

export default function  AppSidebar () {
  const pathname = usePathname()
  const isActive = (href: string) =>
    pathname === href 

  return (
    <Sidebar className="mt-20 px-1 hidden lg:flex bg-white">
      <SidebarContent className="bg-white scroll-width flex gap-2">
        {
          menuItems.map((item, index) => (
            <SidebarMenu key={item.title} >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  isActive(item.href!) &&
                    "bg-zinc-800 hover:bg-zinc-700 text-white hover:text-white"
                )}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          ))}
        
           

      </SidebarContent>
    </Sidebar>
  )
}

