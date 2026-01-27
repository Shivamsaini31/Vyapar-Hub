"use client";
import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Dashboard from "./Dashboard";
import Products from "./Products";
import Orders from "./Orders";

function VendorDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [openMenu, setOpenMenu] = useState(false);
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} /> },
    { id: "products", label: "Products", icon: <FaBoxOpen size={22} /> },
    { id: "orders", label: "Orders", icon: <FaShoppingCart size={22} /> },
  ];
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
    }
  };
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      {/* Mobile Tab bar */}
      <div
        className="lg:hidden fixed top-15 left-0 w-full
        bg-black px-6 py-3 flex justify-between items-center border-b
        border-gray-700 z-50"
      >
        <h1 className="text-xl font-bold">Vendor Panel</h1>
        <button onClick={() => setOpenMenu(!openMenu)}>
          <AiOutlineMenu size={24} />
        </button>
      </div>

      {/* Sidebar for large Area */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:block w-72 bg-gray-800/40 border-r border-gray-700 p-6 backdrop-blur-xl"
      >
        <h1 className="text-xl font-bold mb-6 mt-6">Vendor Panel</h1>
        <div className="flex flex-col gap-3">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm 
                        ${
                          activePage === item.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Sidebar for mobile phone */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 w-72 h-full
         bg-gray-800/90 backdrop-blur-xl p-6 z-50 border-r border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Vendor Panel</h1>
              <button onClick={() => setOpenMenu(false)} className="">
                <AiOutlineClose size={26} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {menu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setOpenMenu(false);
                    setActivePage(item.id);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm 
                        ${
                          activePage === item.id
                            ? "bg-blue-600 text-white"
                            : "bg-black hover:bg-gray-700"
                        }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className=" flex-1 mt-16 p-10 lg:mt-0"
      >
        {renderPage()}
      </motion.div>
    </div>
  );
}

export default VendorDashboard;
