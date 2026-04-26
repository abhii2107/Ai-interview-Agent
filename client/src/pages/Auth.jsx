import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import {
  RiMicLine,
  RiBrainLine,
  RiBarChartBoxLine,
  RiShieldCheckLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";

/* ── rotating words for the hero text ── */
const ROTATING_WORDS = [
  "Confidence",
  "Clarity",
  "Career",
  "Dream Job",
];

/* ── orbit items around the logo ── */
const ORBIT_ICONS = [
  { Icon: RiMicLine, color: "#f97316", angle: 0 },
  { Icon: RiBrainLine, color: "#8b5cf6", angle: 90 },
  { Icon: RiBarChartBoxLine, color: "#06b6d4", angle: 180 },
  { Icon: RiShieldCheckLine, color: "#10b981", angle: 270 },
];

function Auth() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length),
      2800
    );
    return () => clearInterval(timer);
  }, []);



  const handleGoogleAuth = async() => {
    try {
      // calling function from firebase.js popup window
      const response = await signInWithPopup(auth,provider);
      console.log(response)
    } catch (error) {
      console.log("Error in Google sign in",error)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex bg-[#FAF9F6] overflow-hidden font-['Inter',system-ui,sans-serif]">
      {/* ═══════════════════ LEFT VISUAL PANEL ═══════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        {/* Soft noise texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative mesh gradient circles */}
        <motion.div
          className="absolute w-72 h-72 rounded-full top-16 -left-20"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full -bottom-20 right-10"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── Central orbiting logo system ── */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Orbiting icons */}
          <div className="relative w-56 h-56 mb-12">
            {/* Outer orbit ring - static */}
            <div
              className="absolute rounded-full border border-white/[0.06]"
              style={{ inset: "-24px" }}
            />
            {/* Inner orbit ring - static */}
            <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.05]" />

            {/* Soft glow behind logo */}
            <motion.div
              className="absolute inset-0 m-auto w-32 h-32 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-500/25"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-white text-3xl font-black tracking-tighter">V</span>
              </motion.div>
            </div>

            {/* Orbiting items — positioned with inline calc, counter-rotated so icons stay upright */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            >
              {ORBIT_ICONS.map(({ Icon, color, angle }, i) => {
                const rad = (angle * Math.PI) / 180;
                const r = 100; // orbit radius in px
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm"
                    style={{
                      top: "50%",
                      left: "50%",
                      marginTop: "-20px",
                      marginLeft: "-20px",
                      transform: `translate(${x}px, ${y}px)`,
                      backgroundColor: `${color}18`,
                      border: `1px solid ${color}30`,
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon style={{ color }} className="text-lg" />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Left panel text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-center max-w-sm px-6"
          >
            <h2 className="text-white/90 text-3xl font-bold leading-tight mb-4">
              Your AI Interview
              <br />
              Coach, Always Ready
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Practice with intelligent AI that adapts to your skill level,
              provides instant feedback, and helps you land your dream role.
            </p>
          </motion.div>

          {/* Animated stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex gap-3 mt-10"
          >
            {[
              { value: "10K+", label: "Interviews" },
              { value: "95%", label: "Success Rate" },
              { value: "50+", label: "Topics" },
            ].map(({ value, label }, idx) => (
              <motion.div
                key={label}
                className="px-5 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.07] text-center"
                whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.08)" }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="text-white font-bold text-lg">{value}</div>
                <div className="text-white/30 text-xs mt-0.5">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-orange-500/30 rounded-tl-lg" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-cyan-500/30 rounded-br-lg" />
      </div>

      {/* ═══════════════════ RIGHT AUTH PANEL ═══════════════════ */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-12 relative">
        {/* Warm subtle gradient background for light side */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF9F6] via-[#FFF7ED] to-[#FAF9F6]" />

        {/* Decorative dots pattern */}
        <div
          className="absolute top-0 right-0 w-40 h-40 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1a1a2e 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Mobile-only logo (shown on small screens) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:hidden flex justify-center mb-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white text-2xl font-black tracking-tighter">V</span>
            </div>
          </motion.div>

          {/* Brand tag */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a1a2e]/40 tracking-widest uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              VivaNexa.ai
            </div>
          </motion.div>

          {/* Main heading with rotating word */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-4"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] leading-[1.15] tracking-tight">
              Interview with
              <br />
              AI. Unlock{" "}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 14, opacity: 0, filter: "blur(3px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -14, opacity: 0, filter: "blur(3px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent"
                  >
                    {ROTATING_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
                {/* Underline accent */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-[2.5px] rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                  animate={{ scaleX: [0, 1, 1, 0] }}
                  style={{ transformOrigin: "left" }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: [0.22, 1, 0.36, 1],
                    times: [0, 0.35, 0.65, 1],
                  }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-[#1a1a2e]/45 text-[15px] leading-relaxed mb-8 max-w-[320px]"
          >
            Sign in to start AI-powered mock interviews, track your
            progress, and get detailed performance insights.
          </motion.p>

          {/* Feature list with staggered animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="space-y-3 mb-10"
          >
            {[
              {
                icon: RiMicLine,
                text: "Real-time voice interviews",
                accent: "#f97316",
              },
              {
                icon: RiBrainLine,
                text: "Adaptive AI questioning",
                accent: "#8b5cf6",
              },
              {
                icon: RiBarChartBoxLine,
                text: "Instant performance analytics",
                accent: "#06b6d4",
              },
            ].map(({ icon: Icon, text, accent }, idx) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.6 + idx * 0.12,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="flex items-center gap-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${accent}12` }}
                >
                  <Icon style={{ color: accent }} className="text-sm" />
                </div>
                <span className="text-[#1a1a2e]/60 text-sm font-medium">
                  {text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Google sign-in button ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
          >
            <motion.button
              onClick={handleGoogleAuth}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              className="group w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#1a1a2e] text-white font-semibold text-[15px] cursor-pointer transition-all duration-300 hover:bg-[#242445] hover:shadow-xl hover:shadow-[#1a1a2e]/15 active:shadow-md"
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
              <motion.div
                className="ml-1"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <RiArrowRightLine className="text-white/50 text-sm" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="flex items-center gap-3 my-6"
          >
            <div className="flex-1 h-px bg-[#1a1a2e]/[0.06]" />
            <span className="text-[11px] text-[#1a1a2e]/20 uppercase tracking-widest font-medium">
              Secure &amp; Private
            </span>
            <div className="flex-1 h-px bg-[#1a1a2e]/[0.06]" />
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="text-center text-[12px] text-[#1a1a2e]/25 leading-relaxed"
          >
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-[#1a1a2e]/40 underline decoration-[#1a1a2e]/10 underline-offset-2 hover:text-orange-600 hover:decoration-orange-600/30 transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-[#1a1a2e]/40 underline decoration-[#1a1a2e]/10 underline-offset-2 hover:text-orange-600 hover:decoration-orange-600/30 transition-colors"
            >
              Privacy Policy
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
