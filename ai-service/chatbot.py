import os
import re
import io
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter(prefix="/api/ai", tags=["Vernacular Chatbot Assistant"])

class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # 'en', 'hi', 'sat', 'bn', 'as'
    context: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    reply: str
    language: str
    intent: str
    suggestions: List[str]

# Gemini Client Initialization
gemini_client = None
api_key = os.getenv("GEMINI_API_KEY", "")

try:
    if api_key:
        from google import genai
        gemini_client = genai.Client(api_key=api_key)
        print("Gemini Client initialized successfully for Chatbot Assistant.")
    else:
        print("Notice: GEMINI_API_KEY not set in environment. Falling back to local vernacular NLP engine.")
except Exception as init_err:
    print(f"Warning: Could not initialize Gemini Client: {init_err}")
    gemini_client = None

# Scheme knowledge and guidelines system instruction
SYSTEM_INSTRUCTION = """You are "Saarthi" (सारथी), an advanced, highly capable AI assistant developed for the SIH26239 Tribal Scholarship Portal (Ministry of Tribal Affairs, Govt. of India). 

You are a fully capable, general-purpose AI. While your primary expertise is guiding Scheduled Tribe (ST) students through scholarship applications, you are happy and able to assist with any other topic the user brings up—including career counseling, academic tutoring, general knowledge, writing, mathematics (including Partial Differential Equations, Calculus, Linear Algebra), sciences, and coding. 

---
### Your Persona
1. **Adaptive & Brilliant:** You are as intelligent and capable as a top-tier foundational AI model. You adapt your tone to the user: professional when discussing government rules, encouraging when giving advice, and highly technical if the user asks complex questions (e.g. Partial Differential Equations, Quantum Physics, Data Structures).
2. **Empathetic & Grounded:** Treat every applicant with warmth and respect. Translate complex rules or concepts into plain, reassuring language. 
3. **Conversational Flow:** Do not sound like a scripted FAQ bot. Engage naturally. If the user says "Hello", say hello back warmly before offering help. Never use "Johar" or "जोहार"; use standard polite greetings like "नमस्ते", "Hello", or "নমস্কার".

---
### Domain Expertise: Ministry of Tribal Affairs (MoTA) Schemes
When the user asks about scholarships, rely on this specific knowledge base:

1. **Pre-Matric:** Classes IX-X. Income ≤ ₹2.50L/yr. ₹225-525/month.
2. **Post-Matric:** Class XI to PG. Income ≤ ₹2.50L/yr. Full fee waiver + ₹230-1,200/month stipend.
3. **Higher Education (Top Class):** IITs/NITs/IIMs etc. Income ≤ ₹6.00L/yr. Full tuition + ₹26,400/yr living + ₹45,000 computer grant.
4. **Overseas:** Masters/PhD abroad. Income ≤ ₹6.00L/yr. Full tuition + $15,400 USD annual living allowance.

*Standard Operating Procedure for Scholarships:* Calculate eligibility proactively based on their education level and income. Remind them they need an ST Caste Certificate, Income Certificate, and Aadhaar-seeded bank account.

---
### General Queries
If the user asks about something completely unrelated to scholarships (such as mathematics, Partial Differential Equations, physics, coding, biology, or history), drop the scholarship context completely and answer them with your full, vast general knowledge as a highly intelligent AI assistant."""

