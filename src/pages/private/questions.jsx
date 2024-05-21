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
  

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {Trash2, SquarePen, Share} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";

export default function QuestionsPage() {
    const [openNewQuizz, setOpenNewQuizz] = useState(false);

    const [quizzs, setQuizzs] = useState([]);
    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

    const inputquizzs = useRef([]);

    const formRef = useRef();

    const addInputs = el => {
      if (el && !inputquizzs.current.includes(el)) {
        inputquizzs.current.push(el)
      }
    }

    const [validationerror , setValidationError] = useState("");
    const [success,setSucces] = useState("");

    const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

    const handleModalOpen = () => {
        inputquizzs.current = [];
        setOpenNewQuizz(true);
    };    

    const handleModalClose = () => {
        setOpenNewQuizz(false);
        inputquizzs.current = [];
        setValidationError("");
        setLoadingSubmitButton(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          setSelectedImage(file);
        } else {
          Swal.fire({position: 'Center',icon: 'warning',title: 'Oops!',text: 'Veuillez sélectionner un fichier image valide.',showConfirmButton: true});
        }
    };    

    useEffect(() => {
        getQuestionnaires();
    }, []);
    
    const getQuestionnaires = async () => {
        setLoadingSkeletonButton(true);
        axiosClient.get(`/questionnaires`).then( ({data})=> {
            setQuizzs(data.data);
            setLoadingSkeletonButton(false);
        }).catch(err => {
            setLoadingSkeletonButton(false);
        });
    };

    const handleSubmit = async (e) => {
        event.preventDefault();
        const errors = {};
    
        if (inputquizzs.current[0].value.trim() === '') {
          errors.title = 'votre titre est requis';
        }
    
        if (inputquizzs.current[1].value.trim() === '') {
          errors.description = 'votre description est requise';
        }

        if (inputquizzs.current[2].value.trim() === '') {
            errors.note = 'note est requise';
        }  
        
        if (!selectedImage) {
            errors.img = 'cette image est requise';
        }        
    
        if (Object.keys(errors).length === 0) {
            setLoadingSubmitButton(true);
            const formData = new FormData();
            formData.append('name', inputquizzs.current[0].value.trim());
            formData.append('description', inputquizzs.current[1].value.trim());            
            formData.append('note', inputquizzs.current[2].value.trim());  
            formData.append('state', "asset");  
            formData.append('img', selectedImage);                    
            await axiosClient.post(`/questionnaires`,formData,{headers: {'Content-Type': 'multipart/form-data',},}).then(({data})  => {                
                setSucces("Questionnaire ajouté avec succès");
                setTimeout(() => { setSucces('');}, 3000);
                setLoadingSubmitButton(false);
                Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Questionnaire ajouté avec succès.',showConfirmButton: true});
                formRef.current.reset();                
                getQuestionnaires();
            })
            setValidationError(errors);
        } else {
          setValidationError(errors);
        }
        setLoadingSubmitButton(false);
    }


    const ChangeStateQuestionnaire  = async(id,questionnaire_state) => {
        Swal.fire({
          title: 'Choisir une operation', icon: 'question',showDenyButton: true,showCancelButton: true, confirmButtonColor: '#61396d',confirmButtonText: 'Activer',denyButtonText: `Desactiver`, cancelButtonText: 'Cancel'
        }).then(async (result) => {
          if (result.isConfirmed) {
            if(questionnaire_state !== "asset")
            {
              let state = "asset";
              const formData = new FormData();
              formData.append('_method', 'PUT');
              await axiosClient.post(`/setstatequestionnaire/${id}/${state}`,formData).then(async ({data})  => {
                getQuestionnaires();
                Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'Ce questionnaire a été activé avec succès',showConfirmButton: true})
              }).catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                  Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Une erreur s\'est produite lors de l\'exécution du programme',showConfirmButton: true,confirmButtonColor: '#61396d',})
                }
              });
            }
            else{
              Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Ce questionnaire est deja activé',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          }
          else if (result.isDenied) {
            if(questionnaire_state !== "idle")
            {
              let state = "idle";
              const formData = new FormData();
              formData.append('_method', 'PUT');
              await axiosClient.post(`/setstatequestionnaire/${id}/${state}`,formData).then(async ({data})  => {
                getQuestionnaires();
                Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'Ce questionnaire a été desactivé avec succès',showConfirmButton: true})
              }).catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                  Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Une erreur s\'est produite lors de l\'exécution du programme',showConfirmButton: true,confirmButtonColor: '#61396d',})
                }
              });
            }
            else{
              Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Ce questionnaire est deja deactivé',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          }
        });
    };

    const handleDelete = async(id) => {
        Swal.fire({
          title: 'Suppression', text: 'Etes vous sur de vouloir supprimer ce questionnaire?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#61396d', cancelButtonColor: '#d33', confirmButtonText: 'supprimer', cancelButtonText: 'Cancel'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('_method', 'DELETE');
            axiosClient.post(`/questionnaires/${id}`,formData).then( () => {
              Swal.fire({position: 'top-right',icon: 'success',title: 'Success!',text: 'Questionnaire supprimé avec succès',showConfirmButton: true});
              getQuestionnaires()
            }).catch(err => {
              const response = err.response;
              if (response.data.message) {
                Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E',})
              }
            });
          }
        });
    };

    return (
        <>
            <Breadcrumb className="my-3">
                <BreadcrumbList>
                    <BreadcrumbItem href="/dashboard">Tableau de bord</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-primary">Quizz</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className="">
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle asChild className="text-lg font-semibold">
                        Listes des quizz
                    </CardTitle>
                    <Button onClick={() => handleModalOpen("")} >Ajouter un quizz</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>La liste des quizz que vous avez créé</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Titre</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Nombre de questions</TableHead>
                                <TableHead>Note requise</TableHead>
                                <TableHead colspan={2}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loadingskeletonbutton ? <p className="text-left"> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-white"></i> </p> :
                            <>
                                {quizzs && quizzs.map((quizz,index) => {
                                    let questionDescription = quizz.questionnaire_description;
                                    if (questionDescription.length > 65) {
                                        questionDescription = questionDescription.substr(0,60)+"..";
                                    }
                                    let classState = "";
                                    let contentState = "";
                                    if (quizz.questionnaire_state === "asset") {classState = "text-primary";contentState = "activée";} 
                                    else if (quizz.questionnaire_state === "idle") { classState = "text-red-400";contentState = "desactivée";}
                                    else{ classState = "text-orange-400";contentState = "en Attente";}
                                    return (                            
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                <Link target="_blank" to={quizz.questionnaire_img}>
                                                    <img src={quizz.questionnaire_img} style={{ height:"50px", width:"50px", objectFit:"cover", borderRadius:"10px" }}/>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="font-medium hover:underline">
                                                <Link to={`/dashboard/quizz/${quizz.questionnaire_id}/${quizz.questionnaire_name}`}>{quizz.questionnaire_name}</Link>
                                            </TableCell>
                                            <TableCell className="max-w-xs" title={quizz.questionnaire_description}>
                                                <p className="line-clamp-1">{questionDescription}</p>
                                            </TableCell>
                                            <TableCell className={`${classState}`}>{contentState}</TableCell>
                                            <TableCell>{quizz.questions.length}</TableCell>
                                            <TableCell>{quizz.questionnaire_note}Pts</TableCell>
                                            <TableCell className="flex flex-row gap-3">
                                                <Button variant="secondary" title={"Partager le quizz"} aria-label={"Partager le quizz"}>
                                                    <Share size={15}/>
                                                </Button>
                                                <Link to={`/dashboard/quizz/${quizz.questionnaire_id}/edit`}>
                                                    <Button variant="success" title={"Modifier le quizz"} aria-label={"Modifier le quizz"}>
                                                        <SquarePen size={15} />
                                                    </Button>
                                                </Link>
                                                {quizz.questions.length >= 1 ?
                                                    <Button onClick={() => ChangeStateQuestionnaire(quizz.questionnaire_id,quizz.questionnaire_state)} variant="danger" title={"Changez l'etat du quizz"} aria-label={"Changez l'etat du quizz"}>
                                                        <Trash2 size={15} />
                                                    </Button> : 
                                                    <Button onClick={() => handleDelete(quizz.questionnaire_id)} variant="danger" title={"Supprimer le quizz"} aria-label={"Supprimer le quizz"}>
                                                        <Trash2 size={15} />
                                                    </Button>                                                
                                                }
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
            <Dialog open={openNewQuizz}  onOpenChange={setOpenNewQuizz}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Nouveau quizz</DialogTitle>
                        <DialogDescription>
                            Vous etes sur le point de créer un nouveau quizz, veuillez renseigner les informations nécessaires.
                        </DialogDescription>
                    </DialogHeader>
                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
                        {success ? <><div className="w-full bg-green-500 text-white p-1" >
                            { success }
                        </div><br /></> : null}                        
                        <div className="space-y-3">
                            <Label htmlFor="title">Titre du quizz : </Label>
                            <Input type="text" ref={addInputs} placeholder="Donnez un titre à votre quizz"/>
                            {validationerror.title && <span className="text-red-500">{validationerror.title}</span>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="description">Description : </Label>
                            <Textarea ref={addInputs} placeholder="Décrivez votre quizz en quelques mots"/>
                            {validationerror.description && <span className="text-red-500">{validationerror.description}</span>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="difficulty">Note requise : </Label>
                            <Input type="number" ref={addInputs} placeholder="Donnez une note requise pour valider ce quizz"/>
                            {validationerror.note && <span className="text-red-500">{validationerror.note}</span>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="difficulty">Image : </Label>
                            <Input type="file" accept="image/*" onChange={handleImageUpload}/>
                            {validationerror.img && <span className="text-red-500">{validationerror.img}</span>}
                        </div>                        
                        <div className="my-4 flex gap-3 items-center">
                            <Button type="submit" className="w-full sm:w-fit">
                                {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl mr-2"></i> : null} Créer le quizz
                            </Button>
                            <DialogClose  asChild>
                                <Button onClick={() => handleModalClose("")} variant="secondary" type="button" className="w-full sm:w-fit">Annuler</Button>
                            </DialogClose>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </>
    );
}
