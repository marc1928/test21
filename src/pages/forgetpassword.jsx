import CardWrapper from '@/components/auth/card-wrapper'
import SignInForm from '@/components/auth/signin-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

export default function Forgetpassword() {
  return (
    <div className='h-screen flex justify-center items-center w-full bg-neutral-100 dark:bg-neutral-800'>
        <CardWrapper headerLabel="Renitialiser Votre mot de passe" headerMessage="" backbuttonHref="/signin" backbuttonLabel="Connectez vous ? Cliquez ici.">
            <form  className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='email'>Email :</Label>
                    <Input id='email' label="Email" placeholder="Entrez votre adresse email" type='email'/>
                </div>
                <Button color={"failure"} className="w-full mt-3" type='submit'>
                    Renitialiser
                </Button>
            </form>
        </CardWrapper>
    </div>
  )
}

