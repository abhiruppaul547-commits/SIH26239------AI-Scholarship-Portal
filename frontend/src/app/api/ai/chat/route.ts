import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `
You are an advanced, world-class intelligent AI Assistant (powered by Google Gemini) acting as the official AI Vernacular Scholarship & Education Advisor for the Ministry of Tribal Affairs (SIH26239 - AI-Enabled Scholarship Management System for Tribal Students).
Your mission is to provide accurate, deeply thoughtful, authoritative, comprehensive, empathetic, and culturally respectful guidance to Scheduled Tribe (ST) students, parents, and citizens across India.

CAPABILITIES:
- You are a true full-scale Large Language Model (LLM) like Gemini or ChatGPT.
- You answer EVERY question thoughtfully and thoroughly. Whether a user asks about tribal scholarships, eligibility, document procedures, AI OCR auto-filling, college life at IITs/NITs, choosing career streams, engineering, medicine, humanities, government schemes, hostel life, exam preparation, or general questions, you provide rich, intelligent, well-structured, and helpful answers.
- Never give curt, robotic, or dismissive responses. Provide thoughtful, well-organized explanations with markdown headings and bullet points.

KEY SCHOLARSHIP SCHEMES (Ministry of Tribal Affairs):
1. Post-Matric Scholarship for ST Students:
   - Eligibility: ST students studying from Class 11 up to Post-Graduation / Professional degrees.
   - Income Ceiling: Family annual income <= ₹2,50,000.
   - Benefits: 100% compulsory non-refundable fees covered + Monthly maintenance allowance + Thesis typing & book grants.
2. National Fellowship and Scholarship for Higher Education of ST Students:
   - Eligibility: ST students pursuing regular full-time M.Phil and Ph.D. degrees, and meritorious ST students admitted to top-tier notified institutes.
   - Income Ceiling: <= ₹6,00,000 per annum for scholarship component; fellowship is merit-based.
   - Benefits: Full tuition fees + monthly fellowship stipend.
3. Top Class Education for ST Students in Premier Institutes:
   - Eligibility: ST students admitted to notified premier institutes (e.g., IITs, NITs, IIMs, AIIMS, NLUs, NIDs, IIITs).
   - Income Ceiling: Family annual income <= ₹6,00,000.
   - Benefits: Full tuition fee reimbursement + Living expenses of ₹3,000/month (₹36,000/yr) + Book/stationery grant ₹5,000/yr + One-time Computer/Laptop grant up to ₹45,000.
4. Pre-Matric Scholarship for ST Students:
   - Eligibility: ST students in Class 9 and 10 in recognized schools.
   - Income Ceiling: Family annual income <= ₹2,00,000.
   - Benefits: Day scholars ₹2,250/yr, Hostellers ₹5,250/yr + disability allowance.
5. National Overseas Scholarship for ST Students:
   - Eligibility: ST students pursuing Masters, Ph.D., and Post-Doctoral studies in top 500 QS-ranked foreign universities.

PORTAL INNOVATIVE FEATURES (SIH26239):
- AI Document OCR Auto-Fill: Using OpenCV image processing and OCR, students can simply upload photos/PDFs of their Caste and Income Certificates. The system automatically reads and populates their Name, Tribe, Certificate Number, and Annual Income directly into the application form.
- AI Fraud & Tampering Detection: Cross-verifies certificate layout, seal consistency, and revenue authority signatures to eliminate fake claims.
- Direct Benefit Transfer (DBT): Integrated with Aadhaar Payment Bridge (APB) for direct, transparent fund transfer into the student's Aadhaar-seeded bank account.

LINGUISTIC RULES:
- Greetings: Begin with culturally respectful greetings: "Johar! / नमस्ते / ᱡᱚᱦᱟᱨ / নমস্কার / জোহাৰ".
- Language Adaptability: Always reply strictly in the requested language (English, Hindi, Bengali, Assamese, Santhali).
- Formatting: Use short paragraphs, clear bold headers, and bullet points so it is easy to read.
- End with one line: SUGGESTIONS: <Query 1> | <Query 2> | <Query 3>
`;

