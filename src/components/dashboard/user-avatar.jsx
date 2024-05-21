import React, { useContext, useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardHeader, CardTitle } from '../ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import axiosClient from '@/axios-client';

export default function UserAvatar() {
    const { currentUser, token } = useContext(AuthContext);

    const { dispatch } = useContext(AuthContext);

    const navigate = useNavigate();

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

    const handleLogout = async () => {
        try {
          dispatch({ type: "LOGOUT" });
        //   await axiosClient.post('/logout');
          navigate("/");
        } catch (error) {
          console.log(error);
          navigate("/");
        }
      };

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
            <Popover>
                <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarFallback className="font-bold">
                            {currentuser.user_img == "" || currentuser.user_img == null ?
                                initials(currentuser.user_lastname+" "+currentuser.user_firstname)
                            : <img src={currentuser.user_img} alt="PROFILE" width={300} /> }
                        </AvatarFallback>
                    </Avatar>
                </PopoverTrigger>
                <PopoverContent asChild>
                    <Card className="space-y-2 mr-2 p-4">
                        <CardHeader className="border-b py-1 px-1">
                            <CardTitle className="font-medium leading-none text-sm">Connecté avec {currentUser.email}</CardTitle>
                        </CardHeader>
                        <div className='flex flex-col gap-0'>
                            <Link to="/dashboard/settings" className='px-2 py-1 hover:bg-foreground/20 rounded-md'>Profil</Link>
                            <Link onClick={handleLogout} className='px-2 py-1 text-primary hover:bg-primary/20 rounded-md'>Se déconnecter</Link>
                        </div>
                    </Card>
                </PopoverContent>
            </Popover>
        </>
    )
}
