import re
from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["Vernacular Chatbot Assistant"])

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

# Intent dictionary with multi-lingual patterns (English, Hindi, Santhali, Bengali, Assamese)
INTENTS = [
    {
        "intent": "GREETING",
        "patterns": [
            r"\b(hello|hi|hey|johar|namaste|pranam|namaskar|hul|kemon|kemcho)\b",
            r"(नमस्ते|प्रणाम|जोहार|जय जोहार|নমস্কার|জোহাৰ|নমস্কাৰ)"
        ],
        "replies": {
            "en": "Johar! Welcome to the AI Scholarship Portal for Tribal Students (SIH26239). How may I assist you with your scholarship application today?",
            "hi": "जोहार! जनजातीय छात्र छात्रवृत्ति पोर्टल (SIH26239) में आपका स्वागत है। मैं आपकी छात्रवृत्ति आवेदन में कैसे मदद कर सकता हूँ?",
            "sat": "ᱡᱚᱦᱟᱨ! ᱟᱢ ᱫᱚ ᱱᱚᱣᱟ Tribal Scholarship Portal ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ। ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱵᱟᱵᱚᱛ ᱪᱮᱫ ᱵᱟᱰᱟᱭ ᱥᱟᱱᱟᱢᱮᱫ ᱢᱮᱭᱟ?",
            "bn": "জোহার ও নমস্কার! উপজাতি ছাত্রবৃত্তি পোর্টালে (SIH26239) আপনাকে স্বাগতম। বৃত্তির আবেদন সংক্রান্ত কীভাবে আপনাকে সাহায্য করতে পারি?",
            "as": "জোহাৰ আৰু নমস্কাৰ! জনজাতীয় ছাত্ৰবৃত্তি পৰ্টেললৈ (SIH26239) আপোনাক স্বাগতম। বৃত্তিৰ আবেদন সম্পৰ্কে আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?"
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
            r"(income\s*limit|income\s*criteria|max\s*income|ceiling|kamai|aay\s*sima|aaye|b वार्षिक আয়)",
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
            r"(ऑटो फिल|स्कैन|अपलोड|দস্তাवेज स्कैन|অটো-ফিল|স্ক্যান|আপলোড)"
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
        # Distinguish Assamese specific letter ৰ (09F0) or ৱ (09F1)
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

@router.post("/chat", response_model=ChatResponse)
async def chat_vernacular(req: ChatRequest):
    """
    Multilingual vernacular assistant responding in English, Hindi, Santhali, Bengali, and Assamese.
    """
    lang = detect_language(req.message, req.language or "en")
    user_msg = req.message.lower().strip()

    for item in INTENTS:
        for pattern in item["patterns"]:
            if re.search(pattern, user_msg, re.IGNORECASE):
                reply_text = item["replies"].get(lang, item["replies"]["en"])
                sug_list = item["suggestions"].get(lang, item["suggestions"]["en"])
                return ChatResponse(
                    success=True,
                    reply=reply_text,
                    language=lang,
                    intent=item["intent"],
                    suggestions=sug_list
                )

    # General Fallbacks
    fallback_replies = {
        "en": "Johar! I can guide you on Tribal Scholarship schemes, required documents (Caste/Income certificates), income limits, and how our OCR Auto-Fill works. Feel free to ask!",
        "hi": "जोहार! मैं आपको जनजातीय छात्रवृत्ति योजनाओं, आवश्यक प्रमाण पत्रों, आय सीमा, और AI दस्तावेज़ सत्यापन के बारे में जानकारी दे सकता हूँ। आप कुछ भी पूछ सकते हैं!",
        "sat": "ᱡᱚᱦᱟᱨ! ᱤᱧ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱡᱚᱡᱚᱱᱟ, ᱡᱟᱹᱛᱤ/ᱟᱭ ᱥᱟᱠᱟᱢ, ᱟᱨ Auto-Fill OCR ᱵᱟᱵᱚᱛ ᱞᱟᱹᱭ ᱫᱟᱲᱮᱭᱟᱢᱟ।",
        "bn": "জোহার! আমি আপনাকে উপজাতি স্কলারশিপ প্রকল্প, প্রয়োজনীয় নথিপত্র (জাতি/আয় সার্টিফিকেট) এবং AI অটো-ফিল সংক্রান্ত তথ্য দিতে পারি। নির্দ্বিধায় জিজ্ঞাসা করুন!",
        "as": "জোহাৰ! মই আপোনাক জনজাতীয় বৃত্তি আঁচনি, প্ৰয়োজনীয় নথিপত্ৰ (জাতি/আয়ৰ চার্টিফিকেট) আৰু AI অটো-ফিল সম্পৰ্কে সহায় কৰিব পাৰোঁ। আপুনি যিকোনো প্ৰশ্ন সুধিব পাৰে!"
    }

    fallback_sug = {
        "en": ["What documents do I need?", "What is the income limit for ST?", "How does Auto-Fill OCR work?"],
        "hi": ["कौन से दस्तावेज़ चाहिए?", "ST छात्रवृत्ति की आय सीमा क्या है?", "Auto-Fill OCR कैसे काम करता है?"],
        "sat": ["ᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱞᱟᱜᱟᱜ-ᱟ?", "ST ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱟᱭ?", "Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?"],
        "bn": ["কি কি নথিপত্র প্রয়োজন?", "ST বৃত্তির আয় সীমা কত?", "Auto-Fill OCR কীভাবে কাজ করে?"],
        "as": ["কি কি নথিপত্ৰ লাগিব?", "ST বৃত্তিৰ বাবে সৰ্বাধিক আয় কিমান?", "Auto-Fill OCR কেনেকৈ হয়?"]
    }

    return ChatResponse(
        success=True,
        reply=fallback_replies.get(lang, fallback_replies["en"]),
        language=lang,
        intent="GENERAL_HELP",
        suggestions=fallback_sug.get(lang, fallback_sug["en"])
    )
