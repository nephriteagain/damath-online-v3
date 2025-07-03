import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInAnonymously, signInWithPopup, linkWithPopup, signOut } from "firebase/auth";
import { authSelector } from "./auth.store";

export async function signInUsingGoogle() {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    authSelector.setState({user, signInMethod: "google"})
}

export async function signInAsGuest() {
    const result = await signInAnonymously(auth)
    const user = result.user
    authSelector.setState({user, signInMethod: "anonymous"})
    return true
}

export async function linkAnonymousUserWithGoogle() {
    const currentUser = auth.currentUser;
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();
  
    if (!currentUser || !currentUser.isAnonymous) {
      throw new Error("No anonymous user is currently signed in.");
    }
    try {
      const result = await linkWithPopup(currentUser, provider);
      const user = result.user;
      authSelector.setState({ user, signInMethod: "google" });
      console.log("Anonymous account successfully linked to Google.");
    } catch (error) {
      console.error("Failed to link anonymous account with Google:", error);
      throw error;
    }
  }

  export async function logout() {
    console.log("logging out...")
    await signOut(auth)
  }