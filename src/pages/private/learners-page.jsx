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


import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, SquarePen } from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function LearnersPage() {

    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

    const [learners, setLeaners] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getLearners();
    }, []);

    const getLearners = async () => {
        setLoadingSkeletonButton(true);
        axiosClient.get('/learners').then( ({data})=> {
            setLeaners(data.data);
            setLoadingSkeletonButton(false);
        }).catch(err => {
            setLoadingSkeletonButton(false);
        });
    };

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


    const ChangeStateUser  = async(id,user_state) => {
        Swal.fire({
          title: 'Choisir une operation', icon: 'question',showDenyButton: true,showCancelButton: true, confirmButtonColor: '#61396d',confirmButtonText: 'Activer',denyButtonText: `Desactiver`, cancelButtonText: 'Cancel'
        }).then(async (result) => {
          if (result.isConfirmed) {
            if(user_state !== "asset")
            {
              let state = "asset";
              const formData = new FormData();
              formData.append('_method', 'PUT');
              await axiosClient.post(`/setstate/${id}/${state}`,formData).then(async ({data})  => {
                getLearners();
                Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'This User has been activated',showConfirmButton: true})
              }).catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                  Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'An error occurred while executing the program',showConfirmButton: true,confirmButtonColor: '#61396d',})
                }
              });
            }
            else{
              Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'This User is already active',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          }
          else if (result.isDenied) {
            if(user_state !== "idle")
            {
              let state = "idle";
              const formData = new FormData();
              formData.append('_method', 'PUT');
              await axiosClient.post(`/setstate/${id}/${state}`,formData).then(async ({data})  => {
                getLearners();
                Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'This User has been deactivated',showConfirmButton: true})
              }).catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                  Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'An error occurred while executing the program',showConfirmButton: true,confirmButtonColor: '#61396d',})
                }
              });
            }
            else{
              Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'This User is already inactive',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
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
                        <BreadcrumbPage className="text-primary">Utilisateurs</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className="">
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle asChild className="text-lg font-semibold">
                        Listes des utilisateurs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>La liste des utilisateurs standard dans la plateforme</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Nom(s)</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead colspan={2}></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loadingskeletonbutton ? <> </>:
                            <>
                                {learners && learners.map((user,index) => {
                                    const descendingIndex = learners.length - index;
                                    let classState = "";
                                    let contentState = "";
                                    if (user.user_state === "asset") {classState = "text-green-300";contentState = "activée";} 
                                    else if (user.user_state === "idle") { classState = "text-red-400";contentState = "desactivée";}
                                    else{ classState = "text-orange-400";contentState = "en Attente";}
                                    return (                            
                                        <TableRow>
                                            <TableCell className="font-medium">{descendingIndex}</TableCell>
                                            <TableCell className="font-medium">
                                                <Avatar className='cursor-pointer'>
                                                    <AvatarFallback>
                                                        {user.user_img == "" || user.user_img == null ?
                                                            initials(user.user_lastname+" "+user.user_firstname)
                                                        : <img src={user.user_img} alt="PROFILE" width={300} /> }
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="max-w-xs">{user.user_lastname+" "+user.user_firstname}</TableCell>
                                            <TableCell className={`${classState}`}>{contentState}</TableCell>
                                            <TableCell className="text-primary font-bold">{user.user_email}</TableCell>
                                            <TableCell className="flex flex-row gap-3">
                                                <Button onClick={()=>{ navigate(`/stats/${user.user_id}`) }} className="bg-primary text-white" variant="primary">
                                                    <span>Stats</span>
                                                </Button>
                                                <Button variant="secondary" onClick={() => ChangeStateUser(user.user_id,user.user_state)}>
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

        </>
    );
}
