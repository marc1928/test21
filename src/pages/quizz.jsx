import {Link, useNavigate, useParams} from "react-router-dom";
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
import { useContext, useEffect, useState } from "react";
import axiosClient from "@/axios-client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";

const resultIniState = {score : 0, correctAnswers : 0, wrongAnswers : 0};

export default function Quizz() {
    const { quizzId } = useParams();

    const navigate = useNavigate();

    const { currentUser, token } = useContext(AuthContext);

    const [dataquestionnaire, setDataQuestionnaire] = useState({});
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answerIdx, setAnswerIdx] = useState(null);

    const [answer, setAnswer] = useState(null);

    const [result, setResult] = useState(resultIniState);

    const [showResult, setShowResult] = useState(false);

    function convertQuestion(question) {
        return {
            question: question.question_description,
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
        axiosClient.get(`/questionnaires/${quizzId}`).then(({ data }) => {
            let list = data.data;
            setDataQuestionnaire(list);
            setQuestions(list.questions);
        })
        .catch(err => {
            console.log("error list");
        });
    };

    const convertedQuestions = questions.length > 0 ? questions.map(convertQuestion) : [];
    
    const { question, choices, correctAnswer } = convertedQuestions[currentQuestion] || {};

    const onClickNext = async() => {

        setAnswerIdx(null);

        setResult(prev => ({
            ...prev,
            score: answer ? prev.score + 5 : prev.score,
            correctAnswers: answer ? prev.correctAnswers + 1 : prev.correctAnswers,
            wrongAnswers: answer ? prev.wrongAnswers : prev.wrongAnswers + 1,
        }));

        if (currentQuestion !== convertedQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setCurrentQuestion(0);
            const data = {user_id : currentUser.id, questionnaire_id: quizzId, score: result.score, correct: result.correctAnswers, wrong: result.wrongAnswers}
            await axiosClient.post('/results/store', data).then(({data})  => {
                setShowResult(true);
            }).catch(err => {
              const response = err.response;
              if (response && response.status === 422) {
                if (response.data.errors.questionnaire_id) {
                  Swal.fire({position: 'Center',icon: 'error',title: 'Error',text: response.data.errors.questionnaire_id ,showConfirmButton: true});
                }                  
              }
            });            
        }
    };

    const onAnswerClick = (answer, index) => {
        setAnswerIdx(index);
        if (answer == correctAnswer) {
            setAnswer(true);
        }else{
            setAnswer(false);
        }
    }
    
    console.log(result);


    return(
        <>
            <Navbar/>
            {convertedQuestions.length > 0 ?
            <main className="max-w-full mx-auto px-2 pt-[90px] pb-10 pl-10">
                {!showResult ? (
                <>
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
                <div className="space-y-3 my-3">
                    <div className="space-y-4 border-b border-foreground/20 pb-8">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-medium"> <span className="text-primary text-4xl">{currentQuestion+1}</span><span className="text-2xl">/{convertedQuestions.length}</span>  <br /> <span dangerouslySetInnerHTML={{ __html: question }}></span></h1>
                        </div>
                        <div>
                            <RadioGroup className="space-y-3">
                            {choices.map((response, index) => (
                                <div key={response} onClick={() => onAnswerClick(response,index)} className="flex items-center space-x-2">
                                    <RadioGroupItem id={response} value={response}/>
                                    <Label htmlFor={response}>{response}</Label>
                                </div>
                            ))}
                            </RadioGroup>
                        </div>
                    </div>                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button type={"button"} onClick={onClickNext}  disabled={answerIdx == null ? 'disabled' : ''}>
                            {currentQuestion === convertedQuestions.length - 1 ? "Terminer" : "Suivant"}
                        </Button>
                    </div>
                </div>
                </> ) : <main className="max-w-[1200px] mx-auto px-2 pt-[90px] pb-10">
                <p>
                    <h1 className="text-3xl sm:text-4xl">{"Resultats"} </h1>
                </p>
                <p className="mt-5">
                    <h1 className="text-2xl sm:text-3xl">{"Total Questions : "} <span style={{ color:"#61396d" }}> {convertedQuestions.length} </span> </h1>
                </p>
                <p>
                    <h1 className="text-2xl sm:text-3xl">{"Total Scores : "} <span className="text-green-500"> {result.score} </span> </h1>
                </p>   
                <p>
                    <h1 className="text-2xl sm:text-3xl">{"Reponses Correctes : "} <span className="text-green-500"> {result.correctAnswers} </span> </h1>
                </p>  
                <p>
                    <h1 className="text-2xl sm:text-3xl">{"Mauvaises Reponses : "} <span className="text-red-500"> {result.wrongAnswers} </span> </h1>
                </p> 
                <div className="space-y-3 my-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button color={"failure"} onClick={()=>{ navigate(`/quizz`) }}>
                            Cliquez ici
                        </Button>
                    </div>     
                </div>                                                            
            </main> }
            </main> : null }
            {/* <Footer/> */}
        </>
    )
}