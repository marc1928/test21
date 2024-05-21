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
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";

export default function ManagersPage() {
    const [openNewManager, setOpenNewManager] = useState(false);

    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);
  
    const [managers, setManagers] = useState([]);

    const [learners, setLeaners] = useState([]);

    const [datauserid,setDataUserId] = useState(0);

    const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

    const [validationerror , setValidationError] = useState("");

    const handleModalOpen = () => {
        setOpenNewManager(true);
        setValidationError("");
        setDataUserId("");
    };

    const handleModalClose = () => {
        setOpenNewManager(false);
    };    

    useEffect(() => {
        getManagers() && getUsers();
    }, []);

    const getManagers = async () => {
        setLoadingSkeletonButton(true);
        axiosClient.get('/managers').then( ({data})=> {
            setManagers(data.data);
            setLoadingSkeletonButton(false);
        }).catch(err => {
            setLoadingSkeletonButton(false);
        });
    };

    const getUsers = async () => {
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

    const handleSubmit = async (e) => {
        event.preventDefault();
        const errors = {};

        if (datauserid === "" || datauserid === 0) {
            errors.user_id = 'Selectionner un utilisateur';
        }

        if (Object.keys(errors).length === 0) {
            setLoadingSubmitButton(true);
            let role = "member";
            const formData = new FormData();
            formData.append('_method', 'PUT');
            await axiosClient.post(`/setrole/${datauserid}/${role}`,formData).then(async ({data})  => {
                setLoadingSubmitButton(false);
                handleModalClose();
                getManagers();
            }).catch(err => {
              const response = err.response;
            });
            setValidationError(errors);
        } else {
          setValidationError(errors);
        }
        setLoadingSubmitButton(false);        

    }    

    const handleChangeState = async(id) => {
        Swal.fire({
          title: 'Suppression', text: 'Etes vous sur de vouloir retirer ce gestionnaire ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#61396d', cancelButtonColor: '#d33', confirmButtonText: 'supprimer', cancelButtonText: 'Cancel'
        }).then(async (result) => {
          if (result.isConfirmed) {
            let role = "s_member";
            const formData = new FormData();
            formData.append('_method', 'PUT');
            axiosClient.post(`/setrole/${id}/${role}`,formData).then( () => {
              Swal.fire({position: 'top-right',icon: 'success',title: 'Success!',text: 'Opération effectuée avec succès',showConfirmButton: true});
              getManagers();
            }).catch(err => {
                Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `An error occurred while processing your request` ,showConfirmButton: true,confirmButtonColor: '#61396d',})
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
                        <BreadcrumbPage className="text-primary">Gestionnaires</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className="">
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle asChild className="text-lg font-semibold">
                        Listes des gestionnaires
                    </CardTitle>
                    <Button onClick={() => handleModalOpen("")}>Ajouter un gestionnaire</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>La liste des gestionnaires dans la plateforme</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Nom(s)</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead colspan={2}></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loadingskeletonbutton ? <> </>:
                            <>
                                {managers && managers.map((user,index) => {
                                    const descendingIndex = managers.length - index;
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
                                            <TableCell className="text-primary font-bold">{user.user_email}</TableCell>
                                            <TableCell className="flex flex-row gap-3">
                                                <Button variant="danger" onClick={() => handleChangeState(user.user_id)}>
                                                    <Trash2 size={15} />
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
            <Dialog open={openNewManager} onOpenChange={setOpenNewManager}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Nouveau gestionnaire</DialogTitle>
                        <DialogDescription>
                            Vous etes sur le point de changer un utilisateur standard en gestionnaire.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="space-y-3">
                            <Label htmlFor="difficulty">Utilisateurs : </Label>
                            <Select value={datauserid} onValueChange={setDataUserId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectionnez le nouveau gestionnaire :"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {learners && learners.map((user,index) => {
                                        return (                                
                                            <SelectItem value={`${user.user_id}`}>{user.user_lastname+" "+user.user_firstname}</SelectItem>
                                        );
                                    })}                                     
                                </SelectContent>
                            </Select>
                            {validationerror.user_id && <span className="text-red-500">{validationerror.user_id}</span>}
                        </div>
                        <div className="my-4 flex gap-3 items-center">
                            <Button type="submit" className="w-full sm:w-fit">
                                {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl mr-2"></i> : null} Modifier le role
                            </Button>
                            <DialogClose asChild>
                                <Button onClick={() => handleModalClose("")} variant="secondary" type="button" className="w-full sm:w-fit">Annuler</Button>
                            </DialogClose>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </>
    );
}
