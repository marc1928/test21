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
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ReactApexChart from "react-apexcharts";

const calculateAverages = (data) => {
    return data.map(result => {
      const totalScore = (result.result_correct * 5) + (result.result_wrong * 5);
      const average = (result.result_score / totalScore) * 100;
      let questionnaireName = result.questionnaire.questionnaire_name;
      questionnaireName = questionnaireName.substr(0, 2);
      return {
        name: questionnaireName,
        average: average.toFixed(2)
      };
    });
};

export default function StatisticUser(){

    const [chartData, setChartData] = useState({
        series: [{
          name: 'Series 1',
          data: [],
        }],
        options: {
          chart: {
            height: 50,
            width: 600,
            type: 'radar',
            toolbar: {
              show: true,
            }
          },
          title: {
            text: 'Statistiques des Quiz',
            align: 'center',
            style: {
              fontSize: '24px',
              color: '#333'
            }
          },
          yaxis: {
            tickAmount: 5, // Définit le nombre de graduations sur l'axe Y
            labels: {
              formatter: (val) => `${val}%`, // Ajoute un pourcentage aux labels de l'axe Y
              style: {
                colors: ['#546E7A'],
                fontSize: '12px'
              }
            }
          },
          xaxis: {
            categories: [],
            labels: {
              style: {
                colors: ['#546E7A'],
                fontSize: '12px'
              }
            }
          },
          fill: {
            opacity: 0.5, // Ajoute une opacité à la zone remplie
            colors: ['#45FFB5'] // Couleur de remplissage
          },
          stroke: {
            show: true,
            width: 6,
            colors: ['#022EBF'] // Couleur de la ligne
          },
          markers: {
            size: 4,
            colors: ['#022EBF'],
            strokeColors: '#fff',
            strokeWidth: 2
          },
          legend: {
            position: 'bottom'
          },
          plotOptions: {
            radar: {
              polygons: {
                strokeColor: '#e9e9e9',
                fill: {
                  colors: ['#f8f8f8', '#fff']
                }
              }
            }
          },
          tooltip: {
            y: {
              formatter: (val) => `${val}%`
            }
          }
        }
      });

    const [results, setResults] = useState([]);

    const [loadingInput, setLoadingInput] = useState(false);

    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

    const {userId} = useParams();

    const navigate = useNavigate();

    const [currentuser, setCurrentUser] = useState({});

    useEffect(() => {
        getResults() && getUser();
    }, []);
    
    const getResults = async () => {
        setLoadingSkeletonButton(true);
        axiosClient.get(`/results/users/${userId}`).then( ({data})=> {
            setResults(data.data);
            setLoadingSkeletonButton(false);
        }).catch(err => {
            setLoadingSkeletonButton(false);
        });
    };
      
    const getUser = async () => {
        axiosClient.get(`/users/${userId}`).then( ({data})=> {
            let list = data.data;
            setCurrentUser(list);
        }).catch(err => {
            navigate('/'); 
        });
    };  

    useEffect(() => {
        const getAverages = async () => {
          const calculatedAverages = calculateAverages(results);
    
          const seriesData = calculatedAverages.map(result => parseFloat(result.average));
          const categoriesData = calculatedAverages.map(result => result.name);
          setLoadingInput(false);
    
          setChartData({
            series: [{
              name: 'Series 1',
              data: seriesData
            }],
            options: {
              ...chartData.options,
              xaxis: {
                categories: categoriesData
              }
            }
          });
    
          setLoadingInput(true);
        };
    
        getAverages();
      }, [results]);

    return(
        <>
            <Navbar/>          
            <main className="max-w-[1200px] mx-auto px-2 pt-[90px] pb-10">
                <div className="space-y-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/learners">Accueil</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-primary">Resultats</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl sm:text-3xl">Resultats des Quizz de : {currentuser.user_lastname ? currentuser.user_lastname+" "+currentuser.user_firstname : ""} </h1>
                    <div className="grid grid-cols-1 gap-y-3 relative">
                        {loadingInput && results.length > 0 ?
                        <div className='quizz-card' style={{ width:"100%", margin:"auto", padding:"20px",border : "2px solid #eeeeee" }}>
                            <ReactApexChart options={chartData.options} series={chartData.series} type="radar" height={450} />
                        </div> : <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                            <div class="flex">
                                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                                <div>
                                <p class="text-sm">vous n'avez pas encore effectué de quizz.</p>
                                </div>
                            </div>
                        </div> }
                    </div>
                    <div className="grid grid-cols-1 gap-y-3 relative">
                        {loadingskeletonbutton ? <p className="text-left"> <i class="fa fa-refresh fa-spin text-3xl mr-2"></i> </p>:
                            <>
                                {results && results.map((quizz,index) => {
                                    const descendingIndex = results.length - index;
                                    let questionnnaireDescription = quizz.questionnaire.questionnaire_description;
                                    if (questionnnaireDescription.length > 65) {
                                        questionnnaireDescription = questionnnaireDescription.substr(0,60)+"..";
                                    }
                                    let questionnaireImg = quizz.questionnaire.questionnaire_img;
                                    let questionnnaireTitle = quizz.questionnaire.questionnaire_name;
                                    let questionnnaireNote = quizz.questionnaire.questionnaire_note;
                                    let questionsNumber = quizz.result_correct + quizz.result_wrong;
                                    let Score = quizz.result_score;
                                    return (
                                            <Card className="quizz-card relative">
                                                <div className="flex flex-col sm:flex-row gap-4 p-4 font-medium">
                                                    <Link className="">
                                                        <img src={questionnaireImg} alt={"Quizz image"} style={{ height:"220px", width:"200px", objectFit:"cover" }} className="w-full rounded-md hover:opacity-90 sm:w-full" />
                                                        <p className='mt-10'>
                                                            <strong>Effectué le : </strong> {quizz.result_created_at}
                                                        </p>
                                                    </Link>
                                                    <div className="space-y-4 text-sm ">
                                                        <div className="space-y-3 max-w-xl md:max-w-2xl">
                                                            <Link to={`/quizz/${'1'}`} className="hover:text-primary font-bold">
                                                                <h1 className="text-2xl">{questionnnaireTitle}</h1>
                                                            </Link>                 
                                                            <p className="text-sm font-medium line-clamp-2">{questionnnaireDescription}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-primary font-bold">Terminé</p>
                                                        </div>
                                                        <p className="font-medium">Nombre de questions : <span className="text-primary font-bold">{questionsNumber}</span></p>
                                                        <p className="font-medium">Mauvaises reponses : <span className="text-red-500 font-bold">{quizz.result_wrong}</span></p>
                                                        <p className="font-medium">Bonnes reponses : <span className="text-green-500 font-bold">{quizz.result_correct}</span></p>
                                                        <p>⭐ Note obtenue : <span className="text-green-500">{Score} points</span></p>
                                                        <div className="flex">
                                                            {Score >= questionnnaireNote ?
                                                            <Button variant="default" className="bg-green-500">{"Validé"}</Button> 
                                                            : <Button variant="default" className="bg-red-500">{"Non Validé"}</Button> }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
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