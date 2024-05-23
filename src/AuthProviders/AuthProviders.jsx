import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import useAxiosPublic from "../useCustomHook/useAxiosPublic";
import { GoogleAuthProvider } from "firebase/auth/cordova";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);

const AuthProviders = ({ children }) => {
  const axiosNoToken = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleUpdateProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const emailVerification = () => {
    return sendEmailVerification(auth.currentUser);
  };

  const logOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // console.log("user in ", currentUser);
      setUser(currentUser);
      const getEmail = currentUser?.email || user?.email;
      const emailToSend = { email: getEmail };
      setLoading(false);
      // if (getEmail) {
      //   await axiosNoToken
      //     .post("/jwt", emailToSend, {
      //       withCredentials: true,
      //     })
      //     .then((res) => console.log("login token response", res.data));
      // } else {
      //   await axiosNoToken
      //     .post("/logout", emailToSend, {
      //       withCredentials: true,
      //     })
      //     .then((res) => console.log("logout token response", res.data));
      // }
    });
    return () => {
      unSubscribe();
    };
  }, [user?.email, axiosNoToken]);

  const authInfo = {
    user,
    createUser,
    login,
    logOut,
    loading,
    handleUpdateProfile,
    googleLogin,
    resetPassword,
    emailVerification,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
