import createSelector from "../createSelector";
import { User } from "firebase/auth"
import { create } from "zustand";
import { persist } from "zustand/middleware"

export type AuthStoreState = {
    user: User|null,
    
}

export const authInitialState : AuthStoreState = {
    user: null,
}


const useAuthStore = create<AuthStoreState>()(
    persist(
        () => ({
          ...authInitialState
        }),
        {
          name: 'auth-storage',
        },
      ),
  
);

export const authSelector = createSelector(useAuthStore);