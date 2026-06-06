import React, { useEffect, useRef, useState } from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer';
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';





function Step2Interview({ interviewData, onFinish = () => {} }) {

  const { interviewId, questions, userName } = interviewData;
  const [introPhase, setIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const micEnabledRef = useRef(true);
  const aiPlayingRef = useRef(false);
  const manualStopRef = useRef(false);
  const [isAiPlaying, setIsAiPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0); // this currentIndex will beused to find the current question
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    micEnabledRef.current = isMicOn;
  }, [isMicOn])

  const currentQuestion = questions[currentIndex];

  /*  ----------- Voice Initialization ----------- */
  useEffect(() => {
    const loadvoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) {
        return
      }

      // try known female voices first

      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      )

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // try known male voice
      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      )

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      //  Fallback: First voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    }

    loadvoices();
    window.speechSynthesis.onvoiceschanged = loadvoices;
  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  /* -------------- SPEAK FUNCTION -------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // stop any ongoing speech

      // Add natural pauses after commas and periods

      const humanText = text.replace(/,/g, ", ...").replace(/\./g, ". ...");

      const utterance = new SpeechSynthesisUtterance(humanText); // create speechSynthesisUtterance object

      if (selectedVoice) {
        utterance.voice = selectedVoice; // set the selected voice
      }

      // Human- like pacing
      utterance.rate = 0.9; // slightly slower than normal
      utterance.pitch = 1.05; // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        aiPlayingRef.current = true;
        setIsAiPlaying(true);
        stopMic({ manual: false }); // stop mic when AI starts speaking
        videoRef.current?.play();
      };

      utterance.onerror = (err) => {
        console.error('SpeechSynthesisUtterance error:', err);
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0; // vdeo reset to start
        aiPlayingRef.current = false;
        setIsAiPlaying(false);

        if (micEnabledRef.current) {
          startMic(); // restart mic when AI finishes speaking
        }

        setTimeout(() => {
          setSubtitle(""); // clear subtitle after 300 mili seconds
          resolve();

        }, 300)

      }

      setSubtitle(text); // show subtitle when speech starts

      window.speechSynthesis.speak(utterance); // start speaking


    })
  }

  useEffect(() => {
    const runIntro = async () => {
      if (introPhase) {
        await speakText(
          `Hello ${userName}, It's great to meet you. I am your AI interviewer for today. I will be asking you a series of questions related to the ${interviewData.role} role. Let's start the interview and all the best!`
        )
        setIntroPhase(false);
      }
      else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800)); // small delay before question

        if (currentIndex === questions.length - 1) {
          await speakText(
            "Alright, this one might be a bit more challenging. But give it your best shot!"
          )
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic(); // start mic when question is done speaking
        }

      }
    }
    runIntro();

  }, [introPhase, currentIndex, currentQuestion, selectedVoice])




  useEffect(() => {
    if (introPhase) return;

    if (!currentQuestion) {
      return
    }

    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      })
    }, 1000)

    return () => clearInterval(timer);
  }, [introPhase, currentIndex, isSubmitting])


  //  voice ko text mein change karvaenge

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));

    }

    recognition.onend = () => {
      if (manualStopRef.current || !micEnabledRef.current || aiPlayingRef.current) {
        manualStopRef.current = false;
        return;
      }

      setTimeout(() => {
        startMic();
      }, 200);
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    }

    recognitionRef.current = recognition;

  }, [])


  const startMic = () => {
    if (!recognitionRef.current || aiPlayingRef.current || !micEnabledRef.current) {
      return;
    }

    manualStopRef.current = false;

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.warn('Failed to start speech recognition:', error);
    }
  }

  const stopMic = ({ manual = true } = {}) => {
    if (!recognitionRef.current) {
      return;
    }

    if (manual) {
      manualStopRef.current = true;
    }

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.warn('Failed to stop speech recognition:', error);
    }
  }



  const toggleMic = () => {
    if (isMicOn) {
      micEnabledRef.current = false;
      stopMic();
    }
    else {
      micEnabledRef.current = true;
      startMic();
    }
    setIsMicOn(!isMicOn);
  }


  const submitAnswer = async ({ autoAdvance = false } = {}) => {
    if (isSubmitting) return;

    stopMic();

    setIsSubmitting(true);

    try {
      const result = await axios.post(serverUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken: currentQuestion.timeLimit - timeLeft,
      }, { withCredentials: true })
      setFeedback(result.data.feedback);
      await speakText(result.data.feedback);

      if (autoAdvance) {
        await handleNext();
      }

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  const handleNext = async () => {
    try {
      setAnswer("");
      setFeedback("");

      if (currentIndex + 1 >= questions.length) {
        finishInterview();
        return;
      }

      await speakText("Alright, Move to the next question")

      setCurrentIndex(prev => {
        const next = prev + 1;
        setTimeLeft(questions[next]?.timeLimit || 60);
        return next;
      });

      setTimeout(() => {
        if (isMicOn) {
          startMic();
        }
      }, 500)


    } catch (error) {
      console.log(error);
    }
  }


  const finishInterview = async (params) => {

    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(serverUrl + "/api/interview/finish", {
        interviewId,

      },{withCredentials:true})

      console.log(result.data);
      onFinish(result.data); // pass the result data to parent component (interview page) so that it can show the final result and analysis
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    if(introPhase) return;
    if(!currentQuestion) return;
    // user ka time khatam ho gaya and usne submit bhi nahi kiya toh hum answer ko submit kar denge and feedback de denge
    if(timeLeft === 0 && !isSubmitting && !feedback){
      submitAnswer({ autoAdvance: true });
    }

  },[timeLeft])


  useEffect(() => {
    return () => {
      if(recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      if (window && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [])







  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex-items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>
        {/* video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shoadow-xl'>
            <video src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              autoPlay
              playsInline
              preload='auto'
              className='w-full h-auto object-cover'
            />
          </div>

          {/* subtitle */}

          {subtitle && (
            <div className='w-full max-w-md bg-gray-50 border border-gray-20 rounded-xl shadow-sm'>
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>
                {subtitle}
              </p>

            </div>
          )}


          {/* timer area */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>

              </span>
              {isAiPlaying &&
                <span className="text-sm font-semibold text-emarald-600">
                  {isAiPlaying ? "AI Speaking" : ""}
                </span>
              }
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='flex justify-center'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                <span className='text-xs text-gray-400'>Current Questions</span>
              </div>

              <div>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-xs text-gray-400'>Total Questions</span>
              </div>

            </div>


          </div>

        </div>
        {/* Text -section */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>

          <h2 className='text-xl sm:text-2xl font-bold text-emarald-600 mb-6'>
            AI Smart Interview
          </h2>
          {!introPhase
            &&
            (<div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className='text-xs sm:text-sm text-gray-400 mb-2'>
                Question {currentIndex + 1} of {questions.length}
              </p>

              <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed'>
                {currentQuestion?.question}
              </div>

            </div>
            )
          }

          <textarea placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-gray-200 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition text-gray-700" />

          {!feedback ? (<div className='flex items-center gap-4 mt-6'>
            <motion.button
              onClick={toggleMic}
              whileTap={{ scale: 0.95 }}
              className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'>
              {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}

            </motion.button>

            <motion.button
              onClick={submitAnswer}
              disabled={isSubmitting || introPhase || isAiPlaying}
              whileTap={{ scale: 0.95 }}
              className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed'>
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </motion.button>
          </div>) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}

              className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm'>
              <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>

              <button
                onClick={handleNext}
                className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition font-semibold flex items-center justify-center gap-1'>
                Next Question <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Step2Interview
