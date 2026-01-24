"use client"
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FcNext } from "react-icons/fc";
import { ClipLoader } from "react-spinners";

function EditRoleAndPhone() {
    const [role,setRole]=useState<string>("");
    const [phone,setPhone]=useState<string>("");
    const [loading,setLoading]=useState<boolean>(false);
    const router= useRouter();
    const roles=[
        {label:"User", icon:"👤", value:"user"},
        {label:"Vendor", icon:"🏪", value:"vendor"},
        {label:"Admin", icon:"🛠️", value:"admin"} , 
    ];
    const [checkAdmin,setCheckAdmin]=useState(false);
    useEffect(()=>{
        const checkAdmin=async()=>{
            try {
            const res=await axios.get("/api/admin/check-admin");
            setCheckAdmin(res.data.exists);
        } catch (error) {
            setCheckAdmin(false);
            console.log("Error checking admin existence:", error);
        }
    }
    checkAdmin();
    },
    [])
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        if(!role || !phone){
            alert("Please select a role and enter your phone number.");
            return;
        }
        setLoading(true);
        try {
            const result= await axios.post("/api/user/edit-role-phone",{role, phone});
            console.log("User updated: ", result.data);
            setLoading(false);
            router.push("/");
        } catch (error) {
            console.log("Error updating user:", error);
            setLoading(false);
        }
        
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br
     from-gray-900 via-black to-gray-900 text-white p-6">
        <AnimatePresence>
            <motion.div
            initial={{opacity:0,y:40}}
            animate={{opacity:1, y:0}}
            exit={{opacity:0, y:-40}}
            transition={{duration:0.5}}
            className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl
            shadow-xl p-10 border border-white/10"
            >
                <h1 className="text-4xl mb-4 font-semibold text-center">Choose your role</h1>
                <p className="text-center text-gray-300 mb-4 text-base">
                    Select your role and enter your mobile number to continue.
                    </p>
                    <form 
                    onSubmit={handleSubmit}
                   className="flex flex-col gap-8">
                        <input
                        type="text"
                        maxLength={10}
                        required
                        placeholder="Enter your mobile number"
                        className=" border p-4 rounded-xl bg-white/10 border-white/30 
                        text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e)=>setPhone(e.target.value)} value={phone}/>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {roles.map((rol)=>{
                                const isAdminBlocked= rol.value==="admin" && checkAdmin;
                                return (
                                    <motion.div 
                                    whileHover={{scale:1.1}}
                                    key={rol.value}
                                    onClick={()=>{
                                        if(isAdminBlocked){
                                            alert("⚠️Admin already exists. You cannot select admin role.");
                                            return;
                                        }
                                        setRole(rol.value);
                                    }}
                                    className={`cursor-pointer p-6 text-center rounded-xl border transition text-lg font-medium
                                    ${
                                        role===rol.value?
                                        "border-blue-500 bg-blue-500/40":
                                        "border-white/20 bg-white/10 hover:bg-white/20"
                                    }
                                    ${isAdminBlocked && "opacity-50 cursor-not-allowed"}
                                    `}>
                                        <div className=" flex justify-center mb-3">{rol.icon}</div>
                                        <div className=" flex justify-center">{rol.label}</div>
                                        {isAdminBlocked && <p className="text-xs text-red-400 mt-2">Admin already exists.</p>}

                                    </motion.div>
                                )
                            })}
                            </div>
                            <motion.button 
                                    type='submit'
                                      disabled={loading}
                                      whileTap={{opacity:0.7,scale:0.95}}
                                      whileHover={{opacity:1, scale:1.05}}
                                      className="text-xl flex items-center justify-center gap-2 w-full border border-white/30 bg-blue-600 mt-2 px-8 py-3 hover:bg-blue-500/20 rounded-xl font-medium">
                                        {loading? <ClipLoader size={20}/>:<>Submit<FcNext size={20}/></>}
                                      </motion.button>

                    </form>

            </motion.div>
        </AnimatePresence>
     </div>
  );
}

export default EditRoleAndPhone;