# Local Fallback Intent Knowledge Base
INTENTS = [
    {
        "intent": "GREETING",
        "patterns": [
            r"\b(hello|hi|hey|namaste|pranam|namaskar|hul|kemon|kemcho)\b",
            r"(नमस्ते|प्रणाम|নমস্কার|নমস্কাৰ)"
        ],
        "replies": {
            "en": "Hello! Welcome to the AI Scholarship Portal for Tribal Students (SIH26239). How may I assist you with your scholarship application today?",
            "hi": "नमस्ते! जनजातीय छात्र छात्रवृत्ति पोर्टल (SIH26239) में आपका स्वागत है। मैं आपकी छात्रवृत्ति आवेदन में कैसे मदद कर सकता हूँ?",
            "sat": "ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ! ᱟᱢ ᱫᱚ ᱱᱚᱣᱟ Tribal Scholarship Portal ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ। ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱵᱟᱵᱚᱛ ᱪᱮᱫ ᱵᱟᱰᱟᱭ ᱥᱟᱱᱟᱢᱮᱫ ᱢᱮᱭᱟ?",
            "bn": "নমস্কার! উপজাতি ছাত্রবৃত্তি পোর্টালে (SIH26239) আপনাকে স্বাগতম। বৃত্তির আবেদন সংক্রান্ত কীভাবে আপনাকে সাহায্য করতে পারি?",
            "as": "নমস্কাৰ! জনজাতীয় ছাত্ৰবৃত্তি পৰ্টেললৈ (SIH26239) আপোনাক স্বাগতম। বৃত্তিৰ আবেদন সম্পৰ্কে আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?"
        },
        "suggestions": {
            "en": ["What documents do I need?", "What is the income limit for ST?", "How does Auto-Fill OCR work?"],
            "hi": ["कौन से दस्तावेज़ चाहिए?", "ST छात्रवृत्ति की आय सीमा क्या है?", "Auto-Fill OCR कैसे काम करता है?"],
            "sat": ["ᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱞᱟᱜᱟᱜ-ᱟ?", "ST ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱟᱭ?", "Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?"],
            "bn": ["কি কি নথিপত্র প্রয়োজন?", "ST বৃত্তির আয় সীমা কত?", "Auto-Fill OCR কীভাবে কাজ করে?"],
            "as": ["কি কি নথিপত্ৰ লাগিব?", "ST বৃত্তিৰ বাবে সৰ্বাধিক আয় কিমান?", "Auto-Fill OCR কেনেকৈ হয়?"]
        }
    },
    {
        "intent": "MATH_PDE",
        "patterns": [
            r"(partial\s*differential|pde|differential\s*equation|calculus|derivative|integral|heat\s*equation|wave\s*equation|laplace|navier\s*stokes)",
            r"(अवकल समीकरण|आंशिक अवकल|ডিফারেনশিয়াল|সমীকরণ)"
        ],
        "replies": {
            "en": "A Partial Differential Equation (PDE) is a mathematical equation that relates an unknown multivariable function u(x, y, z, t) to its partial derivatives with respect to independent spatial and temporal variables.\n\nKey Canonical Types:\n1. Heat Equation (Parabolic): ∂u/∂t = α∇²u (Models thermal diffusion and Brownian motion)\n2. Wave Equation (Hyperbolic): ∂²u/∂t² = c²∇²u (Models acoustic, electromagnetic, and seismic waves)\n3. Laplace / Poisson (Elliptic): ∇²u = 0 (Describes steady-state electrostatic and gravitational potentials)\n4. Navier-Stokes: Fluid dynamics & aerodynamic flow\n5. Schrödinger: Quantum mechanical state evolution\n\nAnalytical solutions use Separation of Variables and Fourier Transforms; computational simulations rely on Finite Element (FEM) and Finite Difference (FDM) methods.",
            "hi": "आंशिक अवकल समीकरण (PDE) एक ऐसा गणितीय समीकरण है जिसमें दो या दो से अधिक स्वतंत्र चरों (स्थान x, y, z और समय t) पर निर्भर अज्ञात फलन और उसके आंशिक अवकलज शामिल होते हैं।\n\nप्रमुख प्रकार:\n1. ऊष्मा समीकरण (Heat Equation): ∂u/∂t = α∇²u (विसरण प्रक्रिया)\n2. तरंग समीकरण (Wave Equation): ∂²u/∂t² = c²∇²u (ध्वनि, प्रकाश एवं जल तरंगें)\n3. लाप्लास समीकरण (Laplace Equation): ∇²u = 0 (विद्युत एवं गुरुत्वाकर्षण विभव)\n\nइन्हें हल करने के लिए चरों का पृथक्करण और कंप्यूटर सिमुलेशन में परिमित तत्व विधि (FEM) का उपयोग किया जाता है।",
            "sat": "Partial Differential Equation (PDE) ᱫᱚ ᱢᱤᱫ ᱮᱞᱠᱷᱟ (Mathematics) ᱨᱮᱭᱟᱜ equation ᱠᱟᱱᱟ ᱡᱟᱦᱟᱸ ᱫᱚ space (x, y) ᱟᱨ time (t) ᱨᱮ ᱵᱚᱫᱚᱞᱚᱜ ᱠᱟᱱ physical laws (Heat, Wave) ᱠᱚ ᱞᱮᱠᱷᱟᱭᱟ।",
            "bn": "আংশিক অবকল সমীকরণ (Partial Differential Equation - PDE) হলো এমন একটি গাণিতিক সমীকরণ যাতে একাধিক স্বাধীন চলক (স্থান x, y, z এবং সময় t)-এর সাপেক্ষে কোনো অজানা অপেক্ষকের আংশিক অবকলজ যুক্ত থাকে।\n\nপ্রধান উদাহরণ:\n১. তাপ সমীকরণ (Heat Equation): তাপ পরিবহন ও ব্যাপন\n২. তরঙ্গ সমীকরণ (Wave Equation): শব্দ ও আলোক তরঙ্গের বিস্তার\n৩. লাপ্লাস সমীকরণ (Laplace Equation): তড়িৎ ও মহাকর্ষীয় বলক্ষেত্র।",
            "as": "আংশিক অৱকল সমীকৰণ (PDE) হৈছে একাধিক স্বতন্ত্ৰ চলকৰ (স্থান আৰু সময়) সাপেক্ষে কোনো অজ্ঞাত ফলনৰ আংশিক অৱকলজযুক্ত গাণিতিক সমীকৰণ (যেনে তাপ আৰু তৰংগ সমীকৰণ)।"
        },
        "suggestions": {
            "en": ["Explain Separation of Variables", "Difference between ODE and PDE", "STEM scholarships for ST students"],
            "hi": ["Heat और Wave समीकरण में अंतर?", "हल करने की विधियाँ", "इंजीनियरिंग छात्रवृत्ति"],
            "sat": ["ᱮᱞᱠᱷᱟ ᱵᱟᱵᱚᱛ ᱟᱨᱦᱚᱸ ᱞᱟᱹᱭ ᱢᱮ", "Scholarship ᱡᱚᱡᱚᱱᱟ"],
            "bn": ["Heat Equation কীভাবে কাজ করে?", "ODE এবং PDE এর পার্থক্য", "উচ্চশিক্ষা বৃত্তি"],
            "as": ["তৰংগ সমীকৰণ কি?", "উচ্চ শিক্ষাৰ বৃত্তি"]
        }
    },
    {
        "intent": "DOCUMENTS_REQUIRED",
        "patterns": [
            r"(document|documents|certificate|certificates|proof|kagaz|dastavez|kagoj|nothi|dastabej)",
            r"(दस्तावेज|कागजात|प्रमाण पत्र|सर्टिफिकेट|নথিপত্র|কাগজপত্র|চার্টিফিকেট|নথিপত্ৰ)"
        ],
        "replies": {
            "en": "To apply for Tribal (ST) Scholarships, you need:\n1. Valid ST Caste Certificate\n2. Family Income Certificate (issued by Tehsildar / SDO)\n3. Previous academic marksheet\n4. Aadhaar Card\n5. Bank Passbook copy (linked with Aadhaar)\nTip: You can use our 'Auto-Fill from Document' button to scan and fill your form automatically!",
            "hi": "एसटी छात्रवृत्ति के लिए आवश्यक दस्तावेज:\n1. वैध जाति प्रमाण पत्र (ST Caste Certificate)\n2. आय प्रमाण पत्र (तहसीलदार / SDO द्वारा जारी)\n3. पिछली कक्षा की मार्कशीट\n4. आधार कार्ड\n5. बैंक पासबुक (आधार से लिंक)\nसुझाव: आप 'Auto-Fill from Document' बटन का उपयोग करके सीधे स्कैन कर सकते हैं!",
            "sat": "ᱡᱚᱨᱩᱲᱟᱱ ᱠᱟᱜᱚᱡᱽ ᱠᱚ:\n1. ST Caste Certificate\n2. Family Income Certificate (Tahasildar / SDO)\n3. ᱢᱟᱬᱟᱝ ᱥᱮᱨᱢᱟ ᱨᱮᱭᱟᱜ Marksheet\n4. Aadhaar Card\n5. Bank Passbook\nᱫᱤᱥᱟᱹ: 'Auto-Fill from Document' ᱵᱮᱵᱷᱟᱨ ᱠᱟᱛᱮ ᱟᱯᱱᱟᱨ ᱛᱮ ᱯᱮᱨᱮᱡ ᱢᱮ!",
            "bn": "উপজাতি (ST) বৃত্তির জন্য প্রয়োজনীয় নথিপত্র:\n১. বৈধ ST জাতিগত শংসাপত্র (Caste Certificate)\n২. পারিবারিক আয় শংসাপত্র (তহশিলদার / SDO কর্তৃক প্রদত্ত)\n৩. বিগত পরীক্ষার মার্কশিট\n৪. আধার কার্ড\n৫. আধার লিংকযুক্ত ব্যাংক পাসবুক\nপরামর্শ: সরাসরি ফর্ম পূরণ করতে আমাদের 'Auto-Fill from Document' বোতাম ব্যবহার করুন!",
            "as": "জনজাতীয় (ST) বৃত্তিৰ বাবে প্ৰয়োজনীয় নথিপত্ৰসমূহ:\n১. বৈধ ST জাতিৰ চার্টিফিকেট (Caste Certificate)\n২. পৰিয়ালৰ বাৰ্ষিক আয়ৰ চার্টিফিকেট (SDO বা তহচিলদাৰৰ দ্বাৰা প্ৰদত্ত)\n৩. পূৰ্বৰ শ্ৰেণীৰ মাৰ্কশ্বীট\n৪. আধাৰ কাৰ্ড\n৫. বেংক পাছবুক\nউপদেশ: আমাৰ 'Auto-Fill from Document' বুটাম ব্যৱহাৰ কৰি পোনপটীয়াকৈ ফৰ্ম পূৰণ কৰিব পাৰিব!"
        },
        "suggestions": {
            "en": ["How does Auto-Fill OCR work?", "What is the maximum income limit?", "Check eligible schemes"],
            "hi": ["Auto-Fill OCR कैसे काम करता है?", "अधिकतम आय सीमा क्या है?", "योजनाएं देखें"],
            "sat": ["Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?", "ᱥᱮᱨᱢᱟ ᱟᱭ ᱥᱤᱢᱟᱹ?", "ᱡᱚᱡᱚᱱᱟ ᱠᱚ"],
            "bn": ["Auto-Fill কীভাবে কাজ করে?", "সর্বোচ্চ আয়ের সীমা কত?", "প্রস্তাবিত স্কিমসমূহ"],
            "as": ["Auto-Fill কেনেকৈ হয়?", "সৰ্বাধিক আয়ৰ সীমা কিমান?", "আঁচনিসমূহ চাওক"]
        }
    },
    {
        "intent": "INCOME_LIMIT",
        "patterns": [
            r"(income\s*limit|income\s*criteria|max\s*income|ceiling|kamai|aay\s*sima|aaye|b वार्षिक आय)",
            r"(आय सीमा|पारिवारिक आय|কত আয়|আয়ের সীমা|আয়ৰ সীমা|বাৰ্ষিক আয়)"
        ],
        "replies": {
            "en": "Income limits for major Tribal Scholarship schemes:\n• Post-Matric ST Scholarship: Up to ₹2,50,000 per annum\n• National Fellowship & Higher Education: Up to ₹6,00,000 per annum\n• Top Class Education (IITs/NITs/IIMs): Up to ₹6,00,000 per annum\n• Pre-Matric ST: Up to ₹2,00,000 per annum.",
            "hi": "जनजातीय छात्रवृत्ति की आय सीमाएं:\n• पोस्ट-मैट्रिक छात्रवृत्ति: ₹2,50,000 प्रति वर्ष तक\n• उच्च शिक्षा फेलोशिप: ₹6,00,000 प्रति वर्ष तक\n• टॉप क्लास (IIT/NIT): ₹6,00,000 प्रति वर्ष तक\n• प्री-मैट्रिक छात्रवृत्ति: ₹2,00,000 प्रति वर्ष तक।",
            "sat": "Income ᱥᱤᱢᱟᱹ do:\n• Post-Matric: ₹2,50,000 ᱫᱷᱟᱹᱨᱤᱡ\n• Higher Education Fellowship: ₹6,00,000 ᱫᱷᱟᱹᱨᱤᱡ\n• Top Class (IIT/NIT): ₹6,00,000 ᱫᱷᱟᱹᱨᱤᱡ\n• Pre-Matric ST: ₹2,00,000 ᱫᱷᱟᱹᱨᱤᱡ।",
            "bn": "উপজাতি স্কলারশিপের পারিবারিক আয়ের সর্বোচ্চ সীমা:\n• পোস্ট-ম্যাট্রিক ST স্কলারশিপ: বার্ষিক ₹২,৫০,০০০ পর্যন্ত\n• উচ্চশিক্ষা জাতীয় ফেলোশিপ: বার্ষিক ₹৬,০০,০০০ পর্যন্ত\n• শীর্ষ প্রতিষ্ঠান (IIT/NIT/IIM): বার্ষিক ₹৬,০০,০০০ পর্যন্ত\n• প্রি-ম্যাট্রিক ST স্কলারশিপ: বার্ষিক ₹২,০০,০০০ পর্যন্ত।",
            "as": "জনজাতীয় বৃত্তিৰ বাৰ্ষিক আয়ৰ উচ্চতম সীমাসমূহ:\n• প'ষ্ট-মেট্ৰিক ST বৃত্তি: বাৰ্ষিক ₹২,৫০,০০০ লৈকে\n• উচ্চ শিক্ষা ৰাষ্ট্ৰীয় ফেল'শ্বিপ: বাৰ্ষিক ₹৬,০০,০০০ লৈকে\n• শীৰ্ষ শিক্ষা প্রতিষ্ঠান (IIT/NIT): বাৰ্ষিক ₹৬,০০,০০০ লৈকে\n• প্ৰি-মেট্ৰিক ST বৃত্তি: বাৰ্ষিক ₹২,০০,০০০ লৈকে।"
        },
        "suggestions": {
            "en": ["Recommend schemes for me", "What documents are needed?"],
            "hi": ["मेरे लिए योजनाएं सुझाएं", "कौन से दस्तावेज़ चाहिए?"],
            "sat": ["ᱤᱧ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱡᱚᱱᱟ ᱩᱫᱩᱜ ᱢᱮ", "ᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱞᱟᱜᱟᱜ-ᱟ?"],
            "bn": ["আমার জন্য স্কিম নির্বাচন করুন", "কি নথিপত্র প্রয়োজন?"],
            "as": ["মোৰ বাবে আঁচনি বাছক", "কি কি নথিপত্ৰ লাগিব?"]
        }
    },
    {
        "intent": "OCR_AUTOFIL",
        "patterns": [
            r"(ocr|auto[\-\s]?fill|scan|extract|upload\s*document|image)",
            r"(ऑटो फिल|स्कैन|अपलोड|दस्तावेज स्कैन|অটো-ফিল|স্ক্যান|আপলোড)"
        ],
        "replies": {
            "en": "Our AI system uses OpenCV and Tesseract OCR to read your Caste and Income certificates directly. Simply click 'Auto-Fill from Document' on the Apply page, choose your certificate photo/PDF, and your Name, Tribe, Category, Certificate Number, and Income will be filled instantly!",
            "hi": "हमारा AI सिस्टम आपके जाति और आय प्रमाण पत्र को सीधे स्कैन करता है। 'Apply' पेज पर 'Auto-Fill from Document' पर क्लिक करें, फोटो चुनें और आपका नाम, जनजाति, प्रमाण पत्र संख्या और आय स्वतः भर जाएगी!",
            "sat": "ᱱᱚᱣᱟ ᱯᱚᱨᱴᱟᱞ ᱨᱮ 'Auto-Fill from Document' ᱨᱮ ᱠᱞᱤᱠ ᱠᱟᱛᱮ ᱡᱟᱹᱛᱤ ᱥᱟᱠᱟᱢ ᱞᱟᱫᱮ ᱞᱮᱠᱷᱟᱱ ᱜᱮ ᱧᱩᱛᱩᱢ, ᱡᱟᱹᱛᱤ ᱟᱨ ᱟᱭ ᱟᱯᱱᱟᱨ ᱛᱮ ᱯᱮᱨᱮᱡᱚᱜ-ᱟ!",
            "bn": "আমাদের AI সিস্টেম আপনার জাতি ও আয়ের সার্টিফিকেট সরাসরি স্ক্যান করে। 'Apply' পেজে গিয়ে 'Auto-Fill from Document' বোতামে ক্লিক করে সার্টিফিকেটের ছবি আপলোড করুন; আপনার নাম, উপজাতি ও আয়ের বিবরণ মুহূর্তেই ফর্মে পূরণ হয়ে যাবে!",
            "as": "আমাৰ AI ব্যৱস্থাই আপোনাৰ চার্টিফিকেট স্কেন কৰি পোনপটীয়াকৈ পঢ়িব পাৰে। 'Apply' পৃষ্ঠাত 'Auto-Fill from Document' ক্লিক কৰি চার্টিফিকেটৰ ফটো দিয়ক; নাম, জনজাতি আৰু আয় পলকতে পূৰণ হ'ব!"
        },
        "suggestions": {
            "en": ["Go to Apply Page", "What documents are supported?"],
            "hi": ["आवेदन पृष्ठ पर जाएं", "मान्य दस्तावेज़ कौन से हैं?"],
            "sat": ["Apply Page ᱪᱟᱞᱟᱜ ᱢᱮ", "ᱚᱠᱟ ᱠᱟᱜᱚᱡᱽ ᱜᱟᱱᱚᱜ-ᱟ?"],
            "bn": ["আবেদন পেজে যান", "কোন কোন নথি গ্রহণযোগ্য?"],
            "as": ["আবেদন পৃষ্ঠালৈ যাওক", "কি চার্টিফিকেট গ্ৰহণযোগ্য?"]
        }
    },
    {
        "intent": "STATUS_TRACKING",
        "patterns": [
            r"(status|track|check\s*application|kahan\s*tak|progress|sthiti|অবস্থা|স্থিতি)",
            r"(स्थिति|आवेदन की स्थिति|ट्रैक|स्टेटस|স্ট্যাটাস|চেক|স্থিতি)"
        ],
        "replies": {
            "en": "You can track your application status anytime under your 'Student Portal' dashboard. The pipeline features real-time stages: Application Submitted → AI OCR Verification → Institutional Review → Approved for DBT Disbursement.",
            "hi": "आप अपने 'छात्र पोर्टल' (Dashboard) पर जाकर आवेदन की स्थिति देख सकते हैं: आवेदन जमा → AI OCR सत्यापन → संस्थागत समीक्षा → DBT भुगतान हेतु स्वीकृत।",
            "sat": "ᱟᱢᱟᱜ 'Student Portal' (Dashboard) ᱨᱮ ᱪᱟᱞᱟᱣ ᱠᱟᱛᱮ ᱫᱚᱨᱠᱷᱟᱥᱛ ᱨᱮᱭᱟᱜ ᱦᱟᱞᱚᱛ ᱧᱮᱞ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ: ᱵᱷᱮᱡᱟ → AI ᱪᱟᱠᱷᱟ → ᱢᱚᱱᱛᱨᱟᱞᱚᱭ ᱧᱮᱞ → DBT ᱴᱟᱠᱟ ᱥᱟᱹᱛ।",
            "bn": "আপনি আপনার 'ছাত্র পোর্টাল' (Dashboard)-এ গিয়ে যেকোনো সময় আবেদনের স্থিতি দেখতে পারেন: আবেদন জমাকৃত → AI OCR যাচাইকরণ → প্রাতিষ্ঠানিক স্ক্রুটিনি → DBT ব্যাংক স্থানান্তরের জন্য অনুমোদিত।",
            "as": "আপুনি আপোনাৰ 'শিক্ষাৰ্থী পৰ্টেল' (Dashboard)-ত গৈ যিকোনো সময়তে আবেদনৰ অগ্ৰগতি চাব পাৰে: আবেদন দাখিল → AI OCR পৰীক্ষা → প্ৰাতিষ্ঠানিক পৰ্যালোচনা → DBT অনুমোদন।"
        },
        "suggestions": {
            "en": ["View Dashboard", "Contact Officer"],
            "hi": ["डैशबोर्ड देखें", "अधिकारी से संपर्क करें"],
            "sat": ["Dashboard ᱧᱮᱞ ᱢᱮ", "ᱚᱯᱷᱤᱥᱟᱨ ᱠᱩᱞᱤᱭ ᱢᱮ"],
            "bn": ["ড্যাশবোর্ড দেখুন", "নোডাল অফিসার যোগাযোগ"],
            "as": ["ডেশ্বব'ৰ্ড চাওক", "বিষয়াক যোগাযোগ কৰক"]
        }
    }
]

