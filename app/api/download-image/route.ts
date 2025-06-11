import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get("imageUrl");

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch image from external URL:", response.status, errorText);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("Content-Type");
    const contentDisposition = response.headers.get("Content-Disposition");

    const headers = new Headers();
    if (contentType) {
      headers.set("Content-Type", contentType);
    }
    if (contentDisposition) {
      headers.set("Content-Disposition", contentDisposition);
    } else {
      // Fallback for filename if Content-Disposition is not present
      const filename = imageUrl.split("/").pop()?.split("?")[0] || "download.jpeg";
      headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    }

    return new NextResponse(response.body, { status: response.status, headers });
  } catch (error: any) {
    console.error("Error in download proxy API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
} 