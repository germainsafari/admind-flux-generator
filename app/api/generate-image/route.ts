import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    if (!process.env.FLUX_API_KEY) {
      return NextResponse.json({ error: "Missing Flux API key." }, { status: 500 })
    }

    const response = await fetch("https://fal.run/fal-ai/flux/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_size: getImageSize(aspectRatio),
        num_inference_steps: 28,
        guidance_scale: 3.5,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Flux API error:", errorData)
      throw new Error(errorData.detail || "Failed to generate image with Flux API")
    }

    const data = await response.json()

    return NextResponse.json({
      imageUrl: data.images?.[0]?.url ?? "/placeholder.svg?height=512&width=512",
      success: true,
    })
  } catch (error: any) {
    console.error("Error generating image:", error)

    // For fallback, return a placeholder
    return NextResponse.json({
      imageUrl: "/placeholder.svg?height=512&width=512",
      success: false,
      error: error.message || "Image generation failed.",
    })
  }
}

function getImageSize(aspectRatio: string) {
  switch (aspectRatio) {
    case "16:9":
      return "landscape_16_9"
    case "9:16":
      return "portrait_9_16"
    case "4:3":
      return "landscape_4_3"
    default:
      return "square"
  }
}
