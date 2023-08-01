import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Authentication() {
  const navigate = useNavigate()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showLogIn, setShowLogIn] = useState(false)
  return (
    <div>
      <button onClick={()=> navigate("auth/signin")}>Sign in</button>
      <button onClick={()=> navigate("auth/signup")}>Register</button>
      
    </div>
  )
}
