import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import {motion} from "motion/react"

function Step3Report({ report }) {

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }
  const navigate = useNavigate()
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((item, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ]

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Excellent performance! You have a strong grasp of the concepts and demonstrated great confidence and communication skills. Keep up the fantastic work!";
    shortTagline = "Excellent clear understanding and great communication skills.";
  }

  else if (finalScore >= 5) {
    performanceText = "Good job! You have a decent understanding of the concepts and showed potential in your communication skills. With a bit more practice and focus on certain areas, you can further improve your performance.";
    shortTagline = "Good understanding with room for improvement in communication skills.";
  }
  else {
    performanceText = "There is room for improvement. Focus on strengthening your understanding of the concepts and work on your communication skills.";
    shortTagline = "Needs improvement in understanding and communication skills.";
  }


  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-green-50 px-4 sm:px-6 lg:px-10 py-8'>
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='md:mb-10 w-full flex items-start gap-4 flex-wrap'>
          <button
            onClick={() => navigate("/history")}
            className='mt-1 p-3 rounded-full bg-white shadow-md transition'>
            <FaArrowLeft className='text-gray-600' />
          </button>

          <div>
            <h1 className='text-3xl font-bold text-gray-800 flex-nowrap'>
              Interview Analytics Dashboard
            </h1>

            <p className='text-gray-500 mt-2'>
              Ai-powered insights to help you ace your interviews!
            </p>

          </div>
        </div>
        <button className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-semibold tetx-sm sm:text-base text-nowrap'>
          Download Report
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className='space-y-6'>
          <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center' 
          >
            
          </motion.div>
        </div>

        <div>


        </div>
      </div>

    </div>
  )
}

export default Step3Report
