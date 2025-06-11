"use client"

import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Palette, Sparkles } from "lucide-react"

interface HeroSectionProps {
  onGetStarted: () => void
}

function AnimatedSphere() {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial color="#29D9C2" attach="material" distort={0.3} speed={1.5} roughness={0} />
    </Sphere>
  )
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="inline-flex items-center space-x-2 bg-admind-beige text-black px-4 py-2 rounded-full text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 text-admind-tangerine" />
                <span className="uppercase tracking-wide">Powered by Flux AI</span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold text-black leading-tight">
                Create{" "}
                <span className="relative">
                  Stunning
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-admind-tangerine"></div>
                </span>{" "}
                Images
              </h1>

              <p className="text-xl text-admind-gray-01 leading-relaxed max-w-lg">
                Transform your ideas into breathtaking visuals with Admind's advanced AI image generation platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-admind-turquoise/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-admind-turquoise" />
                </div>
                <span className="text-black font-medium">Lightning Fast</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-admind-tangerine/10 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-admind-tangerine" />
                </div>
                <span className="text-black font-medium">High Quality</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                onClick={onGetStarted}
                className="group bg-admind-tangerine hover:bg-admind-tangerine/90 text-white px-8 py-4 text-lg rounded-lg font-medium uppercase tracking-wide"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-96 lg:h-[500px]"
          >
            <Canvas>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <AnimatedSphere />
              <Environment preset="studio" />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
