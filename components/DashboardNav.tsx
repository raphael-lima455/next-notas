'use client'

import { cn } from "@/lib/utils";
import { CreditCard, Home, Settings } from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "../lib/nav-items"

export function DashboardNav() {

    const pathname = usePathname()

    return (
        <nav className="grid items-start gap-2 px-4">
            {navItems.map((item, index) => {
                const Icon = item.icon; 
                return ( 
                    <Link key={index} href={item.href}> 
                        <span className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href ? 'bg-accent' : 'bg-transparent'
                        )}>
                            <Icon className="mr-2 h-4 w-4 text-primary" /> 
                            <span>{item.name}</span>
                        </span>
                    </Link>
                )
            })}
        </nav>
    )
}