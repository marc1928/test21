import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {Trash2, SquarePen, Share} from "lucide-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReactQuillForm } from "@/components/dashboard/react-quill";
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";

export default function QuizzPage() {
    const [openNewQuestion, setOpenNewQuestion] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionReponse, setQuestionReponseValue] = useState('');

    const {quizzId} = useParams();
    const {quizzName} = useParams();

    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

    const handleEditorDescription = (html) => {
        setDescriptionValue(html);
    };

    const inputquestions = useRef([]);

    const formRef = useRef();

    const addInputs = el => {
      if (el && !inputquestions.current.includes(el)) {
        inputquestions.current.push(el)
      }
    }
    

    const [validationerror , setValidationError] = useState("");
    const [success,setSucces] = useState("");

    const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

    useEffect(() => {
        quizzId && getQuestionnaireById();
    }, [quizzId]);

    const getQuestionnaireById = async () => {
        setLoadingSkeletonButton(true);
        axiosClient.get(`/questionsby/${quizzId}`).then(({data}) => {
            let list = data.data;
            setQuestions(list);
            setLoadingSkeletonButton(false);
        }).catch(err => {
            const response = err.response;
            console.log(response);
            navigate('/dashboard/quizz'); 
        });   
    };

    const handleModalOpen = () => {
        inputquestions.current = [];
        setOpenNewQuestion(true);
    };        

    const handleModalClose = () => {
        inputquestions.current = [];
        setOpenNewQuestion(false);
        setValidationError("");
        setDescriptionValue("");
    };

    const handleSubmit = async (e) => {
        event.preventDefault();
        const errors = {};

        if (!descriptionValue || descriptionValue == '<p><br></p>') {
            errors.description = 'le descriptif es requis.';
        }        
    
        if (inputquestions.current[0].value.trim() === '') {
            errors.choice_one = 'le champ choix 1 est requis';
        }

        if (inputquestions.current[1].value.trim() === '') {
            errors.choice_two = 'le champ choix 2 est requis';
        }

        if (inputquestions.current[2].value.trim() === '') {
            errors.choice_three = 'le champ choix 3 est requis';
        }    
        
        if (inputquestions.current[3].value.trim() === '') {
            errors.choice_four = 'le champ choix 4 est requis';
        }      
        
        if (questionReponse === '') {
            errors.response = 'Choisissez une reponse';
        }
    
        if (Object.keys(errors).length === 0) {
            setLoadingSubmitButton(true);

            let reponse = "";
            if (questionReponse == "1") {
              reponse = inputquestions.current[0].value.trim();
            }else if (questionReponse == "2") {
              reponse = inputquestions.current[1].value.trim();
            }else if (questionReponse == "3") {
              reponse = inputquestions.current[2].value.trim();
            }else if (questionReponse == "4") {
              reponse = inputquestions.current[3].value.trim();
            }
            
            const dataquestion = {description : descriptionValue, choice_one: inputquestions.current[0].value.trim(), choice_two: inputquestions.current[1].value.trim(), choice_three: inputquestions.current[2].value.trim(), choice_four: inputquestions.current[3].value.trim(), response : reponse , questionnaire_id : parseInt(quizzId) , state: "asset"}
            await axiosClient.post('/questions', dataquestion).then(({data})  => {
              Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Question ajoutée avec succès.',showConfirmButton: true});              
              setSucces("Question ajoutée avec succès");
              setTimeout(() => { setSucces('');}, 3000);            
              formRef.current.reset();
              setDescriptionValue("");
              setLoadingSubmitButton(false);
              getQuestionnaireById();
            }).catch(err => {
              const response = err.response;
              if (response && response.status === 422) {
                if (response.data.errors.questionnaire_id) {
                  Swal.fire({position: 'Center',icon: 'error',title: 'Error',text: response.data.errors.questionnaire_id ,showConfirmButton: true});
                }                  
              }
            });

            setValidationError(errors);
        } else {
          setValidationError(errors);
        }
        setLoadingSubmitButton(false);
    }

    const handleDelete = async(id) => {
        Swal.fire({
          title: 'Suppression', text: 'Etes vous sur de vouloir supprimer cette question?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#61396d', cancelButtonColor: '#d33', confirmButtonText: 'supprimer', cancelButtonText: 'Cancel'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('_method', 'DELETE');
            axiosClient.post(`/questions/${id}`,formData).then( () => {
              Swal.fire({position: 'top-right',icon: 'success',title: 'Success!',text: 'Question supprimée avec succès',showConfirmButton: true});
              getQuestionnaireById();
            }).catch(err => {
              const response = err.response;
              if (response.data.message) {
                Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E',})
              }
            });
          }
        });
    };


    const ChangeStateQuestion  = async(id,question_state) => {
        Swal.fire({
          title: 'Choisir une operation', icon: 'question',showDenyButton: true,showCancelButton: true, confirmButtonColor: '#61396d',confirmButtonText: 'Activer',denyButtonText: `Desactiver`, cancelButtonText: 'Cancel'
        }).then(async (result) => {
          if (result.isConfirmed) {
            if(question_state !== "asset")
            {
              let state = "asset";
              const formData = new FormData();
              formData.append('_method', 'PUT');
              await axiosClient.post(`/setstatequestion/${id}/${state}`,formData).then(async ({data})  => {
                getQuestionnaireById();
                Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'Cette question a été activé avec succès',showConfirmButton: true})
              }).catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                  Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Une erreur s\'est produite lors de l\'exécution du programme',showConfirmButton: true,confirmButtonColor: '#61396d',})
                }
              });
            }
            else{
              Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Cette question est deja activée',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          }
          else if (result.isDenied) {
            if(question_state !== "idle")
            {
              let state = "idle";
              const formData = new FormData();
              formData.append('_method', 'PUT');
              await axiosClient.post(`/setstatequestion/${id}/${state}`,formData).then(async ({data})  => {
                getQuestionnaireById();
                Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'Cette question a été desactivé avec succès',showConfirmButton: true})
              }).catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                  Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Une erreur s\'est produite lors de l\'exécution du programme',showConfirmButton: true,confirmButtonColor: '#61396d',})
                }
              });
            }
            else{
              Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Cette question est deja deactivée',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          }
        });
      };

    return (
        <>
            <Breadcrumb className="my-3">
                <BreadcrumbList className="">
                    <BreadcrumbItem href="/dashboard">Tableau de bord</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem href="/dashboard/quizz">
                        Quizz
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary line-clamp-1">{quizzName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className="">
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle asChild className="text-lg font-semibold">
                        Listes des questions
                    </CardTitle>
                    <Button onClick={() => handleModalOpen("")}>Ajouter une question</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>La liste des questions de votre quizz</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Libellé</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Réponses</TableHead>
                                <TableHead colspan={2}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loadingskeletonbutton ? <i class="fa fa-refresh fa-spin text-3xl mr-2 text-center text-white"></i> :
                            <>
                                {questions && questions.map((question,index) => {
                                    let response = "";
                                    const descendingIndex = questions.length - index;
                                    if (question.question_choice_one == question.question_response ) {
                                        response = "A";
                                    }else if(question.question_choice_two == question.question_response){
                                        response = "B";
                                    }else if(question.question_choice_three == question.question_response){
                                        response = "C";
                                    }else if(question.question_choice_four == question.question_response){
                                        response = "D";
                                    }
                                    let classState = "";
                                    let contentState = "";
                                    if (question.question_state == "asset") {classState = "text-primary";contentState = "activée";} 
                                    else if (question.question_state == "idle") { classState = "text-red-400";contentState = "desactivée";}
                                    else{ classState = "text-orange-400";contentState = "en Attente";}                                    
                                    return (                               
                                        <TableRow>
                                            <TableCell className="font-medium">{descendingIndex}</TableCell>
                                            <TableCell className="font-medium" dangerouslySetInnerHTML={{ __html: question.question_description }}></TableCell>
                                            <TableCell className={`${classState}`}>{contentState}</TableCell>
                                            <TableCell className="text-primary">{response}</TableCell>
                                            <TableCell className="flex flex-row gap-3">
                                                <Link to={`/dashboard/quizz/${quizzName}/questions/${question.question_id}/edit`}>
                                                    <Button variant="success" title={"Modifier la question"} aria-label={"Modifier la question"}>
                                                        <SquarePen size={15}/>
                                                    </Button>
                                                </Link>
                                                <Button onClick={() => handleDelete(question.question_id)} variant="danger" title={"Supprimer la question"} aria-label={"Supprimer la question"}>
                                                    <Trash2 size={15}/>
                                                </Button>
                                                <Button onClick={() => ChangeStateQuestion(question.question_id,question.question_state)} variant="secondary" title={"Supprimer la question"} aria-label={"Supprimer la question"}>
                                                    <span>Act/Des</span>
                                                </Button>                                                
                                            </TableCell>
                                        </TableRow>
                                    );
                                })} 
                            </>                     
                          }                                        
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Dialog open={openNewQuestion} onOpenChange={setOpenNewQuestion}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Nouvelle question</DialogTitle>
                        <DialogDescription>
                            Vous etes sur le point de créer un nouveau quizz, veuillez renseigner les informations nécessaires.
                        </DialogDescription>
                    </DialogHeader>
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
                        {success ? <><div className="w-full bg-green-400 text-white p-1" >
                            { success }
                        </div><br /></> : null}
                        <div className="space-y-3">
                            <ReactQuillForm value={descriptionValue} theme="snow" onChange={handleEditorDescription}/>
                            {validationerror.description && <span className="text-red-500">{validationerror.description}</span>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="choice1">Choix 1 <sup className="text-primary">*</sup> : </Label>
                            <Input type="text" ref={addInputs} placeholder="Entrez la première réponse"/>
                            {validationerror.choice_one && <span className="text-red-500">{validationerror.choice_one}</span>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="choice2">Choix 2 <sup className="text-primary">*</sup> : </Label>
                            <Input type="text" ref={addInputs} placeholder="Entrez la seconde réponse"/>
                            {validationerror.choice_two && <span className="text-red-500">{validationerror.choice_two}</span>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="choice3">Choix 3 <sup className="text-primary">*</sup> : </Label>
                            <Input type="text" ref={addInputs} placeholder="Entrez la troisième réponse"/>
                            {validationerror.choice_three && <span className="text-red-500">{validationerror.choice_three}</span>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="choice4">Choix 4 <sup className="text-primary">*</sup> : </Label>
                            <Input type="text" ref={addInputs} placeholder="Entrez la dernière réponse"/>
                            {validationerror.choice_four && <span className="text-red-500">{validationerror.choice_four}</span>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="difficulty">Réponse <sup className="text-primary">*</sup>: </Label>
                            <Select value={questionReponse} onValueChange={setQuestionReponseValue}>
                                <SelectTrigger>
                                    <SelectValue value="" placeholder="Choisissez la réponse juste :"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">A</SelectItem>
                                    <SelectItem value="2">B</SelectItem>
                                    <SelectItem value="3">C</SelectItem>
                                    <SelectItem value="4">D</SelectItem>
                                </SelectContent>
                            </Select>
                            {validationerror.response && <span className="text-red-500">{validationerror.response}</span>}
                        </div>
                        <div className="my-4 flex gap-3 items-center">
                            <Button type="submit" className="w-full sm:w-fit">
                                {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl mr-2"></i> : null} Créer
                            </Button>
                                <Button onClick={() => handleModalClose("")} variant="secondary" type="button" className="w-full sm:w-fit">Annuler</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