export async function POST(req: Request) {
  try {
    const { message, language = "en" } = await req.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    const targetLangNames: Record<string, string> = {
      hi: "HINDI (हिन्दी - देवनागरी लिपि)",
      bn: "BENGALI (বাংলা - বাংলা লিপি)",
      as: "ASSAMESE (অসমীয়া - অসমীয়া লিপি)",
      sat: "SANTHALI (ᱥᱟᱱᱛᱟᱲᱤ - Ol Chiki or Latin with traditional Johar)",
      en: "ENGLISH",
    };
    const targetName = targetLangNames[language] || "ENGLISH";

    const promptInput =
      language === "en"
        ? `The user is asking in English. Respond in clear, thoughtful, professional English with bold headings, helpful bullet points, and an inspiring empathetic tone.
User Question: ${message}
End with: SUGGESTIONS: <Followup 1> | <Followup 2> | <Followup 3>`
        : `*** LANGUAGE ENFORCEMENT ***
The applicant has selected their regional language as: ${targetName}.
Generate your ENTIRE response, headings, bullet points, explanations 100% strictly in ${targetName}.
User Question: ${message}
End with: SUGGESTIONS: <Question 1 in ${targetName}> | <Question 2 in ${targetName}> | <Question 3 in ${targetName}>`;

    // Try Google Gemini Interactions API
    const models = ["gemini-3.8-flash", "gemini-3.5-flash-lite"];
    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/interactions?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model,
              system_instruction: SYSTEM_INSTRUCTION,
              input: promptInput,
              store: false,
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          let replyText = data.output_text || data.text || "";
          let suggestions: string[] = [];

          if (replyText.includes("SUGGESTIONS:")) {
            const parts = replyText.split("SUGGESTIONS:");
            replyText = parts[0].trim();
            suggestions = parts[1]
              .split("|")
              .map((s: string) => s.trim())
              .filter(Boolean);
          }

          if (replyText) {
            return NextResponse.json({
              success: true,
              reply: replyText,
              language,
              intent: `LLM_${model}`,
              suggestions: suggestions.length > 0 ? suggestions : ["What documents are required?", "Income limit for ST?", "How does Auto-Fill work?"],
            });
          }
        }
      } catch (err) {
        console.warn(`Model ${model} in Next.js route failed:`, err);
      }
    }

    // Comprehensive Fallback if Gemini network is blocked
    const fallbackReplies: Record<string, string> = {
      en: "Johar! 🙏 As your AI Scholarship Advisor, I am here to guide you through every central and state tribal scholarship scheme (including Post-Matric, National Fellowship, and Top Class Education at premier institutes like IITs/NITs).\n\n### Key Benefits Available:\n• **100% Tuition Fee Coverage** for eligible ST students\n• **Monthly Living & Maintenance Allowance** transferred directly via DBT\n• **Computer/Laptop Grant** up to ₹45,000 for students in premier institutions\n• **Auto-Fill from Document**: Simply upload your caste and income certificates to populate your application instantly!\n\nPlease ask any specific question about income limits, required documents, or application tracking!",
      hi: "जोहार! 🙏 जनजातीय कार्य मंत्रालय के AI छात्रवृत्ति सलाहकार के रूप में, मैं आपको सभी केंद्रीय और राज्य छात्रवृत्ति योजनाओं (पोस्ट-मैट्रिक, राष्ट्रीय फैलोशिप, और IITs/NITs के लिए टॉप क्लास शिक्षा) की पूरी जानकारी दे सकता हूँ।\n\n### मुख्य लाभ:\n• पात्र ST विद्यार्थियों के लिए **100% शिक्षण शुल्क प्रतिपूर्ति**\n• DBT के माध्यम से सीधे खाते में **मासिक रखरखाव भत्ता**\n• शीर्ष संस्थानों के विद्यार्थियों के लिए ₹45,000 तक का **कंप्यूटर/लैपटॉप अनुदान**\n• **दस्तावेज़ Auto-Fill**: प्रमाण पत्र अपलोड करके 2 मिनट में आवेदन पूरा करें!\n\nकृपया अपनी पात्रता या आवेदन प्रक्रिया के बारे में कोई भी प्रश्न पूछें!",
      bn: "জোহার! 🙏 জনজাতি বিষয়ক মন্ত্রকের AI বৃত্তি উপদেষ্টা হিসেবে, আমি আপনাকে সমস্ত কেন্দ্রীয় ও রাজ্য উপজাতি বৃত্তি প্রকল্প (পোস্ট-ম্যাট্রিক, ন্যাশনাল ফেলোশিপ এবং IIT/NIT-এর জন্য শীর্ষ স্তরের শিক্ষা) সম্পর্কে সম্পূর্ণ নির্দেশনা প্রদান করছি।\n\n### প্রধান সুবিধাসমূহ:\n• যোগ্য ST শিক্ষার্থীদের জন্য **১০০% টিউশন ফি মওকুফ**\n• DBT-এর মাধ্যমে সরাসরি ব্যাংক একাউন্টে **মাসিক ভাতা**\n• শীর্ষ প্রতিষ্ঠানে ভর্তির জন্য ₹৪৫,০০০ পর্যন্ত **ল্যাপটপ/কম্পিউটার অনুদান**\n• **AI অটো-ফিল**: সার্টিফিকেট আপলোড করে মুহূর্তেই ফর্ম পূরণ করুন!",
      sat: "ᱡᱚᱦᱟᱨ! 🙏 ᱤᱧ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ AI ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ ᱠᱟᱱᱟᱹᱧ। Post-Matric, National Fellowship, ᱟᱨ Top Class ᱡᱚᱡᱚᱱᱟ ᱵᱟᱵᱚᱛ ᱡᱚᱛᱚ ᱠᱟᱛᱷᱟ ᱤᱧ ᱵᱟᱰᱟᱭ ᱚᱪᱚ ᱫᱟᱲᱮᱭᱟᱢᱟ।\n\n• ST ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱯᱩᱨᱟᱹ ᱯᱷᱤ ᱪᱷᱟᱲ\n• DBT ᱫᱟᱨᱟᱭ ᱛᱮ ᱪᱟᱸᱫᱚᱠᱤᱭᱟᱹ ᱜᱚᱲᱚ ᱴᱟᱠᱟ\n• Auto-Fill OCR ᱫᱟᱨᱟᱭ ᱛᱮ ᱠᱟᱜᱚᱡᱽ ᱞᱟᱫᱮ ᱠᱟᱛᱮ ᱞᱚᱜᱚᱱ ᱯᱷᱚᱨᱢ ᱯᱮᱨᱮᱡᱽ!",
      as: "জোহাৰ! 🙏 জনজাতীয় পৰিক্ৰমা মন্ত্ৰালয়ৰ AI বৃত্তি পৰামৰ্শদাতা হিচাপে, মই আপোনাক সকলো কেন্দ্রীয় আৰু ৰাজ্যিক জনজাতীয় বৃত্তি আঁচনি সম্পৰ্কে সম্পূৰ্ণ সহায় আগবঢ়াবলৈ সাজু।\n\n• যোগ্য ST ছাত্ৰ-ছাত্ৰীৰ বাবে **১০০% মাচুল ৰেহাই**\n• DBT-ৰ জৰিয়তে প্ৰত্যক্ষভাৱে **মাহেকীয়া জলপানী**\n• **AI অটো-ফিল**: চার্টিফিকেট আপল'ড কৰি পলকতে আবেদন সম্পূৰ্ণ কৰক!",
    };

    return NextResponse.json({
      success: true,
      reply: fallbackReplies[language] || fallbackReplies.en,
      language,
      intent: "EXPANDED_FALLBACK",
      suggestions: ["What documents are required?", "Income limit for ST scholarship?", "How does Auto-Fill OCR work?"],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process chat" },
      { status: 500 }
    );
  }
}
