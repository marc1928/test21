import React from 'react'
import SignUpForm from '../components/auth/signup-form'

export default function SignUpPage() {
  return (
    <div className='h-screen flex justify-center items-center w-full bg-neutral-100 dark:bg-neutral-800'>
      <SignUpForm/>
    </div>
  )
}
