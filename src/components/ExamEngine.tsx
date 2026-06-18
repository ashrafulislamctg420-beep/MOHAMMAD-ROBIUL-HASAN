import React, { useState, useEffect, useRef } from "react";
import { Exam, ExamResult, User } from "../types";
import { Clock, Award, ShieldAlert, Check, RefreshCw, Star, Trophy, Sparkles, AlertCircle, Bookmark } from "lucide-react";

interface ExamEngineProps {
  exams: Exam[];
  onSaveResult: (result: ExamResult) => void;
  currentUser: User;
  lang: "en" | "bn";
}

export default function ExamEngine({ exams, onSaveResult, currentUser, lang }: ExamEngineProps) {
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"idle" | "running" | "ended">("idle");
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [timeSpentMs, setTimeSpentMs] = useState<number>(0);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeTrackerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle active countdown timer
  useEffect(() => {
    if (status === "running" && timeLeftMs > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeftMs((prev) => prev - 1000);
      }, 1000);
    } else if (status === "running" && timeLeftMs <= 0) {
      // Auto submit upon hitting 0
      handleSubmitExam();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status, timeLeftMs]);

  // Handle tracking time spent
  useEffect(() => {
    if (status === "running") {
      timeTrackerRef.current = setInterval(() => {
        setTimeSpentMs((prev) => prev + 1000);
      }, 1000);
    } else {
      if (timeTrackerRef.current) clearInterval(timeTrackerRef.current);
    }

    return () => {
      if (timeTrackerRef.current) clearInterval(timeTrackerRef.current);
    };
  }, [status]);

  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeftMs(exam.durationMs);
    setTimeSpentMs(0);
    setStatus("running");
    setExamResult(null);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;

    setStatus("ended");
    if (timerRef.current) clearTimeout(timerRef.current);
    if (timeTrackerRef.current) clearInterval(timeTrackerRef.current);

    // Calculate accuracy
    let correctCount = 0;
    activeExam.questions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      if (chosen !== undefined && chosen === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const totalQuestions = activeExam.questions.length;
    const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const finalResult: ExamResult = {
      id: "res-" + Math.floor(1000 + Math.random() * 9000),
      examId: activeExam.id,
      examTitle: activeExam.title,
      examTitleBn: activeExam.titleBn,
      totalQuestions: totalQuestions,
      correctAnswers: correctCount,
      scorePercentage: scorePct,
      timeSpentMs: timeSpentMs > activeExam.durationMs ? activeExam.durationMs : timeSpentMs,
      dateCompleted: new Date().toLocaleDateString(lang === "en" ? "en-US" : "bn-BD"),
    };

    setExamResult(finalResult);
    onSaveResult(finalResult);
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 1. SELECTION STATE */}
      {status === "idle" && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              {lang === "en" ? "Available MCQ Challenge Arena" : "লাইভ এমসিকিউ এক্সাম কর্নার"}
            </h2>
            <p className="text-sm text-slate-500">
              {lang === "en"
                ? "Select an active test sheet. Standard automatic timer countdown and smart grading rules apply."
                : "আপনার কাঙ্ক্ষিত পরীক্ষাটি সিলেক্ট করুন। লাইভ টাইমার এবং অটো-সাবমিশন ফিচার সক্রিয় রয়েছে।"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-[#1565c0] rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {lang === "en" ? exam.category : exam.categoryBn}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        exam.difficulty === "Easy"
                          ? "bg-green-50 text-green-700"
                          : exam.difficulty === "Medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {exam.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-800 leading-tight">
                    {lang === "en" ? exam.title : exam.titleBn}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{exam.durationMs / 60000} mins</span>
                    </div>
                    <div>
                      <span>{exam.questions.length} Questions</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartExam(exam)}
                  className="w-full py-3 bg-[#1565c0] hover:bg-[#0d47a1] text-white font-bold rounded-2xl text-sm transition transition-transform active:scale-95 cursor-pointer text-center shadow-lg shadow-blue-700/15"
                >
                  {lang === "en" ? "Launch Exam Live" : "পরীক্ষায় অংশ নিন"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. EXAM RUNNING STATE - SHOWING ALL MCQS TOGETHER */}
      {status === "running" && activeExam && (
        <div className="space-y-6">
          {/* Sticky Dashboard Header & Progress Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md bg-white/95">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="w-14 h-14 rounded-2xl bg-blue-50 flex flex-col items-center justify-center text-xs font-black font-mono text-[#1565c0] border border-blue-100 shrink-0">
                <span className="text-base leading-none">
                  {Object.keys(selectedAnswers).length}
                </span>
                <span className="text-[9px] text-slate-400 font-bold border-t border-slate-200 mt-0.5 pt-0.5 w-8 text-center">
                  {activeExam.questions.length}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-slate-800 text-sm sm:text-base truncate">
                  {lang === "en" ? activeExam.title : activeExam.titleBn}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-bold">
                    {lang === "en"
                      ? `${Object.keys(selectedAnswers).length} of ${activeExam.questions.length} Answered`
                      : `${Object.keys(selectedAnswers).length}টির উত্তর দেওয়া হয়েছে (মোট ${activeExam.questions.length}টি)`}
                  </span>
                  <div className="w-24 sm:w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1565c0] to-blue-500 transition-all duration-300"
                      style={{
                        width: `${(Object.keys(selectedAnswers).length / activeExam.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Clock Timer */}
            <div
              className={`flex items-center gap-2 py-2.5 px-5 rounded-2xl font-mono text-lg font-black border tracking-wider shrink-0 transition ${
                timeLeftMs < 60000
                  ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <Clock className={`w-5 h-5 ${timeLeftMs < 60000 ? "text-rose-600 animate-spin" : "text-[#1565c0]"}`} />
              <span>{formatTime(timeLeftMs)}</span>
            </div>
          </div>

          {/* Quick Info bar */}
          <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 text-xs text-amber-850 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {lang === "en"
                ? "Scroll down to answer all the questions. Click 'Finish & Submit Test' when you are done."
                : "নিচের সবগুলো প্রশ্নের উত্তর নির্বাচন করুন। শেষ হলে সবার নিচে থাকা 'পরীক্ষা সাবমিট করুন' বাটনে ক্লিক করুন।"}
            </span>
          </div>

          {/* List of ALL MCQs rendered together */}
          <div className="space-y-6">
            {activeExam.questions.map((questionObj, qIndex) => {
              const hasAnswered = selectedAnswers[questionObj.id] !== undefined;
              return (
                <div
                  key={questionObj.id}
                  id={`question-card-${questionObj.id}`}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border transition duration-200 shadow-sm hover:shadow-md space-y-4 relative ${
                    hasAnswered ? "border-blue-100 ring-1 ring-blue-50/50" : "border-slate-100"
                  }`}
                >
                  {/* Question Header Row */}
                  <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#1565c0] text-white rounded-lg text-xs font-black font-mono">
                        {lang === "en" ? `Q-${qIndex + 1}` : `প্রশ্ন-${qIndex + 1}`}
                      </span>
                      {hasAnswered && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black font-mono uppercase">
                          <Check className="w-3 h-3" />
                          {lang === "en" ? "Selected" : "পূরণকৃত"}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {lang === "en" ? activeExam.category : activeExam.categoryBn}
                    </div>
                  </div>

                  {/* Question Title */}
                  <div className="space-y-1 pt-1">
                    <p className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">
                      {lang === "en"
                        ? questionObj.questionText
                        : questionObj.questionTextBn || questionObj.questionText}
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    {questionObj.options.map((option, idx) => {
                      const isSelected = selectedAnswers[questionObj.id] === idx;
                      const displayOptionText =
                        lang === "bn" && questionObj.optionsBn
                          ? questionObj.optionsBn[idx]
                          : option;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(questionObj.id, idx)}
                          className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? "bg-[#1565c0]/5 border-[#1565c0] text-[#1565c0] font-bold shadow-sm ring-1 ring-[#1565c0]/35"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/75 hover:border-slate-300"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border ${
                              isSelected
                                ? "bg-[#1565c0] text-white border-transparent"
                                : "bg-white text-slate-400 border-slate-300"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-tight pt-0.5">{displayOptionText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer - Form-wide Submission Button */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-4">
            <p className="text-xs text-slate-500">
              {lang === "en"
                ? `You have answered ${Object.keys(selectedAnswers).length} out of ${activeExam.questions.length} questions.`
                : `আপনি ${activeExam.questions.length}টি প্রশ্নের মধ্যে ${Object.keys(selectedAnswers).length}টি সম্পন্ন করেছেন।`}
            </p>
            <button
              onClick={handleSubmitExam}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest transition duration-150 cursor-pointer shadow-md shadow-emerald-500/20 inline-flex items-center gap-2 active:scale-95"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{lang === "en" ? "Finish & Submit Test" : "টেস্ট জমা দিন"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. EXAM REPORT STATE & CERTIFICATE GENERATION */}
      {status === "ended" && examResult && activeExam && (
        <div className="space-y-8 animate-fade-in">
          {/* Result Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                <Star className="w-8 h-8 text-[#1565c0] animate-pulse" />
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono block">
                  {lang === "en" ? "Diagnostic Report card" : "ফলাফল ডায়াগনস্টিক রিপোর্ট"}
                </span>
                <h3 className="text-2xl font-black text-slate-800">
                  {lang === "en" ? activeExam.title : activeExam.titleBn}
                </h3>
              </div>

              {/* Central Core Stats Rings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-xl mx-auto">
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    {lang === "en" ? "Accuracy Score" : "প্রাপ্ত স্কোর"}
                  </span>
                  <span className="text-3xl font-black text-[#1565c0] font-mono block mt-1">
                    {examResult.scorePercentage}%
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    {lang === "en" ? "Correct / Total" : "সঠিক উত্তর"}
                  </span>
                  <span className="text-3xl font-black text-slate-800 font-mono block mt-1">
                    {examResult.correctAnswers} / {examResult.totalQuestions}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    {lang === "en" ? "Time Spent" : "ব্যয়িত সময়"}
                  </span>
                  <span className="text-3xl font-black text-[#1565c0] font-mono block mt-1">
                    {formatTime(examResult.timeSpentMs)}
                  </span>
                </div>
              </div>

              {/* Smart feedback comments */}
              <div className="max-w-xl mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed text-center">
                {examResult.scorePercentage >= 80 ? (
                  lang === "en"
                    ? "🎖️ Stellar Performance! You demonstrated deep core understanding of the concepts. High rank predicted!"
                    : "🎖️ অসাধারণ পারফরম্যান্স! আপনি দুর্দান্ত দক্ষতা দেখিয়েছেন। র্যাংকিংয়ে বড় অগ্রগতির সম্ভাবনা!"
                ) : examResult.scorePercentage >= 50 ? (
                  lang === "en"
                    ? "⚡ Good attempt. Review the official lessons syllabus to patch some gap areas."
                    : "⚡ চমৎকার চেষ্টা। কিছু দুর্বলতা দূর করতে আবার কারিকুলাম ও সিলেবাস রিভিশন দিন।"
                ) : (
                  lang === "en"
                    ? "📚 Practice makes perfect. Review the mock solutions and recheck course worksheets."
                    : "📚 অনুশীলনই সাফল্যের চাবিকাঠি। সমাধানগুলো মিলিয়ে নিন এবং কোর্সে পুনরায় মনোযোগ দিন।"
                )}
              </div>
            </div>
            
            {/* Solutions Overview Accordion list */}
            <div className="mt-8 space-y-4 pt-8 border-t border-slate-100/80">
              <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider font-mono">
                {lang === "en" ? "Official Solved Sheets" : "সঠিক উত্তরের তালিকা"}
              </h4>

              <div className="space-y-3.5">
                {activeExam.questions.map((q, qIndex) => {
                  const userChoice = selectedAnswers[q.id];
                  const isCorrect = userChoice === q.correctAnswerIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2.5 transition ${
                        isCorrect
                          ? "bg-emerald-50/20 border-emerald-200"
                          : "bg-rose-50/15 border-rose-200"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-black font-mono shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <div className="font-semibold text-slate-800">
                          {lang === "en" ? q.questionText : q.questionTextBn || q.questionText}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                        <div className="p-2 rounded-xl bg-white border border-slate-100">
                          <span className="text-[10px] text-slate-400 block uppercase font-mono">
                            {lang === "en" ? "Your selected choice" : "আপনার উত্তর"}
                          </span>
                          <span className={`font-semibold ${isCorrect ? "text-emerald-600" : "text-rose-600 font-bold"}`}>
                            {userChoice !== undefined
                              ? (lang === "en" ? q.options[userChoice] : q.optionsBn?.[userChoice] || q.options[userChoice])
                              : (lang === "en" ? "Unanswered" : "উত্তর দেওয়া হয়নি")}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-white border border-slate-100">
                          <span className="text-[10px] text-slate-400 block uppercase font-mono">
                            {lang === "en" ? "Correct Answer" : "সঠিক উত্তর"}
                          </span>
                          <span className="text-emerald-700 font-bold">
                            {lang === "en"
                              ? q.options[q.correctAnswerIndex]
                              : q.optionsBn?.[q.correctAnswerIndex] || q.options[q.correctAnswerIndex]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Accomplishment Certificate Card */}
          {examResult.scorePercentage >= 60 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-3xl p-8 border-4 border-double border-amber-200 shadow-lg text-center relative overflow-hidden max-w-2xl mx-auto space-y-6">
              <div className="absolute top-0 right-0 p-4 transform translate-x-4 -translate-y-4 text-amber-500 opacity-20">
                <Trophy className="w-40 h-40" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-amber-600 font-black tracking-widest uppercase font-mono text-[10px]">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-spin" />
                  <span>{lang === "en" ? "The Success Academy Certificate" : "দ্য সাকসেস অ্যাকাডেমি সার্টিফিকেট"}</span>
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-spin" />
                </div>
                
                <h3 className="font-serif text-3xl font-black text-amber-900 tracking-tight italic">
                  Certificate of Achievement
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-stone-500">
                  {lang === "en" ? "This certifies that" : "এই মর্মে প্রত্যয়ন করা হচ্ছে যে"}
                </p>

                <div className="border-b-2 border-dashed border-amber-300 max-w-xs mx-auto pb-1">
                  <span className="font-black text-xl text-stone-800 font-sans">
                    {currentUser.isLoggedIn ? currentUser.name : (lang === "en" ? "Distinguished Guest Student" : "সম্মানিত অতিথি শিক্ষার্থী")}
                  </span>
                </div>

                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  {lang === "en" ? (
                    <>
                      has successfully passed the academic credential challenge <strong className="text-stone-800">{examResult.examTitle}</strong> with a proficiency score of <strong className="text-[#1565c0]">{examResult.scorePercentage}%</strong> accuracy within this live LMS test frame.
                    </>
                  ) : (
                    <>
                      সফলতার সাথে অ্যাকাডেমিক প্র্যাকটিস টেস্ট <strong className="text-stone-800">{examResult.examTitleBn}</strong> সম্পন্ন করেছেন এবং সাকসেস অ্যাকাডেমির পরীক্ষার নিয়মাবলী অনুযায়ী <strong className="text-[#1565c0]">{examResult.scorePercentage}%</strong> মার্কস অর্জন করেছেন।
                    </>
                  )}
                </p>
              </div>

              {/* Verified Badge / Stamp & Digital Signatures */}
              <div className="flex justify-between items-end pt-6 border-t border-amber-200 max-w-md mx-auto">
                <div className="text-left font-sans text-[10px] text-stone-400">
                  <span className="block font-mono font-bold uppercase text-amber-800">
                    {lang === "en" ? "ID Card" : "আইডি কার্ড"}
                  </span>
                  <span>{currentUser.studentId || "TSA-MEMBER-GUEST"}</span>
                </div>

                <div className="w-16 h-16 rounded-full border-4 border-amber-300 bg-white shadow flex items-center justify-center font-bold text-amber-500 rotate-12 relative select-none">
                  <div className="absolute inset-1 rounded-full border border-dashed border-amber-300 flex items-center justify-center text-[10px] font-black">
                    PASSED
                  </div>
                </div>

                <div className="text-right font-sans text-[10px] text-stone-400">
                  <span className="block font-mono font-bold uppercase text-amber-800">
                    {lang === "en" ? "Date Passed" : "তারিখ"}
                  </span>
                  <span>{examResult.dateCompleted}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Exit Buttons */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setStatus("idle");
                setActiveExam(null);
                setExamResult(null);
              }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition cursor-pointer flex items-center gap-2 mx-auto shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{lang === "en" ? "Back to Exams Lobby" : "পরীক্ষা লবিতে ফিরে যান"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
