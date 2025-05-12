"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"

export default function GoingUpBtn() {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Button
      aria-label="Volver al inicio"
      onClick={handleClick}
      className={`fixed bottom-25 right-4 z-50 transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp size={16} />
    </Button>
  )
}
