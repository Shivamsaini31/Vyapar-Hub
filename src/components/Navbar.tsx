"use client";
import { IUser } from "@/model/user.model";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import logo from "@/assets/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlinePhone,
  AiOutlineShop,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineSolution,
} from "react-icons/ai";
import { GoListUnordered } from "react-icons/go";
import { useState } from "react";
import { signOut } from "next-auth/react";

function Navbar({ user }: { user: IUser }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg">
      <div className=" max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src={logo} alt="logo" width={60} height={80} className="" />
          <span className="text-xl font-semibold hidden sm:inline">
            VyaparX
          </span>
        </div>
        {user.role === "user" && (
          <div className="hidden md:flex gap-8">
            <NavItem label="Home" path="/" router={router} />
            <NavItem label="Categories" path="/category" router={router} />
            <NavItem label="Shop" path="/shop" router={router} />
            <NavItem label="Orders" path="/order" router={router} />
          </div>
        )}

        {/* Desktop icons */}
        <div className="hidden md:flex items-center gap-6">
          {user.role === "user" && (
            <IconBtn
              Icon={AiOutlineSearch}
              onClick={() => router.push("/category")}
            />
          )}
          <IconBtn
            Icon={AiOutlinePhone}
            onClick={() => router.push("/support")}
          />
          <div className="relative">
            {user?.image ? (
              <Image
                src={user?.image}
                alt="user"
                height={40}
                width={40}
                className="w-10 h-10 rounded-full object-cover border border-gray-700 cursor-pointer"
                onClick={() => setOpenMenu(!openMenu)}
              />
            ) : (
              <IconBtn
                Icon={AiOutlineUser}
                onClick={() => setOpenMenu(!openMenu)}
              />
            )}
            <AnimatePresence>
              {openMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-48 backdrop-blur-lg rounded-xl shadow-lg
                  border bg-[#6a69693c]"
                >
                  <DropDownBtn Icon={AiOutlineUser} label="Profile" onClick={()=>{router.push("/profile");setOpenMenu(false)}}/>
                  <DropDownBtn Icon={AiOutlineLogin} label="SignIn" onClick={()=>{router.push("/login");setOpenMenu(false)}}/>
                  <DropDownBtn Icon={AiOutlineLogout} label="SignOut" onClick={()=>{signOut();setOpenMenu(false)}}/>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {user.role=="user" && <CartButton router={router} count={5}/>}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

// components
const NavItem = ({ label, path, router }: any) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    onClick={() => router.push(path)}
    className="hover:text-gray-300 transiton duration-100 cursor-pointer"
  >
    {label}
  </motion.button>
);

const IconBtn = ({ Icon, onClick }: any) => (
  <motion.button whileHover={{ scale: 1.1,cursor:"pointer" }} onClick={onClick}>
    <Icon size={24} />
  </motion.button>
);

const DropDownBtn=({Icon, label, onClick}:any)=>(
  <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 w-full text-left"
  onClick={onClick}>
    <Icon size={20}/>{label}
    </button>
);

const CartButton=({router,count}:any)=>(
  <motion.div className="relative" whileHover={{scale:1.1}} onClick={()=>router.push("/cart")}>
    <AiOutlineShoppingCart size={24}/>
    {count>0&&(
      <div className="absolute bg-blue-500 px-1 text-xs -top-2 -right-2 rounded-full text-white">
        {count}
      </div>
    )
      }
  </motion.div>
)