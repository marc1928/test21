import Navbar from "@/components/navbar.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import QuizzCard from "@/components/quizz/quizz-card";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Search} from "lucide-react";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";


export default function QuizzList(){
    const [quizzs, setQuizzs] = useState([]);
    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    const [filteredQuizzs, setFilteredQuizzs] = useState([]);

    useEffect(() => {
        const filtered = quizzs.filter((quizz) =>{
          const searchString = `${quizz.questionnaire_name.toLowerCase()}`;
          return searchString.includes(searchTerm.toLowerCase());
        });
        setFilteredQuizzs(filtered);
    }, [quizzs, searchTerm]);

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
    };

    useEffect(() => {
        getQuizzs();
    }, []);
    
    const getQuizzs = async () => {
        setLoadingSkeletonButton(true);
        axiosClient.get(`/questionnairesactive`).then( ({data})=> {
            setQuizzs(data.data);
            setLoadingSkeletonButton(false);
        }).catch(err => {
            setLoadingSkeletonButton(false);
        });
    };
    return(
        <>
            <Navbar/>
            <main className="max-w-full mx-auto p-10">
                <div className="space-y-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/quizz">Accueil</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-primary">Questionnaires</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl sm:text-3xl">Questionnaires</h1>
                    <p className="text-sm">Une panoplie de questions pour vous aider à prendre en main nos outils.</p>
                    <div className="max-w-lg relative flex gap-2">
                        <Input type={"search"} title={"Rechercher"} value={searchTerm} onChange={handleSearch} className="pl-10"/>
                        <Search  className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 ml-3 text-foreground/80"/>
                    </div><br />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 relative">
                        {loadingskeletonbutton ? <p className="text-left"> <i class="fa fa-refresh fa-spin text-3xl mr-2"></i> </p> :
                            <>
                                {filteredQuizzs && filteredQuizzs.map((quizz,index) => {
                                    const descendingIndex = quizzs.length - index;
                                    let questionDescription = quizz.questionnaire_description;
                                    if (questionDescription.length > 65) {
                                        questionDescription = questionDescription.substr(0,60)+"..";
                                    }
                                    return (
                                        <QuizzCard
                                            id={quizz.questionnaire_id}
                                            image={quizz.questionnaire_img}
                                            questionsNumber={quizz.questions.length}
                                            description={questionDescription}
                                            title={quizz.questionnaire_name}
                                            quota={quizz.questionnaire_note}
                                            status={"notStarted"}
                                        />
                                    );
                                })} 
                            </>                     
                          }
                    </div>
                </div>
            </main>
            {/* <Footer/> */}
        </>
    )
}