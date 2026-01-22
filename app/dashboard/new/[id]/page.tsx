import { SubmitButton } from "@/components/Submitbuttons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";


async function getData({ userId, noteId }: { userId: string, noteId: string }) {
    noStore()

    const data = await prisma.note.findUnique({
        where: {
            id: noteId,
            userId: userId
        },
        select: {
            title: true,
            description: true
        }
    })

    return data;
}

export default async function DynamicRoute({ params }: { params: Promise<{ id: string }> }) {

    const { getUser } = getKindeServerSession()
    const user = await getUser()

    const { id } = await params;

    const data = await getData({ userId: user?.id as string, noteId: id })

    async function postData(formData: FormData) {
        'use server'

        if (!user) {
            throw new Error("Usuário não autenticado.");

        }

        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const noteId = formData.get('noteId') as string

        await prisma.note.update({
            where: {
                id: noteId,
                userId: user.id
            },
            data: {
                description: description,
                title: title,
            }
        })


        revalidatePath('/dashboard')

        redirect('/dashboard')

    }


    return (
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle >Editar Nota</CardTitle>
                    <CardDescription>Aqui você pode editar suas notas.</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-y-5 mt-4">

                    {/* Campo hidden com o ID */}
                    <input type="hidden" name="noteId" value={id} />

                    <div className="gap-y-2 flex flex-col">
                        <Label>Título</Label>
                        <Input
                            required
                            type="text"
                            name="title"
                            placeholder="Título da nota"
                            defaultValue={data?.title}
                        />
                    </div>

                    <div className="gap-y-2 flex flex-col">
                        <Label>Descrição</Label>
                        <Textarea
                            required
                            name="description"
                            placeholder="Descreva a sua nota"
                            defaultValue={data?.description}
                        />
                    </div>
                </CardContent>

                <CardFooter className="mt-4 flex justify-between">

                    <Button asChild variant={"secondary"}>
                        <Link href={'/dashboard'}>Cancelar</Link>
                    </Button>

                    <SubmitButton />

                </CardFooter>


            </form>
        </Card>
    )
}