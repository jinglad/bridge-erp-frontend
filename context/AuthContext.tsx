import { GoogleAuthProvider, onAuthStateChanged, onIdTokenChanged, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        if (idToken) {
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            jwt: idToken,
          });
          localStorage.setItem("token", JSON.stringify(idToken));
          setToken(idToken)
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdTokenResult();
        if (idToken) {
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            jwt: idToken.token,
          });
          localStorage.setItem("token", JSON.stringify(idToken.token));
          // localStorage.setItem("token", idToken.token);
          setToken(idToken)
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
      setUser(user.user);
    });

    return user;
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, logout, googleLogin, token }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
