import create from "zustand";
import { persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";
import { deleteCookie } from "cookies-next";

interface IUser {
  email: string | null;
  role: string | null;
  id: string | null;
}

interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: () => void;
}

const useUserStore = create<IUserStore>()(
  persist(
    (set) =>
      ({
        user: null,
        setUser: (user: IUser) => set({ user }),
        logout: () => {
          set({ user: null });
          deleteCookie("token");
        },
      } as IUserStore),
    {
      name: "user",
    }
  )
);

export default useUserStore;

export const useTrackedUserStore = createTrackedSelector(useUserStore);
