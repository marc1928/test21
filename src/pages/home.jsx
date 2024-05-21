import React from 'react'
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '@/hooks/use-theme';
import {Sun, Moon} from "lucide-react";
import Navbar from "@/components/navbar.jsx";

export default function HomePage() {
  const location = useLocation();
  const {theme, setTheme} = useTheme();
  return (
      <>
        {location.pathname == "/" || location.pathname == "" ?
         null : <Navbar/> }
        <main className='h-screen flex justify-center items-center'>
          <div className='flex flex-col gap-4 items-center max-w-2xl text-center'>
            <h1 className='text-4xl tracking-tight font-extrabold text-primary'>BPCE QUIZZ APP</h1>
            <p className='text-lg font-medium'>Bienvenue sur notre plateforme de quizz personnalisé, vous pouvez tester
              les connaissances de votre proche et de vos collaborateurs</p>
            <div className='flex gap-2 items-center'>
              <Link to="/signin">
                <Button>Commencer</Button>
              </Link>
              {/* <Link to="/about">
                <Button variant="secondary">A propos de nous</Button>
              </Link> */}
              {/* <Link to="/dashboard">
                <Button variant='destructive'>Tableau de bord</Button>
              </Link> */}
            </div>
          </div>
        </main>
      </>
  )
}
