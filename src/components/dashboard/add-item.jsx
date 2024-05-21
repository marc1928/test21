import React, { useContext } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import {Plus} from "lucide-react"
import { Link } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContext'
  
export default function AddItem() {
    const { currentUser, token } = useContext(AuthContext);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2 py-2 rounded-full">
                    Naviguer
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent aria-label="Static Actions" className="rounded-md mr-3 w-[200px]">
                <DropdownMenuItem asChild className="rounded-md">
                    <Link to="/quizz" className="flex gap-2 items-center w-full h-full py-2 cursor-pointer">
                        Voir les Quizz
                    </Link>
                </DropdownMenuItem>                
                <DropdownMenuItem asChild className="rounded-md">
                    <Link to="/dashboard"
                        className="flex gap-2 items-center w-full h-full py-2 cursor-pointer">
                        Tableau de bord
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
