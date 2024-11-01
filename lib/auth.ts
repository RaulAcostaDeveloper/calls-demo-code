import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { serverConfig } from "@/config";

if (!getApps().length) {
  initializeApp({
    credential: cert(serverConfig.serviceAccount),
  });
}

const db = getFirestore();

export async function getCurrentUser() {
  const tokens = await getTokens(cookies(), {
    apiKey: serverConfig.serviceAccount.privateKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    return null;
  }

  try {
    const userDoc = await db
      .collection(process.env.NEXT_PUBLIC_USERS_COLLECTION_NAME || "V2_users")
      .doc(tokens.decodedToken.uid)
      .get();
    const userData = userDoc.data();

    return {
      id: tokens.decodedToken.uid,
      email: tokens.decodedToken.email,
      access_control_list: userData?.access_control_list || [],
      calls_tab_enabled: userData?.calls_tab_enabled || false,
      incoming_stats_tab_enabled: userData?.incoming_stats_tab_enabled || false,
      outgoing_stats_tab_enabled: userData?.outgoing_stats_tab_enabled || false,
      persona: userData?.persona || "",
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
