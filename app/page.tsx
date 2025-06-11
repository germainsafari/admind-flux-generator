"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import HeroSection from "./components/HeroSection"
import ImageGenerator from "./components/ImageGenerator"
import ImageGeneratorBackground from "./components/ImageGeneratorBackground"
import ImageEditor from "./components/ImageEditor"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"

export default function Home() {
  const [currentSection, setCurrentSection] = useState<"hero" | "generator" | "editor">("hero")

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentSection={currentSection} setCurrentSection={setCurrentSection} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        {currentSection === "hero" && <HeroSection onGetStarted={() => setCurrentSection("generator")} />}
        {currentSection === "generator" && <ImageGenerator />}
        {currentSection === "editor" && <ImageEditor />}
      </motion.div>

      <Footer />
    </div>
  )
}
