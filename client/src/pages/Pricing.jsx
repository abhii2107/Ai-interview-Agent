import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from 'axios';
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);


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
      ],
      badge: "Best Value",
    }
  ]

const handlePayment = async(plan) => {
  try {
    setLoadingPlan(plan.id);
    const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

    const result = await axios.post(serverUrl + "/api/payment/order", {
      planId: plan.id,
      amount: amount,
      credits: plan.credits,
    },{withCredentials: true})
    console.log(result.data);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: result.data.amount,
      currency: "INR",
      name: "VivaNexa.AI",
      description: `${plan.name} - ${plan.credits} Credits`,
      order_id: result.data.id,

      handler: async function (response) {
        const verifyPayload = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };

        const verifypay = await axios.post(serverUrl + "/api/payment/verify", verifyPayload, { withCredentials: true });
        dispatch(setUserData(verifypay.data.user));

        alert("Payment successful. Credits added!")
        navigate("/")

      },
      theme:{
        color: "#10b981"
      },
      
    }

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert(response.error?.description || "Payment failed");
      setLoadingPlan(null);
    });

    rzp.open();
  } catch (error) {
    console.error("Payment error:", error);
    alert(error?.response?.data?.message || "Unable to start payment");
    setLoadingPlan(null);
  }
}


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
            onClick = {() => !plan.default && setSelectedPlan(plan.id)}
            className={`relative rounded-3xl p-8 transition-all duration-300
             border ${
              isSelected ? "border-emerald-500 bg-emerald-50 shadow-lg" : "border-gray-300 bg-white hover:shadow-md"
             }
             ${plan.default ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {/* Badge */}
              {
                plan.badge && (
                  <div className="absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )
              }

              {/* default tag */}

              {
                plan.default && (
                  <div className="absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full shadow-lg">
                    Default
                  </div>
                )
              }

              {/* plan name */}
              <h3 className='text-xl font-semibold text-gray-800'>
                {
                  plan.name
                }
              </h3>

                {/* plan price */}
                <div className="mt-4">
                  <span className='text-3xl font-bold text-emerald-600'>
                    {
                      plan.price
                    }
                  </span>
                  <p className='text-gray-500 mt-2'>
                    {
                      plan.credits 
                    }
                    Credits
                  </p>
                </div>

                {/* plan description  */}
                <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
                  {
                    plan.description
                  }
                </p>

                {/* Features */}
                <div className="mt-6 space-y-3 text-left">
                  {
                    plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <FaCheckCircle className="text-emerald-500 text-sm"/>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))
                  }
                </div>

                {
                  !plan.default && 
                  <button 
                  disabled ={loadingPlan === plan.id}
                  onClick={(e) => {e.stopPropagation() 
                    if(!isSelected){
                      setSelectedPlan(plan.id)
                    }
                    else{
                      handlePayment(plan);
                    }
                  }
                }
                  className = { `w-full mt-8 py-3 rounded-xl font-semibold transition ${
                    isSelected ? "bg-emerald-600 text-white hover:opacity-90" : "bg-gray-200 text-gray-700 hover:bg-emerald-50"
                  }`}>

                    {
                      loadingPlan === plan.id ?
                      "Processing..." : isSelected ? "Proceed to Pay" : "Select Plan"
                    }
                    
                  </button>
                }

            </motion.div>
          )
        })
        }
      
      </div>

    </div>
  )
}

export default Pricing
