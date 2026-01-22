import Link from "next/link";
import { navItems } from "../lib/nav-items"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DoorClosed } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";


export function UseNav({name, email, image}: {name: string, email: string, image: string}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src={image} alt="@shadcn" />
                        <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56"
                align="end"
                forceMount>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                </DropdownMenuLabel>


                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {navItems.map((item, index) => {
                        const Icon = item.icon; // Componente precisa começar com maiúscula
                        return (
                            <DropdownMenuItem asChild key={index}>
                                <Link href={item.href} className="w-full flex justify-between items-center">
                                    {item.name}
                                    <span>
                                        <Icon className="w-4 h-4" /> {/* Icon com maiúscula */}
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full flex justify-between items-center" asChild>
                    <LogoutLink>
                        Logout{" "} <span className="w-4 h-4"><DoorClosed /></span>
                    </LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}