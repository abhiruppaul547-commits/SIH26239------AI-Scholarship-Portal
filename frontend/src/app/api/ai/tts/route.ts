import { NextResponse } from "next/server";

function cleanTextForSpeech(text: string): string {
  return text
    // Remove code blocks and LaTeX expressions
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$]+\$/g, " ")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 over $2")
    .replace(/\\[a-zA-Z]+/g, " ")
    .replace(/[{}\\^=_~`*#]/g, " ")
    // Remove markdown links & formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Convert common acronyms to natural spoken sounds
    .replace(/MoTA/g, "Ministry of Tribal Affairs")
    .replace(/\bST\b/g, "S T")
    .replace(/\bPDEs?\b/g, "P D E")
    .replace(/\bODEs?\b/g, "O D E")
    .replace(/\bDBT\b/g, "Direct Benefit Transfer")
    .replace(/\bOCR\b/g, "O C R")
    .replace(/\bIITs?\b/g, "I I T")
    .replace(/\bNITs?\b/g, "N I T")
    .replace(/\bAIIMS\b/g, "AIIMS")
    .replace(/\bNEET\b/g, "NEET")
    .replace(/\bJEE\b/g, "J E E")
    .replace(/\bUPSC\b/g, "U P S C")
    .replace(/₹/g, "Rupees ")
    .replace(/≤/g, "less than or equal to ")
    .replace(/≥/g, "greater than or equal to ")
    // Remove emojis and UI bullets
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[•\-\|]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoSpeechChunks(text: string, maxLen = 110): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + " " + trimmed).trim().length <= maxLen) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length > maxLen) {
        const parts = trimmed.split(/,\s*/);
        for (const p of parts) {
          if ((current + " " + p).trim().length <= maxLen) {
            current = (current + " " + p).trim();
          } else {
            if (current) chunks.push(current);
            current = p;
          }
        }
      } else {
        current = trimmed;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.slice(0, 6); // Max 6 chunks for fast playback
}

export async function POST(req: Request) {
  try {
    const { text, language = "en" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cleanText = cleanTextForSpeech(text).slice(0, 500);

    if (!cleanText) {
      return new Response(null, { status: 204 });
    }

    // 1. Primary: Try local or Ngrok backend TTS endpoint if live
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
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        if (audioBuffer && audioBuffer.byteLength > 100) {
          return new Response(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": audioBuffer.byteLength.toString(),
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
      }
    } catch {
      // Backend tunnel down or timed out, continue to high-fidelity regional gTTS
    }

    // 2. High-Fidelity Standalone Regional Voice Engine with Authentic Indian Pronunciation
    // Crucial: Hitting translate.google.co.in ensures genuine Indian regional phonetics and en-IN accent
    const langMap: Record<string, { tl: string; domain: string }> = {
      en: { tl: "en", domain: "translate.google.co.in" }, // Indian English (en-IN)
      hi: { tl: "hi", domain: "translate.google.co.in" }, // Native Hindi (hi-IN)
      bn: { tl: "bn", domain: "translate.google.co.in" }, // Native Bengali (bn-IN)
      as: { tl: "bn", domain: "translate.google.co.in" }, // Eastern Indic accent
      sat: { tl: "hi", domain: "translate.google.co.in" }, // Native Indic phonetics
    };

    const conf = langMap[language] || { tl: "en", domain: "translate.google.co.in" };
    const chunks = splitIntoSpeechChunks(cleanText);

    try {
      const audioBuffers = await Promise.all(
        chunks.map(async (chunk) => {
          const url = `https://${conf.domain}/translate_tts?ie=UTF-8&q=${encodeURIComponent(
            chunk
          )}&tl=${conf.tl}&client=tw-ob`;

          const res = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Referer: `https://${conf.domain}/`,
            },
            signal: AbortSignal.timeout(6000),
          });

          if (!res.ok) {
            throw new Error(`Google TTS responded with ${res.status}`);
          }
          return await res.arrayBuffer();
        })
      );

      if (audioBuffers.length > 0) {
        const combined = Buffer.concat(audioBuffers.map((b) => Buffer.from(b)));
        if (combined.byteLength > 100) {
          return new Response(combined, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": combined.byteLength.toString(),
              "Cache-Control": "public, max-age=86400",
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
