import {useParams} from "react-router-dom";
import Navbar from "@/components/navbar.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Search} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import QuizzCard from "@/components/quizz/quizz-card.jsx";
import Footer from "@/components/footer.jsx";
import QuestionItem from "@/components/quizz/question-item.jsx";
import { useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const iniState = {score : 0, correctAnswers : 0, wrongAnswers : 0};

export default function Quizz(){
    const {quizzId} = useParams();

    const [dataquestionnaire, setDataQuestionnaire] = useState({});

    const [questions, setQuestions] = useState([]);

    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answerIdx, setAnswerIdx] = useState(null);

    const [answer, setAnswer] = useState(null);

    const [result, setResult] = useState(iniState);

    const [showResult, setShowResult] = useState(false);

    const onAnswerClick = (answer, index) => {
        setAnswerIdx(index);
        if (answer == correctAnswer) {
            setAnswer(true);
        }else{
            setAnswer(false);
        }
    }

    function convertQuestion(question) {
        return {
            question: question.question_description.replace(/<\/?[^>]+(>|$)/g, ""),
            choices: [
                question.question_choice_one,
                question.question_choice_two,
                question.question_choice_three,
                question.question_choice_four
            ],
            correctAnswer: question.question_response
        };
    }

    useEffect(() => {
        getQuestionnaireById();
    }, []);

    const getQuestionnaireById = async () => {
        setLoadingSkeletonButton(true);
        axiosClient.get(`/questionnaires/${quizzId}`).then( ({data})=> {
            let list = data.data;
            setDataQuestionnaire(list);
            setQuestions(list.questions);
            setLoadingSkeletonButton(false);
        }).catch(err => {
            console.log("error list");
        });
    };

    const convertedQuestions = questions.map(convertQuestion);

    const {question, choices, correctAnswer} = convertedQuestions[currentQuestion];

    const onClickNext = () => {
        setAnswerIdx(null);
        setResult((prev) => {
            answer ? {
                ...prev,
                score : prev.score + 5,
                correctAnswer : prev.correctAnswers + 1
            }:  {
                ...prev,
                wrongAnswers : prev.wrongAnswers + 1
            }
        } );

        if (currentQuestion !== convertedQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1 );
        }else{
            setCurrentQuestion(0);
            setShowResult(true);
        }
    }

    return(
        <>
            <Navbar/>
            <main className="max-w-[1200px] mx-auto px-2 pt-[90px] pb-10">
                <div className="space-y-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/quizz">Questionnaires</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-primary max-w-[400px] line-clamp-1">
                                    {dataquestionnaire.questionnaire_name ? dataquestionnaire.questionnaire_name : null}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl sm:text-3xl">{dataquestionnaire.questionnaire_name ? dataquestionnaire.questionnaire_name : null}</h1>
                    <p className="text-sm max-w-3xl">
                        {dataquestionnaire.questionnaire_description ? dataquestionnaire.questionnaire_description : null}
                    </p>
                </div>
                <form className="space-y-3 my-3">
                    <div className="space-y-4 border-b border-foreground/20 pb-8">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-medium">{currentQuestion+1} - {question}</h1>
                        </div>
                        <div>
                            <RadioGroup className="space-y-3">
                            {choices.map((response, index) => (
                                <div key={index} onClick={() => onAnswerClick(response,index)} className="flex items-center space-x-2">
                                    <RadioGroupItem id={response} value={response}/>
                                    <Label htmlFor={response}>{response}</Label>
                                </div>
                            ))}
                            </RadioGroup>
                        </div>
                    </div>                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button type={"submit"} disabled={answerIdx === null}>
                            {currentQuestion === convertedQuestions.length - 1 ? "Terminer" : "Suivant"}
                        </Button>
                    </div>
                </form>
            </main>
            <Footer/>
        </>
    )
}