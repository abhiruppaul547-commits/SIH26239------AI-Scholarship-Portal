import { getCleanFirstName } from "./nameUtils";

export interface AIFallbackResult {
  reply: string;
  suggestions: string[];
}

export function getSmartFallbackResponse(
  message: string,
  language: string = "en",
  userName?: string
): AIFallbackResult {
  const query = (message || "").toLowerCase().trim();
  const name = userName ? getCleanFirstName(userName) : "";
  const namePrefix = name && name !== "Student" ? `${name}, ` : "";

  // Topic detection
  const isDocQuery =
    /document|doc|certificate|caste|income cert|marksheet|bonafide|aadhaar|passbook|proof|checklist|কাগজ|নথি|নথিপত্র|দস্তাবেজ|दस्तावेज़|प्रमाण|कागजात|ᱠᱟᱜᱚᱡᱽ/.test(
      query
    );
  const isIncomeQuery =
    /income|limit|ceiling|eligible|eligibility|criteria|salary|lakh|2\.5|6 lakh|आय|সীমা|আয় সীমা|পৰিয়ালৰ আয়|বাৰ্ষিক আয়|ᱟᱭ/.test(
      query
    );
  const isOcrQuery =
    /ocr|scan|auto-fill|autofill|upload|extract|verify|camera|স্ক্যান|আপলোড|অটো-ফিল|स्कैन|ऑटो-फिल|ᱞᱟᱫᱮ/.test(
      query
    );
  const isSchemeQuery =
    /scheme|schemes|post-matric|post matric|fellowship|top class|overseas|pre-matric|योजना|প্রকল্প|আঁচনি|ᱡᱚᱡᱚᱱᱟ/.test(
      query
    );
  const isApplyQuery =
    /apply|process|how to|procedure|deadline|date|track|status|login|portal|आवेदन|আবেদন|প্ৰক্ৰিয়া|ᱞᱟᱜᱟᱣ/.test(
      query
    );

  // 1. Bengali (bn)
  if (language === "bn") {
    if (isDocQuery) {
      return {
        reply: `নমস্কার ${namePrefix}ST বৃত্তির আবেদনের জন্য নিম্নলিখিত নথিগুলি প্রয়োজন:

### 📄 প্রয়োজনীয় নথিপত্রের তালিকা:
1. **উপজাতি / জাতিগত শংসাপত্র (Caste Certificate)**: মহকুমা শাসক (SDO) বা উপযুক্ত রাজস্ব কর্তৃপক্ষ দ্বারা প্রদত্ত।
2. **পারিবারিক আয়ের শংসাপত্র (Income Certificate)**: বর্তমান আর্থিক বছরের জন্য রাজস্ব আধিকারিক বা উপযুক্ত কর্তৃপক্ষ প্রদত্ত।
3. **পূর্ববর্তী শিক্ষাবর্ষের মার্কশিট / গ্রেড কার্ড**: সর্বশেষ উত্তীর্ণ পরীক্ষার স্ব-প্রত্যয়িত অনুলিপি।
4. **বোনাফাইড শিক্ষার্থী শংসাপত্র (Bonafide Certificate)** বা বর্তমান প্রতিষ্ঠানে ভর্তির রসিদ।
5. **আধার কার্ড (Aadhaar Card)**: সরাসরি DBT হস্তান্তরের জন্য ব্যাংক অ্যাকাউন্টের সাথে যুক্ত (Aadhaar-seeded) থাকতে হবে।
6. **ব্যাংক পাসবই / বাতিল চেক (Cancelled Cheque)**: ব্যাংক অ্যাকাউন্টের স্পষ্ট বিবরণ ও IFSC কোড।
7. **পাসপোর্ট সাইজ রঙিন ছবি**।

💡 **বিশেষ সুবিধা**: আমাদের পোর্টালে আপনার কাস্ট ও ইনকাম সার্টিফিকেট আপলোড করলে AI OCR সিস্টেম স্বয়ংক্রিয়ভাবে ফর্ম পূরণ করে দেয়!`,
        suggestions: ["ST বৃত্তির আয় সীমা কত?", "Auto-Fill কীভাবে কাজ করে?", "আবেদনের শেষ তারিখ কবে?"],
      };
    }
    if (isIncomeQuery) {
      return {
        reply: `নমস্কার ${namePrefix}জনজাতি বিষয়ক মন্ত্রকের অধীন বৃত্তি প্রকল্পগুলির পারিবারিক বার্ষিক আয়ের সীমা নিম্নরূপ:

### 💰 পারিবারিক বার্ষিক আয়ের সীমা:
• **পোস্ট-ম্যাট্রিক বৃত্তি (Post-Matric ST)**: পারিবারিক বার্ষিক আয় **₹২,৫০,০০০ (২.৫ লক্ষ টাকা)** বা তার কম হতে হবে। সম্পূর্ণ নন-রিফান্ডেবল টিউশন ফি ও মাসিক রক্ষণাবেক্ষণ ভাতা প্রদান করা হয়।
• **শীর্ষ প্রতিষ্ঠানে শীর্ষ শ্রেণীর শিক্ষা (Top Class Education)**: IIT, NIT, IIM, AIIMS প্রভৃতি জাতীয় প্রতিষ্ঠানে অধ্যয়রত ST শিক্ষার্থীদের জন্য আয়ের সীমা **₹৬,০০,০০০ (৬ লক্ষ টাকা)**। সম্পূর্ণ টিউশন ফি, প্রতি বছর ₹৩৬,০০০ থাকার খরচ এবং ₹৪৫,০০০ ল্যাপটপ অনুদান প্রদান করা হয়।
• **উচ্চ শিক্ষার জন্য জাতীয় ফেলোশিপ (National Fellowship)**: M.Phil ও Ph.D. গবেষকদের জন্য মেধাভিত্তিক সম্পূর্ণ আর্থিক অনুদান।
• **প্রি-ম্যাট্রিক বৃত্তি (Class 9-10)**: পারিবারিক বার্ষিক আয় **₹২,০০,০০০ (২ লক্ষ টাকা)** বা তার কম।`,
        suggestions: ["কি কি নথিপত্র লাগবে?", "Auto-Fill কীভাবে কাজ করে?", "Top Class বৃত্তির সুবিধা কী?"],
      };
    }
    if (isOcrQuery) {
      return {
        reply: `নমস্কার ${namePrefix}আমাদের AI OCR স্বয়ংক্রিয় ফর্ম পূরণ (Auto-Fill) ব্যবস্থা অত্যন্ত সহজ ও দ্রুত:

### ⚡ AI Auto-Fill ব্যবহারের ধাপসমূহ:
1. আবেদন পৃষ্ঠার শীর্ষে থাকা **AI Document Scanner** বক্সে আপনার জাতিগত (Caste) বা আয়ের (Income) সার্টিফিকেটের ছবি/PDF আপলোড করুন।
2. মাত্র ৩ সেকেন্ডের মধ্যে আমাদের কৃত্রিম বুদ্ধিমত্তা আপনার নাম, উপজাতি, সার্টিফিকেটের নম্বর ও বার্ষিক আয় নির্ভুলভাবে স্ক্যান করবে।
3. সমস্ত তথ্য স্বয়ংক্রিয়ভাবে আবেদন ফর্মের নির্দিষ্ট ঘরে পূরণ হয়ে যাবে এবং নিচে নথিপত্র সংযুক্তির ঘরে ফাইলটি স্বয়ংক্রিয়ভাবে যুক্ত হবে।
4. আপনাকে শুধুমাত্র তথ্যগুলি যাচাই করে নিশ্চিত করতে হবে!`,
        suggestions: ["কি কি নথিপত্র লাগবে?", "ST বৃত্তির আয় সীমা কত?", "বৃত্তি স্ট্যাটাস কীভাবে দেখব?"],
      };
    }
    return {
      reply: `নমস্কার ${namePrefix}জনজাতি বিষয়ক মন্ত্রকের AI বৃত্তি উপদেষ্টা হিসেবে আমি আপনাকে সাহায্য করতে প্রস্তুত।

আমাদের পোর্টালে আপনি ST শিক্ষার্থীদের জন্য পোস্ট-ম্যাট্রিক বৃত্তি, ন্যাশনাল ফেলোশিপ এবং শীর্ষ প্রতিষ্ঠানের স্কলারশিপ সংক্রান্ত সমস্ত তথ্য পেতে পারেন। এছাড়াও আপনার কাস্ট ও ইনকাম সার্টিফিকেট আপলোড করে মাত্র ২ মিনিটে সম্পূর্ণ আবেদন ফর্ম অটো-ফিল করতে পারবেন।

আপনার কি নির্দিষ্ট কোনো বৃত্তি বা নথিপত্র সম্পর্কে জানার আছে?`,
      suggestions: ["কি কি নথিপত্র লাগবে?", "ST বৃত্তির আয় সীমা কত?", "Auto-Fill কীভাবে কাজ করে?"],
    };
  }

  // 2. Hindi (hi)
  if (language === "hi") {
    if (isDocQuery) {
      return {
        reply: `नमस्ते ${namePrefix}जनजातीय कार्य मंत्रालय की छात्रवृत्ति योजनाओं के लिए निम्नलिखित दस्तावेज़ अनिवार्य हैं:

### 📄 आवश्यक दस्तावेज़ों की सूची:
1. **जाति प्रमाण पत्र (Caste / ST Certificate)**: सक्षम राजस्व प्राधिकारी (SDO / Tehsildar) द्वारा जारी वैध प्रमाण पत्र।
2. **पारिवारिक आय प्रमाण पत्र (Income Certificate)**: सक्षम राजस्व अधिकारी द्वारा जारी चालू वित्तीय वर्ष का आय प्रमाण पत्र।
3. **पिछली कक्षा की अंकतालिका (Marksheet)**: अंतिम उत्तीर्ण परीक्षा की स्व-हस्ताक्षरित प्रति।
4. **बोनाफाइड प्रमाण पत्र / प्रवेश रसीद (Bonafide Certificate / Fee Receipt)**: वर्तमान मान्यता प्राप्त शिक्षण संस्थान से।
5. **आधार कार्ड (Aadhaar Card)**: DBT लाभ प्राप्त करने के लिए बैंक खाते से लिंक (Aadhaar-seeded) होना अनिवार्य है।
6. **बैंक पासबुक / निरस्त चेक (Bank Passbook / Cancelled Cheque)**: स्पष्ट बैंक खाता संख्या और IFSC कोड।
7. **पासपोर्ट आकार का फोटो**।

💡 **सुविधा**: पोर्टल पर प्रमाणपत्र अपलोड करते ही AI OCR सिस्टम स्वतः फॉर्म भर देता है!`,
        suggestions: ["ST छात्रवृत्ति की आय सीमा?", "Auto-Fill कैसे काम करता है?", "आवेदन कैसे करें?"],
      };
    }
    if (isIncomeQuery) {
      return {
        reply: `नमस्ते ${namePrefix}जनजातीय कार्य मंत्रालय द्वारा निर्धारित आय सीमाएं इस प्रकार हैं:

### 💰 पारिवारिक आय सीमा एवं पात्रता:
• **पोस्ट-मैट्रिक छात्रवृत्ति (Post-Matric ST)**: परिवार की वार्षिक आय **₹2,50,000 (2.5 लाख रुपये)** या उससे कम होनी चाहिए। इसमें संपूर्ण गैर-वापसी योग्य शिक्षण शुल्क और मासिक भत्ता मिलता है।
• **शीर्ष संस्थानों में उच्च शिक्षा (Top Class Education)**: IITs, NITs, IIMs, AIIMS जैसे राष्ट्रीय संस्थानों में अध्ययनरत छात्रों के लिए वार्षिक आय सीमा **₹6,00,000 (6 लाख रुपये)** है। पूरी फीस + ₹36,000/वर्ष निर्वाह भत्ता + ₹45,000 लैपटॉप अनुदान।
• **राष्ट्रीय फेलोशिप (National Fellowship)**: M.Phil एवं Ph.D. के लिए मेरिट आधारित पूर्ण फैलोशिप।
• **प्री-मैट्रिक छात्रवृत्ति (कक्षा 9-10)**: वार्षिक पारिवारिक आय **₹2,00,000 (2 लाख रुपये)** से अधिक नहीं होनी चाहिए।`,
        suggestions: ["कौन से दस्तावेज़ चाहिए?", "Auto-Fill कैसे काम करता है?", "Top Class योजना क्या है?"],
      };
    }
    if (isOcrQuery) {
      return {
        reply: `नमस्ते ${namePrefix}हमारा AI OCR दस्तावेज़ स्कैनर आपकी आवेदन प्रक्रिया को बेहद आसान बनाता है:

### ⚡ AI Auto-Fill कैसे कार्य करता है:
1. आवेदन पृष्ठ पर दिए गए **AI Document Scanner** में अपना जाति या आय प्रमाण पत्र अपलोड करें।
2. सिस्टम कुछ ही सेकंड में आपका नाम, जनजाति, प्रमाण पत्र संख्या और आय सीधे स्कैन कर लेता है।
3. यह जानकारी आवेदन फॉर्म में स्वतः भर जाती है और अपलोड किया गया दस्तावेज़ नीचे संलग्न हो जाता है।
4. आपको बस विवरण की पुष्टि करनी होती है!`,
        suggestions: ["कौन से दस्तावेज़ चाहिए?", "ST छात्रवृत्ति की आय सीमा?", "आवेदन कैसे करें?"],
      };
    }
    return {
      reply: `नमस्ते ${namePrefix}जनजातीय कार्य मंत्रालय के AI छात्रवृत्ति सलाहकार के रूप में मैं आपकी सेवा में उपस्थित हूँ।

आप पोस्ट-मैट्रिक, नेशनल फेलोशिप, टॉप क्लास शिक्षा, पात्रता, आय सीमा या आवेदन प्रक्रिया से संबंधित कोई भी सवाल पूछ सकते हैं। आप अपने प्रमाण पत्र अपलोड करके तुरंत फॉर्म ऑटो-फिल भी कर सकते हैं।`,
      suggestions: ["कौन से दस्तावेज़ चाहिए?", "ST छात्रवृत्ति की आय सीमा?", "Auto-Fill कैसे काम करता है?"],
    };
  }

  // 3. Assamese (as)
  if (language === "as") {
    if (isDocQuery) {
      return {
        reply: `নমস্কাৰ ${namePrefix}জনজাতীয় পৰিক্ৰমা মন্ত্ৰালয়ৰ বৃত্তিৰ বাবে তলত দিয়া নথিপত্ৰসমূহ প্ৰয়োজন:

### 📄 প্ৰয়োজনীয় নথিপত্ৰৰ তালিকা:
1. **জনজাতি প্ৰমাণপত্ৰ (ST Caste Certificate)**: উপযুক্ত ৰাজহ বিষয়া (SDO/চক্ৰ বিষয়া) দ্বাৰা প্ৰদত্ত।
2. **বাৰ্ষিক আয়ৰ প্ৰমাণপত্ৰ (Income Certificate)**: চলিত বৰ্ষৰ বাবে অনুমোদিত বিষয়াৰ দ্বাৰা জাৰী কৰা।
3. **পূৰ্ববৰ্তী শিক্ষাবৰ্ষৰ মাৰ্কশ্বীট (Marksheet)**: সৰ্বশেষ উত্তীৰ্ণ পৰীক্ষাৰ প্ৰতিলিপি।
4. **বোনাফাইড ছাত্ৰ প্ৰমাণপত্ৰ (Bonafide Certificate)** বা নামভৰ্তিৰ মাচুল ৰচিদ।
5. **আধাৰ কাৰ্ড (Aadhaar Card)**: DBT লাভৰ বাবে বেংক একাউণ্টৰ সৈতে লিংক থকা বাধ্যতামূলক।
6. **বেংক পাছবুক / বাতিল চেক**: একাউণ্ট নম্বৰ আৰু IFSC ক'ড স্পষ্টভাৱে থকা।
7. **পাছপ'ৰ্ট আকাৰৰ ফটো**।`,
        suggestions: ["ST বাৰ্ষিক আয়ৰ সীমা কিমান?", "Auto-Fill কেনেকৈ কাম কৰে?", "আবেদন কেনেকৈ কৰিম?"],
      };
    }
    if (isIncomeQuery) {
      return {
        reply: `নমস্কাৰ ${namePrefix}জনজাতীয় বৃত্তি আঁচনিসমূহৰ বাবে বাৰ্ষিক আয়ৰ সীমা তলত দিয়া ধৰণৰ:

### 💰 বাৰ্ষিক আয়ৰ সীমা:
• **প'ষ্ট-মেট্ৰিক বৃত্তি (Post-Matric ST)**: পৰিয়ালৰ বাৰ্ষিক আয় **₹২,৫০,০০০ (২.৫ লাখ টকা)** বা তাতকৈ কম হ'ব লাগিব।
• **শীৰ্ষ শিক্ষানুষ্ঠানৰ শীৰ্ষ শ্ৰেণীৰ শিক্ষা (Top Class Education)**: IIT, NIT, AIIMS আদিৰ বাবে আয়ৰ সীমা **₹৬,০০,০০০ (৬ লাখ টকা)**।
• **প্ৰি-মেট্ৰিক বৃত্তি (Class 9-10)**: পৰিয়ালৰ বাৰ্ষিক আয় **₹২,০০,০০০ (২ লাখ টকা)** বা কম হ'ব লাগিব।`,
        suggestions: ["কি কি নথিপত্ৰ লাগিব?", "Auto-Fill কেনেকৈ কাম কৰে?", "বৃত্তিৰ সুবিধা কি কি?"],
      };
    }
    return {
      reply: `নমস্কাৰ ${namePrefix}জনজাতীয় পৰিক্ৰমা মন্ত্ৰালয়ৰ AI বৃত্তি পৰামৰ্শদাতা হিচাপে মই আপোনাক সহায় কৰিবলৈ সাজু।

আপুনি বৃত্তিৰ যোগ্যতা, আয়ৰ সীমা, প্ৰয়োজনীয় নথিপত্ৰ বা অনলাইন আবেদন সম্পৰ্কে যিকোনো প্ৰশ্ন সুধিব পাৰে।`,
      suggestions: ["কি কি নথিপত্ৰ লাগিব?", "ST বাৰ্ষিক আয়ৰ সীমা কিমান?", "Auto-Fill কেনেকৈ কাম কৰে?"],
    };
  }

  // 4. Santhali (sat)
  if (language === "sat") {
    if (isDocQuery) {
      return {
        reply: `ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ ${namePrefix}ST ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱶᱟ ᱠᱟᱜᱚᱡᱽ ᱠᱚ ᱞᱟᱹᱠᱛᱤᱭᱟ:

### 📄 ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱜᱚᱡᱽ ᱠᱚ:
1. **ᱡᱟᱹᱛᱤ ᱥᱟᱠᱟᱢ (Caste Certificate)**: SDO ᱥᱮ ᱥᱚᱨᱠᱟᱨᱤ ᱟᱹᱢᱟᱹᱞᱤ ᱴᱷᱮᱱ ᱠᱷᱚᱱ ᱧᱟᱢ ᱟᱠᱟᱱ।
2. **ᱟᱭ ᱥᱟᱠᱟᱢ (Income Certificate)**: ᱜᱷᱟᱨᱚᱸᱡᱽ ᱨᱮᱱᱟᱜ ᱥᱮᱨᱢᱟᱠᱤᱭᱟᱹ ᱟᱭ ᱨᱮᱱᱟᱜ ᱥᱟᱠᱟᱢ।
3. **ᱢᱟᱨᱠᱥᱤᱴ (Marksheet)**: ᱯᱟᱨᱚᱢᱮᱱ ᱪᱟᱱᱟᱪ ᱨᱮᱱᱟᱜ ᱯᱟᱥ ᱥᱟᱠᱟᱢ।
4. **ᱵᱚᱱᱟᱯᱷᱟᱭᱤᱰ ᱥᱟᱠᱟᱢ (Bonafide Certificate)**: ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱨᱮ ᱯᱟᱲᱦᱟᱣᱜ ᱠᱟᱱ ᱨᱮᱱᱟᱜ ᱥᱟᱹᱵᱩᱫᱽ।
5. **ᱟᱫᱷᱟᱨ ᱠᱟᱨᱰ (Aadhaar Card)**: ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤᱭᱟ।
6. **ᱵᱮᱸᱠ ᱯᱟᱥᱵᱩᱠ (Bank Passbook)**: ᱴᱟᱠᱟ ᱥᱚᱡᱷᱮ ᱵᱮᱸᱠ ᱨᱮ ᱦᱤᱡᱩᱜ ᱞᱟᱹᱜᱤᱫ।`,
        suggestions: ["ST ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱟᱭ?", "Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?", "ᱪᱮᱫ ᱞᱮᱠᱟ ᱟᱵᱮᱫᱚᱱᱟ?"],
      };
    }
    return {
      reply: `ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ ${namePrefix}ᱤᱧ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ AI ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ ᱠᱟᱱᱟᱹᱧ। ᱥᱠᱚᱞᱟᱨᱥᱤᱯ, ᱠᱟᱜᱚᱡᱽ-ᱯᱟᱛᱨᱚ ᱟᱨ ᱟᱭ ᱵᱟᱵᱚᱛ ᱡᱚᱛᱚ ᱠᱟᱛᱷᱟ ᱤᱧ ᱵᱟᱰᱟᱭ ᱚᱪᱚ ᱫᱟᱲᱮᱭᱟᱢᱟ।`,
      suggestions: ["ᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱞᱟᱜᱟᱜ-ᱟ?", "ST ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱟᱭ?", "Auto-Fill OCR ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ?"],
    };
  }

  // 5. English (Default)
  if (isDocQuery) {
    return {
      reply: `Hello ${namePrefix}! Here is the comprehensive checklist of documents required for Ministry of Tribal Affairs (ST) scholarships:

### 📄 Mandatory Documents Checklist:
1. **Caste / Tribe Certificate (ST Certificate)**: Valid certificate issued by a Competent Revenue Authority (SDO / Tehsildar / Sub-Divisional Magistrate).
2. **Family Annual Income Certificate**: Issued by the designated Revenue Authority for the current financial year.
3. **Previous Academic Marksheet**: Marksheet/Grade card of the highest qualifying examination.
4. **Bonafide Student Certificate / Admission Letter**: Issued by your recognized school, college, or university confirming current enrollment and fee structure.
5. **Aadhaar Card**: Must be linked and seeded with your bank account (Aadhaar Payment Bridge) for direct DBT fund transfer.
6. **Active Bank Account Passbook / Cancelled Cheque**: Bank details clearly displaying Account Number, Account Holder Name, and IFSC Code.
7. **Passport-Sized Photograph**: Recent color photograph.

💡 **AI Auto-Fill Feature**: You don't have to type these manually! Simply upload your Caste and Income certificates into our **AI Document Scanner** above, and our OCR engine will automatically extract and populate your application form within seconds!`,
      suggestions: [
        "What are the income limits for ST scholarships?",
        "How does AI Auto-Fill OCR work?",
        "What is the Top Class Education scheme?",
      ],
    };
  }

  if (isIncomeQuery) {
    return {
      reply: `Hello ${namePrefix}! Here are the official annual family income limits and eligibility criteria for Ministry of Tribal Affairs ST scholarships:

### 💰 Annual Family Income Limits:
1. **Post-Matric Scholarship for ST Students (Class 11 to Ph.D.)**:
   • **Income Ceiling**: **₹2,50,000 (₹2.5 Lakhs)** per annum.
   • **Benefits**: 100% compulsory non-refundable tuition fees reimbursed + Monthly maintenance allowance.

2. **Top Class Education for ST Students in Premier Institutes (IITs, NITs, IIMs, AIIMS, NLUs)**:
   • **Income Ceiling**: **₹6,00,000 (₹6.0 Lakhs)** per annum.
   • **Benefits**: Full tuition fee waiver + ₹3,000/month living expense (₹36,000/yr) + ₹5,000/yr books/stationery + One-time Computer/Laptop grant up to ₹45,000.

3. **National Fellowship for Higher Education of ST Students (M.Phil / Ph.D.)**:
   • **Eligibility**: Merit-based research scholars enrolled in full-time research programs (Income ceiling ₹6.0 Lakhs for scholarship component).

4. **Pre-Matric Scholarship for ST Students (Class 9 & 10)**:
   • **Income Ceiling**: **₹2,00,000 (₹2.0 Lakhs)** per annum.
   • **Benefits**: Day scholars ₹2,250/yr, Hostellers ₹5,250/yr.`,
      suggestions: [
        "What documents do I need?",
        "How do I apply for Top Class Education?",
        "How does Auto-Fill OCR work?",
      ],
    };
  }

  if (isOcrQuery) {
    return {
      reply: `Hello ${namePrefix}! Our portal features an intelligent **AI Document OCR Auto-Fill** system designed to eliminate manual data entry errors:

### ⚡ How AI Auto-Fill Works:
1. **Upload Certificate**: Click or drop your Caste or Income Certificate (PNG, JPG, PDF) into the AI Document Scanner at the top of the application page.
2. **Instant Computer Vision Extraction**: In under 3 seconds, OpenCV and Google Vision models scan the certificate and extract:
   • Full Applicant Name
   • Tribe / Community Category
   • Certificate Number & Issue Date
   • Annual Family Income
3. **Automatic Form Population**: The extracted fields are instantly written directly into your application form with zero typing required.
4. **Auto-Attachment**: The uploaded certificate file is automatically linked and marked as attached in the document upload section below.`,
      suggestions: [
        "What documents do I need?",
        "Income limits for ST scholarships?",
        "How to track my application status?",
      ],
    };
  }

  if (isSchemeQuery) {
    return {
      reply: `Hello ${namePrefix}! The Ministry of Tribal Affairs (Govt. of India) administers five flagship scholarship schemes for ST students:

### 🎓 Flagship ST Scholarship Schemes:
1. **Post-Matric Scholarship for ST Students**: For Class 11, 12, ITI, Polytechnic, UG, and PG programs. Income limit ₹2.5L/year. Covers tuition fees + monthly stipend.
2. **Top Class Education for ST Students**: For meritorious students admitted to notified premier institutes (IITs, NITs, IIMs, AIIMS, NLUs). Full tuition + ₹36,000/yr living expense + ₹45,000 laptop grant.
3. **National Fellowship for ST Students**: Monthly fellowship stipend (JRF/SRF) for students pursuing regular M.Phil and Ph.D. research degrees.
4. **Pre-Matric Scholarship**: For Class 9 and 10 students in government/aided schools to prevent dropouts.
5. **National Overseas Scholarship**: Financial support for ST scholars admitted to top 500 QS-ranked universities abroad for Masters, Ph.D., and Post-Doctoral studies.`,
      suggestions: [
        "What documents do I need?",
        "What is the income limit for Post-Matric?",
        "How does Auto-Fill OCR work?",
      ],
    };
  }

  if (isApplyQuery) {
    return {
      reply: `Hello ${namePrefix}! Applying for your ST scholarship is quick and seamless on our AI-powered portal:

### 🚀 Step-by-Step Application Guide:
1. **Sign In**: Log into your student account.
2. **Scan Documents with AI**: Navigate to **Apply Scholarship** and upload your Caste and Income certificates in the top scanner to auto-fill your details.
3. **Review & Confirm**: Verify the auto-populated details (Name, Tribe, Annual Income, Academic details).
4. **Submit & Track**: Submit the application. Your institution and State Nodal Officer will verify it digitally, and funds will be credited directly to your bank account via Aadhaar DBT.`,
      suggestions: [
        "What documents do I need?",
        "Income limits for ST scholarships?",
        "How does Auto-Fill OCR work?",
      ],
    };
  }

  // General Fallback
  return {
    reply: `Hello ${namePrefix}! As your official AI Scholarship Advisor for the Ministry of Tribal Affairs, I am here to guide you with any questions about ST scholarships, higher education funding, and portal features.

You can ask me anything about:
• **Required Documents** for ST applications
• **Income Limits & Eligibility** (Post-Matric limit ₹2.5L, Top Class ₹6L)
• **How AI Document Auto-Fill (OCR)** works
• **Premier Institutes** (IITs, NITs, AIIMS, IIMs) benefits and grants
• Direct Benefit Transfer (DBT) and Aadhaar seeding

How may I assist you today?`,
    suggestions: [
      "What documents do I need?",
      "Income limits for ST scholarships?",
      "How does Auto-Fill OCR work?",
    ],
  };
}
