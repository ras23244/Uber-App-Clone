import React,{ useContext, useState,useEffect } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainDetails = () => {

  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalDistance: 0,
    totalRides: 0,
    totalTime: 0,
  })
  useEffect(() => {
    const fetchDailyStats = async ()=>{
      try{
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/daily-stats`,{
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        setStats(response.data)

      }catch(err){
        console.error("Error fetching daily stats:", err)
      }
    }
    fetchDailyStats();
  }, [])
  

  const { captain } = useContext(CaptainDataContext)

  return (
    <div>
      <div className="flex items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <img className='h-12 w-12 rounded-full object-cover ' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBlPlpTtK_z4wQ4W74DmV5pxpZYatxBAmzrg&s" alt="profile photo" />
            <h4 className='text-lg font-semibold capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname }</h4>
          </div>
          <div className="text-right">
            <h4 className='text-lg font-semibold'>₹{stats.totalEarnings}</h4>
            <p className='text-sm text-gray-500'>Earned</p>
          </div>
        </div>

        <div className="flex gap-3 items-center justify-between bg-amber-300 p-7 rounded-xl mt-8 mb-2">
          <div className="text-center">
            <i className="text-gray-400 text-3xl font-extralight ri-time-line"></i>
            <h5 className='text-lg font-medium'>{stats.totalTime}</h5>
            <p className='text-xs text-gray-500'>MINUTES ONLINE</p>
          </div>
          <div className="text-center">
            <i className="text-gray-400 text-3xl font-extralight ri-speed-up-line"></i>
            <h5 className='text-lg font-medium'>{stats.totalDistance}KM</h5>
            <p className='text-xs text-gray-500'>TOTAL DISTANCE</p>
          </div>
          <div className="text-center">
            <i className="text-gray-400 text-3xl font-extralight ri-booklet-line"></i>
            <h5 className='text-lg font-medium'>{stats.totalRides}</h5>
            <p className='text-xs text-gray-500'>TOTAL JOBS</p>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails
