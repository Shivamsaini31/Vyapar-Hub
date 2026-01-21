"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { use, useState } from "react";
import { FcNext } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { signIn } from "next-auth/react";

function Register() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name,setName]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [showPassword, setShowPassword]=useState(false);
  const [loading, setLoading]=useState(false);
  const [err, setErr]=useState("");
  const router=useRouter();
  const handleSignUp=async (e:React.FormEvent)=>{
    setLoading(true);
    //API call to reigster the user
    e.preventDefault();
    try {
      const result= await axios.post("api/auth/register",{name, email, password});
      console.log("User registered:", result.data);
      setLoading(false);
      router.push("/login");
      setName("");
      setPassword("");
      setEmail("");
    } catch (error) {
      console.log("Error in user registration:", error);
      if(axios.isAxiosError(error) && error.response){
        setErr(error.response.data.message);
      }
      
      setLoading(false);
    }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      {/* UI for step 1 */}
      <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div 
        initial={{opacity:0, y:40}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.5}}
        exit={{opacity:0, y:-40}}
        className="w-full max-w-lg text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/20">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">Welcome to Multicart</h1>
          <p className="text-gray-300 mb-6">Register with one of the following account types:</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {
              [
                {label:"User", icon:"👤", value:"user"},
                {label:"Vendor", icon:"🏪", value:"vendor"},
                {label:"Admin", icon:"🛠️", value:"admin"} ,    
              ].map((item)=>(
                <motion.div key={item.value} whileHover={{scale:1.1}} whileTap={{scale:0.95}} transition={{duration:0.01}}
                className="p-4 bg-white/5 hover:bg-white/20 cursor-pointer rounded-xl border border-white/30
                shadow-lg flex flex-col items-center transition">
                  <span className="text-4xl mb-2">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))
            }
          </div>
          <motion.button 
          onClick={()=>setStep(2)}
          whileTap={{opacity:0.7,scale:0.95}}
          whileHover={{opacity:1, scale:1.05}}
          className="text-2xl flex items-center justify-center gap-2 w-full border border-white/30 bg-blue-600 mt-4 px-8 py-3 hover:bg-blue-500/20 rounded-xl font-medium">
            Next<FcNext/>
          </motion.button>
        </motion.div>
      )}
      {/* UI for step 2 */}
      {step === 2 && <motion.div
      className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
      initial={{opacity:0, y:40}}
      animate={{opacity:1, y:0}}
      transition={{duration:0.5}}
      exit={{opacity:0, y:-40}}>
        <h1 className="text-2xl font-semibold text-center mb-6 text-blue-300">Create your Account</h1>
        <form  
        onSubmit={handleSignUp}
        className="flex flex-col gap-4">
          <input type="text"
          required
          placeholder="Full name"
          className="bg-white/10 border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus: ring-blue-500"
          onChange={(e)=>setName(e.target.value)}
          value={name}
          ></input>
          <input type="text"
          required
          placeholder="Email"
          className="bg-white/10 border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus: ring-blue-500"
          onChange={(e)=>setEmail(e.target.value)}
          value={email}
          ></input>
          <div className="relative">
          <input type={showPassword ? "text" : "password"}
          required
          placeholder="Password"    
          className="bg-white/10 w-full border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>setPassword(e.target.value)}
          value={password}
          />
          <button type="button"
          onClick={()=>setShowPassword(!showPassword)}
          className="absolute right-7 bottom-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >{showPassword ?<FaRegEyeSlash size={20} />:<FaRegEye size={20} />}</button>
          </div>
          {err && <p className="text-red-500 text-sm text-center bg-yellow-200/10 rounded-lg">{err}</p>}
          <motion.button 
        type='submit'
          disabled={loading}
          whileTap={{opacity:0.7,scale:0.95}}
          whileHover={{opacity:1, scale:1.05}}
          className="text-xl flex items-center justify-center gap-2 w-full border border-white/30 bg-blue-600 mt-2 px-8 py-3 hover:bg-blue-500/20 rounded-xl font-medium">
            {loading? <ClipLoader size={20}/>:<>Register Now<FcNext size={20}/></>}
          </motion.button>
          <div className="flex items-center justify-center mt-2">
            <div className="h-px bg-gray-400 w-45 mr-2"></div>
            <span className="text-xl font-medium text-gray-400">or</span>
            <div className="h-px bg-gray-400 w-45 ml-2"></div>
          </div>
          <motion.button 
          onClick={()=>signIn("google",{callbackUrl:"/"})}
        type='button'
          whileTap={{opacity:0.7,scale:0.95}}
          whileHover={{opacity:1, scale:1.05}}
          className="text-xl flex items-center justify-center gap-2 w-full border border-white/30 bg-white/10 mt-4 px-8 py-3 hover:bg-blue-500/20 rounded-xl font-medium">
            <FcGoogle className='w-5 h-5'/>Continue with Google
          </motion.button>

          <p className=" text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <span 
            onClick={()=>router.push("/login")}
            className="text-blue-400 hover:underline hover:cursor-pointer transition hover:text-blue-300">
              SignIn
            </span>
          </p>
        </form>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

export default Register;
