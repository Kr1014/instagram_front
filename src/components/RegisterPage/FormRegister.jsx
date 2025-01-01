import React from 'react'
import { useForm } from 'react-hook-form'
import useRegister from '../../hooks/useRegister'

const FormRegister = () => {

    const {handleSubmit, register, reset} = useForm()
    const [error, registerUser] = useRegister()
    

    const submit = (data) =>{
        const url = 'http://localhost:8080/api/v1/users'
        registerUser(url, data),
        reset({
            firstName: '',
            lastName: '',
            email: '',
            userName: '',
            password: '',
            photoProfile: ''
        })
    }

  return (
    <form onSubmit={handleSubmit(submit)}>
        <label htmlFor="firstName">First name</label>
        <input type="text" {...register('firstName')} />
        <label htmlFor="lastName">Last name</label>
        <input type="text" {...register('lastName')} />
        <label htmlFor="userName">User name</label>
        <input type="text" {...register('userName')} />
        <label htmlFor="photoProfile">Photo profile</label>
        <input type="text" {...register('photoProfile')} />
        <label htmlFor="email">Email</label>
        <input type="email" {...register('email')} />
        <label htmlFor="password">Password</label>
        <input type="password" {...register('password')}/>
        <button>Register</button>
    </form>
  )
}

export default FormRegister