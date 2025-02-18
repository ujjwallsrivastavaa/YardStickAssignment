import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {  CreditCard, Home, Wallet } from "lucide-react";

const Header = () => {
  const menuItems = [
    { title: "Dashboard", icon: Home, href: "/" },
    { title: "Transactions", icon: CreditCard, href: "/transactions" },
    { title: "Budget", icon: Wallet, href: "/budget" },
   
  ];
  return (
    <div className="fixed top-0 left-0 w-full h-16 flex items-center pl-6 gap-4 bg-white z-50 shadow-md">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 rounded-md focus:outline-none md:hidden">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <VisuallyHidden>
            <SheetTitle>Menu</SheetTitle>
          </VisuallyHidden>
          <ul className="bg-white scroll-width">
            {menuItems.map((item) => (
              <li key={item.title} className="pb-5">
                <a
                  href={item.href}
                  className="flex items-center gap-2 p-2    rounded-md"
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
      <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
    </div>
  );
};

export default Header;
