import { database } from "./firebase";
import { ref, push, set, get } from "firebase/database";

export interface ScholarshipApplication {
  id?: string;
  userId: string;
  scholarshipId?: string | number;
  scholarshipTitle?: string;
  studentName?: string;
  email?: string;
  category?: string;
  annualIncome?: string | number;
  status?: string;
  submittedAt?: number | string;
  [key: string]: any;
}

/**
 * Saves a scholarship application to Firebase Realtime Database
 * under the user's specific path: applications/{userId}/{applicationId}
 */
export async function saveApplication(userId: string, applicationData: any) {
  try {
    const userApplicationsRef = ref(database, `applications/${userId}`);
    const newAppRef = push(userApplicationsRef);
    const payload: ScholarshipApplication = {
      ...applicationData,
      id: newAppRef.key || undefined,
      userId,
      status: applicationData.status || "PENDING_VERIFICATION",
      submittedAt: Date.now(),
    };
    await set(newAppRef, payload);
    return { success: true, id: newAppRef.key, data: payload };
  } catch (error: any) {
    console.error("Error saving application to Firebase RTDB:", error);
    throw error;
  }
}

/**
 * Retrieves all scholarship applications for a given user from Firebase Realtime Database
 */
export async function getUserApplications(userId: string): Promise<ScholarshipApplication[]> {
  try {
    const userAppsRef = ref(database, `applications/${userId}`);
    const snapshot = await get(userAppsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    }
    return [];
  } catch (error: any) {
    console.error("Error fetching applications from Firebase RTDB:", error);
    throw error;
  }
}
