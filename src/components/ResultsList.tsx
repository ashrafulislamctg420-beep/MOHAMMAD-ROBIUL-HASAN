import { useState } from "react";
import { ExamResult, LeaderboardEntry } from "../types";
import { ListChecks, AlertCircle, Calendar, CheckSquare, Percent, Play, Trophy, Users } from "lucide-react";
import Leaderboard from "./Leaderboard";

interface ResultsListProps {
  results: ExamResult[];
  leaderboard: LeaderboardEntry[];
  onNavigateToExams: () => void;
  lang: "en" | "bn";
}

export default function ResultsList({ results, leaderboard, onNavigateToExams, lang }: ResultsListProps) {
  const [subTab, setSubTab] = useState<"personal" | "leaderboard">("personal");
  const totalCompleted = results.length;
  const averageScore =
    totalCompleted > 0
      ? Math.round(results.reduce((sum, r) => sum + r.scorePercentage, 0) / totalCompleted)
      : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Tab Swapper */}
      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-full border border-slate-100 shadow-sm flex gap-1">
          <button
            onClick={() => setSubTab("personal")}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition duration-150 cursor-pointer flex items-center gap-2 ${
              subTab === "personal"
                ? "bg-[#1565c0] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>{lang === "en" ? "My Score sheets" : "আমার ফলাফল বিবরণী"}</span>
          </button>
          <button
            onClick={() => setSubTab("leaderboard")}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition duration-150 cursor-pointer flex items-center gap-2 ${
              subTab === "leaderboard"
                ? "bg-[#1565c0] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{lang === "en" ? "Leaderboard" : "লিডারবোর্ড র‍্যাংকিং"}</span>
          </button>
        </div>
      </div>

      {subTab === "leaderboard" ? (
        <Leaderboard leaderboard={leaderboard} lang={lang} />
      ) : (
        <>
          {/* Dynamic Header */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              <ListChecks className="w-8 h-8 text-[#1565c0]" />
              <span>{lang === "en" ? "Official Examination Logs" : "পরীক্ষার ফলাফল বিবরণী"}</span>
            </h2>
            <p className="text-sm text-slate-500">
              {lang === "en"
                ? "Inspect historic mock scorecards and retrieve dynamic credential certifications instantly."
                : "আপনার সম্পন্নকৃত সকল পরীক্ষার স্কোর শিট ও কর্মক্ষমতা বিস্তারিতভাবে পর্যালোচনা করুন।"}
            </p>
          </div>

          {totalCompleted > 0 ? (
            <div className="space-y-6">
              {/* Quick Stats Banner card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="bg-[#1565c0] text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-blue-100 block tracking-wider">
                      {lang === "en" ? "Passed Tests" : "মোট সম্পন্ন পরীক্ষা"}
                    </span>
                    <span className="text-4xl font-black font-mono block mt-1">
                      {totalCompleted}
                    </span>
                  </div>
                  <CheckSquare className="w-12 h-12 text-blue-200/40" />
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-teal-100 block tracking-wider">
                      {lang === "en" ? "Avg Success Rate" : "গড় নির্ভুলতার হার"}
                    </span>
                    <span className="text-4xl font-black font-mono block mt-1">
                      {averageScore}%
                    </span>
                  </div>
                  <Percent className="w-12 h-12 text-teal-100/40" />
                </div>
              </div>

              {/* Results Table Listing */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-3xl mx-auto">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100/80">
                  <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest leading-none">
                    {lang === "en" ? "Historic Scorecards" : "অতীতের স্কোরশীট বিবরণ"}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition opacity-100 animate-fade-in"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-bold font-mono px-2 py-0.5 rounded-full uppercase">
                          ID: {result.id}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-base leading-snug">
                          {lang === "en" ? result.examTitle : result.examTitleBn}
                        </h4>
                        
                        <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{result.dateCompleted}</span>
                          </span>
                          <span>•</span>
                          <span>
                            {lang === "en" ? `${result.correctAnswers} Correct` : `${result.correctAnswers}টি সঠিক`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right self-end sm:self-auto">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                            {lang === "en" ? "Report Score" : "প্রাপ্ত মার্কস"}
                          </span>
                          <span
                            className={`text-lg font-black font-mono leading-none ${
                              result.scorePercentage >= 85
                                ? "text-emerald-600"
                                : result.scorePercentage >= 60
                                ? "text-blue-600"
                                : "text-rose-600"
                            }`}
                          >
                            {result.scorePercentage}%
                          </span>
                        </div>
                        
                        <div className="h-10 w-1 rounded-full bg-slate-200" />

                        <div className="text-left">
                          <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                            {lang === "en" ? "Result Tag" : "মর্যাদা"}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              result.scorePercentage >= 80
                                ? "bg-emerald-50 text-emerald-800"
                                : result.scorePercentage >= 60
                                ? "bg-blue-50 text-blue-800"
                                : "bg-rose-50 text-rose-800"
                            }`}
                          >
                            {result.scorePercentage >= 80
                              ? (lang === "en" ? "EXCELLENT" : "অসাধারণ")
                              : result.scorePercentage >= 60
                              ? (lang === "en" ? "PASSED" : "উত্তীর্ণ")
                              : (lang === "en" ? "RETAKE HELP" : "অনুশীলন প্রয়োজন")
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Empty state inviting them to launch a test */
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto border border-blue-100 text-[#1565c0]">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-lg">
                  {lang === "en" ? "No exam history recorded yet" : "এখনো কোনো ফলাফল সংরক্ষিত নেই"}
                </h3>
                <p className="text-xs text-slate-400 leading-normal">
                  {lang === "en"
                    ? "Your mock exams and real-time grades will be captured here after you launch and finish an exam from the lobby."
                    : "পরীক্ষা লবি থেকে পরীক্ষায় অংশগ্রহণ করার পর আপনার সমস্ত প্রোগ্রেস ও রেজাল্ট হিস্ট্রি এখানে দেখানো হবে।"}
                </p>
              </div>
              <button
                onClick={onNavigateToExams}
                className="w-full py-3 bg-[#1565c0] hover:bg-[#0d47a1] text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-500/15"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === "en" ? "Let's Solve First MCQ Exam" : "চলুন প্রথম পরীক্ষায় অংশ নিই"}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
