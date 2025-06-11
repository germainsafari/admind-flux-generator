"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, Share2, Wand2, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedImage(data.imageUrl)
      }
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-black mb-4">
            AI Image{" "}
            <span className="relative">
              Generator
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-admind-tangerine"></div>
            </span>
          </h1>
          <p className="text-xl text-admind-gray-01 max-w-2xl mx-auto">
            Describe your vision and watch it come to life with cutting-edge AI technology
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-white border-2 border-admind-gray-03 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-black font-bold mb-3 uppercase tracking-wide text-sm">
                    Describe your image
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A majestic dragon soaring through a starlit sky, digital art style..."
                    className="min-h-32 bg-white border-2 border-admind-gray-03 text-black placeholder:text-admind-gray-02 resize-none focus:border-admind-turquoise"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-3 uppercase tracking-wide text-sm">
                    Aspect Ratio
                  </label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="bg-white border-2 border-admind-gray-03 text-black focus:border-admind-turquoise">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">Square (1:1)</SelectItem>
                      <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                      <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                      <SelectItem value="4:3">Standard (4:3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="group w-full bg-admind-tangerine hover:bg-admind-tangerine/90 text-white py-4 rounded-lg font-bold uppercase tracking-wide"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Image
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 bg-white border-2 border-admind-gray-03 shadow-lg h-full">
              {generatedImage ? (
                <div className="space-y-6">
                  <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-admind-gray-03">
                    <Image
                      src={generatedImage || "/placeholder.svg"}
                      alt="Generated image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="group flex-1 border-2 border-admind-turquoise text-admind-turquoise hover:bg-admind-turquoise hover:text-white font-bold uppercase tracking-wide"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      className="group flex-1 border-2 border-admind-turquoise text-admind-turquoise hover:bg-admind-turquoise hover:text-white font-bold uppercase tracking-wide"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-96">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-admind-turquoise/10 rounded-lg flex items-center justify-center mx-auto">
                      <Wand2 className="w-8 h-8 text-admind-turquoise" />
                    </div>
                    <p className="text-admind-gray-02 font-medium">Your generated image will appear here</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
