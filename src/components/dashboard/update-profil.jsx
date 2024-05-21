import React, {useContext, useEffect, useRef, useState} from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { AuthContext } from '@/context/AuthContext';
import axiosClient from '@/axios-client';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function UpdateProfil() {
    const { currentUser, token } = useContext(AuthContext);

    function initials(str) {
        const words = str.split(' ');
        let initials = '';
    
        words.forEach(word => {
            if (word.length > 0) {
                initials += word[0].toUpperCase();
            }
        });
    
        return initials;
    } 
    
    const navigate = useNavigate();

    const [currentuser, setCurrentUser] = useState({});

    useEffect(() => {
        getCurrentUser();
      }, []);
    
      const getCurrentUser = async () => {
          axiosClient.get(`/users/${currentUser.id}`).then( ({data})=> {
            let list = data.data;
            setCurrentUser(list);
            setImgURL(list.user_img);
          }).catch(err => {
            navigate('/'); 
          });
    };

    const formRef = useRef();

    const inputusers = useRef([]);

    const addInputsUser = el => {
        if (el && !inputusers.current.includes(el)) {
          inputusers.current.push(el)
        }
    }

    const [imgURL, setImgURL] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

    const [validationerror , setValidationError] = useState("");

    const handleUploadImage = (e) => {
        const file = e.target.files?.[0];
        if(file){
            const imgURL = URL.createObjectURL(file);
            setSelectedImage(file);
            setImgURL(imgURL);
        }
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const errors = {};
    
        if (inputusers.current[0].value.trim() === '') {
          errors.lastname = 'entrez votre nom';
        }  
    
        if (inputusers.current[1].value.trim() === '') {
          errors.firstname = 'entrez votre prenom';
        }

        if (Object.keys(errors).length === 0) {
            if (!selectedImage) {
                setLoadingSubmitButton(true);
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('lastname', inputusers.current[0].value.trim());
                formData.append('firstname', inputusers.current[1].value.trim());
        
                await axiosClient.post(`/setprofile/${currentUser.id}`,formData).then(({data})  => {
                  setLoadingSubmitButton(false);
                  Swal.fire({position: 'Center',icon: 'success',title: 'Thanks you!',text: 'Informations modifiees avec succes',showConfirmButton: true});
                  setValidationError(errors);
                }).catch(err => {
                  const response = err.response;
                  if (response && response.status === 422) {
                    Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'An error occurred while executing the program',showConfirmButton: true,confirmButtonColor: '#10518E',})
                  }
                })   
                setLoadingSubmitButton(false);             
            } else {
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('img', selectedImage);
                formData.append('lastname', inputusers.current[0].value.trim());
                formData.append('firstname', inputusers.current[1].value.trim());
                await axiosClient.post(`/setprofile/${currentUser.id}`,formData,{headers: {'Content-Type': 'multipart/form-data',},}).then(({data})  => {
                  setLoadingSubmitButton(false);
                  Swal.fire({position: 'Center',icon: 'success',title: 'Thanks you!',text: 'Informations modifiees avec succès',showConfirmButton: true});
                  setValidationError(errors);
                }).catch(err => {
                  const response = err.response;
                  if (response && response.status === 422) {
                    Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'An error occurred while executing the program',showConfirmButton: true,confirmButtonColor: '#10518E',})
                  }
                })
                setLoadingSubmitButton(false);                
            }
          } else{
            setValidationError(errors);
            setLoadingSubmitButton(false);
          }           
    }

    return (
        <>
            <form ref={formRef} onSubmit={handleSubmit} className='space-y-3 mt-3'>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nom : </Label>
                    <Input type="text" ref={addInputsUser} defaultValue={currentuser.user_lastname} />
                    {validationerror.lastname && <span className="text-red-500">{validationerror.lastname}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="secondname">Prenom : </Label>
                    <Input type="text" ref={addInputsUser} defaultValue={currentuser.user_firstname} />
                    {validationerror.firstname && <span className="text-red-500">{validationerror.firstname}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="profilePhoto" className="flex flex-col gap-3 w-fit">
                        <p>Modifier votre photo de profil :</p>
                        <Avatar className="w-[100px] h-[100px]">
                            {imgURL === null || imgURL === "" ? 
                                <AvatarFallback className="text-2xl fontbod">
                                    {initials(currentuser.user_lastname+" "+currentuser.user_firstname)}
                                </AvatarFallback>
                                : <AvatarImage src={imgURL} alt="profile photo"/>
                            }
                        </Avatar>
                    </Label>
                    <Input type="file" id="profilePhoto" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleUploadImage}/>
                </div>
                <div className="flex gap-2 items-center mt-3">
                    <Button type="submit">
                        {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl mr-2"></i> : null} Modifier votre compte
                    </Button>
                </div>
            </form>
        </>
    )
}
