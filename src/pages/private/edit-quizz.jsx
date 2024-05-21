import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '@/axios-client';

export default function EditQuizzPage() {
    const {quizzId} = useParams();

    const navigate = useNavigate();

    const inputquestions = useRef([]);

    const formRef = useRef();

    const addInputs = el => {
      if (el && !inputquestions.current.includes(el)) {
        inputquestions.current.push(el)
      }
    }

    const [validationerror , setValidationError] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);

    const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

    const [loadinginput, setLoadingInput] = useState(false);

    const [dataquizz,setDataQuizz] = useState({});

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          setSelectedImage(file);
        } else {
          Swal.fire({position: 'Center',icon: 'warning',title: 'Oops!',text: 'Veuillez sélectionner un fichier image valide.',showConfirmButton: true});
        }
    }; 

    useEffect(() => {
        quizzId && getQuestionnaireById();
    }, [quizzId]);

    const getQuestionnaireById = async () => {
        setLoadingInput(true);
        axiosClient.get(`/questionnaires/${quizzId}`).then(({data}) => {
            let list = data.data;
            setDataQuizz(list);
            setLoadingInput(false);
        }).catch(err => {
            const response = err.response;
            console.log(response);
            navigate('/dashboard/quizz'); 
        });   
    };

    const handleSubmit = async (e) => {
        event.preventDefault();
        const errors = {};
    
        if (inputquestions.current[0].value.trim() === '') {
          errors.title = 'votre titre est requis';
        }
    
        if (inputquestions.current[1].value.trim() === '') {
          errors.description = 'votre description est requise';
        }

        if (inputquestions.current[2].value.trim() === '') {
            errors.note = 'note est requise';
        }          
    
        if (Object.keys(errors).length === 0) {
            setLoadingSubmitButton(true);
            if (selectedImage) {
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('name', inputquestions.current[0].value.trim());
                formData.append('description', inputquestions.current[1].value.trim());            
                formData.append('note', inputquestions.current[2].value.trim());                  
                formData.append('img', selectedImage);    
                await axiosClient.post(`/questionnaires/${quizzId}`,formData,{headers: {'Content-Type': 'multipart/form-data',},}).then(({data})  => {                
                    setLoadingSubmitButton(false);
                    formRef.current.reset();
                    navigate('/dashboard/quizz'); 
                    Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Questionnaire modifié avec succès.',showConfirmButton: true});
                })                             
            }else{
                const dataquestionnaire = {_method : 'PUT', name : inputquestions.current[0].value.trim(), description : inputquestions.current[1].value.trim(), note : inputquestions.current[2].value.trim()};
                await axiosClient.post(`/questionnaires/${quizzId}`,dataquestionnaire).then(({data})  => {                    
                    navigate('/dashboard/quizz'); 
                    Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Questionnaire modifié avec succès.',showConfirmButton: true});
                }); 
                setLoadingSubmitButton(false);                
            }    
            setValidationError(errors);
        } else {
          setValidationError(errors);
        }
        setLoadingSubmitButton(false);
    }

    return (
        <main className='max-w-3xl'>
            <form className="space-y-3" onSubmit={handleSubmit}  ref={formRef} >
                <h1 className="text-xl font-bold">Modifier un quizz</h1>
                <p className='text-sm font-medium'>
                    Vous etes sur le point de modifier un quizz, veuillez bien renseigner les informations nécessaires.
                </p>                      
                <div className="space-y-3">
                    <Label htmlFor="title">Titre du quizz : </Label>
                    <Input type="text" ref={addInputs} disabled={loadinginput ? 'disabled' : ''} defaultValue={dataquizz.questionnaire_name}  placeholder="Donnez un titre à votre quizz"/>
                    {validationerror.title && <span className="text-red-500">{validationerror.title}</span>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="description">Description : </Label>
                    <Textarea ref={addInputs} disabled={loadinginput ? 'disabled' : ''} defaultValue={dataquizz.questionnaire_description} placeholder="Décrivez votre quizz en quelques mots"/>
                    {validationerror.description && <span className="text-red-500">{validationerror.description}</span>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="difficulty">Note requise : </Label>
                    <Input type="number" disabled={loadinginput ? 'disabled' : ''} ref={addInputs} defaultValue={dataquizz.questionnaire_note} placeholder="Donnez une note requise pour valider ce quizz"/>
                    {validationerror.note && <span className="text-red-500">{validationerror.note}</span>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="difficulty">Modifier l'Image : </Label>
                    <Input type="file" accept="image/*" onChange={handleImageUpload}/>
                </div>                        
                <div className="my-4 flex gap-3 items-center">
                    <Button type="submit" className="w-full sm:w-fit">
                        {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl mr-2"></i> : null} Modifier le quizz
                    </Button>
                </div>
            </form>
        </main>
    )
}
