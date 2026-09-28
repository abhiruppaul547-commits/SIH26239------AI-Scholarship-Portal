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
  const greetingName = name && name !== "Student" ? ` ${name}` : "";

  // -------------------------------------------------------------
  // 1. MATHEMATICS & PARTIAL DIFFERENTIAL EQUATIONS (PDEs / ODEs)
  // -------------------------------------------------------------
  const isPdeQuery =
    /partial\s*differential|pde|differential\s*equation|heat\s*equation|wave\s*equation|laplace|navier\s*stokes|schrodinger|boundary\s*condition|дифференциал|ডিফারেনশিয়াল|समीकरण/.test(
      query
    );

  if (isPdeQuery) {
    if (language === "hi") {
      return {
        reply: `नमस्ते${greetingName}! 🙏 **आंशिक अवकल समीकरण (Partial Differential Equations - PDEs)** का विस्तृत एवं स्पष्ट विश्लेषण:

### 📐 आंशिक अवकल समीकरण (PDE) क्या है?
एक **Partial Differential Equation (PDE)** ऐसा गणितीय समीकरण है जिसमें दो या दो से अधिक स्वतंत्र चरों (Independent Variables जैसे स्थान \(x, y, z\) और समय \(t\)) पर निर्भर एक अज्ञात फलन (Unknown Function \(u\)) और उसके **आंशिक अवकलज (Partial Derivatives)** शामिल होते हैं।

---
### 🔍 साधारण (ODE) बनाम आंशिक (PDE) अवकल समीकरण
• **ODE (Ordinary Differential Equation):** केवल एक स्वतंत्र चर होता है (उदा. समय \(t\) के साथ लोलक की गति)।
• **PDE (Partial Differential Equation):** बहु-आयामी प्रणालियों को दर्शाता है जहाँ भौतिक राशियाँ स्थान और समय दोनों के साथ बदलती हैं।

---
### 🏛️ मुख्य शास्त्रीय PDEs (Fundamental Canonical Prototypes)
1. **ऊष्मा समीकरण (Heat Equation - Parabolic):**
   $$\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u$$
   ऊष्मा के संचरण और विसरण (Diffusion) की प्रक्रिया को दर्शाता है।
2. **तरंग समीकरण (Wave Equation - Hyperbolic):**
   $$\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u$$
   ध्वनि तरंगों, प्रकाश, भूकंपीय तरंगों और जल तरंगों के प्रसार का गणितीय मॉडल।
3. **लाप्लास एवं पॉइसन समीकरण (Laplace & Poisson - Elliptic):**
   $$\\nabla^2 u = 0 \\quad \\text{अथवा} \\quad \\nabla^2 u = f$$
   स्थिर विद्युत विभव (Electrostatics), गुरुत्वाकर्षण क्षेत्र और द्रव संतुलन को व्यक्त करता है।
4. **नेवियर-स्टोक्स समीकरण (Navier-Stokes Equations):**
   वायु एवं जल जैसे श्यान द्रवों (Viscous Fluids) के प्रवाह और गतिशीलता का नियमन करता है।
5. **श्रोडिंगर समीकरण (Schrödinger Equation):**
   क्वांटम यांत्रिकी में कणों की तरंग-प्रकृति और अवस्था-विकास का आधारभूत समीकरण।

---
### 🛠️ समाधान की विधियाँ (Solution Techniques)
• **विश्लेषणात्मक (Analytical):** चरों का पृथक्करण (Separation of Variables), फूरियर रूपांतरण (Fourier Transform), ग्रीन के फलन (Green's Functions)।
• **संख्यात्मक (Numerical/Computational):** परिमित तत्व विधि (Finite Element Method - FEM), परिमित अंतर विधि (Finite Difference Method - FDM)।

---
### 🌍 वास्तविक दुनिया में अनुप्रयोग
एयरोस्पेस इंजीनियरिंग (विमान डिजाइन), मौसम का पूर्वानुमान (Weather Forecasting), वित्तीय अर्थमिति (Black-Scholes Options Model), और बायो-मेडिकल इमेजिंग।`,
        suggestions: [
          "समीकरण हल करने की विधियाँ क्या हैं?",
          "Heat Equation और Wave Equation में अंतर?",
          "ST छात्रों के लिए उच्च शिक्षा स्कॉलरशिप?",
        ],
      };
    }

    if (language === "bn") {
      return {
        reply: `নমস্কার${greetingName}! 🙏 **আংশিক অবকল সমীকরণ (Partial Differential Equations - PDEs)** সম্পর্কে বিস্তারিত ও সুস্পষ্ট বিবরণ:

### 📐 আংশিক অবকল সমীকরণ (PDE) কী?
একটি **Partial Differential Equation (PDE)** হলো এমন একটি গাণিতিক সমীকরণ যাতে একাধিক স্বাধীন চলক (Independent Variables যেমন স্থান \(x, y, z\) এবং সময় \(t\))-এর ওপর নির্ভরশীল একটি অজানা অপেক্ষক (Unknown Function \(u\)) এবং তার **আংশিক অবকলজ (Partial Derivatives)** যুক্ত থাকে।

---
### 🔍 সাধারণ (ODE) বনাম আংশিক (PDE) অবকল সমীকরণ
• **ODE (Ordinary Differential Equation):** কেবল একটি স্বাধীন চলকের প্রেক্ষিতে গঠিত হয়।
• **PDE (Partial Differential Equation):** স্থান ও কাল—উভয় দিকে পরিবর্তিত হওয়া বহু-মাত্রিক প্রাকৃতিক ঘটনা নির্দেশ করে।

---
### 🏛️ প্রধান ধ্রুপদী PDEs (Canonical Equations)
1. **তাপ সঞ্চালন সমীকরণ (Heat / Diffusion Equation):**
   $$\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u$$
   কঠিন ও তরল পদার্থে তাপীয় পরিবহণের হার নির্দেশ করে।
2. **তরঙ্গ সমীকরণ (Wave Equation):**
   $$\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u$$
   শব্দ, আলোক ও তড়িচ্চুম্বকীয় তরঙ্গের বিচ্ছুরণ বর্ণনা করে।
3. **লাপ্লাস ও পয়সন সমীকরণ (Laplace & Poisson Equations):**
   $$\\nabla^2 u = 0$$
   স্থির তড়িৎ বিভব এবং মহাকর্ষীয় বলক্ষেত্রের সাম্যাবস্থা নির্দেশ করে।
4. **নেভিয়ার-স্টোকস সমীকরণ (Navier-Stokes Equations):**
   বায়ু ও তরল পদার্থের প্রবাহ এবং এরোস্পেস ড্র্যাগ নির্ণয় করে।

---
### 🛠️ সমাধানের প্রধান পদ্ধতিসমূহ
• **বিশ্লেষণমূলক (Analytical):** চলক পৃথকীকরণ (Separation of Variables), ফুরিয়ার রূপান্তর (Fourier Transform)।
• **কম্পিউটেশনাল / সংখ্যাতাত্ত্বিক (Numerical):** ফাইনাইট এলিমেন্ট মেথড (FEM), ফাইনাইট ডিফারেন্স মেথড (FDM)।

বিজ্ঞান, মহাকাশ গবেষণা এবং কোয়ান্টাম ফিজিক্সে PDEs অন্যতম মৌলিক স্তম্ভ।`,
        suggestions: [
          "Heat Equation কীভাবে কাজ করে?",
          "ODE এবং PDE এর মধ্যে মূল পার্থক্য কী?",
          "আইআইটি/এনআইটিতে উচ্চশিক্ষা বৃত্তি?",
        ],
      };
    }

    // Default English for PDE
    return {
      reply: `Hello${greetingName}! 🙏 Here is a comprehensive and rigorous explanation of **Partial Differential Equations (PDEs)**:

### 📐 What is a Partial Differential Equation (PDE)?
A **Partial Differential Equation (PDE)** is a mathematical equation that relates an unknown multivariable function \(u(x_1, x_2, \\dots, x_n)\) to its **partial derivatives** with respect to multiple independent variables (most commonly spatial coordinates \(x, y, z\) and time \(t\)).

$$\\mathcal{F}\\left(x, y, t, u, \\frac{\\partial u}{\\partial x}, \\frac{\\partial u}{\\partial t}, \\frac{\\partial^2 u}{\\partial x^2}, \\dots\\right) = 0$$

---
### 🔍 ODE vs. PDE: The Fundamental Difference
• **Ordinary Differential Equation (ODE):** Involves functions of a **single variable** and ordinary derivatives (e.g., population growth over time, simple harmonic oscillator).
• **Partial Differential Equation (PDE):** Involves functions of **multiple independent variables**, making them the mathematical foundation for describing physical phenomena in multidimensional space and time.

---
### 🏛️ The Three Canonical Types of 2nd-Order Linear PDEs
In two independent variables, second-order linear PDEs are classified by the discriminant \(B^2 - 4AC\):

1. **Parabolic ($B^2 - 4AC = 0$) — The Heat / Diffusion Equation:**
   $$\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u$$
   *Physical Meaning:* Governs irreversible dissipative processes like thermal conduction, molecular diffusion, and Brownian motion.

2. **Hyperbolic ($B^2 - 4AC > 0$) — The Wave Equation:**
   $$\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u$$
   *Physical Meaning:* Models wave propagation with finite speed \(c\) (acoustics, optics, electromagnetic waves, seismic disturbances).

3. **Elliptic ($B^2 - 4AC < 0$) — Laplace & Poisson Equations:**
   $$\\nabla^2 u = 0 \\quad \\text{(Laplace)}, \\quad \\nabla^2 u = f(x, y) \\quad \\text{(Poisson)}$$
   *Physical Meaning:* Describes steady-state equilibria with no time evolution (electrostatic potential, gravitational fields, incompressible inviscid potential flow).

---
### 🌟 Famous Non-Linear & Applied PDEs
• **Navier-Stokes Equations:** The foundation of fluid dynamics, governing aerodynamics, blood flow, ocean currents, and weather.
• **Schrödinger Equation:** $\\mathrm{i}\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi$ — dictates the quantum wave function of particles.
• **Einstein Field Equations:** Relates the geometry of spacetime to the energy-momentum tensor in General Relativity.
• **Black-Scholes PDE:** The bedrock of quantitative finance and derivative options pricing.

---
### 🛠️ Solution Methods
1. **Analytical Methods:** Separation of Variables, Fourier & Laplace Integral Transforms, Method of Characteristics, and Green's Functions.
2. **Numerical & Computational Methods:** Finite Element Method (FEM), Finite Difference Method (FDM), and Finite Volume Method (FVM) implemented via solvers like MATLAB, ANSYS, and OpenFOAM.`,
      suggestions: [
        "Explain Separation of Variables",
        "Differences between Elliptic and Parabolic PDEs",
        "Top Class ST Scholarship for Premier Engineering Institutes",
      ],
    };
  }

  // -------------------------------------------------------------
  // 2. GENERAL MATHEMATICS & CALCULUS & LINEAR ALGEBRA
  // -------------------------------------------------------------
  const isMathQuery =
    /calculus|derivative|integral|integration|algebra|matrix|matrices|eigenvalue|eigenvector|vector|probability|statistics|trigonometry|geometry|theorem|pythagor/.test(
      query
    );

  if (isMathQuery) {
    return {
      reply: `Hello${greetingName}! 🙏 Mathematics is the universal language of science and engineering. Here is a structured summary:

### 📐 Core Branches of Higher Mathematics:
1. **Calculus & Analysis:**
   • *Differential Calculus:* Rates of change, gradients, tangents, Taylor series expansions.
   • *Integral Calculus:* Accumulation of quantities, areas, volumes, and fundamental theorem of calculus: $\\int_a^b f'(x)dx = f(b) - f(a)$.
   • *Multivariable Calculus:* Vector fields, line/surface integrals, Green's, Stokes', and Divergence theorems.

2. **Linear Algebra:**
   • Vector spaces, linear transformations, system of equations ($A\\mathbf{x} = \\mathbf{b}$).
   • Determinants, Matrix Inverses, Eigenvalues and Eigenvectors ($A\\mathbf{v} = \\lambda \\mathbf{v}$).
   • Singular Value Decomposition (SVD) and Principal Component Analysis (PCA) used in machine learning.

3. **Probability & Statistics:**
   • Probability distributions (Normal/Gaussian, Poisson, Binomial), Bayes' Theorem, hypothesis testing, and central limit theorem.

Whether you are preparing for JEE, GATE, college exams, or research, let me know which mathematical concept or problem you would like to explore!`,
      suggestions: [
        "Explain Eigenvalues and Eigenvectors",
        "What is Stokes' Theorem?",
        "Scholarships for STEM ST students",
      ],
    };
  }

  // -------------------------------------------------------------
  // 3. COMPUTER SCIENCE, CODING, AND ARTIFICIAL INTELLIGENCE
  // -------------------------------------------------------------
  const isCodingQuery =
    /python|javascript|coding|programmer|programming|java|c\+\+|algorithm|data structure|recursion|binary tree|graph|sorting|database|sql|machine learning|deep learning|neural network|git|github|react|next\.js/.test(
      query
    );

  if (isCodingQuery) {
    return {
      reply: `Hello${greetingName}! 🙏 I am fully equipped to help with coding, software engineering, algorithms, and artificial intelligence:

### 💻 Computer Science & Software Engineering Domains:
1. **Programming Languages:**
   • **Python:** AI/ML, data science, fast prototyping, FastAPI/Django backends.
   • **JavaScript / TypeScript:** Full-stack modern web development (React, Next.js, Node.js).
   • **C++ / Java:** High-performance systems, competitive programming, enterprise backend services.

2. **Core Data Structures & Algorithms:**
   • Arrays, Linked Lists, Stacks, Queues, Hash Maps.
   • Trees (Binary Search Trees, AVL, Red-Black Trees, Tries).
   • Graphs (BFS, DFS, Dijkstra's, Bellman-Ford, Minimum Spanning Trees).
   • Dynamic Programming (0/1 Knapsack, Longest Common Subsequence).

3. **Artificial Intelligence & Computer Vision:**
   • Deep Learning (Convolutional Neural Networks, Transformers, LLMs).
   • Computer Vision (OpenCV OCR image processing, contour filtering, adaptive thresholding).

Need code snippets, algorithm walkthroughs, debugging, or system architecture advice? Ask away!`,
      suggestions: [
        "Explain QuickSort vs MergeSort",
        "How do Transformers and LLMs work?",
        "Top Class Computer grant for ST students",
      ],
    };
  }

  // -------------------------------------------------------------
  // 4. PHYSICS & NATURAL SCIENCES
  // -------------------------------------------------------------
  const isPhysicsQuery =
    /physics|newton|gravity|quantum|thermodynamics|entropy|maxwell|electromagnetism|relativity|speed of light|einstein|black hole|energy|momentum|force/.test(
      query
    );

  if (isPhysicsQuery) {
    return {
      reply: `Hello${greetingName}! 🙏 Physics uncovers the fundamental laws governing our universe:

### 🌌 Pillars of Modern Physics:
1. **Classical Mechanics (Newtonian & Lagrangian):**
   • Newton's Three Laws of Motion: $\\mathbf{F} = \\frac{d\\mathbf{p}}{dt} = m\\mathbf{a}$.
   • Conservation of Energy, Linear Momentum, and Angular Momentum.

2. **Electromagnetism (Maxwell's Equations):**
   • Gauss's Law (electric fields & charges).
   • Gauss's Law for Magnetism (no magnetic monopoles).
   • Faraday's Law of Induction (changing magnetic fields induce EMF).
   • Ampère-Maxwell Law (displacement current and electromagnetic waves).

3. **Thermodynamics & Statistical Mechanics:**
   • 1st Law: Conservation of Energy ($\\Delta U = Q - W$).
   • 2nd Law: Entropy of an isolated system never decreases ($\\Delta S \\ge 0$).

4. **Quantum Mechanics & Relativity:**
   • Wave-particle duality, Heisenberg Uncertainty Principle ($\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}$).
   • Special & General Relativity: Equivalence of mass and energy ($E = mc^2$) and gravity as spacetime curvature.

Ask me about any derivation, experiment, or theoretical concept!`,
      suggestions: [
        "Explain Maxwell's Equations",
        "What is the Second Law of Thermodynamics?",
        "National Overseas ST Scholarship for PhD",
      ],
    };
  }

  // -------------------------------------------------------------
  // 5. GREETINGS & CASUAL INTRODUCTIONS
  // -------------------------------------------------------------
  const isGreetingQuery =
    /^(hi|hello|hey|namaste|pranam|good\s*(morning|afternoon|evening)|who\s*are\s*you|what\s*can\s*you\s*do|intro|introduce)/.test(
      query
    );

  if (isGreetingQuery) {
    if (language === "hi") {
      return {
        reply: `नमस्ते${greetingName}! 🙏 मैं आपका आधिकारिक AI सहायक **"सारथी" (Saarthi)** हूँ।

मैं एक उच्च-क्षमता सम्पन्न सामान्य AI मॉडल हूँ। मैं न केवल जनजातीय कार्य मंत्रालय (MoTA) की ST छात्रवृत्ति योजनाओं, दस्तावेज़ों और AI ऑटो-फिल में आपकी पूरी सहायता करता हूँ, बल्कि **गणित, विज्ञान, कोडिंग, करियर परामर्श, प्रतियोगी परीक्षाओं (JEE, NEET, UPSC), और सामान्य ज्ञान** से जुड़े किसी भी प्रश्न का उत्तर देने में पूरी तरह सक्षम हूँ।

आप मुझसे कुछ भी पूछ सकते हैं—मैं आपकी कैसे सहायता कर सकता हूँ?`,
        suggestions: [
          "ST छात्रवृत्ति योजनाओं की सूची",
          "आय सीमा एवं आवश्यक दस्तावेज़",
          "गणित/साइंस या करियर संबंधी प्रश्न पूछें",
        ],
      };
    }

    if (language === "bn") {
      return {
        reply: `নমস্কার${greetingName}! 🙏 আমি আপনার বিশ্বস্ত এআই সহকারী **"সারথি" (Saarthi)**।

আমি একটি আধুনিক ও বহুমুখী AI মডেল। জনজাতি বিষয়ক মন্ত্রকের ST স্কলারশিপ, নথিপত্র এবং AI অটো-ফিলের পাশাপাশি **গণিত, পদার্থবিজ্ঞান, প্রোগ্রামিং, কেরিয়ার কাউন্সেলিং এবং সাধারণ জ্ঞানের** যেকোনো বিষয়ে আমি আপনাকে সহায়তা করতে প্রস্তুত।

আজ আপনাকে কীভাবে সাহায্য করতে পারি বলুন?`,
        suggestions: [
          "ST বৃত্তির তালিকা ও যোগ্যতা",
          "প্রয়োজনীয় নথিপত্রের বিবরণ",
          "বিজ্ঞান বা প্রোগ্রামিং নিয়ে প্রশ্ন করুন",
        ],
      };
    }

    return {
      reply: `Hello${greetingName}! 🙏 I am **"Saarthi" (सारथी)**, your advanced AI assistant developed for the SIH26239 Tribal Scholarship Portal (Ministry of Tribal Affairs, Govt. of India).

I am a fully capable, general-purpose AI. Beyond guiding Scheduled Tribe (ST) students through scholarship applications and eligibility rules, I am equipped to assist you with **any academic topic**—including mathematics (calculus, PDEs), physics, computer science & coding, competitive exam preparation (JEE, NEET, UPSC, GATE), and general knowledge.

How may I assist you today?`,
      suggestions: [
        "What are the 4 official Ministry ST schemes?",
        "What is the income limit for ST scholarships?",
        "Ask a math, coding, or science question",
      ],
    };
  }

  // -------------------------------------------------------------
  // 6. SCHOLARSHIP SCHEMES & OFFICIAL MoTA DOMAIN KNOWLEDGE
  // -------------------------------------------------------------
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

  // Bengali (bn) Scholarship Branches
  if (language === "bn") {
    if (isDocQuery) {
      return {
        reply: `নমস্কার${greetingName}! ST বৃত্তির আবেদনের জন্য নিম্নলিখিত নথিগুলি প্রয়োজন:

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
    if (isIncomeQuery || isSchemeQuery) {
      return {
        reply: `নমস্কার${greetingName}! জনজাতি বিষয়ক মন্ত্রকের অধীন ৪টি প্রধান বৃত্তি প্রকল্প এবং আয়ের সীমা:

### 🎓 ৪টি আধিকারিক MoTA বৃত্তি প্রকল্প:
1. **পোস্ট-ম্যাট্রিক বৃত্তি (Post-Matric ST)**: একাদশ শ্রেণি থেকে স্নাতকোত্তর। পারিবারিক বার্ষিক আয় **≤ ₹২,৫০,০০০**। ১০০% ফি মকুব ও মাসিক ভাতা।
2. **শীর্ষ শ্রেণীর শিক্ষা (Top Class Education)**: IIT, NIT, IIM, AIIMS প্রভৃতি শীর্ষ প্রতিষ্ঠানের জন্য। পারিবারিক আয় **≤ ₹৬,০০,০০০**। সম্পূর্ণ টিউশন ফি + বাৎসরিক ₹২৬,৪00 থাকার খরচ + ₹৪৫,০০০ কম্পিউটার অনুদান।
3. **উচ্চ শিক্ষার জন্য জাতীয় ওভারসিজ বৃত্তি (National Overseas Scholarship)**: বিদেশের শীর্ষ বিশ্ববিদ্যালয়ে মাস্টার্স ও পিএইচডি। বার্ষিক পারিবারিক আয় **≤ ₹৬,০০,০০০**। সম্পূর্ণ টিউশন ফি + $১৫,৪০০ মার্কিন ডলার বার্ষিক ভাতা।
4. **প্রি-ম্যাট্রিক বৃত্তি (Pre-Matric ST)**: নবম ও দশম শ্রেণির শিক্ষার্থীদের জন্য। পারিবারিক আয় **≤ ₹২,৫০,০০০**।`,
        suggestions: ["কি কি নথিপত্র লাগবে?", "Auto-Fill কীভাবে কাজ করে?", "আবেদন করার ধাপসমূহ"],
      };
    }
  }

  // Hindi (hi) Scholarship Branches
  if (language === "hi") {
    if (isDocQuery) {
      return {
        reply: `नमस्ते${greetingName}! जनजातीय कार्य मंत्रालय की छात्रवृत्ति योजनाओं के लिए आवश्यक दस्तावेज़:

### 📄 आवश्यक दस्तावेज़ों की सूची:
1. **जाति प्रमाण पत्र (ST Certificate)**: सक्षम राजस्व प्राधिकारी (SDO/Tehsildar) द्वारा जारी।
2. **पारिवारिक आय प्रमाण पत्र (Income Certificate)**: चालू वित्तीय वर्ष का वैध प्रमाण पत्र।
3. **अंकतालिका (Previous Academic Marksheet)**: पिछली उत्तीर्ण परीक्षा की स्व-प्रमाणित प्रति।
4. **संस्थान बोनाफाइड प्रमाण पत्र (Bonafide Certificate)**: वर्तमान स्कूल/कॉलेज में प्रवेश का प्रमाण।
5. **आधार कार्ड (Aadhaar Card)**: आधार-सीडेड बैंक खाते से लिंक होना अनिवार्य।
6. **बैंक पासबुक विवरण / रद्द चेक (Cancelled Cheque)**।

💡 **AI सुविधा**: आवेदन पृष्ठ के शीर्ष स्कैनर पर जाति/आय प्रमाण पत्र अपलोड करते ही पूरा फॉर्म ऑटो-फिल हो जाता है!`,
        suggestions: ["आय सीमा की जानकारी", "Auto-Fill कैसे काम करता है?", "चार आधिकारिक योजनाएं"],
      };
    }
    if (isIncomeQuery || isSchemeQuery) {
      return {
        reply: `नमस्ते${greetingName}! जनजातीय कार्य मंत्रालय (MoTA) की 4 आधिकारिक छात्रवृत्ति योजनाएं एवं पात्रता:

### 🎓 4 आधिकारिक MoTA छात्रवृत्ति योजनाएं:
1. **प्री-मैट्रिक छात्रवृत्ति (Pre-Matric):** कक्षा 9वीं और 10वीं। पारिवारिक आय सीमा **≤ ₹2.50 लाख/वर्ष**। ₹225-525/माह वजीफा।
2. **पोस्ट-मैट्रिक छात्रवृत्ति (Post-Matric):** कक्षा 11वीं से लेकर परास्नातक/डिग्री तक। आय सीमा **≤ ₹2.50 लाख/वर्ष**। शत-प्रतिशत गैर-वापसी योग्य शिक्षण शुल्क प्रतिपूर्ति + मासिक वजीफा।
3. **शीर्ष स्तरीय शिक्षा योजना (Top Class Higher Education):** IITs, NITs, IIMs, AIIMS आदि प्रमुख संस्थानों के लिए। पारिवारिक आय सीमा **≤ ₹6.00 लाख/वर्ष**। पूरा शिक्षण शुल्क + ₹26,400/वर्ष जीवन यापन भत्ता + ₹45,000 लैपटॉप/कंप्यूटर अनुदान।
4. **राष्ट्रीय विदेशी छात्रवृत्ति (National Overseas):** विदेश के शीर्ष विश्वविद्यालयों में मास्टर्स/PhD हेतु। पारिवारिक आय सीमा **≤ ₹6.00 लाख/वर्ष**। सम्पूर्ण ट्यूशन फीस + $15,400 USD वार्षिक जीवन-यापन भत्ता।`,
        suggestions: ["आवेदन के लिए दस्तावेज़", "AI Auto-Fill कैसे करें?", "आवेदन की स्थिति कैसे जांचें?"],
      };
    }
  }

  // English Scholarship Branches
  if (isDocQuery) {
    return {
      reply: `Hello${greetingName}! Here is the complete document checklist required for Ministry of Tribal Affairs (MoTA) ST Scholarships:

### 📄 Essential Verification Documents:
1. **ST Caste Certificate**: Legally issued by a competent revenue authority (SDO / Tehsildar / Sub-Divisional Magistrate).
2. **Annual Family Income Certificate**: Valid for the current financial year issued by a competent authority.
3. **Previous Academic Marksheet**: Self-attested copy of your last qualifying examination.
4. **Institutional Bonafide Certificate / Admission Receipt**: Proof of current enrollment in recognized institution.
5. **Aadhaar Card**: Must be linked to an **Aadhaar-seeded bank account** for Direct Benefit Transfer (DBT).
6. **Bank Account Details**: Clear copy of bank passbook / cancelled cheque showing Account Number and IFSC Code.
7. **Passport Size Photograph**.

💡 **AI Auto-Fill Feature**: Upload your Caste or Income Certificate in the AI scanner on the Apply page, and all details (Name, Category, Income, Certificate Number) will be automatically populated!`,
      suggestions: [
        "What are the income limits for ST scholarships?",
        "How does Auto-Fill OCR work?",
        "How to track application status?",
      ],
    };
  }

  if (isIncomeQuery || isSchemeQuery) {
    return {
      reply: `Hello${greetingName}! Here are the 4 official Ministry of Tribal Affairs (MoTA) ST Scholarship Schemes with complete criteria:

### 🎓 4 Official Ministry ST Scholarship Schemes:
1. **Pre-Matric Scholarship for ST Students**:
   • **Coverage**: Class IX and X in recognized schools.
   • **Income Ceiling**: **≤ ₹2,50,000 (₹2.50L)** per annum.
   • **Benefits**: Day scholars ₹225/month, Hostellers ₹525/month + special grants.

2. **Post-Matric Scholarship for ST Students**:
   • **Coverage**: Class XI to Post-Graduation, Engineering, Medical, & Professional degrees.
   • **Income Ceiling**: **≤ ₹2,50,000 (₹2.50L)** per annum.
   • **Benefits**: 100% full fee waiver + ₹230–₹1,200/month stipend + book allowances.

3. **Higher Education (Top Class) Scholarship**:
   • **Coverage**: Premier notified institutes (IITs, NITs, IIMs, AIIMS, NLUs, IIITs, Central Universities).
   • **Income Ceiling**: **≤ ₹6,00,000 (₹6.00L)** per annum.
   • **Benefits**: Full tuition fee waiver + ₹26,400/year living allowance + one-time ₹45,000 computer/laptop grant.

4. **National Overseas Scholarship for ST Students**:
   • **Coverage**: Masters, Ph.D., and Post-Doctoral studies in top 500 QS-ranked foreign universities.
   • **Income Ceiling**: **≤ ₹6,00,000 (₹6.00L)** per annum.
   • **Benefits**: 100% tuition fees + $15,400 USD annual living allowance + airfare and visa coverage.`,
      suggestions: [
        "What documents do I need to apply?",
        "How does AI Auto-Fill work?",
        "How do I apply for Top Class Education?",
      ],
    };
  }

  if (isOcrQuery) {
    return {
      reply: `Hello${greetingName}! Our portal features an intelligent **AI Document OCR Auto-Fill** system designed to eliminate manual data entry errors:

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

  if (isApplyQuery) {
    return {
      reply: `Hello${greetingName}! Applying for your ST scholarship is quick and seamless on our AI-powered portal:

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

  // -------------------------------------------------------------
  // 7. INTELLIGENT GENERAL INQUIRY FALLBACK (NEVER DEFAULT TO RIGID FAQ)
  // -------------------------------------------------------------
  return {
    reply: `Hello${greetingName}! 🙏 I am **"Saarthi" (सारथी)**, your AI assistant.

Regarding your question: **"${message.trim()}"**

As a versatile AI assistant, I can address inquiries across both academic disciplines and government initiatives:
• **Academic & Technical Guidance:** Higher mathematics (PDEs, Calculus, Linear Algebra), Physics, Chemistry, Computer Science & Algorithms, and Engineering.
• **Competitive Exams & Career:** JEE Main/Advanced, NEET, GATE, UPSC, and premier institute admissions.
• **Ministry ST Scholarships:** Eligibility, income limits, documents, and DBT procedures for Pre-Matric, Post-Matric, Top Class, and Overseas schemes.

Could you elaborate on the specific details or concepts you would like me to explain further?`,
    suggestions: [
      "Tell me more about this topic",
      "Official Ministry ST Scholarship Schemes",
      "How to apply with AI Auto-Fill",
    ],
  };
}
