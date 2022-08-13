import { GoogleAuthProvider, onAuthStateChanged, onIdTokenChanged, signInWithPopup, signOut } from "firebase/auth";
import { Router, useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState<any>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const unsubscribe = onIdTokenChanged(auth, async (user) => {
  //     if (user) {
  //       const idToken = await user.getIdToken();
  //       if (idToken) {
  //         setUser({
  //           uid: user.uid,
  //           email: user.email,
  //           displayName: user.displayName,
  //           photoURL: user.photoURL,
  //           jwt: idToken,
  //         });
  //         localStorage.setItem("token", JSON.stringify(idToken));
  //         setToken(idToken)
  //       } else {
  //         setUser(null);
  //       }
  //     } else {
  //       setUser(null);
  //       localStorage.removeItem("token");
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // const idToken = await user.getIdTokenResult();
        // if (idToken) {
        //   setUser({
        //     uid: user.uid,
        //     email: user.email,
        //     displayName: user.displayName,
        //     photoURL: user.photoURL,
        //     jwt: idToken.token,
        //   });
        //   localStorage.setItem("token", JSON.stringify(idToken.token));
        //   // localStorage.setItem("token", idToken.token);
        //   // setToken(idToken)
        // } else {
        //   setUser(null);
        //   // await signOut(auth);
        // }
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
      fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/login`, {
        method: "POST",
        headers: {
          "content-type":"application/json",
        },
        body: JSON.stringify(user.user)
      }).then(res => {
        if(res.ok) return res.json();
      }).then(data => {
        setToken(data?.accessToken);
        localStorage.setItem("token", data?.accessToken);
      })
      .catch(error => console.log(error))
    });

    return user;
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("token");
    router.push("/login").then();
  };

  return (
    <AuthContext.Provider value={{ user, logout, googleLogin, token }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