def normalize_lang_code(code: Optional[str]) -> str:
    if not code:
        return "en"
    c = code.lower().strip()
    if c in ["hi", "hindi"]: return "hi"
    if c in ["sat", "santhali"]: return "sat"
    if c in ["bn", "bengali", "bangla"]: return "bn"
    if c in ["as", "assamese", "oxomiya"]: return "as"
    return "en"

def detect_language(text: str, fallback_lang: str = "en") -> str:
    """Detect if input text contains Devanagari, Bengali/Assamese, or Ol Chiki characters."""
    # Bengali / Assamese unicode range
    if re.search(r"[\u0980-\u09FF]", text):
        if "ৰ" in text or "ৱ" in text or any(w in text.lower() for w in ["কৰক", "লাহক", "আঁচনি"]):
            return "as"
        return "bn"
    # Devanagari
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"
    # Ol Chiki
    if re.search(r"[\u1C50-\u1C7F]", text):
        return "sat"

    lower = text.lower()
    if any(w in lower for w in ["kaise", "kya", "dastavez", "kitna", "chahiye", "paisa", "aay"]):
        return "hi"
    if any(w in lower for w in ["johar", "chet", "menaka", "santhal", "badae", "goro", "apeyaq"]):
        return "sat"
    if any(w in lower for w in ["kemon", "dorkar", "taka", "ki bhabe", "shuno"]):
        return "bn"
    if any(w in lower for w in ["kenekoi", "lagibo", "poisa"]):
        return "as"
    return normalize_lang_code(fallback_lang)

