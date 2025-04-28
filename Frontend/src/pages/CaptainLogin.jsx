import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'
import { useContext } from 'react'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  const {captain,setCaptain}=useContext(CaptainDataContext)
    const navigate=useNavigate()
  
    const submitHandler=async (e)=>{

      e.preventDefault();
      const captain={
        email: email,
        password: password
      }
      const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`,captain)
      if(response.status===200){
        const data=response.data
        setCaptain(data.captain);
        localStorage.setItem('token',data.token)
        navigate('/captain-home')
      }
      setEmail('')
      setPassword('')
      
      
    }
  return (
   <div className='p-5 h-screen flex flex-col justify-between' >
         <div>
         <img className='w-16 mb-8' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />
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
         <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
         </div>
   
         <div>
           <Link
           to='/login'
           className='flex items-center justify-center bg-[#d5622d] text-white font-semibold rounded mb-7 px-4 py-2 w-full text-xl placeholder:text-base'
           >Sign in as User</Link>
         </div>
       </div>
  )
}

export default CaptainLogin
