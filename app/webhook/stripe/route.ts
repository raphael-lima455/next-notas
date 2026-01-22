import { prisma } from "@/app/lib/prisma"
import { stripe } from "@/app/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

export async function POST(req: Request) {

    const body = await req.text()

    const signature = (await headers()).get('Stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        )

    } catch (error: unknown) {
        return new Response('webhook error', { status: 404 })
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
        )
        const subscription = subscriptionResponse as Stripe.Subscription

        const customerId = String(session.customer)

        const user = await prisma.user.findUnique({
            where: {
                stripeCustomerId: customerId
            }
        })

        if (!user) {
            throw new Error("User not found...");

        }



        await prisma.subscription.create({
            data: {
                stripeSubscriptionId: subscription.id,
                userId: user.id,
                currentPeriodStart: (subscription as any).current_period_start,
                currentPeriodEnd: (subscription as any).current_period_end,
                status: subscription.status,
                planId: subscription.items.data[0].plan.id,
                interval: String(subscription.items.data[0].plan.interval)
            }
        })
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )


        await prisma.subscription.update({
            where: {
                stripeSubscriptionId: subscription.id
            }, data: {
                planId: subscription.items.data[0].price.id,
                currentPeriodStart: (subscription as any).current_period_start,
                currentPeriodEnd: (subscription as any).current_period_end,
                status: subscription.status
            }
        })

    }


    return new Response(null, {status: 200})


}
