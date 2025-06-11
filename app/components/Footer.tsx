"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-black text-white py-12"
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Image
              src="/admind-logo.png"
              alt="Admind"
              width={120}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="text-gray-300 max-w-sm">
              Creating stunning visuals with advanced AI technology. Transform your ideas into reality.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wide text-sm">Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-admind-turquoise transition-colors uppercase text-sm tracking-wide"
                >
                  AI Image Generation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-admind-turquoise transition-colors uppercase text-sm tracking-wide"
                >
                  Creative Solutions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-admind-turquoise transition-colors uppercase text-sm tracking-wide"
                >
                  Digital Innovation
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wide text-sm">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">hello@admindagency.com</p>
              <p className="text-sm">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 Admind Agency. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
