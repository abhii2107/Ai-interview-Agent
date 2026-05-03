import React, { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import Auth from '../pages/Auth'

function AuthModel({onClose}) {
    const {userData} = useSelector(state=>state.user)
    console.log(userData)

    useEffect(() => {
        if(userData){
            onClose()
        }
    },[userData,onClose])
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black/40 backdrop-blur-sm">
         <div className = "relative w-full max-w-md">
            <button onClick={onClose} className='absolute top-4 right-4 z-50 text-white cursor-pointer text-xl bg-slate-700 hover:bg-slate-900 p-2 rounded-full shadow-lg transition-colors duration-200'>
              
              <FaTimes size={18}/>
            </button>
            <Auth isModel={true} />
         </div>


    </div>
  )
}

export default AuthModel