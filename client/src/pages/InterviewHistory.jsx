import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/interview/get-interview", { withCredentials: true })
                console.log(result.data);

                setInterviews(result.data.interviews)
            } catch (error) {
                console.log(error);
            }
        }
        getMyInterviews();
    }, [])


    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 py-10'>
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto bg-white'>
                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-full bg-white shadow-md transition'>
                        <FaArrowLeft className='text-gray-600' />
                    </button>

                    <div>
                        <h1 className='text-3xl font-bold text-gray-800 flex-nowrap'>
                            Interview History
                        </h1>

                        <p className='text-gray-500 mt-2'>
                            Review your past interviews, track your progress, and gain insights to improve your performance.
                        </p>

                    </div>
                </div>

                {interviews.length === 0 ?
                    <div className='bg-white p-10 rounded-2xl shadow text-center'>
                        <p className='text-gray-500 '>
                            You haven't given any interviews yet. Start practicing to see your interview history here!
                        </p>
                    </div >
                    :
                    <div className='grid gap-3'>
                        {
                            interviews.map((item, index) =>( <div key={index}
                                onClick={() => navigate(`/report/${item._id}`)}
                            className='bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-800'>{item.role}

                                        </h3>

                                        <p className='text-gray-500 text-sm mt-1'>
                                            {item.experience} * {item.mode}
                                        </p>

                                        <p className='text-xs text-gray-400 mt-2'>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-6'>
                                        
                                        {/* score */}
                                        <div className='text-right'>
                                            <p className='text-xl font-bold text-emerald-600'>
                                                {item.finalScore ||0} / 10

                                            </p>

                                            <p className='text-xs text-gray-400'>
                                                Overall Score
                                            </p>

                                        </div>

                                        {/* STATUS BADGE */}
                                        <span className={`px-4 py-1 rounded-full text-xs ${item.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"}`}>
                                            {item.status}
                                        </span>

                                    </div>
                                </div>

                            </div>
                            ))
                        }
                    </div>
                }

            </div>

        </div>
    )
}

export default InterviewHistory
