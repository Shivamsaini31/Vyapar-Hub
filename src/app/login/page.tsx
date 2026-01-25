"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle, FcNext } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import React from "react";
import { signIn, useSession } from "next-auth/react";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();
  const session=useSession();
  console.log(session.data?.user);
  const handleSignIn = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
        const result=await signIn("credentials",{
            email,
            password,
            redirect:false
        });
        
        setLoading(false);
          if (result?.error) {
    setErr("Invalid email or password"); 
    return;
  }

  if (result?.ok) {
    router.push("/");
    alert("Signed in successfully");
  }
    } catch (error) {
      console.log("Error in user signIn:", error);
      if (axios.isAxiosError(error) && error.response) {
        setErr(error.response.data.message);
      }
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <AnimatePresence>
        <motion.div
          className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: -40 }}
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-300">
            Welcome Back to <span className="text-blue-600">VyaparX</span>
          </h1>
          <form
          onSubmit={handleSignIn}
           className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Email"
              className="bg-white/10 border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus: ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="bg-white/10 w-full border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-7 bottom-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? (
                  <FaRegEyeSlash size={20} />
                ) : (
                  <FaRegEye size={20} />
                )}
              </button>
            </div>
            {err && (
              <p className="text-red-500 text-sm text-center bg-yellow-200/10 rounded-lg">
                {err}
              </p>
            )}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ opacity: 0.7, scale: 0.95 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="text-xl flex items-center justify-center gap-2 w-full border border-white/30 bg-blue-600 mt-2 px-8 py-3 hover:bg-blue-500/20 rounded-xl font-medium"
            >
              {loading ? (
                <ClipLoader size={20} />
              ) : (
                <>
                  Login Now
                  <FcNext size={20} />
                </>
              )}
            </motion.button>
            <div className="flex items-center justify-center mt-2">
              <div className="h-px bg-gray-400 w-45 mr-2"></div>
              <span className="text-xl font-medium text-gray-400">or</span>
              <div className="h-px bg-gray-400 w-45 ml-2"></div>
            </div>
            <motion.button
              type="button"
              onClick={()=>signIn("google",{callbackUrl:"/"})}
              whileTap={{ opacity: 0.7, scale: 0.95 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="text-xl flex items-center justify-center gap-2 w-full border border-white/30 bg-white/10 mt-4 px-8 py-3 hover:bg-blue-500/20 rounded-xl font-medium"
            >
              <FcGoogle className="w-5 h-5" />
              Login with Google
            </motion.button>

            <p className=" text-center text-sm text-gray-400 mt-4">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-blue-400 hover:underline hover:cursor-pointer transition hover:text-blue-300"
              >
                SignUp
              </span>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SignIn;
