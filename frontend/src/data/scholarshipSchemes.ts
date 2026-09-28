export interface ScholarshipScheme {
  id: number;
  schemeId: number;
  title: string;
  category: "Pre-Matric" | "Post-Matric" | "Higher Education" | "Overseas Studies" | string;
  tag: string;
  maxIncomeLimit: number;
  maxIncomeText: string;
  targetLevel: string;
  financialBenefit: string;
  fundingBadge: string;
  scholarshipAmount: number | string;
  provider: string;
  authority: string;
  deadline: string;
  description: string;
  matchScore?: number;
  matchReason?: string;
}

/**
 * The 4 Verified Official Ministry of Tribal Affairs (MoTA), Government of India ST Scholarship Schemes
 */
export const OFFICIAL_ST_SCHEMES: ScholarshipScheme[] = [
  {
    id: 1,
    schemeId: 1,
    title: "Pre-Matric Scholarship for ST Students",
    category: "Pre-Matric",
    tag: "Pre-Matric",
    maxIncomeLimit: 250000,
    maxIncomeText: "₹2,50,000 / year",
    targetLevel: "Classes IX & X",
    financialBenefit: "Up to ₹5,250 / yr (Maintenance: Day Scholar ₹225/mo, Hosteller ₹525/mo for 10 months + book grant)",
    fundingBadge: "Up to ₹5,250/yr",
    scholarshipAmount: 5250,
    provider: "Ministry of Tribal Affairs & State Tribal Welfare Departments",
    authority: "Ministry of Tribal Affairs & State Tribal Welfare Departments",
    deadline: "2026-10-31",
    description: "Financial assistance to tribal students studying in Classes IX and X to prevent dropouts and support transition to post-secondary education.",
    matchScore: 91.0,
    matchReason: "Applicable for secondary school tribal students with family income under ₹2.5L",
  },
  {
    id: 2,
    schemeId: 2,
    title: "Post-Matric Scholarship for ST Students",
    category: "Post-Matric",
    tag: "Post-Matric",
    maxIncomeLimit: 250000,
    maxIncomeText: "₹2,50,000 / year",
    targetLevel: "Class XI, XII, ITI, Diploma, Undergraduate & Postgraduate",
    financialBenefit: "Full compulsory fees waiver + ₹2,300 to ₹12,000 / yr maintenance allowance",
    fundingBadge: "Full Fees + ₹12,000/yr",
    scholarshipAmount: 15000,
    provider: "Ministry of Tribal Affairs & State Tribal Welfare Departments",
    authority: "Ministry of Tribal Affairs & State Tribal Welfare Departments",
    deadline: "2026-11-30",
    description: "Centrally sponsored scheme providing complete compulsory non-refundable fees waiver and monthly maintenance stipend for post-matriculation tribal students.",
    matchScore: 96.5,
    matchReason: "Fully eligible for post-secondary maintenance stipend and complete compulsory fee waiver",
  },
  {
    id: 3,
    schemeId: 3,
    title: "National Fellowship & Scholarship for Higher Education of ST Students (Top Class)",
    category: "Higher Education",
    tag: "Higher Education",
    maxIncomeLimit: 600000,
    maxIncomeText: "₹6,00,000 / year (Fellowship is merit-based with no ceiling)",
    targetLevel: "B.Tech, MBBS, MBA, M.Phil, Ph.D. at premier notified institutes (IITs, IIMs, NITs, AIIMS)",
    financialBenefit: "Full tuition fee waiver + ₹26,400 / yr living allowance + ₹45,000 one-time hardware assistance",
    fundingBadge: "Full Tuition + ₹26,400/yr",
    scholarshipAmount: 28000,
    provider: "Ministry of Tribal Affairs, Govt. of India",
    authority: "Ministry of Tribal Affairs, Govt. of India",
    deadline: "2026-12-15",
    description: "Comprehensive financial backing for meritorious ST students admitted to notified premier institutes (IITs, NITs, IIMs, AIIMS) and M.Phil/Ph.D. research fellowships.",
    matchScore: 98.5,
    matchReason: "Matches ST category & premier institute criteria with income (₹1.2L) well below ₹6.0L ceiling",
  },
  {
    id: 4,
    schemeId: 4,
    title: "National Overseas Scholarship for ST Students",
    category: "Overseas Studies",
    tag: "Overseas Studies",
    maxIncomeLimit: 600000,
    maxIncomeText: "₹6,00,000 / year",
    targetLevel: "Masters, Ph.D. & Post-Doctoral studies abroad",
    financialBenefit: "100% Tuition Fees + $15,400 USD / £9,900 GBP annual living allowance + airfare",
    fundingBadge: "100% Tuition + $15,400/yr",
    scholarshipAmount: 1250000,
    provider: "Ministry of Tribal Affairs, Govt. of India",
    authority: "Ministry of Tribal Affairs, Govt. of India",
    deadline: "2026-12-31",
    description: "Exclusive scholarship funding tuition fees, international airfare, and annual living allowance for ST scholars pursuing postgraduate and doctoral studies in top global universities.",
    matchScore: 88.0,
    matchReason: "Open for advanced tribal scholars seeking international master's or doctoral degrees",
  },
];

/**
 * Standardized AI Recommendations derived from the official MoTA scheme catalog
 */
export const OFFICIAL_RECOMMENDED_SCHEMES: ScholarshipScheme[] = [
  OFFICIAL_ST_SCHEMES[2], // National Fellowship & Higher Education
  OFFICIAL_ST_SCHEMES[1], // Post-Matric
  OFFICIAL_ST_SCHEMES[0], // Pre-Matric
  OFFICIAL_ST_SCHEMES[3], // National Overseas
];
