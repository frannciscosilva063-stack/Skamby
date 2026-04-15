"use client";

import { create } from "zustand";

type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  setSession: (input: { accessToken: string; refreshToken: string; userId: string }) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  accessToken: null,
  refreshToken: null,
  userId: null,
  isLoggedIn: false,
  setSession: ({ accessToken, refreshToken, userId }) =>
    set({ accessToken, refreshToken, userId, isLoggedIn: true }),
  clearSession: () => set({ accessToken: null, refreshToken: null, userId: null, isLoggedIn: false })
}));
