/**
 * Intelligent User Name Extraction Utility
 * Handles extracting clean, human-readable first names and full names from
 * User objects, Display Names, or Email addresses (e.g., johnhopkins@xyz.com -> John / John Hopkins,
 * abhiruppaul547@gmail.com -> Abhirup / Abhirup Paul).
 */

const COMMON_FIRST_NAMES = [
  // Multi-syllable / Long names first (for prefix greedy matching)
  "christopher", "alexander", "jonathan", "christian", "nicholas", "benjamin",
  "zachary", "lawrence", "gabriel", "vincent", "russell", "stephen", "richard",
  "matthew", "william", "michael", "anthony", "charles", "douglas", "patrick",
  "elizabeth", "jennifer", "patricia", "margaret", "stephanie", "kathleen",
  "christine", "carolyn", "danielle", "michelle", "kimberly", "jessica",
  // Common Indian names
  "abhinav", "abhishek", "abhirup", "aditya", "aniket", "ananya", "ashish",
  "arvind", "avinash", "bhupen", "biswajit", "chandan", "deepak", "devesh",
  "dipankar", "dibyendu", "dharmendra", "dinesh", "gaurav", "gautam", "ganesh",
  "govind", "harshit", "hemant", "indrajit", "jitendra", "kalyan", "kailash",
  "kishore", "krishna", "lakshman", "lokesh", "manish", "mayank", "mukesh",
  "mahesh", "madhav", "nirmal", "nilesh", "nishant", "navin", "naveen",
  "nikhil", "pranav", "prateek", "pradeep", "prakash", "prashant", "pravin",
  "piyush", "pankaj", "partha", "pallavi", "rajesh", "rakesh", "ramesh",
  "ranjan", "rishabh", "ritesh", "rupesh", "sachin", "sandeep", "sanjay",
  "sanjeev", "saurabh", "sourav", "subhash", "subrata", "shubham", "shivam",
  "satish", "siddharth", "suresh", "sushant", "tanmay", "tushar", "trilok",
  "utkarsh", "ujjwal", "vaibhav", "vikram", "vishal", "yogesh",
  // 5-6 letter English & Indian names
  "arthur", "austin", "brandon", "brian", "bryan", "connie", "daniel", "dennis",
  "donald", "edward", "eugene", "george", "gerald", "gordon", "harold", "howard",
  "jacob", "james", "jason", "jeremy", "jesse", "jordan", "joseph", "joshua",
  "justin", "louise", "marcus", "martin", "nathan", "oliver", "philip", "robert",
  "ronald", "samuel", "steven", "thomas", "victor", "walter", "warren",
  "alok", "aman", "amit", "anil", "ankit", "anand", "arjun", "arpan", "arun",
  "ayush", "bimal", "bipin", "birsa", "chetan", "chirag", "kamal", "kapil",
  "karan", "kumar", "lalit", "manoj", "mohit", "naman", "nitin", "neeraj",
  "priya", "pooja", "priti", "rahul", "rohit", "rohan", "rohit", "shyam",
  "sneha", "swati", "shweta", "simran", "sonia", "sonam", "shreya", "sumit",
  "sunil", "suraj", "tarun", "umesh", "varun", "vikas", "vivek", "vijay",
  "vinay", "vipin",
  // 3-4 letter English & Indian names
  "john", "jack", "adam", "alan", "alex", "andy", "bill", "bob", "carl",
  "dan", "dave", "dean", "ed", "eric", "gary", "greg", "henry", "ian",
  "jeff", "joe", "kyle", "mark", "matt", "mike", "nick", "paul", "pete",
  "ray", "rick", "rob", "roy", "ryan", "sam", "sean", "tim", "tom",
  "abhi", "amit", "anil", "atul", "debu", "dev", "hari", "jeet", "joy",
  "mary", "jane", "kate", "lucy", "emma", "sara", "lisa", "amy", "anna",
  "rose", "rita", "tina", "neha", "ritu", "puja", "yash"
];

// Sort descending by length so longer names match first (e.g. "jonathan" before "john")
COMMON_FIRST_NAMES.sort((a, b) => b.length - a.length);

/**
 * Capitalizes a word: "john" -> "John", "abhirup" -> "Abhirup"
 */
