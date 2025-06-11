"use client"

import { motion } from "framer-motion"
import { ImageIcon, Home } from "lucide-react"
import Image from "next/image"

interface NavigationProps {
  currentSection: "hero" | "generator" | "editor"
  setCurrentSection: (section: "hero" | "generator" | "editor") => void
}

export default function Navigation({ currentSection, setCurrentSection }: NavigationProps) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center">
            <Image src="/admind-logo.png" alt="Admind" width={120} height={40} className="h-8 w-auto" />
          </motion.div>

          <div className="flex items-center space-x-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSection("hero")}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${
                currentSection === "hero" ? "text-admind-tangerine" : "text-black hover:text-admind-turquoise"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="uppercase tracking-wide text-sm group-hover:tracking-wider transition-all">HOME</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSection("generator")}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${
                currentSection === "generator" ? "text-admind-tangerine" : "text-black hover:text-admind-turquoise"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="uppercase tracking-wide text-sm group-hover:tracking-wider transition-all">
                GENERATE
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSection("editor")}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${
                currentSection === "editor" ? "text-admind-tangerine" : "text-black hover:text-admind-turquoise"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="uppercase tracking-wide text-sm group-hover:tracking-wider transition-all">
                EDIT IMAGE
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
