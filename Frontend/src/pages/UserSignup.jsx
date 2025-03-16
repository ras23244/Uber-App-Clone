import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const UserSignup = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [userData, setUserData] = useState({})

  const submitHandler=(e)=>{
    e.preventDefault();

    setUserData({
      fullName:{
        firstname:firstname,
        lastname:lastname
      },
      email:email,
      password:password,
    })
    console.log(userData)
    setFirstname('')
    setEmail('')
    setPassword('')
    setLastname('')
    setUserData('')
  }

  return (
    <div className='p-5 h-screen flex flex-col justify-between' >
      <div>
        <img className='w-16 mb-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <form onSubmit={(e) => {
          submitHandler(e)
        }} >

          <h3 className='text-xl mb-2'>Name</h3>
          <div className='flex gap-2 mb-5' >
            <input
            value={firstname}
            onChange={(e)=>{
             
              setFirstname(e.target.value)
            }}

              className='bg-gray-200 rounded w-1/2 px-4 py-2  text-xl placeholder:text-base'
              required
              type="text"
              name='firstname'
              placeholder='Enter your first name' />

            <input
            value={lastname}
            onChange={(e)=>{
             
              setLastname(e.target.value)
            }}


              className='bg-gray-200 rounded w-1/2  px-4 py-2 text-xl placeholder:text-base'
              required
              type="text"
              name='lastname'
              placeholder='Enter your last name' />

          </div>


          <h3 className='text-xl mb-2'>Email</h3>

          <input
          value={email}
          onChange={(e)=>{
         
            setEmail(e.target.value)
          }}


            className='bg-gray-200 rounded mb-5 px-4 py-2 w-full text-xl placeholder:text-base'
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


            className='bg-gray-200 rounded mb-5 px-4 py-2 w-full text-xl placeholder:text-base'
            type="password"
            name="password"
            id=""
            placeholder='Enter your password' />

          <button
            className='  bg-black text-white font-semibold rounded mb-7 px-4 py-2 w-full text-xl placeholder:text-base'>Sign up</button>


        </form>
        <p className='text-center'>Already have an account ? <Link to='/login' className='text-blue-600'>Login</Link></p>
      </div>

      <div>
        <p className='text-xs leading-tight'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At nam vitae magnam.Spercalifragilistich ehoaujhgjgg</p>
      </div>
    </div>
  )
}

export default UserSignup
