import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "../lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, File, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { TrashDelete } from "@/components/Submitbuttons";




async function getData(userId: string) {

    noStore()

    const data = prisma.note.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return data;
}

export default async function DashboardPage() {


    const { getUser } = getKindeServerSession()

    const user = await getUser()

    const data = await getData(user?.id as string)


    async function deleteNote(formData: FormData) {
        'use server'

        const noteId = formData.get('noteId') as string

        await prisma.note.delete({
            where: {
                id: noteId
            }
        })

        revalidatePath('/dashboard')

    }


    return (
        <div className="grid items-start gap-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl">Suas notas</h1>
                    <p className="text-lg text-muted-foreground">Aqui você pode criat novas notas.</p>
                </div>

                <Button asChild>
                    <Link href={'/dashboard/new'}>Criar Nota</Link>
                </Button>


            </div>


            {data.length < 1 ? (
                // Pagina quando não existe notas
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <File className="w-10 h-10 text-primary" />
                    </div>

                    <h2 className="mt-6 text-xl font-semibold">
                        Você não tem notas criadas
                    </h2>
                    <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-xm-sm mx-auto">Crie novas notas para vê-las aqui.</p>

                    <Button asChild>
                        <Link href={'/dashboard/new'}>Criar Nota</Link>
                    </Button>
                </div>
            ) : (
                // Pagina quando existe notas

                <div className="flex flex-col gap-y-4">
                    {data.map((item, index) => {
                        return (
                            <Card className="p-4" key={index}>
                                <div className="flex flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h2 className="font-semibold text-sl text-primary">{item.title}</h2>
                                        <p className="text-sm">{new Intl.DateTimeFormat('pt-BR', {
                                            dateStyle: 'full'
                                        }).format(new Date(item.createdAt))}</p>
                                    </div>

                                    <div className="flex gap-x-2">
                                        <Link href={`/dashboard/new/${item.id}`}>
                                            <Button size={'icon'} variant={'outline'}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <form action={deleteNote}>
                                            <input type="hidden" name='noteId' value={item.id} />
                                            <TrashDelete />
                                        </form>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>

            )}

        </div>
    )
}