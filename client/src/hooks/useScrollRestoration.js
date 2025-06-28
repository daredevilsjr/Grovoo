import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const scrollPositions = {}

const useScrollRestoration = () => {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname

    // Restore scroll position
    if (scrollPositions[path]) {
      window.scrollTo(0, scrollPositions[path])
    }

    const handleScroll = () => {
      scrollPositions[path] = window.scrollY
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [location])
}

export default useScrollRestoration
