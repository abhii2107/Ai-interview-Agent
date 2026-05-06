import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { setUserData } from './redux/userSlice'
import { useDispatch } from 'react-redux'
import InterviewPage from './pages/InterviewPage'

export const serverUrl = "http://localhost:8000"


function App() {
  const dispatch = useDispatch()
  // jaise hi app ke andar aaye toh hume uyser chahiye that is why we use UseEffect
useEffect(() => {
  const getUser = async () => {
    try {
      const { data } = await axios.get(
        serverUrl + "/api/user/current-user",
        { withCredentials: true }
      )

      dispatch(setUserData(data))
    } catch (error) {
      console.log(error)
      dispatch(setUserData(null))
    }
  }

  getUser()
}, [])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path = "/interview" element={<InterviewPage/>}/>
    </Routes>
  )
}

export default App