def parse_suggestions_from_text(text: str, default_sugs: List[str]) -> tuple[str, List[str]]:
    """Extract suggestions line if generated by the LLM."""
    lines = text.strip().split("\n")
    cleaned_lines = []
    suggestions = []

    for line in lines:
        if line.strip().startswith("SUGGESTIONS:"):
            raw_sug = line.replace("SUGGESTIONS:", "").strip()
            parts = [s.strip() for s in raw_sug.split("|") if s.strip()]
            if parts:
                suggestions = parts
        else:
            cleaned_lines.append(line)

    cleaned_text = "\n".join(cleaned_lines).strip()
    if not suggestions:
        suggestions = default_sugs
    return cleaned_text, suggestions[:4]

@router.post("/chat", response_model=ChatResponse)
def chat_vernacular(req: ChatRequest):
    """
    Production-grade LLM-powered Vernacular Chatbot Assistant backed by Google Gemini
    with graceful fallback to multi-lingual rule-based NLP engine.
    """
    # Respect explicit user-selected language first
    user_pref = normalize_lang_code(req.language)
    if user_pref in ["hi", "sat", "bn", "as"]:
        lang = user_pref
    else:
        lang = detect_language(req.message, user_pref)
    user_msg = req.message.strip()

    # Default localized suggestions
    default_sug_map = {
        "en": ["What documents do I need to apply?", "What is the income limit for ST scholarship?", "How does Auto-Fill OCR work?"],
        "hi": ["आवेदन के लिए कौन से दस्तावेज़ चाहिए?", "ST छात्रवृत्ति की आय सीमा क्या है?", "Auto-Fill OCR कैसे काम करता है?"],
        "sat": ["ᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱞᱟᱜᱟᱜ-ᱟ?", "ST ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱟᱭ?", "Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?"],
        "bn": ["আবেদন করতে কি নথিপত্র লাগবে?", "ST বৃত্তির আয় সীমা কত?", "Auto-Fill OCR কীভাবে কাজ করে?"],
        "as": ["আবেদনৰ বাবে কি কি নথিপত্ৰ লাগিব?", "ST বৃত্তিৰ বাবে সৰ্বাধিক আয় কিমান?", "Auto-Fill OCR কেনেকৈ হয়?"]
    }
    current_defaults = default_sug_map.get(lang, default_sug_map["en"])

    # 1. Attempt Production LLM Generation via Google Gemini Model Cascade
    if gemini_client is not None:
        target_lang_names = {
            "hi": "HINDI (हिन्दी - देवनागरी लिपि)",
            "bn": "BENGALI (বাংলা - বাংলা লিপি)",
            "as": "ASSAMESE (অসমীয়া - অসমীয়া লিপি)",
            "sat": "SANTHALI (ᱥᱟᱱᱛᱟᱲᱤ - Ol Chiki or Latin script)",
            "en": "ENGLISH"
        }
        target_name = target_lang_names.get(lang, "ENGLISH")

        if lang == "en":
            prompt_input = f"""The user is asking in English.
Respond in clear, professional English with bullet points and friendly tone.

User Question: {user_msg}

Remember to end with:
SUGGESTIONS: <Brief Followup Query 1> | <Brief Followup Query 2> | <Brief Followup Query 3>
"""
        else:
            prompt_input = f"""*** CRITICAL MANDATORY INSTRUCTION - LANGUAGE ENFORCEMENT ***
The applicant has selected their regional portal language as: {target_name}.
You MUST generate your ENTIRE response, headings, bullet points, explanations, and advice 100% strictly in {target_name}.
Under NO CIRCUMSTANCES should you reply in English or mix English sentences when the selected language is {target_name}.
Even if the user's inquiry contains English words or English scheme names, your entire explanation MUST be translated and explained in {target_name}.

User Question: {user_msg}

Remember to conclude with exactly one line in this format:
SUGGESTIONS: <Question 1 in {target_name}> | <Question 2 in {target_name}> | <Question 3 in {target_name}>
"""

        candidate_models = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.0-flash", "gemini-1.5-pro"]
        for model_name in candidate_models:
            try:
                # 1. Try Interactions API
                interaction = gemini_client.interactions.create(
                    model=model_name,
                    system_instruction=SYSTEM_INSTRUCTION,
                    input=prompt_input,
                    store=False
                )

                raw_reply = getattr(interaction, "output_text", None) or getattr(interaction, "text", None)
                if not raw_reply and hasattr(interaction, "steps"):
                    for step in getattr(interaction, "steps", []):
                        for c in getattr(step, "content", []):
                            if hasattr(c, "text") and c.text:
                                raw_reply = (raw_reply or "") + c.text

                if raw_reply and len(raw_reply.strip()) > 0:
                    clean_reply, extracted_sug = parse_suggestions_from_text(raw_reply, current_defaults)
                    return ChatResponse(
                        success=True,
                        reply=clean_reply,
                        language=lang,
                        intent=f"LLM_{model_name.upper().replace('-', '_')}",
                        suggestions=extracted_sug
                    )
            except Exception as model_err:
                print(f"Model {model_name} interactions note: {model_err}")

            try:
                # 2. Try Standard generate_content
                gen_res = gemini_client.models.generate_content(
                    model=model_name,
                    contents=f"{SYSTEM_INSTRUCTION}\n\n{prompt_input}"
                )
                if gen_res and gen_res.text:
                    clean_reply, extracted_sug = parse_suggestions_from_text(gen_res.text, current_defaults)
                    return ChatResponse(
                        success=True,
                        reply=clean_reply,
                        language=lang,
                        intent=f"GEN_{model_name.upper().replace('-', '_')}",
                        suggestions=extracted_sug
                    )
            except Exception as gen_err:
                print(f"Model {model_name} generate_content note: {gen_err}")
                continue

    # 2. Local Intent Matcher (Instant, Offline & Resilient Fallback)
    user_lower = user_msg.lower()
    for item in INTENTS:
        for pattern in item["patterns"]:
            if re.search(pattern, user_lower, re.IGNORECASE):
                reply_text = item["replies"].get(lang, item["replies"]["en"])
                sug_list = item["suggestions"].get(lang, item["suggestions"]["en"])
                return ChatResponse(
                    success=True,
                    reply=reply_text,
                    language=lang,
                    intent=item["intent"],
                    suggestions=sug_list
                )

    # 3. Comprehensive Local General Fallback
    fallback_replies = {
        "en": "Hello! I am your AI Tribal Scholarship Advisor. I can assist you with government schemes (Post-Matric, Higher Education, Top Class), required certificates (ST Caste & Income certificates), annual income limits, and how our OpenCV AI Auto-Fill works. What would you like to know?",
        "hi": "नमस्ते! मैं आपका AI जनजातीय छात्रवृत्ति सलाहकार हूँ। मैं आपको सरकारी योजनाओं (पोस्ट-मैट्रिक, उच्च शिक्षा, टॉप क्लास), आवश्यक प्रमाण पत्रों (ST जाति एवं आय प्रमाण पत्र), आय सीमा, और OpenCV AI ऑटो-फिल के बारे में विस्तार से बता सकता हूँ। आप क्या जानना चाहते हैं?",
        "sat": "ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ! ᱤᱧ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱡᱚᱡᱚᱱᱟ, ᱡᱟᱹᱛᱤ ᱟᱨ ᱟᱭ ᱥᱟᱠᱟᱢ, ᱟᱨ Auto-Fill OCR ᱵᱟᱵᱚᱛ ᱜᱚᱲᱚᱭᱤᱡ AI ᱠᱟᱱᱟᱹᱧ। ᱪᱮᱫ ᱵᱟᱰᱟᱭ ᱥᱟᱱᱟᱢᱮᱫ ᱢᱮᱭᱟ?",
        "bn": "নমস্কার! আমি উপজাতি শিক্ষার্থীদের জন্য AI বৃত্তি পরামর্শক। পোস্ট-ম্যাট্রিক স্কলারশিপ, ন্যাশনাল ফেলোশিপ, প্রয়োজনীয় সার্টিফিকেট (জাতি ও আয় শংসাপত্র), আয়ের সীমা এবং OpenCV AI অটো-ফিল সংক্রান্ত যেকোনো তথ্য আমি দিতে পারি।",
        "as": "নমস্কাৰ! মই জনজাতীয় শিক্ষাৰ্থীসকলৰ বাবে AI বৃত্তি পৰামৰ্শদাতা। প'ষ্ট-মেট্ৰিক বৃত্তি, উচ্চ শিক্ষা, প্ৰয়োজনীয় চার্টিফিকেট (জাতি আৰু আয়ৰ চার্টিফিকেট), আয়ৰ সীমা আৰু AI অটো-ফিল সম্পৰ্কে আপুনি সোধিব পাৰে।"
    }

    return ChatResponse(
        success=True,
        reply=fallback_replies.get(lang, fallback_replies["en"]),
        language=lang,
        intent="GENERAL_ADVISORY",
        suggestions=current_defaults
    )


