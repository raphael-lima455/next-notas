import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "./ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UseNav } from "./UseNav";






export async function Navbar() {


    const { isAuthenticated, getUser } = getKindeServerSession()

    const user = await getUser()



    return (
        <nav className="border-b bg-background h-[10vh] flex items-center px-4">
            <div className="w-full flex items-center justify-between">
                <Link href={'/'}>
                    <h1 className="font-bold text-3xl ">Next<span className="text-primary">Notas</span></h1>
                </Link>

                <div className="flex items-center gap-x-5">

                    <ModeToggle />

                    {await isAuthenticated() ? (
                        <div>
                            <UseNav
                            email={user?.email as string}
                            image={user?.picture as string}
                            name={user?.given_name as string}
                            />

                        </div>
                    ) : (
                        <div className="flex items-center gap-x-5">
                            <RegisterLink>
                                <Button size="lg" variant="secondary">Cadastrar</Button>
                            </RegisterLink>
                            <LoginLink>
                                <Button size="lg" >Entrar</Button>
                            </LoginLink>
                        </div>
                    )}

                </div>

            </div>
        </nav>
    )
}