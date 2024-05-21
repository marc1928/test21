import axiosClient from '@/axios-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/context/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Link, useNavigate, useParams } from 'react-router-dom';
//import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, PolarSeries, ColumnSeries, Category,Tooltip } from '@syncfusion/ej2-react-charts';


const calculateAverages = (data) => {
  return data.map(result => {
    const totalScore = (result.result_correct * 5) + (result.result_wrong * 5);
    const average = (result.result_score / totalScore) * 100;
    let questionnaireName = result.questionnaire.questionnaire_name;
    questionnaireName = questionnaireName.substr(0, 10);
    return {
      name: questionnaireName,
      average: average.toFixed(2)
    };
  });
};

const calculateAveragesByQuizz = (data) => {
  const questionnaireScores = {};

  data.forEach(result => {
    const totalScore = (result.result_correct * 5) + (result.result_wrong * 5);
    const average = (result.result_score / totalScore) * 100;
    let questionnaireName = result.questionnaire.questionnaire_name;
    questionnaireName = questionnaireName.substr(0, 10);

    if (!questionnaireScores[questionnaireName]) {
      questionnaireScores[questionnaireName] = {
        totalAverage: 0,
        count: 0
      };
    }

    questionnaireScores[questionnaireName].totalAverage += average;
    questionnaireScores[questionnaireName].count += 1;
  });

  return Object.keys(questionnaireScores).map(name => ({
    name,
    average: (questionnaireScores[name].totalAverage / questionnaireScores[name].count).toFixed(2)
  }));
};

export default function DashboardPage() {

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

  const { currentUser, token } = useContext(AuthContext);

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [loadingInput, setLoadingInput] = useState(false);

  const {userId} = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    getResults();
  }, []);
  
  const getResults = async () => {
    setLoadingSkeletonButton(true);
    if (currentUser.role == "s_member") {
      axiosClient.get(`/results/users/${currentUser.id}`).then( ({data})=> {
        setResults(data.data);
        setLoadingSkeletonButton(false);
      }).catch(err => {
        setLoadingSkeletonButton(false);
        navigate('/'); 
      });      
    } else {
      axiosClient.get(`/results`).then( ({data})=> {
        setResults(data.data);
        setLoadingSkeletonButton(false);
      });        
    }
  };

  useEffect(() => {
    const getAverages = async () => {
      let calculatedAverages = [];
      if (currentUser.role == "s_member") {
        calculatedAverages = calculateAverages(results);
      }else{
        calculatedAverages = calculateAveragesByQuizz(results);
      }

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

  console.log(chartData);

  return (
    <>
      {currentUser.role == "s_member" || results.length > 0 ?
      <main className="max-w-full">
        <div className='quizz-card' style={{ width:"100%", margin:"auto", padding:"20px",border : "2px solid #eeeeee" }}>
          <ReactApexChart options={chartData.options} series={chartData.series} type="radar" height={450} />
        </div>
      </main>: <main className="max-w-full">
        <div className='quizz-card' style={{ width:"100%", margin:"auto", padding:"20px",border : "2px solid #eeeeee" }}>
          <ReactApexChart options={chartData.options} series={chartData.series} type="radar" height={450} />
        </div>
      </main> }

      {currentUser.role == "s_member" && results.length > 0 ?
      <main className="max-w-[1200px] mt-5">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-y-3 relative">
            {loadingskeletonbutton ? <p className="text-center"><i class="fa fa-refresh fa-spin text-3xl mr-2 text-grey"></i> </p>:
              <>
                  {results && results.map((quizz,index) => {
                      const descendingIndex = results.length - index;
                      let questionnnaireDescription = quizz.questionnaire.questionnaire_description;
                      if (questionnnaireDescription.length > 85) {
                          questionnnaireDescription = questionnnaireDescription.substr(0,80)+"..";
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
            { currentUser.role == "s_member" && results.length === 0 ? 
                <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                  <div class="flex">
                    <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                    <div>
                      <p class="font-bold">Quizz Statistiques</p>
                      <p class="text-sm">vous n'avez encore effectué de quizz.</p>
                    </div>
                  </div>
                </div>
            :null }     
          </div>
        </div>
      </main> : null }      
    </>
  )
}
