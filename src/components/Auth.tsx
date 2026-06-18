import React, { useState } from "react";
import { User } from "../types";
import { UserCheck, Shield, Award, UserPlus, LogOut } from "lucide-react";

interface AuthProps {
  currentUser: User;
  onLogin: (user: User) => void;
  onLogout: () => void;
  lang: "en" | "bn";
}

export default function Auth({ currentUser, onLogin, onLogout, lang }: AuthProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === "en" ? "Name is required" : "নাম আবশ্যিক");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError(lang === "en" ? "Enter a valid email" : "একটি সঠিক ইমেল লিখুন");
      return;
    }

    const randomId = "TSA-" + Math.floor(100 + Math.random() * 900);
    const mockUser: User = {
      name: name,
      email: email,
      studentId: randomId,
      isLoggedIn: true,
      avatarSeed: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    };

    onLogin(mockUser);
    setError("");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl">
      {/* Upper Colored Banner */}
      <div className="bg-gradient-to-r from-[#1565c0] to-[#42a5f5] p-8 text-white text-center relative">
        <div className="absolute right-4 top-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono">
          SECURE CLIENT SESSION
        </div>
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white/40 mb-3">
          {currentUser.isLoggedIn ? (
            <img
              src={currentUser.avatarSeed}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Shield className="w-10 h-10 text-[#1565c0]" />
          )}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {currentUser.isLoggedIn 
            ? (lang === "en" ? "Dashboard Access" : "ড্যাশবোর্ড অ্যাক্সেস")
            : (lang === "en" ? "Student Login Portal" : "শিক্ষার্থী লগইন পোর্টাল")
          }
        </h2>
        <p className="text-sm text-blue-100 mt-1">
          {currentUser.isLoggedIn
            ? (lang === "en" ? "Manage your official success record" : "আপনার সাফল্যের রেকর্ড পরিচালনা করুন")
            : (lang === "en" ? "Join The Success Academy" : "দ্য সাকসেস একাডেমিতে যুক্ত হোন")
          }
        </p>
      </div>

      <div className="p-8">
        {currentUser.isLoggedIn ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute right-3 top-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● Verified
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
                {lang === "en" ? "STUDENT PROFILE CARD" : "শিক্ষার্থী প্রোফাইল কার্ড"}
              </p>
              <h3 className="text-xl font-bold text-slate-800">{currentUser.name}</h3>
              <p className="text-sm text-slate-500">{currentUser.email}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    {lang === "en" ? "Student ID" : "স্টুডেন্ট আইডি"}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 font-mono">
                    {currentUser.studentId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    {lang === "en" ? "System Access" : "সিস্টেম অ্যাক্সেস"}
                  </span>
                  <span className="text-xs font-bold text-blue-600 block">
                    {lang === "en" ? "GRANTEE LEVEL" : "গ্রান্টি লেভেল"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#1565c0] shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 leading-relaxed">
                {lang === "en" ? (
                  <>
                    <strong>Personalized Certificate System Activated!</strong> Your name will now be printed on dynamically generated achievements sheets and live exam results automatically.
                  </>
                ) : (
                  <>
                    <strong>সার্টিফিকেট সিস্টেম চালু হয়েছে!</strong> এখন থেকে আপনার যেকোনো টেস্ট বা মেধার ফলাফল ও সার্টিফিকেট এই নামে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।
                  </>
                )}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 text-rose-600 hover:bg-rose-100 active:bg-rose-200 font-semibold rounded-2xl transition duration-200 mt-4 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {lang === "en" ? "Sign Out Profile" : "প্রোফাইল থেকে লগআউট"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                {lang === "en" ? "Full Name" : "সম্পূর্ণ নাম"}
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "en" ? "Enter your name..." : "আপনার নাম লিখুন..."}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1565c0]/20 focus:border-[#1565c0] text-slate-800 placeholder:text-slate-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                {lang === "en" ? "E-mail Address" : "ইমেল ঠিকানা"}
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@success.academy"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1565c0]/20 focus:border-[#1565c0] text-slate-800 placeholder:text-slate-400 transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#1565c0] to-[#42a5f5] hover:opacity-95 text-white font-bold rounded-2xl shadow-md cursor-pointer transition"
              >
                <UserPlus className="w-5 h-5" />
                {lang === "en" ? "Create Account & Log In" : "অ্যাকাউন্ট তৈরি ও লগইন করুন"}
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 leading-normal pt-2">
              {lang === "en" 
                ? "This secure sandbox authentication allows you to register instantly within this local session container."
                : "এই নিরাপদ স্যান্ডবক্স অথেনটিকেশন আপনাকে এই সেশনের মধ্যে তাত্ক্ষণিকভাবে রেজিস্টার করতে সাহায্য করে।"
              }
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
