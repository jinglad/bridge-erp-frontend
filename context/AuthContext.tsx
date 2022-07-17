import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const jwt = await user.getIdToken();
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          jwt: jwt,
        });
        localStorage.setItem("token", JSON.stringify(jwt));
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("token");
  };

  return <AuthContext.Provider value={{ user, logout, googleLogin }}>{loading ? null : children}</AuthContext.Provider>;
};
