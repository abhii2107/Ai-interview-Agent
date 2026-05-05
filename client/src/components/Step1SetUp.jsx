import React from 'react'

function Step1SetUp({ onStart }) {
  return (
    <motion.div 
    intial = {{ opacity: 0}}
    animate = {{ opacity: 1}}
    transition = {{ duration: 0.6}}
    className = "min-h-screen flex flex-items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 ">

      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden'>
        <motion.div 
        intial = {{x:-80, opacity: 0 }}
        animate = {{x:0, opacity: 1}}
        transition = {{ duration: 0.7}}
        
        className = "relative bg-gradient-to-br from-green-50 to-green-100 p-10 flex flex-col justify-center">

        </motion.div>

        <motion.div>

        </motion.div>
      </div>

    </motion.div>
  )
}

export default Step1SetUp
