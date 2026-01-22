import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessdRoute() {
    return (
        <div className="w-full min-h-[80vh] flex items-center justify-center">
            <Card className="w-[350px]">
                <div className="w-full flex justify-center">
                    <XIcon className="w-12 h-12 rounded-full bg-red-500/30 text-red-500 p-2" />
                </div>
                <div className="text-center w-full">
                    <h3 className="text-lg leading-6 font-medium">
                        Erro no pagamento.
                    </h3>
                    <div className="mt-2">
                        <p className="text-muted-foreground">Sem problemas, você será não cobrado. Tente novamente.</p>
                    </div>
                </div>

                <div className="w-full p-4">
                    <Button className="w-full" asChild>
                        <Link href={'/dashboard/billings'}>Volte para a Home.</Link>
                    </Button>
                </div>


            </Card>

        </div>
    )
}