@router.post("/tts")
def text_to_speech(req: TTSRequest):
    """
    Generate authentic regional accent Text-To-Speech audio stream (MP3).
    - Bengali ('bn'): Native Indian Bengali accent
    - Hindi ('hi'): Native Indian Hindi accent
    - Assamese ('as'): Native Eastern Indic accent
    - Santhali ('sat'): Native Indic accent
    - English ('en'): Native Indian English accent (co.in)
    """
    content = req.text
    if not content:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # Clean markdown, bullets, and excessive spaces
    clean_text = re.sub(r"[#*_`~>\[\]]", " ", content)
    clean_text = re.sub(r"https?://\S+", "", clean_text)
    clean_text = re.sub(r"\s+", " ", clean_text).strip()

    if not clean_text:
        clean_text = "Hello"

    # Truncate to first 450 characters for rapid real-time audio playback
    if len(clean_text) > 450:
        clean_text = clean_text[:450] + "..."

    norm_lang = normalize_lang_code(req.language)

    try:
        from gtts import gTTS
        if norm_lang == "bn":
            tts = gTTS(text=clean_text, lang="bn", slow=False)
        elif norm_lang == "hi":
            tts = gTTS(text=clean_text, lang="hi", slow=False)
        elif norm_lang == "as":
            tts = gTTS(text=clean_text, lang="bn", slow=False)
        elif norm_lang == "sat":
            tts = gTTS(text=clean_text, lang="hi", slow=False)
        else: # Indian English accent
            tts = gTTS(text=clean_text, lang="en", tld="co.in", slow=False)

        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return StreamingResponse(fp, media_type="audio/mpeg")
    except Exception as e:
        print(f"TTS audio generation exception: {e}")
        raise HTTPException(status_code=500, detail=f"TTS Generation failed: {str(e)}")
