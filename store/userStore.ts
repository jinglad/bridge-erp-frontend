import create from "zustand";
import { persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";

interface IUser {
  email: string | null;
  role: string | null;
  id: string | null;
}

interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  // accessToken: string | null;
  // setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

const useUserStore = create<IUserStore>()(
  persist(
    (set) =>
      ({
        user: null,
        setUser: (user: IUser) => set({ user }),
        // accessToken: null,
        // setAccessToken: (accessToken: string) => set({ accessToken }),
        logout: () => set({ user: null }),
      } as IUserStore),
    {
      name: "user",
    }
  )
);

export default useUserStore;

export const useTrackedUserStore = createTrackedSelector(useUserStore);
