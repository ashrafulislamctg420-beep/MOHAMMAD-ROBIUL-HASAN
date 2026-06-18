import React, { useState } from "react";
import { Course } from "../types";
import { BookOpen, User, Star, CheckCircle, Search, Sparkles, Bookmark } from "lucide-react";

interface CoursesListProps {
  courses: Course[];
  onEnroll: (courseId: string) => void;
  lang: "en" | "bn";
  onToggleBookmark: (courseId: string) => void;
  showOnlyBookmarked: boolean;
  onClearBookmarkFilter: () => void;
}

export default function CoursesList({
  courses,
  onEnroll,
  lang,
  onToggleBookmark,
  showOnlyBookmarked,
  onClearBookmarkFilter,
}: CoursesListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewingSyllabusId, setViewingSyllabusId] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(courses.map((c) => c.category)))];

  const filteredCourses = courses.filter((course) => {
    if (showOnlyBookmarked && !course.bookmarked) return false;
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const searchString = `${course.title} ${course.titleBn} ${course.instructor}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Bookmarks filter banner indicator */}
      {showOnlyBookmarked && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-200 text-sm font-semibold">
            <Bookmark className="w-5 h-5 text-amber-600 fill-amber-500/40" />
            <span>
              {lang === "en"
                ? `Showing bookmarked courses (${courses.filter((c) => c.bookmarked).length})`
                : `আপনার বুকমার্ক করা কোর্সসমূহ দেখানো হচ্ছে (${courses.filter((c) => c.bookmarked).length} টি)`}
            </span>
          </div>
          <button
            onClick={onClearBookmarkFilter}
            className="text-xs bg-white hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
          >
            {lang === "en" ? "Show All Courses" : "সব কোর্স দেখুন"}
          </button>
        </div>
      )}

      {/* Category Filtering & Search UI Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === "en" ? "Search courses or instructors..." : "কোর্স বা শিক্ষক খুঁজুন..."
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1565c0]/15 focus:border-[#1565c0] text-sm text-slate-800 transition placeholder:text-slate-400"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 flex-wrap justify-center w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 uppercase cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1565c0] text-white shadow-md shadow-[#1565c0]/25"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/30"
              }`}
            >
              {cat === "all" ? (lang === "en" ? "ALL PATHS" : "সব কোর্স") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group relative"
          >
            {/* Image banner */}
            <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
              <img
                src={course.image}
                alt={lang === "en" ? course.title : course.titleBn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#1565c0] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none shadow-md">
                {course.category}
              </div>

              {/* Interactive Bookmark Button Overlay */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(course.id);
                }}
                className="absolute top-4 right-4 bg-white/95 hover:bg-white p-2.5 rounded-full shadow-md text-slate-600 hover:text-rose-500 transition-all cursor-pointer z-10 hover:scale-105"
                title={lang === "en" ? "Bookmark Course" : "বুকমার্ক করুন"}
              >
                <Bookmark
                  className={`w-4 h-4 transition ${
                    course.bookmarked
                      ? "fill-rose-500 text-rose-500"
                      : "text-slate-500 hover:text-rose-500"
                  }`}
                />
              </button>

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Title & Info */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
              <div className="space-y-2 flex-grow">
                <h3 className="text-xl font-extrabold text-slate-800 leading-snug group-hover:text-[#1565c0] transition-colors">
                  {lang === "en" ? course.title : course.titleBn}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">
                  {lang === "en" ? course.description : course.descriptionBn}
                </p>
              </div>

              {/* Author & duration stats */}
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center text-xs text-slate-500 gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-medium truncate">{course.instructor}</span>
                </div>
                <div className="flex items-center text-xs text-slate-500 gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>
                    {course.lessonsCount} {lang === "en" ? "interactive milestones" : "টি লার্নিং মডিউল"}
                  </span>
                </div>
              </div>

              {/* Syllabus details toggle preview */}
              <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100/50">
                <button
                  onClick={() =>
                    setViewingSyllabusId(viewingSyllabusId === course.id ? null : course.id)
                  }
                  className="w-full flex items-center justify-between text-xs font-bold text-[#1565c0] hover:underline focus:outline-none cursor-pointer"
                >
                  <span>
                    {viewingSyllabusId === course.id
                      ? (lang === "en" ? "Hide Syllabus Details" : "কারিকুলাম বন্ধ করুন")
                      : (lang === "en" ? "See Detailed Syllabus" : "সম্পূর্ণ কারিকুলাম দেখুন")
                    }
                  </span>
                  <span className="text-sm">{viewingSyllabusId === course.id ? "▲" : "▼"}</span>
                </button>

                {viewingSyllabusId === course.id && (
                  <ul className="mt-3.5 space-y-2.5 border-t border-slate-200/40 pt-3.5">
                    {course.syllabus.map((topic, i) => (
                      <li key={i} className="flex gap-2.5 items-start text-xs text-slate-600 leading-tight">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action enrollment bar */}
              <div className="pt-2">
                {course.enrolled ? (
                  <div className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold text-center rounded-2xl flex items-center justify-center gap-2 border border-emerald-200">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>{lang === "en" ? "Enrolled Successfully" : "এনরোলমেন্ট সফল"}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onEnroll(course.id)}
                    className="w-full py-3 bg-slate-100 hover:bg-[#1565c0] hover:text-white text-slate-700 font-bold rounded-2xl text-center text-sm transition transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-500/15"
                  >
                    {lang === "en" ? "Enroll inside Course" : "কোর্সে যুক্ত হোন"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
