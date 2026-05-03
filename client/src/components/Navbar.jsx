import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";      // Bootstrap Icons
import { HiOutlineLogout } from "react-icons/hi";      // Heroicons (v1)
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';
function Navbar() {
    const { userData } = useSelector((state) => state.user)
    const [showCreditPopup, setCreditPopup] = useState(false)
    const [showUserPopup, setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false)
    const handleLogout = async () => {
        try {
            await axios.post(serverUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            setShowUserPopup(false)
            setCreditPopup(false)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative"
                transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 20, mass: 1 }}
            >
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <BsRobot size={18} />
                    </div>
                    <h1 className='font-semibold hidden md:block text-lg'>VivaNexa.AI</h1>
                </div>

                <div className='flex items-center gap-6 relative'>
                    <div className='realtive'>
                        {/* for the Credits */}
                        <button onClick={() => {
                            if(!userData){
                                setShowAuth(true)
                                return;
                            } setCreditPopup(!showCreditPopup); setShowUserPopup(false) }
                        } className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition'>
                            <BsCoin size={20} />
                            {userData?.credits || 0}
                        </button>
                        {showCreditPopup && (
                            <div className='absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50' >
                                <p className='text-sm text-gray-600 mb-4'>Need More Credits to Continue interview?</p>
                                <button onClick={() => navigate("/pricing")} className='w-full bg-[#FF6239] text-white py-2 rounded-full text-sm font-semibold hover:bg-[#f85831] transition'>
                                    Get Credits
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        {/* div for the icons */}
                        <div onClick={() => { 
                            if(!userData){
                                setShowAuth(true)
                                return;
                            } setShowUserPopup(!showUserPopup); setCreditPopup(false) }} className='realtive'>
                            <button className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold'>

                                {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={16} />}
                            </button>
                            {showUserPopup && (
                                <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl border border-gray-200 rounded-lg p-4 z-50">
                                    <p className="font-bold mb-2 capitalize">{userData?.name}</p>
                                    <button
                                        onClick={() => navigate("/history")}
                                        className="w-full flex items-center gap-2 mb-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                    >
                                        <FaUserAstronaut size={16} />
                                        History
                                    </button>

                                    {/* Logout Button */}
                                    <button onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded"
                                    >
                                        <HiOutlineLogout size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </motion.div>
            {showAuth && <AuthModel onClose={() => { setShowAuth(false) }} />}
        </div>
    )
}

export default Navbar
