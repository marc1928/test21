import React, { useContext, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import CardWrapper from './card-wrapper';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import Cookies from "js-cookie";
import axiosClient from '@/axios-client';

export default function SignInForm() {
  const navigate = useNavigate();
  const {dispatch} = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validationerror , setValidationError] = useState("");
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
  const [errorauthentification,setErrorAuthentification] = useState("");
  
  const [rememberMe, setRememberMe] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    const rememberMeCookie = Cookies.get('rememberMeBpce');
    if (rememberMeCookie) {
      setRememberMe(true);
      const userData = JSON.parse(rememberMeCookie);
      setEmail(userData.email);
      setPassword(userData.password);
    }else{
      const userData = { email : "", password : "" };
      setEmail(userData.email);
      setPassword(userData.password);      
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (email.trim() === '') {
      errors.email = 'votre adresse email est requise';
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'votre format d\'adresse email est non valide';
    }

    if (password.trim() === '') {
      errors.password = 'votre mot de passe est requis';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      const datauser = {email : email.trim(),password : password.trim()}
      await axiosClient.post('/login',datauser).then(({data})  => {
        const { user, token } = data;
        if (rememberMe) {
          const userData = { email : email.trim(), password : password.trim() };
          Cookies.set('rememberMeBpce', JSON.stringify(userData), { expires: 365 });
        } else {
          Cookies.remove('rememberMeBpce');
        }

        dispatch({ type: "LOGIN", payload: { user, token } });

        if (user.state == "s_member") {
          navigate('/quizz');  
        }else{
          navigate('/dashboard');
        }
      }).catch(err => {
        const response = err.response;
        if(err.code === "auth/network-request-failed"){
          errors.checkingnetwork = 'Connexion internet requise';
          setValidationError(errors);
        }
        else if (response && response.status === 500) {
          if (response.data.message) {
            errors.errorUser = response.data.message;
            setErrorAuthentification(errors);
          }

          if (response.data.state) {
            if (response.data.state == 'waiting_for') {
              errors.errorUser = 'votre compte est en attente d\'activation';
              setErrorAuthentification(errors);
            }
            else if (response.data.state == 'idle') {
              errors.errorUser = 'votre compte a été desactivé';
              setErrorAuthentification(errors);
            }
          }
        }
        else{
          errors.checkinglink = 'Erreur de chargement de l\'api, Veillez actualiser la page et ressayer Svp';
        }
      });
      setValidationError(errors);      
      setLoadingSubmitButton(false);
    }else{
      setValidationError(errors);
    }
  }
  return (
    <>
        <CardWrapper
            headerLabel="Se connecter"
            headerMessage="Connectez vous à votre compte."
            backbuttonHref="/signup"
            backbuttonLabel="Vous n'avez pas de compte ? Créez-en un."
        >
          {errorauthentification.errorUser ? <><div className="w-full bg-red-500 text-white p-1" >
            { errorauthentification.errorUser }
          </div><br /></> : null}

            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='email'>Email :</Label>
                <Input id='email' label="Email" placeholder="Email" type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                {validationerror.email && <span className="text-red-500">{validationerror.email}</span>}
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='password'>Mot de passe :</Label>
                <Input id='password' placeholder="Entrez votre mot de passe" value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password"/>
                {validationerror.password && <span className="text-red-500">{validationerror.password}</span>}
              </div>
              <div className="flex justify-between items-center">
                  <div className='flex gap-2'>
                    <Checkbox checked={rememberMe} onCheckedChange={() => setRememberMe(!rememberMe)} id='remember-me'/>
                    <Label htmlFor='remember-me'>Se souvenir de moi</Label>
                  </div>
                  <Link to="/forget-password" className="text-red-500 text-sm hover:underline">Mot de passe oublié ?</Link>
              </div>
              <Button color={"failure"} className="w-full" type='submit'>
                {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl mr-2"></i> : null} Se connecter
              </Button>
            </form>
        </CardWrapper>
    </>
  )
}
