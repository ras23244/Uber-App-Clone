import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LiveTracking from '../components/LiveTracking';

const CaptainRiding = () => {
    const location = useLocation();
    const ride = location.state?.ride;

    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const finishRidePanelRef = useRef(null);

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            });
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [finishRidePanel]);

    return (
        <div className='h-screen flex flex-col relative'>
            <div className="fixed p-3 top-0 flex items-center justify-between w-full ">
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />

                <Link to={'/captain-home'} className='flex items-center justify-center h-10 w-10 bg-amber-500 rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className="h-4/5">
                <LiveTracking />
            </div>

            <div className="h-1/5 relative p-6 bg-yellow-400 flex items-center justify-between " onClick={() => {
                setFinishRidePanel(true)
            }}>
                <h5 className=' text-center w-[88%] absolute top-0 '><i className="text-3xl text-gray-500 ri-arrow-up-wide-fill"></i></h5>
                <h4 className='text-xl font-semibold'>
                {ride?.distance }KM
                </h4>
                <button className=' bg-green-600 text-white font-semibold text-xl rounded-lg p-3 px-4' >Complete Ride</button>
            </div>

            <div ref={finishRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">

                <FinishRide
                    ride={ride}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>
        </div>
    );
};

export default CaptainRiding;
