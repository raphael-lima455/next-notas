import { prisma } from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession, stripe } from "@/app/lib/stripe";
import { redirect } from "next/navigation";
import { StripePortal, StripeSubscriptionCreationButton } from "@/components/Submitbuttons";
import { unstable_noStore as noStore } from "next/cache";



const featuresItems = [
    {
        name: "Benefício 1"
    },
    {
        name: "Benefício 2"
    },
    {
        name: "Benefício 3"
    },
    {
        name: "Benefício 4"
    },
    {
        name: "Benefício 5"
    },
]


async function getData(userId: string) {

    noStore()

    const data = await prisma.subscription.findUnique({
        where: {
            userId: userId
        },
        select: {
            status: true,
            user: {
                select: {
                    stripeCustomerId: true
                }
            }
        }
    })

    return data;
}

export default async function BillingsPage() {

    const { getUser } = getKindeServerSession()

    const user = await getUser()

    const data = await getData(user?.id as string)


    async function createSubscription() {
        "use server";


        const dbUser = await prisma.user.findUnique({
            where: {
                id: user?.id,
            },
            select: {
                stripeCustomerId: true
            }
        })


        if (!dbUser?.stripeCustomerId) {
            throw new Error("stripeCustomerId não foi localizado.");
        }

        const subscriptionUrl = await getStripeSession({
            customerId: dbUser.stripeCustomerId,
            domainUrl: 'http://localhost:3000',
            priceId: process.env.STRIPE_PRICE_ID as string
        })

        return redirect(subscriptionUrl)

    }


    async function createCustomerPortal() {
        'use server'

        const session = await stripe.billingPortal.sessions.create({
            customer: data?.user.stripeCustomerId as string,
            return_url: 'http://localhost:3000/dashboard'
        })

        return redirect(session.url)
    }

    if (data?.status === "active") {
        return (
            <div className="grid items-start gap-8">
                <div className="flex items-center justify-between px-2">
                    <div className="grid gap-1">
                        <h1 className="text-3xl md:text-4xl ">Plano</h1>
                        <p className="text-lg text-muted-foreground">Detalhes da sua isncrição</p>
                    </div>
                </div>


                <Card className="w-full lg:w-2/3">
                    <CardHeader>
                        <CardTitle>Editar Plano</CardTitle>
                        <CardDescription>Clique no botão abaixo para ver detalhes dos seus recibos e métodos de pagamento.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form action={createCustomerPortal}>
                            <StripePortal />
                        </form>
                    </CardContent>
                </Card>


            </div>

        )
    }


    return (
        <div className="max-w-md mx-auto space-y-4">
            <Card className="flex flex-col">
                <CardContent className="py-8">
                    <div>
                        <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary">
                            Mensal
                        </h3>
                    </div>

                    <div className="mt-4 items-baseline text-6xl font-extrabold">
                        R$30<span className="ml-1 text-2xl text-muted-foreground">/mês</span>
                    </div>

                    <p className="mt-4 text-lg text-muted-foreground">Escreva quantas notas quiser por apenas R$ 30 por mês.</p>
                </CardContent>

                <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6 ">
                    <ul className="space-y-4">
                        {featuresItems.map((item, index) => {
                            return (
                                <li key={index} className="flex items-center">
                                    <div className="shrink-0">
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />

                                    </div>
                                    <p className="ml-3 text-base">{item.name}</p>
                                </li>
                            )
                        })}
                    </ul>


                    <form className="w-full" action={createSubscription}>
                        <StripeSubscriptionCreationButton />
                    </form>

                </div>
            </Card>






        </div>
    )
}