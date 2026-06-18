import { LeaderboardEntry } from "../types";
import { Trophy, Medal, Search, Star, Sparkles } from "lucide-react";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  lang: "en" | "bn";
}

export default function Leaderboard({ leaderboard, lang }: LeaderboardProps) {
  // Sort leaderboard by average score percentage descending
  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) => b.averageScorePercentage - a.averageScorePercentage
  );

  // Add dynamic ranks based on sorted positions
  const rankedLeaderboard = sortedLeaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const topThree = rankedLeaderboard.slice(0, 3);
  const restOfTheMinds = rankedLeaderboard.slice(3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dynamic Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
          <span>
            {lang === "en" ? "Academy Leaderboard" : "অ্যাকাডেমি লিডারবোর্ড"}
          </span>
        </h2>
        <p className="text-sm md:text-base text-slate-500">
          {lang === "en"
            ? "Track standard real-time rankings and achievements of our high-performing students."
            : "আমাদের শীর্ষস্থান অধিকারী মেধারী শিক্ষার্থীদের রিয়েল-টাইম র্যাংকিং এবং স্কোর ট্র্যাক করুন।"}
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto">
          {/* Rank 2 (Left or Middle) */}
          {topThree[1] && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative flex flex-col items-center justify-center order-2 md:order-1 md:mt-6">
              <div className="absolute top-4 left-4 text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {lang === "en" ? "Silver" : "রৌপ্য"}
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-xl font-bold shadow-md relative">
                🥈
                <span className="absolute -bottom-1 -right-1 bg-slate-400 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <h3 className="mt-4 font-bold text-slate-800 text-center truncate w-full">
                {topThree[1].name}
              </h3>
              <p className="text-xs font-mono text-slate-400">{topThree[1].studentId}</p>
              <div className="mt-3 py-1.5 px-3 bg-slate-50 rounded-xl text-center w-full">
                <span className="text-xs text-slate-500 block">
                  {lang === "en" ? "Average score" : "গড় স্কোর"}
                </span>
                <span className="text-lg font-extrabold text-[#1565c0]">
                  {topThree[1].averageScorePercentage}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">
                {topThree[1].examsCompleted} {lang === "en" ? "Exams Finished" : "পরীক্ষা সম্পন্ন"}
              </span>
            </div>
          )}

          {/* Rank 1 (Gold - Elevated) */}
          {topThree[0] && (
            <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-8 border-2 border-amber-200/60 shadow-md relative flex flex-col items-center justify-center order-1 md:order-2 ring-4 ring-amber-400/10">
              <div className="absolute top-4 bg-amber-400 text-stone-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>{lang === "en" ? "Champion" : "চ্যাম্পিয়ন"}</span>
              </div>
              <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-3xl shadow-lg relative mt-2">
                🏆
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full text-sm font-bold w-6 h-6 flex items-center justify-center">
                  1
                </span>
              </div>
              <h3 className="mt-4 font-black text-slate-800 text-lg text-center truncate w-full">
                {topThree[0].name}
              </h3>
              <p className="text-xs font-mono text-slate-400">{topThree[0].studentId}</p>
              <div className="mt-3 py-2 px-4 bg-amber-400/10 rounded-2xl text-center w-full border border-amber-200/30">
                <span className="text-xs text-amber-800 block font-semibold">
                  {lang === "en" ? "Average score" : "গড় স্কোর"}
                </span>
                <span className="text-2xl font-black text-amber-600">
                  {topThree[0].averageScorePercentage}%
                </span>
              </div>
              <span className="text-[11px] text-amber-800 font-bold mt-2 font-mono">
                {topThree[0].examsCompleted} {lang === "en" ? "Exams Finished" : "পরীক্ষা সম্পন্ন"}
              </span>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative flex flex-col items-center justify-center order-3 md:mt-6">
              <div className="absolute top-4 left-4 text-xs font-mono bg-[#f5dfd3]/60 text-amber-900 px-2 py-0.5 rounded-full">
                {lang === "en" ? "Bronze" : "ব্রোঞ্জ"}
              </div>
              <div className="w-16 h-16 rounded-full bg-[#fdeee4] border-2 border-amber-300 flex items-center justify-center text-xl font-bold shadow-md relative">
                🥉
                <span className="absolute -bottom-1 -right-1 bg-amber-600 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <h3 className="mt-4 font-bold text-slate-800 text-center truncate w-full">
                {topThree[2].name}
              </h3>
              <p className="text-xs font-mono text-slate-400">{topThree[2].studentId}</p>
              <div className="mt-3 py-1.5 px-3 bg-slate-50 rounded-xl text-center w-full">
                <span className="text-xs text-slate-500 block">
                  {lang === "en" ? "Average score" : "গড় স্কোর"}
                </span>
                <span className="text-lg font-extrabold text-[#1565c0]">
                  {topThree[2].averageScorePercentage}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">
                {topThree[2].examsCompleted} {lang === "en" ? "Exams Finished" : "পরীক্ষা সম্পন্ন"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Table for remaining ranks */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-4xl mx-auto">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100/85 flex justify-between items-center">
          <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
            {lang === "en" ? "Ranked Scholars Checklist" : "র‍্যাংক তালিকা"}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {lang === "en" ? "Showing entire live pool" : "সম্পূর্ণ লাইভ উইন্ডো দেখাচ্ছে"}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {restOfTheMinds.map((player) => (
            <div
              key={player.studentId}
              className={`flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors ${
                player.isCurrentUser ? "bg-blue-50/40 relative font-bold" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 text-center text-sm font-bold font-mono text-slate-400">
                  #{player.rank}
                </span>

                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      player.name
                    )}`}
                    alt={player.name}
                    className="w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 flex-wrap">
                    <span>{player.name}</span>
                    {player.isCurrentUser && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-extrabold">
                        <Star className="w-2.5 h-2.5 fill-blue-700" />
                        {lang === "en" ? "YOU" : "আপনার অ্যাকাউন্ট"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono block">
                    {player.studentId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div className="hidden sm:block">
                  <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                    {lang === "en" ? "Exams taken" : "পরীক্ষা সম্পন্ন"}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold font-mono">
                    {player.examsCompleted}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                    {lang === "en" ? "Avg Accuracy" : "গড় নির্ভুলতা"}
                  </span>
                  <span className="text-sm font-black text-slate-800 font-mono">
                    {player.averageScorePercentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
