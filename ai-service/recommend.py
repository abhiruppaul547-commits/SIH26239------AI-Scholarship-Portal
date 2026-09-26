from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["Recommendation Engine"])

class StudentProfileRequest(BaseModel):
    student_id: Optional[int] = None
    category: str = "ST"
    tribe_name: Optional[str] = "Santhal"
    annual_family_income: Optional[float] = 120000.0
    state: Optional[str] = "Jharkhand"
    course: Optional[str] = "B.Tech Computer Science"
    gpa_percentage: Optional[float] = 82.0

class SchemeMatch(BaseModel):
    scheme_id: int
    title: str
    match_score: float
    match_reason: str
    scholarship_amount: float
    category: str

class RecommendationResponse(BaseModel):
    success: bool
    student_profile_id: Optional[int] = None
    recommendations: List[SchemeMatch]
    reason: str

# Defined scholarship schemes with criteria matching the central knowledge base
SCHOLARSHIP_RULES = [
    {
        "id": 1,
        "title": "National Fellowship and Scholarship for Higher Education of ST Students",
        "category": "Higher Education",
        "target_caste": "ST",
        "max_income": 600000.0,
        "min_percentage": 55.0,
        "amount": 28000.0,
        "courses": ["B.Tech", "MBBS", "MBA", "M.Phil", "Ph.D", "Master", "Engineering", "Medicine", "Science"],
        "weight_merit": 0.4,
        "weight_income": 0.6
    },
    {
        "id": 2,
        "title": "Post-Matric Scholarship for Scheduled Tribe (ST) Students",
        "category": "Post-Matric",
        "target_caste": "ST",
        "max_income": 250000.0,
        "min_percentage": 50.0,
        "amount": 15000.0,
        "courses": ["Class 11", "Class 12", "ITI", "Polytechnic", "B.A", "B.Sc", "B.Com", "B.Tech", "General"],
        "weight_merit": 0.3,
        "weight_income": 0.7
    },
    {
        "id": 3,
        "title": "Top Class Education for Scheduled Tribe Students",
        "category": "Top Class",
        "target_caste": "ST",
        "max_income": 600000.0,
        "min_percentage": 60.0,
        "amount": 85000.0,
        "courses": ["IIT", "NIT", "IIM", "AIIMS", "B.Tech", "Medicine", "Management", "National Law"],
        "weight_merit": 0.6,
        "weight_income": 0.4
    },
    {
        "id": 4,
        "title": "Pre-Matric Scholarship for Tribal Children (Class IX & X)",
        "category": "Pre-Matric",
        "target_caste": "ST",
        "max_income": 200000.0,
        "min_percentage": 45.0,
        "amount": 4500.0,
        "courses": ["Class 9", "Class 10", "Secondary"],
        "weight_merit": 0.2,
        "weight_income": 0.8
    },
    {
        "id": 5,
        "title": "National Overseas Scholarship Scheme for Tribal Students",
        "category": "Overseas Fellowship",
        "target_caste": "ST",
        "max_income": 800000.0,
        "min_percentage": 60.0,
        "amount": 250000.0,
        "courses": ["Master", "Ph.D", "Abroad", "Research"],
        "weight_merit": 0.5,
        "weight_income": 0.5
    }
]

def calculate_eligibility_score(profile: StudentProfileRequest, rule: dict) -> tuple[bool, float, str]:
    """Calculates eligibility boolean and a normalized match score (0-100%) with explainability."""
    # 1. Caste verification
    if rule["target_caste"] == "ST" and profile.category.upper() != "ST":
        return False, 0.0, "Scheme restricted strictly to Scheduled Tribe (ST) applicants"

    # 2. Income criterion
    income = profile.annual_family_income if profile.annual_family_income is not None else 100000.0
    if income > rule["max_income"]:
        return False, 0.0, f"Annual family income (Rs. {income:,.0f}) exceeds ceiling limit of Rs. {rule['max_income']:,.0f}"

    # 3. Minimum academic score
    percentage = profile.gpa_percentage if profile.gpa_percentage is not None else 70.0
    if percentage < rule["min_percentage"]:
        return False, 0.0, f"Academic performance ({percentage}%) does not meet minimum threshold of {rule['min_percentage']}%"

    # 4. Multi-factor scoring
    # Income need score (lower income = higher financial need)
    income_need_factor = max(0.0, min(1.0, 1.0 - (income / (rule["max_income"] * 1.2))))
    
    # Merit factor
    merit_factor = max(0.0, min(1.0, percentage / 100.0))

    # Course affinity boost
    course_str = (profile.course or "").lower()
    has_course_affinity = any(c.lower() in course_str for c in rule["courses"])
    affinity_boost = 0.15 if has_course_affinity else 0.05

    # Compute raw match score
    composite = (
        (merit_factor * rule["weight_merit"]) +
        (income_need_factor * rule["weight_income"]) +
        affinity_boost
    )
    # Scale to 70% - 99% range for eligible candidates
    final_score = round(min(99.0, max(75.0, composite * 100.0)), 1)

    reason = f"Full ST eligibility satisfied. Family income Rs. {income:,.0f} is within limit, and academic merit ({percentage}%) qualifies with high priority."

    return True, final_score, reason

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend_scholarships(profile: StudentProfileRequest):
    """
    Evaluates student profile across all active tribal scholarship schemes
    and returns a ranked recommendation list with explainable AI rationale.
    """
    matches: List[SchemeMatch] = []

    for rule in SCHOLARSHIP_RULES:
        is_eligible, score, reason = calculate_eligibility_score(profile, rule)
        if is_eligible:
            matches.append(SchemeMatch(
                scheme_id=rule["id"],
                title=rule["title"],
                match_score=score,
                match_reason=reason,
                scholarship_amount=rule["amount"],
                category=rule["category"]
            ))

    # Sort descending by match score
    matches.sort(key=lambda m: m.match_score, reverse=True)

    return RecommendationResponse(
        success=True,
        student_profile_id=profile.student_id,
        recommendations=matches,
        reason=f"Identified {len(matches)} eligible scholarship schemes based on category {profile.category} and income profile."
    )
