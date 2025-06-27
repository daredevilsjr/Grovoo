"use client"

import { useEffect } from "react"
import { useAuthStore } from "../store/useStore"

const AuthProvider = ({ children }) => {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return <>{children}</>
}

export default AuthProvider
