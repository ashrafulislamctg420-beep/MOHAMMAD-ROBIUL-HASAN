import { useState, useEffect, useRef } from "react";
import { User, Course, Exam, ExamResult, LeaderboardEntry, AppNotification } from "./types";
import { initialCourses, examsData, initialLeaderboard } from "./data/mockData";

// Sub components
import Home from "./components/Home";
import CoursesList from "./components/CoursesList";
import ExamEngine from "./components/ExamEngine";
import ResultsList from "./components/ResultsList";
import Auth from "./components/Auth";
import SuccessAcademyLogo from "./components/SuccessAcademyLogo";
import AdminPanel from "./components/AdminPanel";

// Icons
import {
  GraduationCap,
  Menu,
  X,
  Globe,
  Shield,
  Bell,
  User as UserIcon,
  Bookmark,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<"en" | "bn">("bn");
  const [activeTab, setActiveTab] = useState<"home" | "courses" | "exam" | "result" | "login" | "admin">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile Options states
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("tsa_dark_mode");
    return saved === "true";
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // States
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem("tsa_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      name: "",
      email: "",
      studentId: "",
      isLoggedIn: false,
      avatarSeed: "",
    };
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("tsa_courses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return initialCourses;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem("tsa_exams");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return examsData;
  });

  const [results, setResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem("tsa_results");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [];
  });

  // Smart Bulletin Notifications list inside dynamic student state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("tsa_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: "notif-default-1",
        title: "Primary Assistant Teacher Quiz Now Live!",
        titleBn: "প্রাইমারি সহকারী শিক্ষক নিয়োগ স্পেশাল মক ০৪ এখন লাইভ!",
        message: "Unlock your career success potential with the newly launched interactive exam suite. Challenge yourself now.",
        messageBn: "আপনার স্বপ্নের সরকারি শিক্ষক হওয়ার প্রস্তুতি ঝালিয়ে নিতে এখনই বিশেষ মক পরীক্ষায় অংশ নিন।",
        date: "Jun 18, 2026",
        type: "exam",
        read: false,
      },
      {
        id: "notif-default-2",
        title: "Zakir Sir's Masterclass Study Guidelines Released",
        titleBn: "জাকির স্যারের বিসিএস গাইডলাইন বই যুক্ত করা হয়েছে",
        message: "Explore our syllabus timeline to view high-yield tips and critical strategies compiled to succeed in BCS GK.",
        messageBn: "বিসিএস প্রিলিমিনারি সাধারণ জ্ঞান কোর্সে জাকির স্যারের তৈরি চূড়ান্ত সাজেশন গাইড স্পেশাল সিলেবাস যুক্ত করা হয়েছে।",
        date: "Jun 17, 2026",
        type: "content",
        read: true,
      },
    ];
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem("tsa_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("tsa_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("tsa_exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("tsa_results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("tsa_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Sync dark mode style to localStorage and HTML classes
  useEffect(() => {
    localStorage.setItem("tsa_dark_mode", String(isDarkMode));
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Close profile options dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle live leaderboard compilation
  useEffect(() => {
    if (currentUser.isLoggedIn) {
      const activeUserExamsCount = results.length;
      const averageScore =
        activeUserExamsCount > 0
          ? Math.round(results.reduce((s, r) => s + r.scorePercentage, 0) / activeUserExamsCount)
          : 0;

      // Update the "YOU" slot in the leaderboard mock data
      const updatedLeaderboard = initialLeaderboard.map((entry) => {
        if (entry.isCurrentUser) {
          return {
            ...entry,
            name: currentUser.name + " (You)",
            studentId: currentUser.studentId,
            examsCompleted: activeUserExamsCount > 0 ? activeUserExamsCount : 5,
            averageScorePercentage: activeUserExamsCount > 0 ? averageScore : 89,
          };
        }
        return entry;
      });

      setLeaderboard(updatedLeaderboard);
    } else {
      setLeaderboard(initialLeaderboard);
    }
  }, [results, currentUser]);

  const handleEnrollCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          return { ...course, enrolled: true };
        }
        return course;
      })
    );
  };

  const handleToggleBookmark = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          return { ...course, bookmarked: !course.bookmarked };
        }
        return course;
      })
    );
  };

  const handleSaveExamResult = (result: ExamResult) => {
    setResults((prev) => [result, ...prev]);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab("home");
  };

  const handleLogout = () => {
    setCurrentUser({
      name: "",
      email: "",
      studentId: "",
      isLoggedIn: false,
      avatarSeed: "",
    });
    setResults([]);
    // Restore default courses & exams
    setCourses(initialCourses);
    setExams(examsData);
  };

  // Administrator state modifiers
  const handleAddCourse = (course: Course) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === course.id);
      if (exists) {
        return prev.map((c) => (c.id === course.id ? course : c));
      }
      return [course, ...prev];
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleAddExam = (exam: Exam) => {
    setExams((prev) => [exam, ...prev]);
  };

  const handleDeleteExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
  };

  const handleAddNotification = (notif: AppNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleDeleteNotification = (notifId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleResetToDefault = () => {
    setCourses(initialCourses);
    setExams(examsData);
    setNotifications([
      {
        id: "notif-default-1",
        title: "Primary Assistant Teacher Quiz Now Live!",
        titleBn: "প্রাইমারি সহকারী শিক্ষক নিয়োগ স্পেশাল মক ০৪ এখন লাইভ!",
        message: "Unlock your career success potential with the newly launched interactive exam suite. Challenge yourself now.",
        messageBn: "আপনার স্বপ্নের সরকারি শিক্ষক হওয়ার প্রস্তুতি ঝালিয়ে নিতে এখনই বিশেষ মক পরীক্ষায় অংশ নিন।",
        date: "Jun 18, 2026",
        type: "exam",
        read: false,
      },
    ]);
  };

  const menuItems = [
    { key: "home", labelEn: "Home", labelBn: "মূল পাতা" },
    { key: "courses", labelEn: "Courses", labelBn: "কোর্সসমূহ" },
    { key: "exam", labelEn: "MCQ Exam", labelBn: "এমসিকিউ পরীক্ষা" },
    { key: "result", labelEn: "Result", labelBn: "ফলাফল বিবরণী" },
    { key: "admin", labelEn: "Admin Panel", labelBn: "অ্যাডমিন প্যানেল" },
    { key: "login", labelEn: currentUser.isLoggedIn ? "Profile" : "Login", labelBn: currentUser.isLoggedIn ? "প্রোফাইল" : "লগইন" },
  ] as const;

  const totalCompleted = results.length;
  const averageScore =
    totalCompleted > 0
      ? Math.round(results.reduce((sum, r) => sum + r.scorePercentage, 0) / totalCompleted)
      : 0;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "dark bg-[#0b0f19] text-slate-100" : "bg-[#f5f8ff] text-slate-800"} font-sans flex flex-col antialiased`}>
      {/* 1. PROFESSIONAL NAVBAR */}
      <nav className="h-20 bg-white border-b border-slate-100 flex items-center shadow-lg shadow-slate-100/50 relative z-40 sticky top-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo element */}
          <div
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-95 select-none group"
          >
            <div className="shrink-0 transition group-hover:scale-105 duration-200">
              <SuccessAcademyLogo size={50} variant="full" />
            </div>
            <div>
              <span className="font-extrabold text-[#061e43] text-lg sm:text-xl tracking-tight block leading-none">
                The Success Academy
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#c79e34] tracking-wide block uppercase mt-1">
                {lang === "en" ? "Academy LMS System" : "আপনার সাফল্যের সঙ্গী"}
              </span>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              {menuItems
                .filter((item) => item.key !== "login" && item.key !== "admin")
                .map((item) => {
                  const isActive = activeTab === item.key && !showOnlyBookmarked;
                  return (
                    <button
                      key={item.key}
                      id={`nav-link-${item.key}`}
                      onClick={() => {
                        setActiveTab(item.key);
                        if (item.key === "courses") {
                          setShowOnlyBookmarked(false);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide transition duration-150 cursor-pointer ${
                        isActive
                          ? "text-[#1565c0] dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/20"
                          : "text-slate-600 dark:text-slate-300 hover:text-[#1565c0] dark:hover:text-blue-400"
                      }`}
                    >
                      {lang === "en" ? item.labelEn : item.labelBn}
                    </button>
                  );
                })}
            </div>

            {/* Language switch button */}
            <button
              onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
              className="p-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1565c0] dark:text-blue-400 rounded-xl flex items-center gap-1.5 text-xs font-bold font-mono transition border border-slate-200/50 dark:border-slate-800 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "en" ? "বাংলা" : "ENG"}</span>
            </button>

            {/* Login / Profile stand-out action button or Floating Dropdown */}
            {currentUser.isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition duration-200 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2 border dark:border-slate-800 ${
                    isProfileDropdownOpen
                      ? "bg-slate-50 dark:bg-slate-800/80 text-[#1565c0] dark:text-blue-400 border-[#1565c0]/30"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/60"
                  }`}
                >
                  <img
                    src={currentUser.avatarSeed}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full ring-2 ring-[#1565c0]/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="truncate max-w-[100px]">{currentUser.name.split(" ")[0]}</span>
                  <span className="text-[10px] text-slate-400 transition-transform duration-200">
                    {isProfileDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* SHETTY-POLISHED HIGH-CONTRAST FLOATING DROPDOWN LIST MATCHING REF IMAGE */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3.5 w-64 bg-[#121420] text-[#a3b3cc] rounded-[24px] shadow-2xl p-4 border border-slate-850 z-50 animate-slide-down transform origin-top-right">
                    {/* User profile details header */}
                    <div className="px-3.5 py-2.5 border-b border-slate-800/70 pb-3 mb-2 flex items-center gap-3">
                      <img
                        src={currentUser.avatarSeed}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-extrabold text-white text-sm truncate leading-tight">
                          {currentUser.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5 truncate uppercase tracking-tight">
                          {currentUser.studentId}
                        </span>
                      </div>
                    </div>

                    {/* Navigation links matching user image */}
                    <div className="space-y-1">
                      {/* 1. Profile Option */}
                      <button
                        onClick={() => {
                          setActiveTab("login");
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs transition duration-150 cursor-pointer ${
                          activeTab === "login"
                            ? "bg-[#1e2030] text-white"
                            : "hover:bg-[#1a1c2d] hover:text-white"
                        }`}
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>{lang === "en" ? "Profile" : "প্রোফাইল"}</span>
                      </button>

                      {/* 2. Bookmarks Option */}
                      <button
                        onClick={() => {
                          setActiveTab("courses");
                          setShowOnlyBookmarked(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs transition duration-150 cursor-pointer ${
                          showOnlyBookmarked && activeTab === "courses"
                            ? "bg-[#1e2030] text-amber-500"
                            : "hover:bg-[#1a1c2d] hover:text-white"
                        }`}
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        <span>{lang === "en" ? "Bookmarks" : "বুকমার্কস"}</span>
                      </button>

                      {/* 3. Admin Option (Admin inside profile) */}
                      <button
                        onClick={() => {
                          setActiveTab("admin");
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs transition duration-150 cursor-pointer ${
                          activeTab === "admin"
                            ? "bg-[#1e2030] text-blue-400"
                            : "hover:bg-[#1a1c2d] hover:text-white"
                        }`}
                      >
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span>{lang === "en" ? "Admin" : "অ্যাডমিন"}</span>
                      </button>

                      {/* 4. Light/Dark Mode switch */}
                      <button
                        onClick={() => {
                          setIsDarkMode((prev) => !prev);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold text-xs hover:bg-[#1a1c2d] hover:text-white transition duration-150 cursor-pointer"
                      >
                        {isDarkMode ? (
                          <>
                            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/10" />
                            <span>{lang === "en" ? "Light Mode" : "লাইট মোড"}</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 text-slate-400" />
                            <span>{lang === "en" ? "Dark Mode" : "ডার্ক মোড"}</span>
                          </>
                        )}
                      </button>

                      {/* Divider */}
                      <div className="border-t border-slate-800/40 my-1 pt-1"></div>

                      {/* 5. Logout Option in Red */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-black text-xs text-rose-500 hover:bg-rose-500/10 transition duration-150 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("login")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition duration-150 cursor-pointer shadow-sm hover:shadow ${
                  activeTab === "login"
                    ? "bg-[#0d47a1] text-white"
                    : "bg-[#1565c0] text-white hover:bg-[#0d47a1]"
                }`}
              >
                <span>{lang === "en" ? "Login" : "লগইন"}</span>
              </button>
            )}
          </div>

          {/* Mobile controllers row */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Lang switcher on mobile header */}
            <button
              onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
              className="p-2 bg-slate-55 dark:bg-slate-800/60 hover:bg-slate-100 text-[#1565c0] dark:text-blue-400 rounded-xl flex items-center gap-1 text-xs font-bold transition cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "en" ? "বাংলা" : "ENG"}</span>
            </button>

            {/* Menu toggle icon */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="p-2.5 bg-slate-55 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 2. MOBILE DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white dark:bg-[#121422] border-b border-slate-100 dark:border-slate-800/80 shadow-xl py-6 px-4 lg:hidden flex flex-col gap-4 animate-slide-down z-50">
            {/* Nav links (excluding login and admin) */}
            <div className="flex flex-col gap-1.5">
              {menuItems
                .filter((item) => item.key !== "login" && item.key !== "admin")
                .map((item) => {
                  const isActive = activeTab === item.key && !showOnlyBookmarked;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveTab(item.key);
                        if (item.key === "courses") {
                          setShowOnlyBookmarked(false);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2.5 px-4 font-bold rounded-xl text-sm transition transition-all ${
                        isActive
                          ? "bg-[#1565c0] text-white shadow-md shadow-blue-500/15"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {lang === "en" ? item.labelEn : item.labelBn}
                    </button>
                  );
                })}
            </div>

            {/* Separator lines */}
            <div className="border-t border-slate-100 dark:border-slate-800/50 my-0.5"></div>

            {/* If logged in, show elegant dropdown layout inside card */}
            {currentUser.isLoggedIn ? (
              <div className="bg-[#121420] text-[#a3b3cc] rounded-[24px] p-4 border border-slate-850 flex flex-col gap-3">
                {/* User Info Header Block */}
                <div className="flex items-center gap-3 pb-2.5 border-b border-slate-800/60">
                  <img
                    src={currentUser.avatarSeed}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border border-slate-700/50"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-extrabold text-white text-sm truncate">{currentUser.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5 uppercase tracking-wider">
                      {currentUser.studentId}
                    </span>
                  </div>
                </div>

                {/* Sub Options panel */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActiveTab("login");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 bg-[#1a1c2d] hover:bg-[#25283f] rounded-xl text-left font-bold text-[11px] transition-all cursor-pointer ${
                      activeTab === "login" ? "text-white border border-blue-500/30" : "text-white/80"
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{lang === "en" ? "Profile" : "প্রোফাইল"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("courses");
                      setShowOnlyBookmarked(true);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 bg-[#1a1c2d] hover:bg-[#25283f] rounded-xl text-left font-bold text-[11px] transition-all cursor-pointer ${
                      showOnlyBookmarked && activeTab === "courses"
                        ? "text-white border border-amber-500/30"
                        : "text-white/80"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{lang === "en" ? "Bookmarks" : "বুকমার্কস"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("admin");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 bg-[#1a1c2d] hover:bg-[#25283f] rounded-xl text-left font-bold text-[11px] transition-all cursor-pointer ${
                      activeTab === "admin" ? "text-white border border-emerald-500/30" : "text-white/80"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{lang === "en" ? "Admin" : "অ্যাডমিন"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDarkMode((prev) => !prev);
                    }}
                    className="flex items-center gap-2 p-2.5 bg-[#1a1c2d] hover:bg-[#25283f] rounded-xl text-left font-bold text-[11px] text-white/80 transition-all cursor-pointer"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{lang === "en" ? "Light" : "লাইট মোড"}</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{lang === "en" ? "Dark" : "ডার্ক মোড"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secure Sign Out */}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-550/10 hover:bg-rose-550/20 text-rose-500 font-bold rounded-xl text-xs transition duration-150 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveTab("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#1565c0] hover:bg-[#0d47a1] text-white font-bold rounded-xl text-center text-sm transition-all shadow-md cursor-pointer"
              >
                {lang === "en" ? "Login" : "লগইন করুন"}
              </button>
            )}
          </div>
        )}
      </nav>

      {/* 3. MAIN COMPONENT CONTAINER FRAMES */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === "home" && (
          <Home
            onStartLearning={() => setActiveTab("courses")}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            lang={lang}
            completedExamsCount={totalCompleted}
            avgScore={averageScore}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
          />
        )}

        {activeTab === "courses" && (
          <div className="space-y-8 animate-fade-in text-left">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#1565c0] font-mono bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/50">
                {lang === "en" ? "Active Syllabus" : "আমাদের কোর্সসমূহ"}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                {lang === "en" ? "Explore Academy Syllabus" : "আমাদের স্পেশাল কোর্সসমূহ"}
              </h2>
              <p className="text-sm text-slate-500">
                {lang === "en"
                  ? "Enroll in curated subject categories, view high-yield syllabus timelines, and track completion progress card-by-card."
                  : "আপনার পছন্দের সেরা কোর্সে এনরোল করুন এবং আধুনিক নির্দেশিকা অনুযায়ী ক্যারিয়ারের প্রস্তুতি দৃঢ় করুন।"}
              </p>
            </div>
            <CoursesList
              courses={courses}
              onEnroll={handleEnrollCourse}
              lang={lang}
              onToggleBookmark={handleToggleBookmark}
              showOnlyBookmarked={showOnlyBookmarked}
              onClearBookmarkFilter={() => setShowOnlyBookmarked(false)}
            />
          </div>
        )}

        {activeTab === "exam" && (
          <ExamEngine
            exams={exams}
            onSaveResult={handleSaveExamResult}
            currentUser={currentUser}
            lang={lang}
          />
        )}

        {activeTab === "result" && (
          <ResultsList
            results={results}
            leaderboard={leaderboard}
            onNavigateToExams={() => setActiveTab("exam")}
            lang={lang}
          />
        )}

        {activeTab === "login" && (
          <div className="py-6">
            <Auth
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              lang={lang}
            />
          </div>
        )}

        {activeTab === "admin" && (
          <AdminPanel
            courses={courses}
            exams={exams}
            notifications={notifications}
            lang={lang}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddExam={handleAddExam}
            onDeleteExam={handleDeleteExam}
            onAddNotification={handleAddNotification}
            onDeleteNotification={handleDeleteNotification}
            onResetToDefault={handleResetToDefault}
          />
        )}
      </main>

      {/* 4. FOOTER MATRICES */}
      <footer className="bg-[#0d47a1] text-white py-8 px-4 border-t border-blue-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <GraduationCap className="w-5 h-5 text-blue-200" />
            <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
              The Success Academy
            </span>
          </div>

          <p className="text-xs sm:text-sm text-blue-200/90 font-medium">
            © 2026 The Success Academy | {lang === "en" ? "Your Ultimate Success Companion" : "আপনার সাফল্যের সঙ্গী"}
          </p>

          <div className="flex gap-4 text-xs text-blue-200 justify-center">
            <button
              onClick={() => setActiveTab("home")}
              className="hover:text-white transition cursor-pointer"
            >
              {lang === "en" ? "Home" : "মূল পাতা"}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("courses")}
              className="hover:text-white transition cursor-pointer"
            >
              {lang === "en" ? "Courses" : "কোর্সসমূহ"}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("admin")}
              className="hover:text-amber-400 transition cursor-pointer font-bold text-amber-200"
            >
              {lang === "en" ? "Portal Admin" : "অ্যাডমিন পোর্টাল"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
