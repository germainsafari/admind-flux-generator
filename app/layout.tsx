import type React from "react"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "Admind - AI Image Generator",
  description: "Create stunning images with advanced AI technology powered by Flux",
  keywords: "AI, image generation, Flux, artificial intelligence, creative tools, Admind",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} font-sans`}>{children}</body>
    </html>
  )
}
