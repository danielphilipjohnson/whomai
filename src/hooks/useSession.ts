'use client';

import { create } from 'zustand';

export type SessionUser = {
  name: string;
};

type SessionState = {
  user: SessionUser | null;
  login: (user: SessionUser) => void;
  logout: () => void;
};

export const useSession = create<SessionState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
