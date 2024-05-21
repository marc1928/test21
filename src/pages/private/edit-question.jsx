import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReactQuillForm } from "@/components/dashboard/react-quill";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axiosClient from '@/axios-client';
import Swal from 'sweetalert2';

export default function EditQuestionPage() {
    const {quizzName} = useParams();
    const {questionId} = useParams();
    const [descriptionValue, setDescriptionValue] = useState('');

    const [loadinginput, setLoadingInput] = useState(false);

    const [dataquestion,setDataQuestion] = useState({});

    const [validationerror , setValidationError] = useState("");

    const navigate = useNavigate();

    const inputquestions = useRef([]);

    const formRef = useRef();

    const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

    const addInputs = el => {
      if (el && !inputquestions.current.includes(el)) {
        inputquestions.current.push(el)
      }
    }

    const [dataquestionresponse,setDataQuestionResponse] = useState(0);

    const handleEditorDescription = (html) => {
        setDescriptionValue(html);
    };

    useEffect(() => {
        questionId && getQuestionById();
    }, [questionId]);

    const getQuestionById = async () => {
        setLoadingInput(true);
        axiosClient.get(`/questions/${questionId}`).then(({data}) => {
            let list = data.data;
            setDataQuestion(list);
            setDescriptionValue(list.question_description);
            if (list.question_choice_one == list.question_response) {
                setDataQuestionResponse(1);
              }else if (list.question_choice_two == list.question_response) {
                setDataQuestionResponse(2);
              }else if (list.question_choice_three == list.question_response) {
                setDataQuestionResponse(3);
              }else if (list.question_choice_four == list.question_response) {
                setDataQuestionResponse(4);
              }             
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
        
        if (dataquestionresponse === 0) {
            errors.response = 'Choisissez une reponse';
        }
    
        if (Object.keys(errors).length === 0) {
            setLoadingSubmitButton(true);
            let reponse = "";
            if (dataquestionresponse == "1") {
              reponse = inputquestions.current[0].value.trim();
            }else if (dataquestionresponse == "2") {
              reponse = inputquestions.current[1].value.trim();
            }else if (dataquestionresponse == "3") {
              reponse = inputquestions.current[2].value.trim();
            }else if (dataquestionresponse == "4") {
              reponse = inputquestions.current[3].value.trim();
            }
            
            const dataquestion = {description : descriptionValue, choice_one: inputquestions.current[0].value.trim(), choice_two: inputquestions.current[1].value.trim(), choice_three: inputquestions.current[2].value.trim(), choice_four: inputquestions.current[3].value.trim(), response : reponse}
            await axiosClient.put(`/questions/${questionId}`, dataquestion).then(({data})  => { 
                setLoadingSubmitButton(false);
                formRef.current.reset();
                window.history.back();
                Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Question modifiée avec succès.',showConfirmButton: true});
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

    return (
        <>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 pb-10">
                <h1 className="text-xl font-bold">Modifier un question</h1>
                <p className='text-sm font-medium'>
                    Vous etes sur le point de modifier un question.
                </p>
                <div className="space-y-3">
                    <ReactQuillForm value={descriptionValue} theme="snow" onChange={handleEditorDescription}/>
                    {validationerror.description && <span className="text-red-500">{validationerror.description}</span>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="choice1">Choix 1 <sup className="text-primary">*</sup> : </Label>
                    <Input type="text" defaultValue={dataquestion.question_choice_one} disabled={loadinginput ? 'disabled' : ''} ref={addInputs} placeholder="Entrez la première réponse"/>
                    {validationerror.choice_one && <span className="text-red-500">{validationerror.choice_one}</span>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="choice2">Choix 2 <sup className="text-primary">*</sup> : </Label>
                    <Input type="text" defaultValue={dataquestion.question_choice_two} disabled={loadinginput ? 'disabled' : ''} ref={addInputs} placeholder="Entrez la seconde réponse"/>
                    {validationerror.choice_two && <span className="text-red-500">{validationerror.choice_two}</span>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="choice3">Choix 3 <sup className="text-primary">*</sup> : </Label>
                    <Input type="text" defaultValue={dataquestion.question_choice_three} disabled={loadinginput ? 'disabled' : ''} ref={addInputs} placeholder="Entrez la troisième réponse"/>
                    {validationerror.choice_three && <span className="text-red-500">{validationerror.choice_three}</span>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="choice4">Choix 4 <sup className="text-primary">*</sup> : </Label>
                    <Input type="text" defaultValue={dataquestion.question_choice_four} disabled={loadinginput ? 'disabled' : ''} ref={addInputs} placeholder="Entrez la dernière réponse"/>
                    {validationerror.choice_four && <span className="text-red-500">{validationerror.choice_four}</span>}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="difficulty">Réponse <sup className="text-primary">*</sup>: </Label>
                    <Select value={dataquestionresponse} onValueChange={setDataQuestionResponse} defaultValue={dataquestionresponse}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisissez la réponse juste :" />
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
                        {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl mr-2"></i> : null} Modifier la question
                    </Button>
                    <Button variant="secondary" type="submit" className="w-full sm:w-fit">Annuler</Button>
                </div>
            </form>
        </>
    )
}
