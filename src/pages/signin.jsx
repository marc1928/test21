import React from 'react'
import SignInForm from '../components/auth/signin-form'
import { useLocation } from 'react-router-dom';

export default function SignInPage() {
  return (
    <div className='h-screen flex justify-center items-center w-full bg-neutral-100 dark:bg-neutral-800'>
      <SignInForm/>
    </div>
  )
}
