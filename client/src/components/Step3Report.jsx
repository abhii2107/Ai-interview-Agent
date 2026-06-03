import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import{jsPDF} from 'jspdf'
import autoTable from 'jspdf-autotable'

function Step3Report({ report }) {
  const [isChartReady, setIsChartReady] = useState(false)

  useEffect(() => {
    setIsChartReady(true)
  }, [])

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
    questioWiseScore = [],
  } = report;

  const chartQuestions = questionWiseScore.length ? questionWiseScore : questioWiseScore;

  const questionScoreData = chartQuestions.map((item, index) => ({
    name: `Q${index + 1}`,
    score: item.score || 0
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

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    let currentY = 25;

    // title

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(14,197,94);
    doc.text("AI Interview Analytics Report", pageWidth / 2, currentY, { align: "center" });

    currentY += 5;

    // underline

    doc.setDrawColor(34,197,94);
    doc.line(margin,currentY +2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // Skills box

    doc.setFillColor(14,197,94);
    doc.roundedRect(margin, currentY, contentWidth, 34, 5, 5, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);

    doc.text(`Confidence: ${confidence}/10`, margin + 10, currentY + 11);
    doc.text(`Communication: ${communication}/10`, margin + 10, currentY + 22);
    doc.text(`Correctness: ${correctness}/10`, margin + contentWidth / 2, currentY + 11);

    currentY += 46;

    // Advice
    let advice = "";
    if(finalScore >= 8) {
      advice = "Excellent performance! You have a strong grasp of the concepts and demonstrated great confidence and communication skills. Keep up the fantastic work!";
    }
    else if(finalScore >= 5) {
      advice = "Good job! You have a decent understanding of the concepts and showed potential in your communication skills. With a bit more practice and focus on certain areas, you can further improve your performance.";
    }
    else{
      advice = "There is room for improvement. Focus on strengthening your understanding of the concepts and work on your communication skills.";
    }

    doc.setFillColor(255,255,255);
    doc.setDrawColor(228);
    doc.roundedRect(margin, currentY, contentWidth, 42, 4, 4);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text("Overall Performance:", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice,contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 22);

    currentY += 58;

    // QUESTION TABLE

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score ?? 0}/10`,
        q.feedback
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",

      },
      headStyles: {
        fillColor: [14,197,94],
        textColor: 255,
        halign: "center",
      },
      columnStyles:{
        0: { cellWidth: 10, halign: "center" }, //index column
        1: { cellWidth: 55 },//question column
        2: { cellWidth: 20, halign: "center" },//score column
        3: { cellWidth: "auto"},//feedback column
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      }
    })

    doc.save("interview_report.pdf");  
    
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
        <button
        onClick={downloadPdf} 
        className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-semibold tetx-sm sm:text-base text-nowrap'>
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
                skills.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2 text-sm sm:text-base">
                      <span>{s.label}</span>
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
                ))
              }
            </div>
          </motion.div>

        </div>

        <div className='lg:col-span-2 space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8'
          >
            <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6'>Performance Trend</h3>

              <div className="h-64 sm:h-72">
                {isChartReady ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={questionScoreData}>
                      <CartesianGrid strokeDasharray="3
                      3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#22c55e"
                        fill="#bbf7d0"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : null}
              </div>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8'
          >
            <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6'>Detailed Feedback</h3>
            
            <div className="space-y-6">
              {chartQuestions.map((q,i) => (
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
              ))
            }
            </div>
           

          </motion.div>

        </div>
      </div>

    </div>
  )
}

export default Step3Report
