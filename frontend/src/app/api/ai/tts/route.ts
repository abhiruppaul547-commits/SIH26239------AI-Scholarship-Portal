import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, language = "en" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Clean markdown, symbols, URLs, and excessive spaces for smooth speech synthesis
    const cleanText = text
      .replace(/[*#_~`>\[\]]/g, " ")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 400);

    if (!cleanText) {
      return new Response(null, { status: 204 });
    }

    // 1. Primary: Try local or Ngrok backend TTS endpoint (Python gTTS service)
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
        body: JSON.stringify({ text: cleanText, language }),
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
    } catch {
      // Backend tunnel down or not responding, seamlessly cascade to cloud regional TTS
    }

    // 2. High-Fidelity Standalone Regional Voice Engine (Native gTTS with regional accents)
    // - English: Indian English regional accent (co.in)
    // - Hindi: Native Indian Hindi accent
    // - Bengali: Native Bengali accent
    // - Assamese: Native Eastern Indic accent
    // - Santhali: Native Indic phonetics
    const langMap: Record<string, { tl: string; tld?: string }> = {
      en: { tl: "en", tld: "co.in" },
      hi: { tl: "hi" },
      bn: { tl: "bn" },
      as: { tl: "bn" },
      sat: { tl: "hi" },
    };

    const conf = langMap[language] || { tl: "en", tld: "co.in" };
    let gttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText
    )}&tl=${conf.tl}&client=tw-ob`;
    if (conf.tld) {
      gttsUrl += `&tld=${conf.tld}`;
    }

    try {
      const gttsRes = await fetch(gttsUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
      });

      if (gttsRes.ok) {
        const audioBuffer = await gttsRes.arrayBuffer();
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
    } catch (gttsErr) {
      console.warn("Direct gTTS generation warning:", gttsErr);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
