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
        const idToken = await user.getIdTokenResult();
        if (idToken.claims.admin) {
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            jwt: idToken.token,
          });
          localStorage.setItem("token", JSON.stringify(idToken.token));
        } else {
          setUser(null);
          // await signOut(auth);
        }
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
    const user = signInWithPopup(auth, provider);
    //update user data on the server
    user.then((user) => {
      auth.updateCurrentUser(user.user);
    });

    return user;
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("token");
  };

  return <AuthContext.Provider value={{ user, logout, googleLogin }}>{loading ? null : children}</AuthContext.Provider>;
};
