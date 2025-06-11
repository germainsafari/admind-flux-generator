"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, ArrowRight } from "lucide-react"

export default function ImageGeneratorBackground() {
  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null)

  const handleSubmitForBackground = async () => {
    if (!prompt.trim()) return

    setIsSubmitting(true)
    setSubmissionMessage(null)

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
        setSubmissionMessage("Image generation request submitted successfully! You can close this window.")
        setPrompt("") // Clear prompt after submission
      } else {
        setSubmissionMessage("Failed to submit image generation request. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting background image generation:", error)
      setSubmissionMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
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
              Background Generator
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-admind-tangerine"></div>
            </span>
          </h1>
          <p className="text-xl text-admind-gray-01 max-w-2xl mx-auto">
            Submit your image generation request to run in the background
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Card className="p-8 bg-white border-2 border-admind-gray-03 shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="block text-black font-bold mb-3 uppercase tracking-wide text-sm">
                  Describe your image
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic city at sunset, highly detailed, cyberpunk style..."
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
                onClick={handleSubmitForBackground}
                disabled={!prompt.trim() || isSubmitting}
                className="group w-full bg-admind-tangerine hover:bg-admind-tangerine/90 text-white py-4 rounded-lg font-bold uppercase tracking-wide"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Submit for Background Generation
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              {submissionMessage && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center text-sm font-medium ${
                    submissionMessage.includes("successfully") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {submissionMessage}
                </motion.p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 