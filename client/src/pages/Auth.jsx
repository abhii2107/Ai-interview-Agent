import React from "react";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(
        serverUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log("Error in Google sign in", error);
      dispatch(setUserData(null));
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-['Inter',system-ui,sans-serif]">
      {/* ── Animated background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50">
        {/* Gradient orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: "-10%",
            right: "-5%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            bottom: "-5%",
            left: "-5%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 25, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Auth Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[380px] mx-4"
      >
        <div
          className="rounded-3xl p-8 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
          }}
        >
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <span className="text-white text-2xl font-black tracking-tighter">
                V
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            className="text-center mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <h1 className="text-[22px] font-bold text-slate-800 tracking-tight">
              Welcome to VivaNexa
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-center text-slate-400 text-sm mb-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            Sign in to start your AI-powered interviews
          </motion.p>

          {/* Google Sign-In Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <motion.button
              onClick={handleGoogleAuth}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(0,0,0,0.06)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[15px] cursor-pointer transition-colors duration-200 hover:border-slate-300"
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-3 my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] text-slate-300 uppercase tracking-[0.15em] font-medium">
              Secure &amp; Private
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </motion.div>

          {/* Terms */}
          <motion.p
            className="text-center text-[11px] text-slate-400 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-orange-500 transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-orange-500 transition-colors"
            >
              Privacy Policy
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;
