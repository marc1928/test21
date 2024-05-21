import React, { useContext, useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { AuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/axios-client';

export default function UpdateAccount() {
    const { currentUser, token } = useContext(AuthContext);
    
    const navigate = useNavigate();

    const [currentuser, setCurrentUser] = useState({});

    useEffect(() => {
        getCurrentUser();
    }, []);
    
    const getCurrentUser = async () => {
        axiosClient.get(`/users/${currentUser.id}`).then( ({data})=> {
        let list = data.data;
        setCurrentUser(list);
        }).catch(err => {
        navigate('/'); 
        });
    };
    return (
        <>
            <form className='space-y-3 mt-3'>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Email : </Label>
                    <Input type="text" disabled defaultValue={currentuser.user_email} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="bio">Mot de passe : </Label>
                    <Input id="bio" placeholder="********" disabled />
                </div>
                <div className="flex gap-2 items-center mt-3">
                    <Button type="button">Modifier votre compte</Button>
                </div>
            </form>
        </>
    )
}
