import Navbar from "@/components/navbar";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import QuizzCard from "@/components/quizz/quizz-card";


export default function TutorialList(){
    return(
        <>
            <Navbar/>
            <main className="max-w-[1200px] mx-auto px-2 pt-[90px]">
                <div className="space-y-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-primary">Formations</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl sm:text-3xl">Formations</h1>
                    <p className="text-sm">Une panoplie de questions basées sur des thèmes pour vous aider à prendre en main nos outils.</p>
                    <div className="grid grid-cols-1 gap-y-3 relative">
                        <div className="absolute w-0.5 h-full -left-[20px] top-0 bg-primary"></div>
                        <QuizzCard
                            image={"https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?auto=compress&cs=tinysrgb&w=600"}
                            questionsNumber={10}
                            description={"Vim est un éditeur de texte, c’est-à-dire un logiciel permettant la manipulation de fichiers texte. Il est directement inspiré de vi, dont il est le clone le plus populaire. Son nom signifie d’ailleurs Vi IMproved, que l’on peut traduire par « VI aMélioré »."}
                            title={"Comment coder un site web sans utiliser le HTML ?"}
                            quota={40}
                            status={"notStarted"}
                        />
                        <QuizzCard
                            image={"https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?auto=compress&cs=tinysrgb&w=600"}
                            questionsNumber={5}
                            description={"Vim est un éditeur de texte, c’est-à-dire un logiciel permettant la manipulation de fichiers texte. Il est directement inspiré de vi, dont il est le clone le plus populaire. Son nom signifie d’ailleurs Vi IMproved, que l’on peut traduire par « VI aMélioré »."}
                            title={"Comment coder un site web sans utiliser le HTML ?"}
                            quota={60}
                            status={"started"}
                        />
                        <QuizzCard
                            image={"https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600"}
                            questionsNumber={7}
                            description={"Vim est un éditeur de texte, c’est-à-dire un logiciel permettant la manipulation de fichiers texte. Il est directement inspiré de vi, dont il est le clone le plus populaire. Son nom signifie d’ailleurs Vi IMproved, que l’on peut traduire par « VI aMélioré »."}
                            title={"Comment coder un site web sans utiliser le HTML ?"}
                            quota={50}
                            status={"finished"}
                        />
                    </div>


                </div>
            </main>
        </>
    )
}