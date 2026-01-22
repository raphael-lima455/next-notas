'use client'

import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"
import { Loader2, Trash } from "lucide-react"


export function SubmitButton() {

    const { pending } = useFormStatus()

    return (
        <>
            {pending ? (
                <Button disabled className="w-fit">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Carregando...
                </Button>
            ) : (
                <Button className="w-fit" type="submit">
                    Salvar
                </Button>
            )}
        </>
    )
}

export function StripeSubscriptionCreationButton() {
    const { pending } = useFormStatus()

    return (
        <>

            {pending ? (
                <Button disabled className="w-fit">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Carregando...
                </Button>

            ) : (
                <Button className="w-fit" type="submit">
                    Comprar Agora
                </Button>

            )}

        </>
    )
}

export function StripePortal() {
    const { pending } = useFormStatus()

    return (
        <>

            {pending ? (
                <Button disabled className="w-fit">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Carregando...
                </Button>

            ) : (
                <Button className="w-fit" type="submit">
                    Ver Detalhes...
                </Button>

            )}

        </>
    )
}


export function TrashDelete() {
    const { pending } = useFormStatus()

    return (
        <>
            {pending ? (
                <div>

                    <Button
                        size={'icon'}
                        variant={'destructive'}
                        disabled
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </Button>

                </div>
            ) : (
                <div>

                    <Button
                        size={'icon'}
                        variant={'destructive'}
                        type="submit"
                    >
                        <Trash className="w-4 h-4" />
                    </Button>

                </div>
            )}
        </>
    )

}
