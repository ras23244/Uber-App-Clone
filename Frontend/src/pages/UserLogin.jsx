import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState,useContext } from 'react'
import axios from 'axios'
import { UserDataContext } from '../context/userContext'

const UserLogin =  () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  const {user,setUser}=useContext(UserDataContext)

  const submitHandler=async (e)=>{
    e.preventDefault();
   
    const userData = {
      email: email,
      password: password
    }

    // axios ki help se server pr bhjeo frontend ka data 
    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData)
    if(response.status === 200){
      const data = response.data
      setUser(data.user);
      localStorage.setItem('token',data.token)
      navigate('/home')
    }

    setEmail('')
    setPassword('')
    
  }

  return (
    <div className='p-5 h-screen flex flex-col justify-between' >
      <div>
      <img className='w-16 mb-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
      <form onSubmit={(e)=>{
        submitHandler(e)
      }} >

        <h3 className='text-xl mb-2'>What's your email?</h3>

        <input
          value={email}
          onChange={(e)=>{
            setEmail(e.target.value)
          }}
          className='bg-gray-200 rounded mb-7 px-4 py-2 w-full text-xl placeholder:text-base'
          required
          type="email"
          name='email'
          placeholder='Enter your email' />

        <h3 className='text-xl mb-2' >Enter Password</h3>

        <input
        value={password}
        onChange={(e)=>{
          setPassword(e.target.value)
        }}
          className='bg-gray-200 rounded mb-7 px-4 py-2 w-full text-xl placeholder:text-base'
          type="password"
          name="password"
          id=""
          placeholder='Enter your password' />

        <button
        className='bg-black text-white font-semibold rounded mb-7 px-4 py-2 w-full text-xl placeholder:text-base'>Login</button>


      </form>
      <p className='text-center'>New here ? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
      </div>

      <div>
        <Link
        to='/captain-login'
        className='flex items-center justify-center bg-[#10b461] text-white font-semibold rounded mb-7 px-4 py-2 w-full text-xl placeholder:text-base'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin
