import { Github, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {Link} from "react-router-dom";

export default function Footer(){
    return(
        <footer className="max-w-[1340px] mx-auto pt-5 pb-10 border-t border-gray-200 dark:border-neutral-600 z-40">
            {/* <section className="mx-2 md:mx-5 border-b border-gray-200 dark:border-neutral-600 pb-5">
                <div className="flex flex-col md:flex-row justify-between gap-5 flex-wrap">
                    <div className="flex flex-col">
                        <img height={500} width={500} className="w-[100px] h-[100px]"  alt="BPCE LOGO"/>
                        <h1 className="font-bold max-w-xs uppercase tracking-wide text-lg">BPCE LOGO</h1>
                    </div>
                    <div className="flex flex-col gap-3 border-b border-gray-100 dark:border-neutral-600 py-5 md:border-none">
                        <h1 className="text-gray-600 dark:text-neutral-200">Ressources</h1>
                        <div className="flex flex-col gap-3">
                            <Link to="/" className="text-sm hover:underline font-medium">Accueil</Link>
                            <Link to="/quizz" className="text-sm hover:underline font-medium">Questionnaires</Link>
                            <Link to="/about" className="text-sm hover:underline font-medium">A propos</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 py-5 border-b border-gray-100 dark:border-neutral-600 md:border-none">
                        <h1 className="text-gray-600 dark:text-neutral-200">Légal</h1>
                        <div className="flex flex-col gap-3">
                            <Link to="" className="text-sm hover:underline font-medium">Confidentialité</Link>
                            <Link to="" className="text-sm hover:underline font-medium">Condition d{"'"}utilisation</Link>
                            <Link to="" className="text-sm hover:underline font-medium">Code de conduite</Link>
                            <Link to="" className="text-sm hover:underline font-medium">FAQ</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 py-5">
                        <h1 className="text-gray-600 dark:text-neutral-200">Rejoignez nous.</h1>
                        <p className="text-sm text-gray-600 dark:text-neutral-600 max-w-md">Souscrivez à notre newsletter pour recevoir des nouveautés sur nos plateformes et de nouveaux questionnaires.</p>
                        <div className="flex flex-col gap-3">
                            <form>
                                <Input type="email" className="peer w-full sm:max-w-xl md:max-w-3xl" placeholder="Entrez votre adresse email" required/>
                                <p className="text-xs text-red-600 invisible peer-invalid:visible"></p>
                                <Button type="submit" className="mt-3 w-full sm:w-fit">Soumettre</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section> */}
            <div className="flex justify-center flex-col md:flex-row md:justify-between gap-2 pt-5 mx-5">
                <div>
                    <h1 className="text-xl">BPCE LOGO</h1>
                </div>
                <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-500">
                        Copyright © 2024. Tous droits réservés.
                    </p>
                </div>

            </div>
        </footer>
    )
}