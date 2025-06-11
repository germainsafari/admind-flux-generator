"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, Wand2, Upload, ArrowRight, Download, History, GitBranch } from "lucide-react"
import Image from "next/image"

interface EditNode {
  id: string
  image: string
  prompt: string | null
  children: EditNode[]
  parentId: string | null
}

export default function ImageEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [editPrompt, setEditPrompt] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editHistory, setEditHistory] = useState<EditNode[]>([])
  const [currentEditId, setCurrentEditId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [lastGeneratedVariations, setLastGeneratedVariations] = useState<EditNode[]>([])

  // Helper function to find a node by ID
  const findNodeById = (nodes: EditNode[], id: string | null): EditNode | null => {
    if (!id) return null;
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      const foundInChildren = findNodeById(node.children, id);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result as string
        setOriginalImage(base64Image)
        // Initialize edit history with the original image
        setEditHistory([{
          id: "root",
          image: base64Image,
          prompt: null,
          children: [],
          parentId: null
        }])
        setCurrentEditId("root")
        setLastGeneratedVariations([]); // Clear variations on new upload
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = async () => {
    if (!originalImage || !editPrompt.trim()) {
      setError("Please upload an image and enter an edit prompt.")
      return
    }

    setIsEditing(true)
    setError(null)

    try {
      const currentImageNode = findNodeById(editHistory, currentEditId);
      if (!currentImageNode) {
        setError("Could not find the current image to edit.");
        setIsEditing(false);
        return;
      }
      const imageToEdit = currentImageNode.image;

      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageToEdit, // Use the image from the current edit node
          prompt: editPrompt,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newEditId = `edit-${Date.now()}`
        
        // Create exactly 2 edit nodes
        const newEdits = data.editedImageUrls.map((url: string, index: number) => ({
          id: `${newEditId}-${index}`,
          image: url,
          prompt: editPrompt,
          children: [],
          parentId: currentEditId
        }))

        // Update edit history
        setEditHistory(prev => {
          const updateNode = (nodes: EditNode[]): EditNode[] => {
            return nodes.map(node => {
              if (node.id === currentEditId) {
                return { ...node, children: [...node.children, ...newEdits] }
              }
              if (node.children.length > 0) {
                return { ...node, children: updateNode(node.children) }
              }
              return node
            })
          }
          return updateNode(prev)
        })

        setLastGeneratedVariations(newEdits); // Set the newly generated variations for display
        setEditPrompt("")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to edit image. Please try again.")
      }
    } catch (err) {
      console.error("Error editing image:", err)
      setError("An unexpected error occurred.")
    } finally {
      setIsEditing(false)
    }
  }

  const handleBranch = (editId: string) => {
    setCurrentEditId(editId)
    setShowHistory(false)
  }

  const handleDownload = async (imageUrl: string) => {
    try {
      if (imageUrl.startsWith("data:")) {
        // If it's a data URL, directly create a link and click it
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = `edited-image-${Date.now()}.jpeg` // Ensure correct extension
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // If it's a remote URL, use the proxy API to download
        const proxyUrl = `/api/download-image?imageUrl=${encodeURIComponent(imageUrl)}`;
        const a = document.createElement('a');
        a.href = proxyUrl;
        a.download = `edited-image-${Date.now()}.jpeg`; // Suggest a filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("Error downloading image:", err)
      setError("Failed to download image")
    }
  }

  const handleSelectVariation = (editId: string) => {
    setCurrentEditId(editId);
    setLastGeneratedVariations([]); // Clear variations display
    setShowHistory(false);
  };

  const renderEditHistory = (nodes: EditNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBranch(node.id)}
            className={`${node.id === currentEditId ? 'bg-admind-tangerine text-white' : ''}`}
          >
            {node.prompt || 'Original Image'}
          </Button>
          {node.children.length > 0 && (
            <GitBranch className="w-4 h-4 text-admind-gray-02" />
          )}
        </div>
        {node.children.length > 0 && (
          <div className="pl-4 border-l-2 border-admind-gray-03">
            {renderEditHistory(node.children, level + 1)}
          </div>
        )}
      </div>
    ))
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
              Editor
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-admind-tangerine"></div>
            </span>
          </h1>
          <p className="text-xl text-admind-gray-01 max-w-2xl mx-auto">
            Upload an image and use text prompts to transform it
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-white border-2 border-admind-gray-03 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-black font-bold mb-3 uppercase tracking-wide text-sm">
                    Upload Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-admind-gray-03 border-dashed rounded-lg cursor-pointer bg-admind-gray-04 hover:bg-admind-gray-05"
                    >
                      {originalImage ? (
                        <Image src={originalImage} alt="Original" width={200} height={200} className="object-contain max-h-44" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-admind-gray-02" />
                          <p className="mb-2 text-sm text-admind-gray-02">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-admind-gray-03">SVG, PNG, JPG, or GIF</p>
                        </div>
                      )}
                      <input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-black font-bold mb-3 uppercase tracking-wide text-sm">
                    Edit Prompt
                  </label>
                  <Textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Add neon lights and make it rainy..."
                    className="min-h-32 bg-white border-2 border-admind-gray-03 text-black placeholder:text-admind-gray-02 resize-none focus:border-admind-turquoise"
                  />
                </div>

                <Button
                  onClick={handleEdit}
                  disabled={!originalImage || !editPrompt.trim() || isEditing}
                  className="group w-full bg-admind-tangerine hover:bg-admind-tangerine/90 text-white py-4 rounded-lg font-bold uppercase tracking-wide"
                  size="lg"
                >
                  {isEditing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Editing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Edit Image
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm font-medium text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="p-8 bg-white border-2 border-admind-gray-03 shadow-lg h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Edit History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="w-5 h-5 mr-2" />
                  {showHistory ? "Hide History" : "Show History"}
                </Button>
              </div>

              {showHistory ? (
                <div className="space-y-4">
                  {renderEditHistory(editHistory)}
                </div>
              ) : (
                // Display logic for variations or selected image
                lastGeneratedVariations.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {lastGeneratedVariations.map((edit) => (
                      <div key={edit.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-admind-gray-03 group">
                        <Image
                          src={edit.image}
                          alt={`Variation ${edit.id.split('-').pop()}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-admind-tangerine"
                            onClick={() => handleDownload(edit.image)}
                          >
                            <Download className="w-5 h-5 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-admind-turquoise"
                            onClick={() => handleSelectVariation(edit.id)}
                          >
                            <Wand2 className="w-5 h-5 mr-2" />
                            Select for Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Display the currently selected image if no new variations are generated
                  currentEditId && findNodeById(editHistory, currentEditId)?.image ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-admind-gray-03">
                      <Image
                        src={findNodeById(editHistory, currentEditId).image}
                        alt="Currently selected image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    // Default empty state
                    <div className="flex items-center justify-center h-full min-h-96">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-admind-turquoise/10 rounded-lg flex items-center justify-center mx-auto">
                          <Wand2 className="w-8 h-8 text-admind-turquoise" />
                        </div>
                        <p className="text-admind-gray-02 font-medium">Your edited images will appear here</p>
                      </div>
                    </div>
                  )
                )
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 