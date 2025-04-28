import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'


const Captainsignup = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    
    const [vehicleColor, setVehicleColor] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleCapacity, setVehicleCapacity] = useState('');
    const [vehicleType, setVehicleType] = useState('');

    const {captain,setCaptain}=useContext(CaptainDataContext)
  
    const submitHandler=async (e)=>{
      e.preventDefault();
      
      const captainData={
        fullname:{
          firstname:firstname,
          lastname:lastname
        },
        email:email,
        password:password,
        vehicle:{
          color:vehicleColor,
          plate:vehiclePlate,
          capacity:vehicleCapacity,
          vehicleType:vehicleType  
          }
      }

      const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`,captainData)
      
      if(response.status===201){
        const data=response.data
        setCaptain(data.captain)
        localStorage.setItem('token',data.token)
        navigate('/captain-home')
      }
      
      setFirstname('')
      setEmail('')
      setPassword('')
      setLastname('')
      setVehicleColor('')
      setVehiclePlate('')
      setVehicleCapacity('')
      setVehicleType('')
    }


  return (
    <div className='p-5 h-screen flex flex-col justify-between' >
          <div>
          <img className='w-16 mb-8' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />
            <form onSubmit={(e) => {
              submitHandler(e)
            }} >
    
              <h3 className='text-sm mb-2'>Name</h3>
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
    
    
              <h3 className='text-sm mb-2'>Email</h3>
    
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
    
              <h3 className='text-sm mb-2' >Enter Password</h3>
    
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

                <h3 className='ttext-sm mb-2'>Vehicle Color</h3>
                <input
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  className='bg-gray-200 rounded mb-5 px-4 py-2 w-full text-xl placeholder:text-base'
                  required
                  type="text"
                  name='vehicleColor'
                  placeholder='Enter your vehicle color' />

                <h3 className='text-sm mb-2'>Vehicle Plate</h3>
                <input
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className='bg-gray-200 rounded mb-5 px-4 py-2 w-full text-xl placeholder:text-base'
                  required
                  type="text"
                  name='vehiclePlate'
                  placeholder='Enter your vehicle plate' />

                <h3 className='text-sm mb-2'>Vehicle Capacity</h3>
                <input
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                  className='bg-gray-200 rounded mb-5 px-4 py-2 w-full text-xl placeholder:text-base'
                  required
                  type="number"
                  name='vehicleCapacity'
                  placeholder='Enter your vehicle capacity' />

                <h3 className='text-sm mb-2'>Vehicle Type</h3>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className='bg-gray-200 rounded mb-5 px-4 py-2 w-full text-sm placeholder:text-base'
                  required
                  name='vehicleType'>
                  <option value="" disabled>Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="bike">Bike</option>
                </select>
    
              <button
                className='  bg-black text-white font-semibold rounded mb-7 px-4 py-2 w-full text-xl placeholder:text-base'>Sign up</button>
    
    
            </form>
            <p className='text-center'>Already have an account ? <Link to='/captain-login' className='text-blue-600'>Login</Link></p>
          </div>
    
          <div>
            <p className='text-xs leading-tight mt-4 mb-8'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At nam vitae magnam.Spercalifragilistich ehoaujhgjgg</p>
          </div>
        </div>
  )
}

export default Captainsignup
