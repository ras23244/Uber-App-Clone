import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'


const CaptainLogin = () => {
  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [captainData, setCaptainData] = useState({})
  
    const submitHandler=(e)=>{
      e.preventDefault();
      setEmail('')
      setPassword('')
      setCaptainData({
        email: email,
        password: password
      })
      
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
