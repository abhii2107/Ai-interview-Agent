import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { ResponsiveContainer } from 'recharts';
import{jsPDF} from 'jspdf'
import autoTable from 'jspdf-autotable'

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

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPdf = () => {
    const doc  = new jsPDF("p",'mm','a4');
  
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
            <h3 className='text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base'>Overall Performance</h3>
            <div className='w-20 h-20 relative sm:w-25 sm:h-25 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  strokeLinecap: 'round',
                  pathColor: '#10b981',
                  textColor: '#ef4444',
                  trailColor: '#e5e7eb',
                  textSize: '18px',

                })}
              />
            </div>

            <p className='text-gray-400 mt-3 text-xs sm:text-sm'>Out of 10</p>

            <div className='mt-4'>
              <p className='font-semibold text-gray-800 text-sm sm:text-base'>{performanceText}</p>
              <p className='text-gray-500 text-xs sm:text-sm mt-1'>{shortTagline}</p>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8">
            <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-6'>
              Skill Evaluation
            </h3>
            <div className="space-y-5">
              {
                skills.map((s, i) => {
                  <div key={i}>
                    <div className="flex justify-between mb-2 text-sm sm:text-base">
                      <span>{s.name}</span>
                      <span className="font-semibold text-green-600">{s.value}/10

                      </span>
                    </div>

                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${(s.value / 10) * 100}%` }}
                      ></div>
                    </div>

                  </div>
                })
              }
            </div>
          </motion.div>

        </div>

        <div className='lg:col-span-2 space-y-6'>
          <motion.div
            intial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8'
          >
            <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6'>Performance Insights</h3>

              <div className="h-64 sm:h-80 bg-gray-100 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data = {questionScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#22c55e" fill="#bbf7d0" 
                    strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8'
          >
            <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6'>Detailed Feedback</h3>
            
            <div className="space-y-6">
              {questionWiseScore.map((q,i) => {
                <div key={i} className='bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200'>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
                    <div>
                      <p className='text-xs text-gray-500'>Question {i + 1}</p>

                      <p className='font-semibold text-gray-800 text-sm sm:text-base leading relaxed'>{q.question || "Question not available"}</p>
                    </div>


                    <div className='bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit'>
                      {q.score ?? 0} /10
                    </div>

                  </div>

                <div className='bg-green-50 border border-green-200 p-4 rounded-lg'>
                  <p className='text-xs text-green-600 font-semibold mb-1'>
                    Feedback:
                  </p>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    {q.feedback && q.feedback.trim() !== "" ? q.feedback : "No feedback available for this question."}
                  </p>
                </div>

                </div>
              })
            }
            </div>
           

          </motion.div>

        </div>
      </div>

    </div>
  )
}

export default Step3Report
