import { ref, set, get, child } from "firebase/database";
import { db } from "./firebase";

export interface ScholarshipApplicationData {
  schemeName?: string;
  schemeId?: string | number;
  applicantName?: string;
  category?: string;
  annualIncome?: number | string;
  gpa?: number | string;
  status?: string;
  submittedAt?: string | number;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Saves or updates a scholarship application for a given user in Firebase Realtime Database
 */
export async function saveApplication(
  userId: string,
  data: ScholarshipApplicationData
): Promise<{ success: boolean; data: any }> {
  if (!userId) {
    throw new Error("userId is required to save application");
  }

  const appRef = ref(db, `applications/${userId}`);
  const payload = {
    ...data,
    userId,
    status: data.status || "SUBMITTED",
    updatedAt: new Date().toISOString(),
    submittedAt: data.submittedAt || new Date().toISOString(),
  };

  await set(appRef, payload);
  return { success: true, data: payload };
}

/**
 * Retrieves the application status and details for a given user from Firebase Realtime Database
 */
export async function getApplicationStatus(
  userId: string
): Promise<ScholarshipApplicationData | null> {
  if (!userId) {
    return null;
  }

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `applications/${userId}`));
  if (snapshot.exists()) {
    return snapshot.val() as ScholarshipApplicationData;
  } else {
    return null;
  }
}
