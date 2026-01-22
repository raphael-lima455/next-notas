import { prisma } from "@/app/lib/prisma";
import { SubmitButton } from "@/components/Submitbuttons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";



async function getData(userId: string) {

    noStore()

    const data = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            name: true,
            email: true,
            colorScheme: true
        }
    })


    return data
}


export default async function SettingPage() {



    const { getUser } = getKindeServerSession()

    const user = await getUser()

    const data = await getData(user?.id as string)


    async function postData(formData: FormData) {
        'use server'


        const name = formData.get('name') as string;
        const colorScheme = formData.get('color') as string;

        await prisma.user.update({
            where: {
                id: user?.id
            },
            data: {
                name: name ?? undefined,
                colorScheme: colorScheme ?? undefined,
            }
        })
        revalidatePath('/', "layout")
    }



    return (
        <div className="grid items-start gap-8">

            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl">Configurações</h1>
                    <p className="text-lg text-muted-foreground">Configurações do seu perfil.</p>
                </div>
            </div>

            <Card>
                <form action={postData}>
                    <CardHeader>
                        <h1 className="text-2xl font-medium">
                            Dados Gerais
                        </h1>
                        <CardDescription>Adicione suas informações. Não esqueça de salvar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <span className="block mt-4">Nome</span>
                                <Input
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder="Digite o seu nome"
                                    defaultValue={data?.name ?? undefined}
                                />
                            </div>

                            <div className="space-y-1">
                                <span className="block mt-4">Email</span>
                                <Input
                                    name="email"
                                    type="email"
                                    id="email"
                                    placeholder={data?.email ?? undefined}
                                    disabled
                                />

                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="block mt-4">Cor do Tema</span>
                            <Select name="color" defaultValue={data?.colorScheme}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Escolha uma cor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Cor</SelectLabel>
                                        <SelectItem value="theme-violet">Violeta</SelectItem>
                                        <SelectItem value="theme-orange">Laranja</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>

                    <CardFooter className="mt-6">
                        <SubmitButton />
                    </CardFooter>


                </form>
            </Card>
        </div>
    )
}