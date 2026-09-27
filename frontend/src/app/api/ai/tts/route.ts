import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, language = "en" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // 1. Try local or Ngrok backend TTS endpoint
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://election-lushness-pointed.ngrok-free.dev";

    try {
      const response = await fetch(`${backendUrl}/api/ai/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ text, language }),
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        if (audioBuffer && audioBuffer.byteLength > 100) {
          return new Response(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": audioBuffer.byteLength.toString(),
            },
          });
        }
      }
    } catch (err) {
      console.warn("Backend TTS proxy failed, delegating to client-side synthesis:", err);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
