export interface User {
  name: string;
  email: string;
  studentId: string;
  isLoggedIn: boolean;
  avatarSeed: string;
}

export interface Question {
  id: string;
  questionText: string;
  questionTextBn?: string;
  options: string[];
  optionsBn?: string[];
  correctAnswerIndex: number;
}

export interface Exam {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  durationMs: number; // in milliseconds
  questions: Question[];
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  examTitleBn: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentMs: number;
  dateCompleted: string;
}

export interface Course {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  instructor: string;
  lessonsCount: number;
  image: string;
  rating: number;
  enrolled: boolean;
  syllabus: string[];
  category: string;
  bookmarked?: boolean;
  regularPrice?: number;
  salePrice?: number;
  status?: string;
  shortDescription?: string;
  duration?: string;
  alreadyEnrolled?: number;
  facebookGroup?: string;
  telegramGroup?: string;
  teachers?: string[];
  tags?: string[];
  communityEnabled?: boolean;
  examEnabled?: boolean;
  liveClassEnabled?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  studentId: string;
  examsCompleted: number;
  averageScorePercentage: number;
  isCurrentUser?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  date: string;
  type: "exam" | "content" | "reminder";
  read: boolean;
}

export interface CourseCategory {
  id: string;
  name: string;
  nameBn?: string;
  image: string;
}

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledDate: string;
  paymentStatus: "paid" | "pending";
  status: "active" | "suspended";
}

