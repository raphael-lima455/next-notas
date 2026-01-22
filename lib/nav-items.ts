import { CreditCard, Home, Settings } from "lucide-react"

export const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
    { name: 'Plano', href: '/dashboard/billings', icon: CreditCard },
]