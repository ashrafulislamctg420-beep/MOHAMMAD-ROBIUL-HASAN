import React, { useState } from "react";
import {
  Award,
  Zap,
  Clock,
  Trophy,
  Users,
  CheckCircle2,
  ChevronRight,
  Bell,
  BookOpen,
  Sparkles,
  Check,
  Info,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";
import SuccessAcademyLogo from "./SuccessAcademyLogo";
import { AppNotification } from "../types";

interface HomeProps {
  onStartLearning: () => void;
  onNavigateToTab: (tab: "home" | "courses" | "exam" | "result") => void;
  lang: "en" | "bn";
  completedExamsCount: number;
  avgScore: number;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export default function Home({
  onStartLearning,
  onNavigateToTab,
  lang,
  completedExamsCount,
  avgScore,
  notifications,
  onMarkNotificationRead,
}: HomeProps) {
  // Modal controllers for interactive overlays
  const [activeModal, setActiveModal] = useState<"practice" | "analysis" | "notifications" | null>(null);

  // Quick practice state (5 quick BCS/Primary preparation questions)
  const [currentPracticeIdx, setCurrentPracticeIdx] = useState(0);
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<number, number>>({});
  const [showPracticeExplanation, setShowPracticeExplanation] = useState(false);
  const [practiceScore, setPracticeScore] = useState<number | null>(null);

  const practiceQuestions = [
    {
      q: "Where is the headquarter of the Bangladesh Bank located?",
      qBn: "বাংলাদেশ ব্যাংকের প্রধান কার্যালয় কোথায় অবস্থিত?",
      options: ["Motijheel, Dhaka", "Kawran Bazar, Dhaka", "Agrabad, Chattogram", "Khulna"],
      optionsBn: ["মতিঝিল, ঢাকা", "কাওরান বাজার, ঢাকা", "আগ্রাবাদ, চট্টগ্রাম", "খুলনা"],
      correct: 0,
      explain: "The headquarter of Bangladesh Bank is located at Motijheel Commercial Area in Dhaka, Bangladesh.",
      explainBn: "বাংলাদেশ ব্যাংকের প্রধান কার্যালয় দেশের রাজধানী ঢাকার মতিঝিল বাণিজ্যিক এলাকায় অবস্থিত।"
    },
    {
      q: "Which major river enters Bangladesh from India near Chapainawabganj?",
      qBn: "কোন নদীটি চাঁপাইনবাবগঞ্জ দিয়ে বাংলাদেশে প্রবেশ করেছে?",
      options: ["Meghna", "Padma", "Jamuna", "Teesta"],
      optionsBn: ["মেঘনা", "পদ্মা", "যমুনা", "তিস্তা"],
      correct: 1,
      explain: "The Ganges enters Bangladesh from India as the Padma river near Chapainawabganj district.",
      explainBn: "গঙ্গা নদী ভারতে প্রবাহিত হয়ে চাঁপাইনবাবগঞ্জ জেলা দিয়ে 'পদ্মা' নামে বাংলাদেশে প্রবেশ করেছে।"
    },
    {
      q: "What is the official tagline of the Success Academy?",
      qBn: "সাফল্য একাডেমির অফিসিয়াল স্লোগান কোনটি?",
      options: ["Your learning buddy", "Your Success Companion", "Knowledge First", "Build your future"],
      optionsBn: ["আপনার শেখার বন্ধু", "আপনার সাফল্যের সঙ্গী", "জ্ঞান সবার আগে", "স্বপ্ন গড়ুন নিজে"],
      correct: 1,
      explain: "The official slogan is 'Your Success Companion' (আপনার সাফল্যের সঙ্গী).",
      explainBn: "সাফল্য একাডেমির অফিসিয়াল বাংলা স্লোগান হলো 'আপনার সাফল্যের সঙ্গী'।"
    }
  ];

  const handleSelectPracticeOption = (optionIdx: number) => {
    if (showPracticeExplanation) return;
    setSelectedPracticeAnswers({
      ...selectedPracticeAnswers,
      [currentPracticeIdx]: optionIdx
    });
    setShowPracticeExplanation(true);
  };

  const handleNextPractice = () => {
    setShowPracticeExplanation(false);
    if (currentPracticeIdx < practiceQuestions.length - 1) {
      setCurrentPracticeIdx((p) => p + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      Object.entries(selectedPracticeAnswers).forEach(([qIdx, ansIdx]) => {
        if (practiceQuestions[Number(qIdx)].correct === ansIdx) {
          correctCount++;
        }
      });
      setPracticeScore(correctCount);
    }
  };

  const handleResetPractice = () => {
    setCurrentPracticeIdx(0);
    setSelectedPracticeAnswers({});
    setShowPracticeExplanation(false);
    setPracticeScore(null);
  };

  // Mock analytics diagnostic state
  const mockStrengths = [
    { subject: "Bangladesh Affairs", progress: 92, status: "Excellent", statusBn: "অসাধারণ" },
    { subject: "International Affairs", progress: 85, status: "Strong", statusBn: "বেশ ভালো" },
    { subject: "Bangla Grammar", progress: 78, status: "Good", statusBn: "ভালো" },
    { subject: "Mathematical Reasoning", progress: 54, status: "Needs Review", statusBn: "চর্চা প্রয়োজন" },
    { subject: "English Literature", progress: 41, status: "Critical Focus", statusBn: "মনোযোগ দিন" }
  ];

  return (
    <div className="space-y-16 animate-fade-in relative">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-br from-[#1565c0] to-[#42a5f5] text-white rounded-[40px] px-8 py-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-xl shadow-blue-500/10 border border-white/10 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 text-white/5 pointer-events-none">
          <Award className="w-80 h-80" />
        </div>

        <div className="lg:w-1/2 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          {/* Logo Badge Overlay */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 hover:bg-white/15 transition-colors rounded-full border border-white/20 text-xs font-black tracking-wide backdrop-blur-md shadow-sm select-none mb-4">
            <div className="bg-white p-0.5 rounded-full flex items-center justify-center">
              <SuccessAcademyLogo size={22} variant="badge" />
            </div>
            <span className="text-white font-black tracking-wide text-[11px] uppercase">
              {lang === "en" ? "THE SUCCESS ACADEMY" : "দ্য সাকসেস একাডেমি"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
            {lang === "en" ? (
              <>
                Your Digital Partner <br />
                <span className="text-blue-100">to Ultimate Success</span>
              </>
            ) : (
              <>
                সাফল্যের পথে আপনার <br />
                <span className="text-blue-100">সবচেয়ে বিশ্বস্ত সহযোগী</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-blue-50/95 font-medium leading-relaxed max-w-lg">
            {lang === "en"
              ? "Prepare systematically for BCS, Primary Teacher Recruitment, and competitive university admissions with state-of-the-art interactive exam suites."
              : "বিসিএস, প্রাইমারি সহকারী শিক্ষক নিয়োগ এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য আধুনিক সিলেবাস ও লাইভ মক টেস্ট মডেল দিয়ে নিন সেরা প্রস্তুতি।"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={onStartLearning}
              className="px-8 py-4 bg-white hover:bg-rose-50 text-[#1565c0] font-black rounded-2xl text-xs uppercase tracking-widest transition duration-150 cursor-pointer shadow-lg shadow-blue-800/25 flex items-center justify-center gap-2"
            >
              <span>{lang === "en" ? "Explore Courses" : "আমাদের কোর্সসমূহ"}</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => onNavigateToTab("exam")}
              className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-black rounded-2xl text-xs uppercase tracking-widest transition duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{lang === "en" ? "Take Live Quiz" : "লাইভ মক টেস্ট"}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero STAT CARD */}
        <div className="bg-white text-slate-800 p-8 rounded-[32px] w-full max-w-sm shadow-2xl border border-slate-100 transform hover:scale-[1.02] transition-transform duration-300 relative">
          <div className="absolute -top-3 left-6 px-4 py-1 bg-amber-400 text-stone-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
            {lang === "en" ? "Live Exam Hub" : "লাইভ এক্সাম সেন্টার"}
          </div>

          <h2 className="text-2xl font-black text-[#1565c0] tracking-tight">
            {lang === "en" ? "Online Exam System" : "অনলাইন পরীক্ষা"}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-normal">
            {lang === "en" ? "Real time ranking & performance tracker" : "রিয়েল টাইম র‍্যাংকিং ও পারফর্ম্যান্স ট্র্যাকার"}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-100">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-black text-[#1565c0] font-mono leading-none">10K+</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-2">
                {lang === "en" ? "Students" : "শিক্ষার্থী"}
              </p>
            </div>

            <div className="text-center border-x border-slate-100/80 px-1">
              <h3 className="text-xl sm:text-2xl font-black text-[#1565c0] font-mono leading-none">500+</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-2">
                MCQ
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-black text-amber-500 font-mono leading-none">99%</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-2">
                {lang === "en" ? "Success" : "সফলতা"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMICAL 6 TILES FEATURES (সাফল্যের জন্য যা যা দরকার) */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#1565c0] font-mono bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/50">
            {lang === "en" ? "Our Core LMS Ecosystem" : "আমাদের লার্নিং ইকোসিস্টেম"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
            {lang === "en" ? "Everything You Need for Success" : "সাফল্যের জন্য যা যা দরকার"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            {lang === "en"
              ? "Explore customizable digital components designed solely to maximize competitive readiness."
              : "আমাদের প্ল্যাটফর্ম আপনার পরীক্ষার প্রস্তুতিকে কার্যকর, আকর্ষণীয় এবং উপভোগ্য করতে ডিজাইন করা হয়েছে।"}
          </p>
        </div>

        {/* 6 Responsive Grid Plates resembling the specified mockup screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Smart Practice */}
          <div
            onClick={() => {
              setActiveModal("practice");
              handleResetPractice();
            }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-red-50 text-red-500 rounded-bl-[20px] text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {lang === "en" ? "Try Practice" : "অনুশীলন করুন"}
            </div>
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-rose-300/30">
                <CheckCircle2 className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-[#1565c0] transition-colors">
                  {lang === "en" ? "Smart Practice" : "স্মার্ট অনুশীলন"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {lang === "en"
                    ? "Practice high-yield chapter MCQs with active logic bubbles, instant accuracy reports, and answers explanation sheets."
                    : "অধ্যায় ও বিষয় অনুযায়ী সাজানো হাজারো MCQ দিয়ে অনুশীলন করুন। তাৎক্ষণিক ফলাফল ও বিস্তারিত ব্যাখ্যা গান।"}
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-black text-[#1565c0] group-hover:translate-x-1.5 transition-transform mt-4">
              <span>{lang === "en" ? "Launch Practice Zone" : "অনুশীলন জোন চালু করুন"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Live Exam */}
          <div
            onClick={() => onNavigateToTab("exam")}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-indigo-50 text-indigo-500 rounded-bl-[20px] text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {lang === "en" ? "Go to Exam" : "পরীক্ষায় যান"}
            </div>
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1565c0] to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-300/30">
                <Clock className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-[#1565c0] transition-colors">
                  {lang === "en" ? "Live Exam Arena" : "লাইভ পরীক্ষা"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {lang === "en"
                    ? "Settle in true nationwide online competitive model exams under standard count timers."
                    : "সারা দেশের শিক্ষার্থীদের সাথে নির্ধারিত লাইভ পরীক্ষায় অংশ নিন। বাস্তব পরীক্ষার পরিবেশ অনুভব করুন।"}
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-black text-[#1565c0] group-hover:translate-x-1.5 transition-transform mt-4">
              <span>{lang === "en" ? "Enter Live Arena" : "লাইভ পরীক্ষায় অংশ নিন"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Detailed Analysis */}
          <div
            onClick={() => setActiveModal("analysis")}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-emerald-50 text-emerald-500 rounded-bl-[20px] text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {lang === "en" ? "See Statistics" : "পরিসংখ্যান দেখুন"}
            </div>
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-300/30">
                <Trophy className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-[#1565c0] transition-colors">
                  {lang === "en" ? "Detailed Performance Analysis" : "বিস্তারিত বিশ্লেষণ"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {lang === "en"
                    ? "Diagnose subject progress thresholds, spot weakness fields and elevate overall response accuracies."
                    : "বিস্তারিত অ্যানালিটিক্স দিয়ে আপনার পারফরম্যান্স ট্র্যাক করুন। দুর্বল দিকগুলো চিহ্নিত করে পদ্ধতিগতভাবে উন্নতি করুন।"}
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-black text-[#1565c0] group-hover:translate-x-1.5 transition-transform mt-4">
              <span>{lang === "en" ? "Inspect Analytics Dashboard" : "বিশ্লেষণ ড্যাশবোর্ড দেখুন"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Structured Courses */}
          <div
            onClick={() => onNavigateToTab("courses")}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-amber-50 text-amber-500 rounded-bl-[20px] text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {lang === "en" ? "Browse Courses" : "কোর্স ব্রাউজ"}
            </div>
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md shadow-amber-300/30">
                <BookOpen className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-[#1565c0] transition-colors">
                  {lang === "en" ? "Structured Premium Courses" : "সুগঠিত কোর্স"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {lang === "en"
                    ? "Follow step-by-step lecture guides, systematic syllabus trackers curated by top cadre experts."
                    : "অধ্যায় ও মডিউল সহ সুসংগঠিত কোর্স অনুসরণ করুন। নিজের গতিতে ধাপে দ্বাপে শিখুন।"}
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-black text-[#1565c0] group-hover:translate-x-1.5 transition-transform mt-4">
              <span>{lang === "en" ? "Open Structured Courses" : "সুগঠিত কোর্সসমূহ খুলুন"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Leaderboard */}
          <div
            onClick={() => onNavigateToTab("result")}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-fuchsia-50 text-fuchsia-500 rounded-bl-[20px] text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {lang === "en" ? "Merit List" : "মেধা তালিকা"}
            </div>
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-fuchsia-300/30">
                <Users className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-[#1565c0] transition-colors">
                  {lang === "en" ? "Nationwide Merit Leaderboard" : "লিডারবোর্ড ও মেধা তালিকা"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {lang === "en"
                    ? "Evaluate your score standard against high achieving students of the country in real-time."
                    : "অন্যান্য শিক্ষার্থীদের সাথে আপনার অগ্রগতি তুলনা করুন। র‍্যাঙ্কিংয়ে এগিয়ে থেকে মোটিভেটেড থাকুন!"}
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-black text-[#1565c0] group-hover:translate-x-1.5 transition-transform mt-4">
              <span>{lang === "en" ? "Show Leaderboard Rankings" : "র‍্যাঙ্কিং ও লিডারবোর্ড দেখুন"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Smart Notification */}
          <div
            onClick={() => setActiveModal("notifications")}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-cyan-50 text-cyan-500 rounded-bl-[20px] text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {lang === "en" ? "News Alert" : "খবর ও বিজ্ঞপ্তি"}
            </div>
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-cyan-300/30 relative">
                <Bell className="w-7 h-7 stroke-[2]" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black font-mono text-[9px] w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-[#1565c0] transition-colors">
                  {lang === "en" ? "Smart Notification Alerts" : "স্মার্ট নোটিফিকেশন"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {lang === "en"
                    ? "Acquire instantaneous schedules alerting of incoming exams, newly integrated study lectures, and custom reading reminders."
                    : "আসন্ন পরীক্ষা, নতুন কন্টেন্ট এবং পড়ার রিমাইন্ডার সম্পর্কে নোটিফিকেশন পান। কোনো গুরুত্বপূর্ণ আপডেট মিস করবেন না।"}
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-black text-[#1565c0] group-hover:translate-x-1.5 transition-transform mt-4">
              <span>{lang === "en" ? "Open System Alerts" : "নোটিফিকেশন প্যানেল খুলুন"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. STUDENT DASHBOARD PREVIEW */}
      <section className="space-y-8 bg-slate-100/50 p-8 sm:p-12 rounded-[40px] border border-slate-200/40 text-left">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#1565c0] font-mono">
            {lang === "en" ? "Visual Performance Monitor" : "ড্যাশবোর্ড পর্যবেক্ষণ"}
          </span>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {lang === "en" ? "Student Dashboard" : "শিক্ষার্থী ড্যাশবোর্ড"}
          </h2>
          <p className="text-sm text-slate-500">
            {lang === "en"
              ? "Gain dynamic diagnostic insight of completed trials and average accuracy scores instantaneously."
              : "আপনার পরীক্ষার মোট সংখ্যা, গড় অর্জিত মার্কস এবং লিডারবোর্ড র‍্যাংক লাইভ দেখুন।"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center w-60 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-4xl font-black text-[#1565c0] font-mono leading-none">
              {completedExamsCount > 0 ? completedExamsCount : 0}
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">
              {lang === "en" ? "Completed Exams" : "মোট সম্পন্ন পরীক্ষা"}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center w-60 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-4xl font-black text-emerald-600 font-mono leading-none">
              {avgScore > 0 ? `${avgScore}%` : "0%"}
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">
              {lang === "en" ? "Average Score" : "গড় স্কোর"}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center w-60 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-4xl font-black text-amber-500 font-mono leading-none">
              {completedExamsCount > 0 ? "#4" : "N/A"}
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">
              {lang === "en" ? "Leaderboard Rank" : "লিডারবোর্ড র‍্যাংক"}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ================= INTERACTIVE MODAL OVERLAYS (POPUP HANDLERS) ============ */}
      {/* ========================================================================= */}

      {/* MODAL 1: SMART PRACTICE */}
      {activeModal === "practice" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-55 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setActiveModal(null);
                handleResetPractice();
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1.5 pr-6">
              <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-600 font-black font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lang === "en" ? "Instant Practice Mode" : "তাত্ক্ষণিক অনুশীলন"}
              </span>
              <h3 className="text-xl font-black text-slate-800 leading-tight">
                {lang === "en" ? "Smart Practice Simulator" : "স্মার্ট ব্যকরণ ও জিকে অনুশীলন"}
              </h3>
            </div>

            {practiceScore === null ? (
              <div className="space-y-6">
                {/* Progress Indicators */}
                <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
                  <span>Question {currentPracticeIdx + 1} of {practiceQuestions.length}</span>
                  <div className="flex gap-1">
                    {practiceQuestions.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-4 h-1.5 rounded-full transition-colors ${
                          idx === currentPracticeIdx
                            ? "bg-[#1565c0]"
                            : selectedPracticeAnswers[idx] !== undefined
                            ? "bg-slate-300"
                            : "bg-slate-150"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question Text */}
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/50 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#1565c0] uppercase tracking-widest banner">Quiz Standard</span>
                  <p className="text-base font-extrabold text-slate-800 leading-snug">
                    {lang === "en"
                      ? practiceQuestions[currentPracticeIdx].q
                      : practiceQuestions[currentPracticeIdx].qBn}
                  </p>
                </div>

                {/* Question Options */}
                <div className="space-y-3">
                  {practiceQuestions[currentPracticeIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedPracticeAnswers[currentPracticeIdx] === oIdx;
                    const isCorrect = practiceQuestions[currentPracticeIdx].correct === oIdx;
                    const displayTxt = lang === "en" ? opt : practiceQuestions[currentPracticeIdx].optionsBn[oIdx];

                    let btnClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
                    if (showPracticeExplanation) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold ring-2 ring-emerald-500/10";
                      } else if (isSelected) {
                        btnClass = "bg-rose-50 border-rose-300 text-rose-750 font-bold ring-2 ring-rose-500/10";
                      } else {
                        btnClass = "opacity-60 bg-slate-50 border-slate-200";
                      }
                    } else if (isSelected) {
                      btnClass = "bg-[#1565c0]/5 border-[#1565c0] text-[#1565c0] font-bold ring-1 ring-[#1565c0]";
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={showPracticeExplanation}
                        onClick={() => handleSelectPracticeOption(oIdx)}
                        className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition duration-150 flex items-center justify-between cursor-pointer ${btnClass}`}
                      >
                        <span className="leading-tight">{displayTxt}</span>
                        {showPracticeExplanation && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanatory Bubbles on Submit */}
                {showPracticeExplanation && (
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-1 animate-slide-up">
                    <span className="text-[10px] font-mono tracking-widest font-black text-[#1565c0] uppercase block">
                      {lang === "en" ? "Answer Explanation" : "ব্যাখ্যা ও বিশ্লেষণ"}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      {lang === "en"
                        ? practiceQuestions[currentPracticeIdx].explain
                        : practiceQuestions[currentPracticeIdx].explainBn}
                    </p>

                    <button
                      type="button"
                      onClick={handleNextPractice}
                      className="mt-3.5 w-full py-2 bg-[#1565c0] hover:bg-[#0d47a1] text-white font-black text-xs rounded-lg transition"
                    >
                      {currentPracticeIdx < practiceQuestions.length - 1 ? (lang === "en" ? "Next Question" : "পরবর্তী প্রশ্ন") : (lang === "en" ? "Finish Practice" : "অনুশীলন শেষ করুন")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                  <Award className="w-8 h-8 stroke-[2]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-black text-slate-800">
                    {lang === "en" ? "Practice Run Complete!" : "অনুশীলন সেশন সমাপ্ত!"}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {lang === "en"
                      ? `You scored ${practiceScore} out of ${practiceQuestions.length} standard MCQs.`
                      : `আপনি ${practiceQuestions.length}টি প্রশ্নের মধ্যে ${practiceScore}টির সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা সম্পন্ন করেছেন।`}
                  </p>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={handleResetPractice}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    {lang === "en" ? "Practice Again" : "আবার চেষ্টা করুন"}
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      onNavigateToTab("exam");
                    }}
                    className="px-6 py-2.5 bg-[#1565c0] hover:bg-[#0d47a1] text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    {lang === "en" ? "Take Main Exam" : "মূল পরীক্ষায় অংশ নিন"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: DETAILED ANALYSIS */}
      {activeModal === "analysis" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-55 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1 max-w-[90%] text-left">
              <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-600 font-black font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lang === "en" ? "Diagnostic KPI Insights" : "পারফরম্যান্স এনালাইটিক্স"}
              </span>
              <h3 className="text-xl font-black text-slate-800 leading-tight">
                {lang === "en" ? "Detailed Subject Assessment" : "বিষয়ভিত্তিক পারফরম্যান্স বিশ্লেষণ"}
              </h3>
            </div>

            {/* Assessment chart bars */}
            <div className="space-y-5 text-left">
              <p className="text-xs text-slate-500 leading-normal">
                {lang === "en"
                  ? "Based on diagnostic logs, here is your dynamic learning efficiency across subject areas:"
                  : "আপনার সম্পন্নকৃত মক টেস্ট সমূহের ভিত্তিতে সংকলিত বিষয়ভিত্তিক দক্ষতা পরিমাপক বিশ্লেষণ:"}
              </p>

              <div className="space-y-4">
                {mockStrengths.map((sub, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-700">{lang === "en" ? sub.subject : (sub.subject === "Bangladesh Affairs" ? "বাংলাদেশ বিষয়াবলী" : sub.subject === "International Affairs" ? "আন্তর্জাতিক বিষয়াবলী" : sub.subject === "Bangla Grammar" ? "বাংলা ব্যকরণ" : sub.subject === "Mathematical Reasoning" ? "গাণিতিক যুক্তি" : "ইংরেজি সাহিত্য")}</span>
                      <span className={`font-semibold text-[10px] font-mono px-2 py-0.5 rounded ${
                        sub.progress >= 80 ? "bg-emerald-50 text-emerald-600 font-bold" :
                        sub.progress >= 60 ? "bg-amber-50 text-amber-600 font-bold" :
                        "bg-rose-50 text-rose-600 font-bold"
                      }`}>
                        {sub.progress}% • {lang === "en" ? sub.status : sub.statusBn}
                      </span>
                    </div>
                    {/* Visual Progress Meter */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          sub.progress >= 80 ? "bg-emerald-500" :
                          sub.progress >= 60 ? "bg-amber-500" :
                          "bg-rose-500"
                        }`}
                        style={{ width: `${sub.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Study Advice alert */}
              <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-black uppercase tracking-wider block text-[10px]">Recommended Action</span>
                  <p className="leading-relaxed font-semibold text-slate-600">
                    {lang === "en"
                      ? "Increase focus on Mathematical Reasoning & English Literature subjects. We highly recommend enrolling in our structured Primary Prep module courses."
                      : "আপনার গাণিতিক যুক্তি এবং ইংরেজি সাহিত্যে দক্ষতা বৃদ্ধি প্রয়োজন। আমরা সাকসেস একাডেমির 'প্রাইমারি প্রস্তুতি বা সাধারণ গণিত স্পেশাল' কোর্সে যুক্ত হবার জন্য সুপারিশ করছি।"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                onNavigateToTab("courses");
              }}
              className="w-full py-3.5 bg-[#1565c0] hover:bg-[#0d47a1] text-white text-xs font-black rounded-xl transition uppercase tracking-widest block text-center shadow-md shadow-blue-500/10"
            >
              {lang === "en" ? "Explore Structured Lessons" : "কোর্স পেইজে গিয়ে রিভিশন নিন"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: SMART NOTIFICATIONS TRAWER */}
      {activeModal === "notifications" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-55 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1.5 text-left">
              <span className="text-[10px] bg-cyan-50 border border-cyan-100 text-cyan-600 font-black font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lang === "en" ? "LMS Bulletin Alerts" : "স্মার্ট নোটিফিকেশন সেন্টার"}
              </span>
              <h3 className="text-xl font-black text-slate-800 leading-tight flex items-center gap-2">
                <span>{lang === "en" ? "Live Announcements" : "সক্রিয় নোটিফিকেশন সমূহ"}</span>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white font-mono font-bold text-[9px] rounded-full uppercase">
                    {notifications.filter((n) => !n.read).length} New
                  </span>
                )}
              </h3>
            </div>

            {/* Bulletins lists */}
            <div className="space-y-3.5 text-left max-h-[50vh] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 text-xs">
                  {lang === "en" ? "No new notifications found in log." : "কন্টেন্ট বা রিমাইন্ডার সংক্রান্ত কোনো বিজ্ঞপ্তি পাওয়া যায়নি।"}
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition duration-150 flex items-start gap-3.5 ${
                      notif.read ? "bg-slate-50/50 border-slate-200/50 text-slate-500" : "bg-blue-50/45 border-blue-105 shadow-sm text-slate-800"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${
                        notif.type === "exam" ? "bg-red-50 text-red-600 border border-red-100" :
                        notif.type === "content" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        <Bell className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[9px] font-mono tracking-wider text-slate-400 font-bold uppercase">{notif.type} • {notif.date}</span>
                        {!notif.read && (
                          <button
                            onClick={() => onMarkNotificationRead(notif.id)}
                            className="text-[9px] font-bold text-[#1565c0] hover:underline"
                          >
                            {lang === "en" ? "Mark read" : "পঠিত চিহ্নিত করুন"}
                          </button>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold">{lang === "en" ? notif.title : notif.titleBn}</h4>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        {lang === "en" ? notif.message : notif.messageBn}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