function capitalize(word: string): string {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Parses an email username (before @) into first name and optional last name.
 * Handles:
 * - Delimited: "john.hopkins", "john_hopkins", "john-hopkins" -> First: "John", Last: "Hopkins"
 * - Concatenated: "johnhopkins", "abhiruppaul547" -> First: "John", Last: "Hopkins", First: "Abhirup", Last: "Paul"
 * - Trailing numbers: "abhiruppaul547" -> "abhiruppaul" -> First: "Abhirup", Last: "Paul"
 */
export function parseNameFromEmailPrefix(prefix: string): { firstName: string; lastName?: string; fullName: string } {
  if (!prefix) {
    return { firstName: "Student", fullName: "Student" };
  }

  // 1. Remove leading/trailing numbers and trailing special characters
  let clean = prefix.replace(/^\d+/, "").replace(/\d+$/, "").trim();
  if (!clean) {
    clean = prefix;
  }

  // 2. Check for explicit delimiters: . _ - +
  if (/[._\-+]/.test(clean)) {
    const parts = clean.split(/[._\-+]/).filter(Boolean);
    if (parts.length > 0) {
      const first = capitalize(parts[0]);
      const last = parts.slice(1).map(capitalize).join(" ");
      const full = last ? `${first} ${last}` : first;
      return { firstName: first, lastName: last || undefined, fullName: full };
    }
  }

  // 3. Check for camelCase e.g. "JohnHopkins" or "AbhirupPaul"
  const camelParts = clean.split(/(?=[A-Z])/).filter(Boolean);
  if (camelParts.length > 1) {
    const first = capitalize(camelParts[0]);
    const last = camelParts.slice(1).map(capitalize).join(" ");
    return { firstName: first, lastName: last, fullName: `${first} ${last}` };
  }

  // 4. Check against known common first names for concatenated usernames e.g. "johnhopkins", "abhiruppaul"
  const lower = clean.toLowerCase();
  for (const name of COMMON_FIRST_NAMES) {
    if (lower.startsWith(name)) {
      const first = capitalize(name);
      const remainder = lower.slice(name.length).replace(/^\d+/, "").replace(/\d+$/, "").trim();
      if (remainder.length >= 2) {
        const last = capitalize(remainder);
        return { firstName: first, lastName: last, fullName: `${first} ${last}` };
      }
      return { firstName: first, fullName: first };
    }
  }

  // 5. Fallback: single word username, capitalize it
  const single = capitalize(clean);
  return { firstName: single, fullName: single };
}

/**
 * Returns clean First Name for greetings (e.g. "Hello, John!", "नमस्ते Abhirup!")
 */
export function getCleanFirstName(userOrEmailOrName?: any): string {
  if (!userOrEmailOrName) return "Student";

  // If a string was passed directly
  if (typeof userOrEmailOrName === "string") {
    const trimmed = userOrEmailOrName.trim();
    if (!trimmed || trimmed === "Birsa Soren" || trimmed === "Demo Student") return "Student";
    if (trimmed.includes("@")) {
      return parseNameFromEmailPrefix(trimmed.split("@")[0]).firstName;
    }
    // If it's a full name with spaces e.g. "John Hopkins"
    if (trimmed.includes(" ")) {
      return capitalize(trimmed.split(/\s+/)[0]);
    }
    return parseNameFromEmailPrefix(trimmed).firstName;
  }

  // If a user object was passed (Firebase User or backend User)
  const candidateName =
    (userOrEmailOrName.displayName && userOrEmailOrName.displayName !== "Birsa Soren" ? userOrEmailOrName.displayName : null) ||
    (userOrEmailOrName.fullName && userOrEmailOrName.fullName !== "Birsa Soren" ? userOrEmailOrName.fullName : null) ||
    (userOrEmailOrName.name && userOrEmailOrName.name !== "Birsa Soren" ? userOrEmailOrName.name : null);

  if (candidateName && candidateName.trim()) {
    const cleanCand = candidateName.trim();
    if (cleanCand.includes("@")) {
      return parseNameFromEmailPrefix(cleanCand.split("@")[0]).firstName;
    }
    if (cleanCand.includes(" ")) {
      return capitalize(cleanCand.split(/\s+/)[0]);
    }
    return parseNameFromEmailPrefix(cleanCand).firstName;
  }

  // Extract from email
  const email = userOrEmailOrName.email;
  if (email && typeof email === "string" && !email.includes("student@sih.gov.in")) {
    return parseNameFromEmailPrefix(email.split("@")[0]).firstName;
  }

  return "Student";
}

/**
 * Returns clean Full Name for profiles, dashboard badges, and application forms.
 */
export function getCleanFullName(userOrEmailOrName?: any): string {
  if (!userOrEmailOrName) return "Student";

  if (typeof userOrEmailOrName === "string") {
    const trimmed = userOrEmailOrName.trim();
    if (!trimmed || trimmed === "Birsa Soren" || trimmed === "Demo Student") return "Student";
    if (trimmed.includes("@")) {
      return parseNameFromEmailPrefix(trimmed.split("@")[0]).fullName;
    }
    if (trimmed.includes(" ")) {
      return trimmed.split(/\s+/).map(capitalize).join(" ");
    }
    return parseNameFromEmailPrefix(trimmed).fullName;
  }

  const candidateName =
    (userOrEmailOrName.displayName && userOrEmailOrName.displayName !== "Birsa Soren" ? userOrEmailOrName.displayName : null) ||
    (userOrEmailOrName.fullName && userOrEmailOrName.fullName !== "Birsa Soren" ? userOrEmailOrName.fullName : null) ||
    (userOrEmailOrName.name && userOrEmailOrName.name !== "Birsa Soren" ? userOrEmailOrName.name : null);

  if (candidateName && candidateName.trim()) {
    const cleanCand = candidateName.trim();
    if (cleanCand.includes("@")) {
      return parseNameFromEmailPrefix(cleanCand.split("@")[0]).fullName;
    }
    return cleanCand.split(/\s+/).map(capitalize).join(" ");
  }

  const email = userOrEmailOrName.email;
  if (email && typeof email === "string" && !email.includes("student@sih.gov.in")) {
    return parseNameFromEmailPrefix(email.split("@")[0]).fullName;
  }

  return "Student";
}
