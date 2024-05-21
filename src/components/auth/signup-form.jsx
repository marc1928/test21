import React, { useRef, useState } from 'react';
import CardWrapper from './card-wrapper';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import Swal from 'sweetalert2';
import axiosClient from '@/axios-client';
import { useNavigate } from 'react-router-dom';

export default function SignUpForm() {

  const navigate = useNavigate();

  const inputs = useRef([]);

  const [validationerror , setValidationError] = useState("");

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [success,setSucces] = useState("");

  const formRef = useRef();

  const addInputs = el => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    event.preventDefault();
    const errors = {};

    if (inputs.current[0].value.trim() === '') {
      errors.user_lastname = 'votre nom est requis';
    }

    if (inputs.current[1].value.trim() === '') {
      errors.user_firstname = 'votre prenom est requis';
    }

    if (inputs.current[2].value.trim() === '') {
      errors.user_email = 'votre adresse email est requise';
    } else if (!isValidEmail(inputs.current[2].value)) {
      errors.user_email = 'votre adresse email est non valide';
    } else if (!inputs.current[2].value.endsWith('@bpce-it.fr')) {
      errors.user_email = 'votre adresse email doit se terminer par @bpce-it.fr';
    }  
    
    if (inputs.current[3].value.trim() === '') {
      errors.user_matricule = 'votre matricule est requis';
    }    

    if (inputs.current[4].value.trim() === '') {
      errors.user_password = 'votre mot de passe est requis';
    }
    else if (inputs.current[4].value.trim().length < 7) {
      errors.user_password = 'le mot de passe doit comporter au moins 7 caractères';
    }
    
    if (inputs.current[5].value.trim() === '') {
      errors.user_repeatpassword = 'repeter votre mot de passe';
    }
    else if (inputs.current[5].value.trim().length < 7) {
      errors.user_repeatpassword = 'le second mot de passe doit contenir au moins 7 caractères';
    }
    else if (inputs.current[4].value.trim() != inputs.current[5].value.trim()) {
      errors.user_repeatpassword = 'Les mots de passe doivent etre identiques';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(false);
      let user_state = "asset";
      const datauser = {lastname: inputs.current[0].value.trim(),firstname: inputs.current[1].value.trim(),email: inputs.current[2].value.trim(),matricule: inputs.current[3].value.trim(),password : inputs.current[4].value,img : null,state: user_state,role: "s_member"}
      await axiosClient.post('/signup',datauser).then(({data})  => {
        setSucces("Votre Compte a été créee avec succès");
        setTimeout(() => { setSucces('');}, 3000);
        Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Votre Compte a été créee avec succès.',showConfirmButton: true});
        formRef.current.reset();
        navigate('/signin'); 
      }).catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors.email) {
            errors.user_email = response.data.errors.email;
            Swal.fire({position: 'Center',icon: 'warning',title: 'Warning!',text: 'Ce compte existe déja!',showConfirmButton: true});
          }
          if (response.data.errors.matricule) {
            errors.user_matricule = response.data.errors.matricule;
          }  
          if (response.data.errors.password) {
            errors.user_password = response.data.errors.password;
          }                   
        }
        setValidationError(errors);
      });
    } else {
      setValidationError(errors);
    }
    setLoadingSubmitButton(false);
  }
  return (
    <>
        <CardWrapper
          headerLabel="Creer votre Compte Utilisateur"
          headerMessage=""
          backbuttonHref="/signin"
          backbuttonLabel="Vous avez déjà un compte ? Connectez vous."
        >
          <form onSubmit={handleSubmit} className='flex flex-col gap-3' ref={formRef}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='name'>Nom :</Label>
              <Input ref={addInputs} placeholder="Entrez votre nom"/>
              {validationerror.user_lastname && <span className="text-red-500">{validationerror.user_lastname}</span>}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='name'>Prenom :</Label>
              <Input ref={addInputs} placeholder="Entrez votre Prenom"/>
              {validationerror.user_firstname && <span className="text-red-500">{validationerror.user_firstname}</span>}
            </div>            
            <div className='flex flex-col gap-2'>
              <Label htmlFor='email'>Email :</Label>
              <Input ref={addInputs} placeholder="Entrez votre adresse email" type='email'/>
              {validationerror.user_email && <span className="text-red-500">{validationerror.user_email}</span>}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='Matricule'>Matricule :</Label>
              <Input ref={addInputs} placeholder="Entrez votre Matricule"/>
              {validationerror.user_matricule && <span className="text-red-500">{validationerror.user_matricule}</span>}
            </div>               
            <div className='flex flex-col gap-2'>
              <Label htmlFor='password'>Mot de passe :</Label>
              <Input ref={addInputs} type="password"/>
              {validationerror.user_password && <span className="text-red-500">{validationerror.user_password}</span>}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='password'>Repeter votre Mot de passe :</Label>
              <Input ref={addInputs} type="password"/>
              {validationerror.user_repeatpassword && <span className="text-red-500">{validationerror.user_repeatpassword}</span>}
            </div>            
            <Button color="failure" className="w-full" type='submit'>
              {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl mr-2"></i> : null} Créer un compte
            </Button>
          </form>
        </CardWrapper>
    </>
  )
}
