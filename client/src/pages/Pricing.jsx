import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {motion} from "react-motion"

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparations",
      features: [
        "100 AI-generated interview credits",
        "Basic Performance Analytics",
        "Voice Interview Access",
        "Limited History Tracking"
      ],
      default: true,

    },
    {
      id: "basic",
      name:"Starter Plan",
      price: "₹100",
      credits: 150,
      description: "Ideal for regular interview practice and feedback",
      features: [
        "150 AI-generated interview credits",
        "Detailed FeedBack",
        "Performance Analytics",
        "Full Interview History"
      ]
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "₹500",
      credits: 500,
      description: "Best for intensive interview preparation and personalized coaching",
      features: [
        "500 AI-generated interview credits",
        "Advanced Performance Analytics",
        "Personalized Coaching Sessions",
        "Priority Support"
      ]
    }
  ]




  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-5 py-16 px-6'>
      
      <div className="max-w-6xl mx-auto mb-14 flex items-start gap-4">
        <button 
        onClick={() => navigate("/")}
        className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
          <FaArrowLeft className='text-gray-600'/>
        </button>

        <div className="text-center w-full">
          <h1 className='text-4xl font-bold text-gray-800'>Check Your Plan</h1>

          <p className='text-gray-500 mt-3 text-lg'>

            Flexible pricing to match your needs. Choose the plan that suits you best and start acing your interviews today!
          </p>
        </div>

      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return(
            <motion.div 
              key={plan.id}
            whileHover= {!plan.default && {scale: 1.03}}
            onClick = {() => !plan.default && seSelectedPlan(plan.id)}
            >

            </motion.div>
          )
        })
        }
      
      </div>

    </div>
  )
}

export default Pricing
