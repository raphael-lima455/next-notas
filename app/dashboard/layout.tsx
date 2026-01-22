import { DashboardNav } from "@/components/DashboardNav";
import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from '../lib/prisma'
import { stripe } from "../lib/stripe";
import { unstable_noStore as noStore } from "next/cache";




async function getData(
    {
        email,
        id,
        firstName,
        lastName,
        profileImage }:
        {
            email: string,
            id: string,
            firstName: string | undefined | null,
            lastName: string | undefined | null,
            profileImage: string | undefined | null,
        }
) {

    noStore()

    // Validate required fields before database operations
    if (!email || typeof email !== 'string' || email.trim() === '') {
        throw new Error('Email is required and must be a non-empty string')
    }
    if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('ID is required and must be a non-empty string')
    }

    const trimmedId = id.trim()
    const trimmedEmail = email.trim()
    const name = `${firstName ?? ""}${lastName ?? ""}`.trim() || undefined

    const user = await prisma.user.findUnique({
        where: {
            id: trimmedId
        },
        select: {
            id: true,
            stripeCustomerId: true
        }
    })


    if (!user) {
        try {
            await prisma.user.create({
                data: {
                    id: trimmedId,
                    email: trimmedEmail,
                    colorScheme: "theme-orange",
                    ...(name && { name })
                }
            })
        } catch (error: any) {
            // Check if it's a unique constraint violation (user might have been created between check and create)
            if (error?.code === 'P2002') {
                console.log('User already exists (race condition), continuing...')
                return
            }

            console.error('Error creating user - Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
            console.error('Error creating user - Error details:', {
                message: error?.message,
                code: error?.code,
                meta: error?.meta,
                name: error?.name,
                data: { id: trimmedId, email: trimmedEmail, name }
            })
            throw error
        }
    }

    if (!user?.stripeCustomerId) {
        const data = await stripe.customers.create({
            email: email,
        });


        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                stripeCustomerId: data.id
            }
        })
    }


}

export default async function DashboardLayout({ children }: { children: ReactNode }) {


    const { getUser } = getKindeServerSession()

    const user = await getUser()


    if (!user) {
        return redirect('/')
    }

    // Validate required fields - check for null, undefined, or empty strings
    if (!user.email || typeof user.email !== 'string' || user.email.trim() === '') {
        return redirect('/')
    }
    if (!user.id || typeof user.id !== 'string' || user.id.trim() === '') {
        return redirect('/')
    }

    await getData({
        email: user.email.trim(),
        id: user.id.trim(),
        firstName: user.given_name ?? null,
        lastName: user.family_name ?? null,
        profileImage: user.picture ?? null
    })



    return (
        <div className="flex flex-col space-y-6">
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="h-[90vh] border-r hidden w-50 flex-col md:flex">
                    <div className="mt-5">
                        <DashboardNav />
                    </div>
                </aside>


                <main className="mt-10">
                    {children}
                </main>

            </div>
        </div>

    )
}