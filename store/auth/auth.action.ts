import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInAnonymously, signInWithPopup, linkWithPopup, signOut } from "firebase/auth";

export async function signInUsingGoogle() {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();
    await signInWithPopup(auth, provider)
    return true;
}

export async function signInAsGuest() {
    await signInAnonymously(auth)
    return true;
}

export async function linkAnonymousUserWithGoogle() {
    const currentUser = auth.currentUser;
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();
  
    if (!currentUser || !currentUser.isAnonymous) {
      throw new Error("No anonymous user is currently signed in.");
    }
    try {
      await linkWithPopup(currentUser, provider);
      console.log("Anonymous account successfully linked to Google.");
      return true
    } catch (error) {
      console.error("Failed to link anonymous account with Google:", error);
      throw error;
    }
  }

  export async function logout() {
    console.log("logging out...")
    await signOut(auth)
  }