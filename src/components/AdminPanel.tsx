import React, { useState, useRef, useEffect } from "react";
import { Course, Exam, AppNotification, Question, CourseCategory, EnrolledStudent } from "../types";
import {
  LayoutDashboard,
  BookOpen,
  FileSpreadsheet,
  Bell,
  PlusCircle,
  Trash,
  Check,
  Plus,
  ArrowRight,
  Shield,
  Clock,
  Settings,
  AlertCircle,
  HelpCircle,
  Search,
  Users,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  UserCheck,
  Upload,
  RefreshCw,
  Folder,
  BarChart,
  User,
  MoreVertical,
  CheckSquare,
  Gift,
  GripVertical,
  Edit2,
  Edit,
  Mail,
  Phone,
  UserPlus,
  X
} from "lucide-react";

interface AdminPanelProps {
  courses: Course[];
  exams: Exam[];
  notifications: AppNotification[];
  lang: "en" | "bn";
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddExam: (exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
  onAddNotification: (notif: AppNotification) => void;
  onDeleteNotification: (notifId: string) => void;
  onResetToDefault: () => void;
}

// Simulated active admin data
const INITIAL_RECENT_USERS = [
  { name: "Roki Vai", email: "varokit105@gmail.com", track: "Admission", credits: "0 cr", date: "Jun 17", color: "bg-blue-500" },
  { name: "Muhammad Abul Basher", email: "basher.000021@gmail.com", track: "Job Prep", credits: "0 cr", date: "Jun 16", color: "bg-purple-500" },
  { name: "Md. Monjurul Karim Arafat", email: "mdmonjurulkarimarafat@gmail.com", track: "Admission", credits: "0 cr", date: "Jun 16", color: "bg-pink-500" },
  { name: "Maha Islam Maha Islam", email: "mahaislammahaslam0@gmail.com", track: "SSC", credits: "0 cr", date: "Jun 15", color: "bg-cyan-500" },
  { name: "Shalina Akther", email: "shalinaakther786@gmail.com", track: "SSC", credits: "0 cr", date: "Jun 15", color: "bg-indigo-500" },
  { name: "soma acharjee", email: "somaat07@gmail.com", track: "No Track", credits: "0 cr", date: "Jun 14", color: "bg-yellow-500" },
  { name: "Saiful Islam", email: "saiful19762004@gmail.com", track: "SSC", credits: "0 cr", date: "Jun 12", color: "bg-green-500" },
  { name: "Farhad Bin Riaz", email: "farhadbinriaz18@gmail.com", track: "Admission", credits: "0 cr", date: "Jun 11", color: "bg-orange-500" },
];

export default function AdminPanel({
  courses,
  exams,
  notifications,
  lang,
  onAddCourse,
  onDeleteCourse,
  onAddExam,
  onDeleteExam,
  onAddNotification,
  onDeleteNotification,
  onResetToDefault,
}: AdminPanelProps) {
  // Navigation active control
  // Supports left sidebar clicks to match screenshot_1 and screenshot_2
  const [activeMenu, setActiveMenu] = useState<
    | "dashboard"
    | "course_dashboard"
    | "all_courses"
    | "add_course"
    | "categories"
    | "teachers"
    | "all_exams"
    | "add_exam"
    | "view_questions"
    | "prepare_questions"
    | "notifications"
  >("dashboard");

  // Track expand states for navigation submenus
  const [coursesExpanded, setCoursesExpanded] = useState(true);
  const [examsExpanded, setExamsExpanded] = useState(true);

  // States for user interactive actions
  const [recentUsers, setRecentUsers] = useState(INITIAL_RECENT_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  
  // Custom created subjects registry
  const [subjectsList, setSubjectsList] = useState<string[]>([
    "Bangla Grammar",
    "English Literature",
    "General Mathematics",
    "Bangladesh Affairs",
    "International Affairs",
    "Computer Science & ICT",
    "Mental Ability"
  ]);

  const [newSubjectValue, setNewSubjectValue] = useState("");

  // Course Categories State modeled on the screenshot
  const [categoriesList, setCategoriesList] = useState<CourseCategory[]>(() => {
    const saved = localStorage.getItem("tsa_course_categories");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      {
        id: "cat-admission",
        name: "Admission",
        nameBn: "ভর্তি পরীক্ষা",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=60" // School & graduation cap
      },
      {
        id: "cat-job",
        name: "Job",
        nameBn: "চাকরি প্রস্তুতি",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60" // Professional office setting / prep
      },
      {
        id: "cat-hsc",
        name: "HSC",
        nameBn: "এইচএসসি",
        image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=500&auto=format&fit=crop&q=60" // Wings of success
      },
      {
        id: "cat-exam-batch",
        name: "Exam Batch",
        nameBn: "এক্সাম ব্যাচ",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60" // Exams & tests
      },
      {
        id: "cat-book",
        name: "Book",
        nameBn: "বই ও গাইড",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60" // Class textbooks stack
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("tsa_course_categories", JSON.stringify(categoriesList));
  }, [categoriesList]);

  // Category Edit / Create modal state variables
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryImageInput, setCategoryImageInput] = useState("");

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) {
      alert("Please provide the category name.");
      return;
    }

    const finalImage = categoryImageInput.trim() || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500';

    if (editingCategory) {
      setCategoriesList(
        categoriesList.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name: categoryNameInput, image: finalImage }
            : cat
        )
      );
    } else {
      const newCat: CourseCategory = {
        id: "cat-" + Date.now(),
        name: categoryNameInput,
        image: finalImage
      };
      setCategoriesList([...categoriesList, newCat]);
    }

    setCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryNameInput("");
    setCategoryImageInput("");
  };

  // Detailed Add Course States
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("Admission");
  const [courseStatus, setCourseStatus] = useState("Active");
  const [courseLinkUrl, setCourseLinkUrl] = useState("");
  const [courseCoverImage, setCourseCoverImage] = useState("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseShortDesc, setCourseShortDesc] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDuration, setCourseDuration] = useState("1");
  const [courseAlreadyEnrolled, setCourseAlreadyEnrolled] = useState(0);
  const [courseSalePrice, setCourseSalePrice] = useState(399);
  const [courseRegularPrice, setCourseRegularPrice] = useState(1000);
  const [courseFbGroup, setCourseFbGroup] = useState("");
  const [courseTgGroup, setCourseTgGroup] = useState("");
  const [communityChecked, setCommunityChecked] = useState(true);
  const [examChecked, setExamChecked] = useState(true);
  const [liveClassChecked, setLiveClassChecked] = useState(true);
  const [courseTags, setCourseTags] = useState<string[]>(["hsc admission"]);
  const [courseTagInput, setCourseTagInput] = useState("");

  // ==================== NEW: COURSE DETAILED EDITING STATES ====================
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [editCourseName, setEditCourseName] = useState("");
  const [editCourseCategory, setEditCourseCategory] = useState("");
  const [editCourseStatus, setEditCourseStatus] = useState("");
  const [editCourseLinkUrl, setEditCourseLinkUrl] = useState("");
  const [editCourseCoverImage, setEditCourseCoverImage] = useState("");
  const [editSelectedTeachers, setEditSelectedTeachers] = useState<string[]>([]);
  const [editCourseInstructor, setEditCourseInstructor] = useState("");
  const [editCourseShortDesc, setEditCourseShortDesc] = useState("");
  const [editCourseDescription, setEditCourseDescription] = useState("");
  const [editCourseDuration, setEditCourseDuration] = useState("");
  const [editCourseAlreadyEnrolled, setEditCourseAlreadyEnrolled] = useState(0);
  const [editCourseSalePrice, setEditCourseSalePrice] = useState(399);
  const [editCourseRegularPrice, setEditCourseRegularPrice] = useState(1000);
  const [editCourseFbGroup, setEditCourseFbGroup] = useState("");
  const [editCourseTgGroup, setEditCourseTgGroup] = useState("");
  const [editCommunityChecked, setEditCommunityChecked] = useState(true);
  const [editExamChecked, setEditExamChecked] = useState(true);
  const [editLiveClassChecked, setEditLiveClassChecked] = useState(true);
  const [editCourseTags, setEditCourseTags] = useState<string[]>([]);
  const [editCourseTagInput, setEditCourseTagInput] = useState("");
  const [editCourseSyllabusInput, setEditCourseSyllabusInput] = useState("");

  const [createImageDrag, setCreateImageDrag] = useState(false);
  const [editImageDrag, setEditImageDrag] = useState(false);

  const handleImageUpload = (file: File, type: "create" | "edit") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        if (type === "create") {
          setCourseCoverImage(reader.result);
        } else {
          setEditCourseCoverImage(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // ==================== NEW: ENROLLED STUDENTS MANAGEMENT STATES ====================
  const [viewingStudentsCourse, setViewingStudentsCourse] = useState<Course | null>(null);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [enrolledStudentsList, setEnrolledStudentsList] = useState<EnrolledStudent[]>([]);
  
  // Custom new manual registration inputs inside student dialog
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentPayment, setNewStudentPayment] = useState<"paid" | "pending">("paid");

  // Load and generate course enrollments from client logs
  const loadStudentsForCourse = (courseId: string, currentEnrolledCount: number): EnrolledStudent[] => {
    const key = `tsa_course_students_${courseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const count = currentEnrolledCount > 0 ? Math.min(10, currentEnrolledCount) : 4;
    const firstNames = ["Sajid", "Farhana", "Ariful", "Nusrat", "Tasnim", "Kamrul", "Sultana", "Jamil", "Zannat", "Mehrab", "Anika", "Imran"];
    const lastNames = ["Hasan", "Rahman", "Islam", "Jahan", "Akter", "Uddin", "Chowdhury", "Ahamed", "Sultana", "Hossain"];
    const domain = "gmail.com";
    const initialList: EnrolledStudent[] = [];
    for (let i = 0; i < count; i++) {
      const idxF = (i * 3 + 1) % firstNames.length;
      const idxL = (i * 2 + 5) % lastNames.length;
      const fn = firstNames[idxF];
      const ln = lastNames[idxL];
      const name = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${10 + i * 7}@${domain}`;
      const phone = `017${10000000 + i * 2356987 % 90000000}`;
      const regDay = 1 + (i * 4) % 15;
      const enrolledDate = `Jun ${regDay}, 2026`;
      const id = `STU-${15000 + i * 382}`;
      initialList.push({
        id,
        name,
        email,
        phone,
        enrolledDate,
        paymentStatus: i % 5 === 0 ? "pending" : "paid",
        status: "active"
      });
    }
    localStorage.setItem(key, JSON.stringify(initialList));
    return initialList;
  };

  const saveStudentsForCourse = (courseId: string, list: EnrolledStudent[]) => {
    localStorage.setItem(`tsa_course_students_${courseId}`, JSON.stringify(list));
  };

  const TEACHERS_LIST = [
    { name: "Iffat Madam", subject: "Bangla", initial: "IM", color: "bg-red-500" },
    { name: "Fahad Sir", subject: "Economics & English", initial: "FS", color: "bg-blue-500" },
    { name: "Parvez Sir", subject: "ICT", initial: "PS", color: "bg-green-500" },
    { name: "Shakil Sir", subject: "Bangla", initial: "SS", color: "bg-yellow-500" },
    { name: "Rashed Sir", subject: "Accounting", initial: "RS", color: "bg-purple-500" },
    { name: "Bijoy Debnath", subject: "Vocabulary", initial: "BD", color: "bg-pink-500" },
    { name: "Kazi Mohammad Muslim", subject: "Bangla", initial: "KM", color: "bg-indigo-500" },
    { name: "Dr. Ariyan Jawad", subject: "Head of Math Department+ ICT", initial: "AJ", color: "bg-teal-500" },
    { name: "Rafi sir", subject: "Management", initial: "RS", color: "bg-cyan-500" },
    { name: "Arif sir", subject: "Accounting", initial: "AS", color: "bg-orange-500" },
    { name: "Toufique Sir", subject: "Bangla", initial: "TS", color: "bg-emerald-500" },
    { name: "Rabby Tawhid", subject: "GK", initial: "RT", color: "bg-fuchsia-500" },
    { name: "Ashraful Islam", subject: "Bangla", initial: "AI", color: "bg-rose-500" },
    { name: "Rezo Sir", subject: "GK", initial: "RZ", color: "bg-violet-500" },
    { name: "Shahriar Sir", subject: "English", initial: "SS", color: "bg-amber-500" }
  ];

  // Syllabus / Course Form State
  const [newCourse, setNewCourse] = useState({
    title: "",
    titleBn: "",
    description: "",
    descriptionBn: "",
    instructor: "",
    lessonsCount: 12,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60",
    rating: 4.9,
    category: "BCS GK",
    syllabus: ["Chapter 1 Introduction", "Chapter 2 Core concepts", "Chapter 3 Project review", "Chapter 4 Test preparation"]
  });
  const [courseSyllabusInput, setCourseSyllabusInput] = useState("");

  // Exam Form State
  const [newExam, setNewExam] = useState({
    title: "",
    titleBn: "",
    category: "BCS",
    durationMs: 15 * 60 * 1000,
    difficulty: "Medium" as "Easy" | "Medium" | "Hard"
  });

  // Questions buffers
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q-1",
      questionText: "What is the capital of Bangladesh?",
      questionTextBn: "বাংলাদেশের রাজধানী কী?",
      options: ["Cox's Bazar", "Sylhet", "Dhaka", "Chattogram"],
      optionsBn: ["কক্সবাজার", "সিলেট", "ঢাকা", "চট্টগ্রাম"],
      correctAnswerIndex: 2
    },
    {
      id: "q-2",
      questionText: "Which layer of Atmosphere is closest to Earth?",
      questionTextBn: "বায়ুমণ্ডলের কোন স্তরটি পৃথিবীর সবচেয়ে বেশি নিকটবর্তী?",
      options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
      optionsBn: ["ট্রপোমন্ডল", "স্ট্র্যাটোমন্ডল", "মেসোমন্ডল", "থার্মোমন্ডল"],
      correctAnswerIndex: 0
    }
  ]);

  // Temporary question input buffer
  const [tempQ, setTempQ] = useState({
    questionText: "",
    questionTextBn: "",
    optionA: "",
    optionABn: "",
    optionB: "",
    optionBBn: "",
    optionC: "",
    optionCBn: "",
    optionD: "",
    optionDBn: "",
    correctAnswerIndex: 0
  });

  // Notification creation state
  const [newNotif, setNewNotif] = useState({
    title: "",
    titleBn: "",
    message: "",
    messageBn: "",
    type: "exam" as "exam" | "content" | "reminder"
  });

  // Bulk CSV file drop / manual copy content states
  const [bulkCsvContent, setBulkCsvContent] = useState("");
  const [bulkImportStatus, setBulkImportStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File drag & drop states
  const [dragActive, setDragActive] = useState(false);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop Events
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCsvFile(e.dataTransfer.files[0]);
    }
  };

  // Process selected CSV
  const handleCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setBulkCsvContent(text);
      setBulkImportStatus(`Received file "${file.name}" (${text.split("\n").length} lines).`);
    };
    reader.readAsText(file);
  };

  const handleBulkImportSubmit = () => {
    if (!bulkCsvContent.trim()) {
      alert("Please enter CSV content or drop a valid CSV file first.");
      return;
    }

    try {
      // Very simple CSV parser: question, optionA, optionB, optionC, optionD, correctAnswerIndex
      const lines = bulkCsvContent.split("\n").filter(l => l.trim() !== "");
      let importedCount = 0;
      const parsedQuestions: Question[] = [];

      lines.forEach((line, idx) => {
        // Skip header
        if (line.toLowerCase().includes("questiontext") || line.toLowerCase().includes("options")) return;
        
        const parts = line.split(",").map(p => p.trim());
        if (parts.length >= 6) {
          const text = parts[0];
          const optA = parts[1];
          const optB = parts[2];
          const optC = parts[3];
          const optD = parts[4];
          const correctIdx = parseInt(parts[5]) || 0;

          parsedQuestions.push({
            id: `csv-q-${Date.now()}-${idx}`,
            questionText: text,
            questionTextBn: text,
            options: [optA, optB, optC, optD],
            optionsBn: [optA, optB, optC, optD],
            correctAnswerIndex: correctIdx
          });
          importedCount++;
        }
      });

      if (parsedQuestions.length > 0) {
        setQuestions(prev => [...prev, ...parsedQuestions]);
        alert(`Successfully imported ${importedCount} questions from CSV!`);
        setBulkCsvContent("");
        setBulkImportStatus("");
        setBulkImportOpen(false);
      } else {
        alert("Failed to parse questions. Check format: Question text, Option A, Option B, Option C, Option D, correctIndex");
      }
    } catch (e) {
      alert("Error parsing CSV data: " + e);
    }
  };

  // Action methods
  const handleAddTempQuestion = () => {
    if (!tempQ.questionText || !tempQ.optionA || !tempQ.optionB || !tempQ.optionC || !tempQ.optionD) {
      alert("Please fill out at least the English Question Text & all four options.");
      return;
    }

    const q: Question = {
      id: "cust-q-" + Date.now() + "-" + questions.length,
      questionText: tempQ.questionText,
      questionTextBn: tempQ.questionTextBn || tempQ.questionText,
      options: [tempQ.optionA, tempQ.optionB, tempQ.optionC, tempQ.optionD],
      optionsBn: [
        tempQ.optionABn || tempQ.optionA,
        tempQ.optionBBn || tempQ.optionB,
        tempQ.optionCBn || tempQ.optionC,
        tempQ.optionDBn || tempQ.optionD
      ],
      correctAnswerIndex: Number(tempQ.correctAnswerIndex)
    };

    setQuestions([...questions, q]);
    setTempQ({
      questionText: "",
      questionTextBn: "",
      optionA: "",
      optionABn: "",
      optionB: "",
      optionBBn: "",
      optionC: "",
      optionCBn: "",
      optionD: "",
      optionDBn: "",
      correctAnswerIndex: 0
    });
    alert("Question added to local exam buffer!");
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Support both the manual legacy way and the new premium screenshot layout way
    const titleToUse = courseName.trim() || newCourse.title.trim();
    if (!titleToUse) {
      alert("Please provide the course name.");
      return;
    }

    const firstTeacher = courseInstructor.trim() || "Zakir Sir & Success Panel";

    const coursePayload: Course = {
      id: "course-" + Date.now(),
      title: titleToUse,
      titleBn: titleToUse, // Match native
      description: courseDescription || newCourse.description || "Premium Academy Structured Study Course Program.",
      descriptionBn: courseShortDesc || newCourse.descriptionBn || "বিশেষজ্ঞ শিক্ষকদের দ্বারা পরিচালিত হাই-ভ্যালু সম্পূর্ণ কোর্স গাইড।",
      instructor: firstTeacher,
      lessonsCount: Number(courseDuration) * 8 || Number(newCourse.lessonsCount) || 12,
      image: courseCoverImage || newCourse.image,
      rating: 4.9,
      enrolled: false,
      syllabus: courseSyllabusInput
        ? courseSyllabusInput.split("\n").filter(line => line.trim() !== "")
        : [
            "Day 1 - Intro & Fundamental Hacks",
            "Day 2 - Standard Class MCQ Booster",
            "Day 3 - Core Formula Analysis",
            "Day 4 - Live Mock Test Practice"
          ],
      category: courseCategory || newCourse.category,
      regularPrice: Number(courseRegularPrice) ?? 1000,
      salePrice: Number(courseSalePrice) ?? 399,
      status: courseStatus,
      shortDescription: courseShortDesc,
      duration: courseDuration,
      alreadyEnrolled: Number(courseAlreadyEnrolled) || 0,
      facebookGroup: courseFbGroup,
      telegramGroup: courseTgGroup,
      teachers: [firstTeacher],
      tags: courseTags,
      communityEnabled: communityChecked,
      examEnabled: examChecked,
      liveClassEnabled: liveClassChecked
    };

    onAddCourse(coursePayload);

    // Reset fields
    setCourseName("");
    setCourseCategory("Admission");
    setCourseStatus("Active");
    setCourseLinkUrl("");
    setCourseShortDesc("");
    setCourseDescription("");
    setCourseDuration("1");
    setCourseAlreadyEnrolled(0);
    setCourseSalePrice(399);
    setCourseRegularPrice(1000);
    setCourseFbGroup("");
    setCourseTgGroup("");
    setSelectedTeachers([]);
    setCourseInstructor("");
    setCommunityChecked(true);
    setExamChecked(true);
    setLiveClassChecked(true);
    setCourseTags(["hsc admission"]);
    setCourseTagInput("");

    setNewCourse({
      title: "",
      titleBn: "",
      description: "",
      descriptionBn: "",
      instructor: "",
      lessonsCount: 12,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60",
      rating: 4.9,
      category: "BCS GK",
      syllabus: ["Chapter 1 Introduction", "Chapter 2 Core concepts", "Chapter 3 Project review", "Chapter 4 Test preparation"]
    });
    setCourseSyllabusInput("");

    alert(lang === "en" ? "Course created and live successfully!" : "নতুন কোর্সটি সফলভাবে এবং সুচারুভাবে লাইভ করা হয়েছে!");
    setActiveMenu("all_courses");
  };

  // ==================== NEW HANDLERS FOR COURSE EDIT & STUDENTS ====================
  const handleEditCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const updatedCourse: Course = {
      ...editingCourse,
      title: editCourseName.trim(),
      titleBn: editCourseName.trim(),
      category: editCourseCategory,
      status: editCourseStatus,
      image: editCourseCoverImage,
      teachers: [editCourseInstructor.trim() || "Zakir Sir & Success Panel"],
      instructor: editCourseInstructor.trim() || "Zakir Sir & Success Panel",
      shortDescription: editCourseShortDesc,
      description: editCourseDescription || "Premium Academy Structured Study Course Program.",
      descriptionBn: editCourseShortDesc || "বিশেষজ্ঞ শিক্ষকদের দ্বারা পরিচালিত হাই-ভ্যালু সম্পূর্ণ কোর্স গাইড।",
      duration: editCourseDuration,
      alreadyEnrolled: Number(editCourseAlreadyEnrolled) || 0,
      regularPrice: Number(editCourseRegularPrice),
      salePrice: Number(editCourseSalePrice),
      facebookGroup: editCourseFbGroup,
      telegramGroup: editCourseTgGroup,
      communityEnabled: editCommunityChecked,
      examEnabled: editExamChecked,
      liveClassEnabled: editLiveClassChecked,
      tags: editCourseTags,
      syllabus: editCourseSyllabusInput
        ? editCourseSyllabusInput.split("\n").filter(line => line.trim() !== "")
        : editingCourse.syllabus
    };

    onAddCourse(updatedCourse);
    setEditCourseModalOpen(false);
    setEditingCourse(null);
    alert(lang === "en" ? "Course updated successfully!" : "কোর্সের সিলবাস ও সকল প্যারামিটার সফলভাবে আপডেট করা হয়েছে!");
  };

  const handleToggleStudentPayment = (studentId: string) => {
    if (!viewingStudentsCourse) return;
    const updated = enrolledStudentsList.map(s => 
      s.id === studentId 
        ? { ...s, paymentStatus: (s.paymentStatus === "paid" ? "pending" : "paid") as "paid" | "pending" }
        : s
    );
    setEnrolledStudentsList(updated);
    saveStudentsForCourse(viewingStudentsCourse.id, updated);
  };

  const handleToggleStudentStatus = (studentId: string) => {
    if (!viewingStudentsCourse) return;
    const updated = enrolledStudentsList.map(s => 
      s.id === studentId 
        ? { ...s, status: (s.status === "active" ? "suspended" : "active") as "active" | "suspended" }
        : s
    );
    setEnrolledStudentsList(updated);
    saveStudentsForCourse(viewingStudentsCourse.id, updated);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (!viewingStudentsCourse) return;
    if (confirm(lang === "en" ? "Are you sure you want to remove this registration?" : "আপনি কি এই শিক্ষার্থীর এনরোলমেন্ট বাতিল করতে চান?")) {
      const updated = enrolledStudentsList.filter(s => s.id !== studentId);
      setEnrolledStudentsList(updated);
      saveStudentsForCourse(viewingStudentsCourse.id, updated);
      
      const updatedCourse: Course = {
        ...viewingStudentsCourse,
        alreadyEnrolled: Math.max(0, (viewingStudentsCourse.alreadyEnrolled || 0) - 1)
      };
      setViewingStudentsCourse(updatedCourse);
      onAddCourse(updatedCourse);
    }
  };

  const handleManualRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingStudentsCourse) return;
    if (!newStudentName.trim() || !newStudentEmail.trim() || !newStudentPhone.trim()) {
      alert("Please fill in all the student registration inputs.");
      return;
    }

    const newStudent: EnrolledStudent = {
      id: `STU-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      phone: newStudentPhone.trim(),
      enrolledDate: "Jun 18, 2026",
      paymentStatus: newStudentPayment,
      status: "active"
    };

    const updated = [newStudent, ...enrolledStudentsList];
    setEnrolledStudentsList(updated);
    saveStudentsForCourse(viewingStudentsCourse.id, updated);
    
    const updatedCourse: Course = {
      ...viewingStudentsCourse,
      alreadyEnrolled: (viewingStudentsCourse.alreadyEnrolled || 0) + 1
    };
    setViewingStudentsCourse(updatedCourse);
    onAddCourse(updatedCourse);

    setNewStudentName("");
    setNewStudentEmail("");
    setNewStudentPhone("");
    setNewStudentPayment("paid");
    alert(lang === "en" ? "Student enrolled and registered successfully!" : "সাকসেস একাডেমী প্যানেলে নতুন শিক্ষার্থী সফলভাবে এনরোল করা হয়েছে!");
  };

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.title || !newExam.titleBn) {
      alert("Please provide Exam titles.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least 1 question to compile this MCQ exam.");
      return;
    }

    const examPayload: Exam = {
      id: "exam-" + Date.now(),
      title: newExam.title,
      titleBn: newExam.titleBn,
      category: newExam.category,
      categoryBn: newExam.category === "BCS" ? "বিসিএস সাধারণ জ্ঞান" : "প্রাইমারি শিক্ষক নিয়োগ",
      durationMs: Number(newExam.durationMs),
      questions: questions,
      difficulty: newExam.difficulty
    };

    onAddExam(examPayload);
    setNewExam({
      title: "",
      titleBn: "",
      category: "BCS",
      durationMs: 15 * 60 * 1000,
      difficulty: "Medium"
    });
    setQuestions([
      {
        id: "q-1",
        questionText: "What is the capital of Bangladesh?",
        questionTextBn: "বাংলাদেশের রাজধানী কী?",
        options: ["Cox's Bazar", "Sylhet", "Dhaka", "Chattogram"],
        optionsBn: ["কক্সবাজার", "সিলেট", "ঢাকা", "চট্টগ্রাম"],
        correctAnswerIndex: 2
      }
    ]);
    alert(lang === "en" ? "Custom Mock Exam created successfully!" : "নতুন কাস্টম মক এক্সামটি লাইভ করা হয়েছে!");
    setActiveMenu("all_exams");
  };

  const handleCreateNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.titleBn) {
      alert("Please fill required title parameters.");
      return;
    }

    const notifPayload: AppNotification = {
      id: "notif-" + Date.now(),
      title: newNotif.title,
      titleBn: newNotif.titleBn,
      message: newNotif.message || "An important announcement has been released.",
      messageBn: newNotif.messageBn || "সাফল্য একাডেমির পক্ষ থেকে একটি গুরুত্বপূর্ণ নির্দেশনা জারি করা হয়েছে।",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      type: newNotif.type,
      read: false
    };

    onAddNotification(notifPayload);
    setNewNotif({
      title: "",
      titleBn: "",
      message: "",
      messageBn: "",
      type: "exam"
    });
    alert(lang === "en" ? "Notification broadcasted!" : "স্মার্ট নোটিফিকেশনটি লাইভ প্রচার করা হয়েছে!");
  };

  const submitAddSubject = () => {
    if (!newSubjectValue.trim()) return;
    setSubjectsList(prev => [...prev, newSubjectValue]);
    alert(`Subject "${newSubjectValue}" created successfully!`);
    setNewSubjectValue("");
    setAddSubjectModalOpen(false);
  };

  // Filter recent users by search
  const filteredUsers = recentUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.track.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0b0f19] text-[#e2e8f0] rounded-[32px] border border-slate-800 shadow-xl overflow-hidden animate-fade-in flex flex-col min-h-[90vh]">
      
      {/* 1. LMS TOP UTILITY BANNER */}
      <div className="bg-[#121422] text-[#e2e8f0] px-8 py-5 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center font-black shadow-lg shadow-amber-500/10">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{lang === "en" ? "The Success Academy Admin" : "সাফল্য একাডেমি এডমিন কনসোল"}</span>
              <span className="text-[10px] bg-red-600 text-white border border-red-500 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest font-mono">
                LMS LIVE
              </span>
            </h2>
            <p className="text-xs text-[#a3b3cc] mt-1">
              {lang === "en"
                ? "Unified Management System with complete multi-database coordination controllers."
                : "সমন্বিত শিক্ষা ব্যবস্থাপনা কন্ট্রোল বোর্ড ও ডায়নামিক লাইভ ডাটা ম্যানেজমেন্ট হাব।"}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm(lang === "en" ? "Are you sure you want to reset all states back to mock data?" : "আপনি কি একাডেমির ডাটাবেস ডিফল্ট অবস্থায় রিস্টোর করতে চান?")) {
              onResetToDefault();
              alert(lang === "en" ? "System restored to default!" : "সিস্টেম সফলভাবে পূর্বাবস্থায় ফিরিয়ে আনা হয়েছে!");
            }
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-xs font-bold text-slate-300 rounded-xl transition cursor-pointer border border-slate-700 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{lang === "en" ? "Restore Standard Data" : "ডিফল্ট ডাটা রিস্টোর"}</span>
        </button>
      </div>

      {/* 2. THREE-PANE INTEGRATED DASHBOARD ENGINE */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT NAV PANEL - REPLICATES SCREENSHOT_1 & SCREENSHOT_2 MATCHING LAYOUT PERFECTLY */}
        <aside className="w-full lg:w-72 bg-[#0e111a] border-r border-slate-800/80 p-5 shrink-0 flex flex-col gap-5">
          
          {/* Internal Dashboard Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search... ⌘K"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#161a29] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1565c0]"
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-grow overflow-y-auto max-h-[70vh] lg:max-h-none pr-1">
            
            {/* GENERAL MENU */}
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 mt-1">
              Content & stats
            </div>

            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition duration-150 text-left ${
                activeMenu === "dashboard"
                  ? "bg-[#1565c0] text-white shadow-md shadow-blue-500/10"
                  : "text-[#a3b3cc] hover:bg-[#151926] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveMenu("course_dashboard")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition duration-150 text-left ${
                activeMenu === "course_dashboard"
                  ? "bg-[#1565c0] text-white shadow"
                  : "text-[#a3b3cc] hover:bg-[#151926] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <BarChart className="w-4 h-4 shrink-0" />
                <span>Course Dashboard</span>
              </span>
            </button>

            {/* EXPANDABLE COURSES SECTION: MATCHES SCREENSHOT_1 */}
            <div className="mt-4">
              <button
                onClick={() => setCoursesExpanded(prev => !prev)}
                className="w-full flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 hover:text-slate-300 transition duration-150 text-left cursor-pointer"
              >
                <span>Courses Menu</span>
                <span className="text-slate-600">
                  {coursesExpanded ? <ChevronUp className="w-3" /> : <ChevronDown className="w-3" />}
                </span>
              </button>

              {coursesExpanded && (
                <div className="pl-3.5 border-l border-slate-800 space-y-1.5 mt-1 ml-3.5 animate-slide-down">
                  <button
                    onClick={() => setActiveMenu("all_courses")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-150 text-left ${
                      activeMenu === "all_courses"
                        ? "text-white bg-[#1a1f33]"
                        : "text-[#a3b3cc] hover:text-white"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>All Courses</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("add_course")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-150 text-left ${
                      activeMenu === "add_course"
                        ? "text-white bg-[#1a1f33]"
                        : "text-[#a3b3cc] hover:text-white"
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add Course</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("categories")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-150 text-left ${
                      activeMenu === "categories"
                        ? "text-white bg-[#1a1f33]"
                        : "text-[#a3b3cc] hover:text-white"
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5 text-slate-500" />
                    <span>Categories</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("teachers")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-150 text-left ${
                      activeMenu === "teachers"
                        ? "text-white bg-[#1a1f33]"
                        : "text-[#a3b3cc] hover:text-white"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Teachers</span>
                  </button>
                </div>
              )}
            </div>

            {/* EXPANDABLE EXAMS SECTION: MATCHES SCREENSHOT_2 */}
            <div className="mt-4">
              <button
                onClick={() => setExamsExpanded(prev => !prev)}
                className="w-full flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 hover:text-slate-300 transition duration-150 text-left cursor-pointer"
              >
                <span>Exams Planner</span>
                <span className="text-slate-600">
                  {examsExpanded ? <ChevronUp className="w-3" /> : <ChevronDown className="w-3" />}
                </span>
              </button>

              {examsExpanded && (
                <div className="pl-3.5 border-l border-slate-800 space-y-1.5 mt-1 ml-3.5 animate-slide-down">
                  <button
                    onClick={() => setActiveMenu("all_exams")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-150 text-left ${
                      activeMenu === "all_exams"
                        ? "text-white bg-[#1a1f33]"
                        : "text-[#a3b3cc] hover:text-white"
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                    <span>All Exams</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("add_exam")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-150 text-left ${
                      activeMenu === "add_exam"
                        ? "text-white bg-[#1a1f33]"
                        : "text-[#a3b3cc] hover:text-white"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add Exam</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("view_questions")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-150 text-left ${
                      activeMenu === "view_questions"
                        ? "text-white bg-[#1a1f33]"
                        : "text-[#a3b3cc] hover:text-white"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Questions</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("prepare_questions")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-150 text-left ${
                      activeMenu === "prepare_questions"
                        ? "text-white bg-[#1a1f33]"
                        : "text-[#a3b3cc] hover:text-white"
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Prepare Questions</span>
                  </button>
                </div>
              )}
            </div>

            {/* UTILITIES SYSTEM */}
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1 mt-5">
              Live Notifications
            </div>

            <button
              onClick={() => setActiveMenu("notifications")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition duration-150 text-left ${
                activeMenu === "notifications"
                  ? "bg-[#1565c0] text-white"
                  : "text-[#a3b3cc] hover:bg-[#151926] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 shrink-0" />
                <span>Smart Broadcasts</span>
              </span>
              {notifications.length > 0 && (
                <span className="text-[10px] bg-red-600/25 text-red-400 font-bold px-2 py-0.2 rounded-full font-mono">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Secure indicator */}
          <div className="mt-auto border-t border-slate-800 pt-4 flex items-center gap-2.5 text-slate-500 text-xs">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-mono">Cluster: Success_East_Live</span>
          </div>
        </aside>

        {/* RIGHT WORKSPACE CONTAINER */}
        <main className="flex-1 p-6 md:p-8 space-y-6">
          
          {/* ================ ACTIVE CONTENT VIEW 1: MAIN DASHBOARD ================ */}
          {activeMenu === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* DYNAMIC METRIC SECTION GRID DIRECTLY FROM SCREENSHOT_0 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* METRIC CARD A: CONTENT */}
                <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-16 w-16 bg-[#1a1f33] rounded-bl-[40px] flex items-center justify-center text-[#1565c0]">
                    <BookOpen className="w-5 h-5 opacity-50" />
                  </div>
                  <h3 className="text-xs uppercase font-mono tracking-widest text-[#a3b3cc]/60 font-black">
                    Content Catalog
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3.5 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block">Users</span>
                      <strong className="text-xl font-bold font-mono text-white">306</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Subjects</span>
                      <strong className="text-xl font-bold font-mono text-white">79</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Chapters</span>
                      <strong className="text-xl font-bold font-mono text-white">961</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Modules</span>
                      <strong className="text-xl font-bold font-mono text-white">963</strong>
                    </div>
                    <div className="col-span-2 border-t border-slate-850 pt-2 flex justify-between items-center bg-[#171b2d]/30 px-2.5 py-1 rounded-xl">
                      <span className="text-slate-500 font-semibold">Questions:</span>
                      <strong className="text-sm font-black font-mono text-emerald-400">115,714</strong>
                    </div>
                  </div>
                </div>

                {/* METRIC CARD B: ACTIVITY */}
                <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-16 w-16 bg-[#1a1f33] rounded-bl-[40px] flex items-center justify-center text-amber-500">
                    <CheckSquare className="w-5 h-5 opacity-50" />
                  </div>
                  <h3 className="text-xs uppercase font-mono tracking-widest text-[#a3b3cc]/60 font-black">
                    LMS Activity
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3.5 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block">Quiz Attempts</span>
                      <strong className="text-xl font-bold font-mono text-white">0</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Live Tests</span>
                      <strong className="text-xl font-bold font-mono text-white">91</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Live Attempts</span>
                      <strong className="text-xl font-bold font-mono text-white">19</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Referrals</span>
                      <strong className="text-xl font-bold font-mono text-white">0</strong>
                    </div>
                    <div className="col-span-2 border-t border-slate-855 pt-2 flex justify-between items-center bg-[#171b2d]/30 px-2.5 py-1 rounded-xl text-[10px]">
                      <span className="text-slate-500 font-black">Live Pulse State:</span>
                      <span className="text-emerald-500 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span> Normal Operation
                      </span>
                    </div>
                  </div>
                </div>

                {/* METRIC CARD C: REVENUE */}
                <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-16 w-16 bg-[#1a1f33] rounded-bl-[40px] flex items-center justify-center text-emerald-500">
                    <Gift className="w-5 h-5 opacity-50" />
                  </div>
                  <h3 className="text-xs uppercase font-mono tracking-widest text-[#a3b3cc]/60 font-black">
                    Revenue & Credits
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3.5 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block">Revenue</span>
                      <strong className="text-xl font-bold font-mono text-white">৳428</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Credits Issued</span>
                      <strong className="text-xl font-bold font-mono text-white">20</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Active Courses</span>
                      <strong className="text-xl font-bold font-mono text-white">{courses.length}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Donation</span>
                      <strong className="text-xl font-bold font-mono text-white">৳21.4</strong>
                    </div>
                    <div className="col-span-2 border-t border-slate-855 pt-2 flex justify-between items-center bg-[#171b2d]/30 px-2.5 py-1 rounded-xl text-[10px]">
                      <span className="text-slate-500 font-black">Sync Tracker:</span>
                      <span className="text-[#a3b3cc] font-mono">100% Up to Date</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION: USERS BY EXAM TRACK CHART (SSC, HSC, Admission, Job Prep, No Track) */}
              <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Users by Exam Track</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Total: 306</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* SSC PROGRESS TRACK */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold flex items-center gap-2 text-[#a3b3cc]">
                        🎓 SSC
                      </span>
                      <span className="font-mono font-bold text-white">108 <span className="text-slate-500">(35.3%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-[#171a2c] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "35.3%" }} />
                    </div>
                  </div>

                  {/* HSC PROGRESS TRACK */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold flex items-center gap-2 text-[#a3b3cc]">
                        📚 HSC
                      </span>
                      <span className="font-mono font-bold text-white">82 <span className="text-slate-500">(26.8%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-[#171a2c] rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: "26.8%" }} />
                    </div>
                  </div>

                  {/* Admission PROGRESS TRACK */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold flex items-center gap-2 text-[#a3b3cc]">
                        🏫 Admission
                      </span>
                      <span className="font-mono font-bold text-white">42 <span className="text-slate-500">(13.7%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-[#171a2c] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "13.7%" }} />
                    </div>
                  </div>

                  {/* Job Prep PROGRESS TRACK */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold flex items-center gap-2 text-[#a3b3cc]">
                        💼 Job Prep
                      </span>
                      <span className="font-mono font-bold text-white">13 <span className="text-slate-500">(4.2%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-[#171a2c] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "4.2%" }} />
                    </div>
                  </div>

                  {/* No Track PROGRESS TRACK */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold flex items-center gap-2 text-[#a3b3cc]">
                        ⚪ No Track
                      </span>
                      <span className="font-mono font-bold text-white">61 <span className="text-slate-500">(19.9%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-[#171a2c] rounded-full overflow-hidden">
                      <div className="h-full bg-slate-500 rounded-full" style={{ width: "19.9%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT USERS LOGGER LOG LIST */}
              <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">Recent Logged-In Learners</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Live events feed and platform registration audit.</p>
                  </div>
                  <button className="text-[#1565c0] hover:underline text-xs font-bold">
                    View All →
                  </button>
                </div>

                <div className="divide-y divide-slate-800/70 overflow-hidden">
                  {filteredUsers.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No matching registered users located.
                    </div>
                  ) : (
                    filteredUsers.map((item, index) => (
                      <div key={index} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${item.color} text-slate-900 font-extrabold flex items-center justify-center text-xs shrink-0`}>
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white leading-tight">{item.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono block">{item.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div className="text-left sm:text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.track === "Admission" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                              item.track === "SSC" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                              item.track === "HSC" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" :
                              item.track === "Job Prep" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                              "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                            }`}>
                              {item.track}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block mt-1">{item.credits} • {item.date}</span>
                          </div>
                          <button className="p-1 hover:bg-[#1a1f33] rounded text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* BOTTOM QUICK ACTIONS PANEL */}
              <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm font-black text-white mb-4">Interactive System Handlers</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  
                  {/* Action 1: Add Subject */}
                  <button
                    type="button"
                    onClick={() => setAddSubjectModalOpen(true)}
                    className="p-4 bg-[#161a2c]/80 hover:bg-[#1f243d] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition duration-150 text-left flex flex-col justify-between h-32 cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#1565c0]/15 text-[#1565c0] flex items-center justify-center font-bold">
                      <FolderPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Add Subject</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Configure and release raw categories.</p>
                    </div>
                  </button>

                  {/* Action 2: Add Question */}
                  <button
                    type="button"
                    onClick={() => setActiveMenu("prepare_questions")}
                    className="p-4 bg-[#161a2c]/80 hover:bg-[#1f243d] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition duration-150 text-left flex flex-col justify-between h-32 cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                      <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Add Question</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Compile and index new exam segments.</p>
                    </div>
                  </button>

                  {/* Action 3: Bulk Import */}
                  <button
                    type="button"
                    onClick={() => {
                      setBulkCsvContent("");
                      setBulkImportStatus("");
                      setBulkImportOpen(true);
                    }}
                    className="p-4 bg-[#161a2c]/80 hover:bg-[#1f243d] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition duration-150 text-left flex flex-col justify-between h-32 cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold">
                      <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Bulk Import</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Mass parse questionnaire sets from CSV.</p>
                    </div>
                  </button>

                  {/* Action 4: Send Notification */}
                  <button
                    type="button"
                    onClick={() => setActiveMenu("notifications")}
                    className="p-4 bg-[#161a2c]/80 hover:bg-[#1f243d] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition duration-150 text-left flex flex-col justify-between h-32 cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                      <Bell className="w-5 h-5 group-hover:scale-110 transition-transform animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Send Notification</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Transmit real-time announcements.</p>
                    </div>
                  </button>

                </div>
              </div>

            </div>
          )}

          {/* ================ ACTIVE CONTENT VIEW 2: COURSE DASHBOARD GRAPHICS ================ */}
          {activeMenu === "course_dashboard" && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="bg-[#121422] border border-slate-800/80 rounded-2xl p-6 shadow-lg text-left">
                <h3 className="text-sm font-black text-white mb-2">Live Enrollment Analytics</h3>
                <p className="text-slate-400 block mb-6">Interactive learner registration indexes grouped by course category.</p>

                <div className="space-y-5">
                  {courses.map((c) => {
                    const enrollCount = c.lessonsCount * 14 + (c.alreadyEnrolled || 120);
                    return (
                      <div key={c.id} className="space-y-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-[#a3b3cc]">{lang === "en" ? c.title : c.titleBn}</span>
                          <span>{enrollCount} registered</span>
                        </div>
                        <div className="w-full h-3 bg-[#161a29] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.floor((enrollCount / 400) * 100))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================ ACTIVE CONTENT VIEW 3: ALL COURSES REGISTRY LIST ================ */}
          {activeMenu === "all_courses" && (
            <div className="space-y-6 animate-fade-in text-xs text-left">
              <div className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl shadow-lg space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-white">{lang === "en" ? "Active Courses Management" : "সকল সক্রিয় কোর্সসমূহ"}</h3>
                    <p className="text-slate-400 mt-0.5">{lang === "en" ? "Drag, preview, or configure available training programs." : "কোর্সের ক্রমানুসারে ড্র্যাগ-হ্যান্ডেল এডিট, এভেইলেবল লার্নিং প্যানেল এক্সেস।"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMenu("add_course")}
                    className="px-3.5 py-1.5 bg-[#1565c0] text-white font-bold rounded-xl text-xs hover:bg-blue-600 transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Add New Course" : "নতুন কোর্স যোগ করুন"}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl gap-4 shadow-sm hover:shadow transition text-xs"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Drag Handle :: on the left */}
                        <div className="text-slate-400 hover:text-slate-600 hover:scale-105 transition cursor-grab flex-shrink-0 px-1">
                          <GripVertical className="w-5 h-5 stroke-[2]" />
                        </div>

                        {/* Course Image rectangular thumbnail */}
                        <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                          <img
                            src={course.image}
                            alt={lang === "en" ? course.title : course.titleBn}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Course Title and dynamic Prices (crossed out regular price in red, sale price in green) */}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-800 text-[13px] sm:text-[14px] leading-snug truncate">
                            {lang === "en" ? course.title : course.titleBn}
                          </h4>
                          <div className="flex items-center gap-2.5 mt-1 text-xs">
                            <span className="line-through text-red-500 font-medium">
                              Tk. {course.regularPrice ?? 1000}
                            </span>
                            <span className="text-emerald-600 font-extrabold">
                              Tk. {course.salePrice ?? 399}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rounded buttons on the right exactly like screenshot */}
                      <div className="flex items-center flex-wrap gap-2 flex-shrink-0">
                        <button 
                          type="button"
                          onClick={() => {
                            setEditingCourse(course);
                            setEditCourseName(course.title);
                            setEditCourseCategory(course.category || "Admission");
                            setEditCourseStatus(course.status || "Active");
                            setEditCourseCoverImage(course.image);
                            setEditSelectedTeachers(course.teachers || []);
                            setEditCourseInstructor(course.instructor || "");
                            setEditCourseShortDesc(course.shortDescription || "");
                            setEditCourseDescription(course.description || "");
                            setEditCourseDuration(course.duration || "1");
                            setEditCourseAlreadyEnrolled(course.alreadyEnrolled || 0);
                            setEditCourseSalePrice(course.salePrice || 399);
                            setEditCourseRegularPrice(course.regularPrice || 1000);
                            setEditCourseFbGroup(course.facebookGroup || "");
                            setEditCourseTgGroup(course.telegramGroup || "");
                            setEditCommunityChecked(course.communityEnabled !== false);
                            setEditExamChecked(course.examEnabled !== false);
                            setEditLiveClassChecked(course.liveClassEnabled !== false);
                            setEditCourseTags(course.tags || []);
                            setEditCourseSyllabusInput((course.syllabus || []).join("\n"));
                            setEditCourseModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-lg transition duration-150 shadow-sm text-xs cursor-pointer"
                        >
                          Lessons
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingStudentsCourse(course);
                            const loaded = loadStudentsForCourse(course.id, course.alreadyEnrolled || 0);
                            setEnrolledStudentsList(loaded);
                            setStudentsModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold rounded-lg transition duration-150 shadow-sm text-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Students ({course.alreadyEnrolled || 0})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCourse(course);
                            setEditCourseName(course.title);
                            setEditCourseCategory(course.category || "Admission");
                            setEditCourseStatus(course.status || "Active");
                            setEditCourseCoverImage(course.image);
                            setEditSelectedTeachers(course.teachers || []);
                            setEditCourseInstructor(course.instructor || "");
                            setEditCourseShortDesc(course.shortDescription || "");
                            setEditCourseDescription(course.description || "");
                            setEditCourseDuration(course.duration || "1");
                            setEditCourseAlreadyEnrolled(course.alreadyEnrolled || 0);
                            setEditCourseSalePrice(course.salePrice || 399);
                            setEditCourseRegularPrice(course.regularPrice || 1000);
                            setEditCourseFbGroup(course.facebookGroup || "");
                            setEditCourseTgGroup(course.telegramGroup || "");
                            setEditCommunityChecked(course.communityEnabled !== false);
                            setEditExamChecked(course.examEnabled !== false);
                            setEditLiveClassChecked(course.liveClassEnabled !== false);
                            setEditCourseTags(course.tags || []);
                            setEditCourseSyllabusInput((course.syllabus || []).join("\n"));
                            setEditCourseModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold rounded-lg transition duration-150 shadow-sm text-xs cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(lang === "en" ? `Are you sure you want to delete "${course.title}"?` : `আপনি কি নিশ্চিত যে "${course.titleBn}" কোর্সটি ডিলেট করতে চান?`)) {
                              onDeleteCourse(course.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-150 border border-transparent hover:border-red-100 cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}          {activeMenu === "add_course" && (
            <form onSubmit={handleCreateCourseSubmit} className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-lg space-y-6 text-xs animate-fade-in text-left">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Create new course
                </h3>
                <p className="text-slate-500 mt-1 text-[13px]">
                  Fill up the form to create a new course
                </p>
              </div>

              {/* Two columns: Left inputs, Right upload cover image */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Side: Name, Category & Status, Course Link URL (takes 8 cols on desktop) */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Name</label>
                    <input
                      type="text"
                      required
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="Course Name"
                      className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                    />
                  </div>

                  {/* Category & Status Inline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Category</label>
                      <select
                        value={courseCategory}
                        onChange={(e) => setCourseCategory(e.target.value)}
                        className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:border-rose-700 font-medium"
                      >
                        <option value="">Select a category</option>
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name} {cat.nameBn ? `(${cat.nameBn})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Status</label>
                      <select
                        value={courseStatus}
                        onChange={(e) => setCourseStatus(e.target.value)}
                        className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:border-rose-700 font-medium"
                      >
                        <option value="">Select status</option>
                        <option value="Active">Active</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Course Link URL field with help note */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Course Link URL</label>
                    <input
                      type="text"
                      value={courseLinkUrl}
                      onChange={(e) => setCourseLinkUrl(e.target.value)}
                      placeholder="Course Link URL"
                      className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                    />
                    <p className="text-[10.5px] text-slate-400 leading-normal mt-1">
                      This will be used to generate the course link. It should be unique and contain only alphabets, numbers, and hyphens.
                    </p>
                  </div>

                  {/* Sori Sori Pic Upload (Direct Image File Upload) */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-black text-rose-700 block flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Direct Picture Upload (সরাসরি কম্পিউটার বা মোবাইল থেকে ছবি দিন)*
                    </label>
                    <div 
                      onDragOver={(e) => {
                        e.preventDefault();
                        setCreateImageDrag(true);
                      }}
                      onDragLeave={() => setCreateImageDrag(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setCreateImageDrag(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleImageUpload(e.dataTransfer.files[0], "create");
                        }
                      }}
                      onClick={() => document.getElementById("direct-image-upload-create")?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition duration-150 ${
                        createImageDrag 
                          ? "border-rose-500 bg-rose-50/50" 
                          : "border-slate-200 hover:border-rose-500 hover:bg-rose-50/10 bg-slate-50/20"
                      }`}
                    >
                      <Upload className={`w-6 h-6 mb-1 ${createImageDrag ? "text-rose-500 animate-bounce" : "text-slate-400"}`} />
                      <span className="text-[11px] font-bold text-slate-700">Click to upload or Drag & Drop image</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, JPEG, WEBP files</p>
                      
                      <input 
                        id="direct-image-upload-create"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(e.target.files[0], "create");
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Proper visible input option for Cover Image URL */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-500 block">Or Paste Cover Image URL (অথবা ইমেজের ওয়েবলিংক দিন)</label>
                    <input
                      type="text"
                      value={courseCoverImage}
                      onChange={(e) => setCourseCoverImage(e.target.value)}
                      placeholder="Paste cover image link/URL here (https://...)"
                      className="w-full px-3.5 py-1.8 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                    />
                  </div>

                  {/* Gorgeous Easy Multi-Preset Quick Selection Cards */}
                  <div className="space-y-2">
                    <span className="text-[10.5px] uppercase font-bold text-slate-500 block tracking-wider">Or Select Beautiful Category Preset Banners (ক্লিক করে পছন্দ করুন):</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { title: "Admission", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500" },
                        { title: "Job Prep", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" },
                        { title: "SSC/HSC", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500" },
                        { title: "Primary Education", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500" }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCourseCoverImage(preset.image)}
                          className={`relative border rounded-xl overflow-hidden h-14 transition focus:outline-none text-left cursor-pointer ${
                            courseCoverImage === preset.image ? "border-rose-600 ring-2 ring-rose-600/20" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <img src={preset.image} alt={preset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 hover:bg-black/25 flex items-center justify-center p-1.5 transition text-center">
                            <span className="text-[10px] text-white font-black leading-none">{preset.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Side: Render active cover preview */}
                <div className="lg:col-span-4 h-full space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Image Preview</span>
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center justify-center min-h-[175px] text-center shadow-inner">
                    {courseCoverImage ? (
                      <div className="space-y-3 w-full">
                        <img 
                          src={courseCoverImage} 
                          alt="Cover preview" 
                          className="w-full h-24 object-cover rounded-xl shadow-md border border-slate-200" 
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg py-1 px-2.5 inline-block">
                          ✓ Banner Active
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-bold text-xs">No image loaded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Free-form Teacher/Instructor input (REMOVES FIXED TEACHERS LIST LIMIT) */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 block">Instructor / Teacher Name (শিক্ষকদের নাম লিখুন কমা দিয়ে বা সরাসরি)*</label>
                <input
                  type="text"
                  required
                  value={courseInstructor}
                  onChange={(e) => setCourseInstructor(e.target.value)}
                  placeholder="যেমন: Zakir Sir & Success Panel"
                  className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                />
                <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">
                  You can type any teacher card names freely, separated by commas if multiple. Fixed checkboxes are replaced with complete freedom.
                </p>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 block">Short Description*</label>
                <input
                  type="text"
                  required
                  value={courseShortDesc}
                  onChange={(e) => setCourseShortDesc(e.target.value)}
                  placeholder="Short Description"
                  className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                />
              </div>

              {/* Description textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Description</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Description"
                  rows={4}
                  className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                />
              </div>

              {/* Duration and Already Enrolled inline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="Duration (Month)"
                    className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Already Enrolled</label>
                  <input
                    type="number"
                    value={courseAlreadyEnrolled || ""}
                    onChange={(e) => setCourseAlreadyEnrolled(Number(e.target.value) || 0)}
                    placeholder="Already Enrolled"
                    className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Sale Price and Regular Price inline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Sale Price</label>
                  <input
                    type="number"
                    value={courseSalePrice || ""}
                    onChange={(e) => setCourseSalePrice(Number(e.target.value) || 0)}
                    placeholder="Sale Price"
                    className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Regular Price</label>
                  <input
                    type="number"
                    value={courseRegularPrice || ""}
                    onChange={(e) => setCourseRegularPrice(Number(e.target.value) || 0)}
                    placeholder="Regular Price"
                    className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Facebook Group and Telegram Group inline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Facebook Group</label>
                  <input
                    type="text"
                    value={courseFbGroup}
                    onChange={(e) => setCourseFbGroup(e.target.value)}
                    placeholder="Facebook Group Link (optional)"
                    className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Telegram Group</label>
                  <input
                    type="text"
                    value={courseTgGroup}
                    onChange={(e) => setCourseTgGroup(e.target.value)}
                    placeholder="Telegram Group Link (optional)"
                    className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Community checkboxes style */}
              <div className="flex flex-wrap items-center gap-6 pt-2 font-bold text-[13px] text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={communityChecked}
                    onChange={(e) => setCommunityChecked(e.target.checked)}
                    className="w-4.5 h-4.5 text-rose-600 bg-white border-slate-300 rounded focus:ring-rose-500 accent-[#800020]"
                  />
                  <span>Community</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={examChecked}
                    onChange={(e) => setExamChecked(e.target.checked)}
                    className="w-4.5 h-4.5 text-rose-600 bg-white border-slate-300 rounded focus:ring-rose-500 accent-[#800020]"
                  />
                  <span>Exam</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={liveClassChecked}
                    onChange={(e) => setLiveClassChecked(e.target.checked)}
                    className="w-4.5 h-4.5 text-rose-600 bg-white border-slate-300 rounded focus:ring-rose-500 accent-[#800020]"
                  />
                  <span>Live Class</span>
                </label>
              </div>

              {/* Keywords Tag Manager */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Keywords</label>
                <div className="border border-slate-200 rounded-lg p-2.5 bg-white min-h-[46px] flex flex-wrap items-center gap-2">
                  {courseTags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border border-slate-200 shadow-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => setCourseTags(courseTags.filter(t => t !== tag))}
                        className="text-slate-400 hover:text-red-600 transition font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={courseTagInput}
                    onChange={(e) => setCourseTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const cleanVal = courseTagInput.trim().replace(/,/g, "");
                        if (cleanVal && !courseTags.includes(cleanVal)) {
                          setCourseTags([...courseTags, cleanVal]);
                        }
                        setCourseTagInput("");
                      }
                    }}
                    placeholder="Keywords..."
                    className="flex-1 bg-transparent text-slate-800 min-w-[80px] focus:outline-none placeholder-slate-400 font-medium text-xs font-semibold"
                  />
                </div>
                <p className="text-[10.5px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Set keywords for seo. Press Enter or type a comma to add.
                </p>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="submit"
                  className="py-3 px-6 bg-[#8a0329] hover:bg-[#6c021f] text-white font-bold rounded-lg transition-colors cursor-pointer text-xs shadow-md tracking-wide"
                >
                  Create new Course
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMenu("all_courses")}
                  className="py-3 px-5 border border-slate-200 text-slate-500 hover:text-slate-800 bg-white rounded-lg transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ================ ACTIVE CONTENT VIEW 5: CATEGORIES LIST ================ */}
          {activeMenu === "categories" && (
            <div className="space-y-6 animate-fade-in text-xs">
              {/* Header Box */}
              <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0f172a] tracking-tight">Course Categories</h3>
                  <p className="text-slate-500 text-[13px] mt-1 font-medium">Create, Update or organize categories.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryNameInput("");
                    setCategoryImageInput("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500");
                    setCategoryModalOpen(true);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer text-xs shadow-sm shadow-rose-200 transition duration-150 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Grid Layout of Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 text-left">
                {categoriesList.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition duration-200"
                  >
                    {/* Cover image half */}
                    <div className="h-44 w-full relative overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Footer half containing action button */}
                    <div className="p-3.5 flex items-center justify-between bg-slate-50/40">
                      <span className="text-slate-800 font-bold text-[13.5px] truncate pr-2">
                        {lang === "en" ? cat.name : (cat.nameBn || cat.name)}
                      </span>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryNameInput(cat.name);
                            setCategoryImageInput(cat.image);
                            setCategoryModalOpen(true);
                          }}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100/50 border border-slate-200 rounded-lg transition duration-150 cursor-pointer bg-white shadow-xs flex items-center justify-center"
                          title="Edit Category Name & Image"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                              setCategoriesList(categoriesList.filter(item => item.id !== cat.id));
                            }
                          }}
                          className="p-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg transition duration-150 cursor-pointer shadow-xs flex items-center justify-center border border-transparent"
                          title="Delete Category"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Category Popup Overlay Modal */}
              {categoryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] animate-fade-in p-4 text-slate-800">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full p-6 space-y-4 text-left animate-scale-up">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <h4 className="text-base font-bold text-slate-900">
                        {editingCategory ? "Update Category Details" : "Create New Category"}
                      </h4>
                      <button 
                        type="button" 
                        onClick={() => setCategoryModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600 text-lg font-black transition cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>

                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Category Name</label>
                        <input
                          type="text"
                          required
                          value={categoryNameInput}
                          onChange={(e) => setCategoryNameInput(e.target.value)}
                          placeholder="e.g. Primary Prep or Admission Prep"
                          className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium text-xs"
                        />
                      </div>

                      {/* Cover Image Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Banner Cover Image URL</label>
                        <input
                          type="text"
                          required
                          value={categoryImageInput}
                          onChange={(e) => setCategoryImageInput(e.target.value)}
                          placeholder="Paste direct HTTPS cover link"
                          className="w-full px-3.5 py-2.2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-rose-700 bg-white placeholder-slate-400 font-medium text-xs"
                        />
                      </div>

                      {/* Presets Gallery picker */}
                      <div className="space-y-2">
                        <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 block">Custom Theme Pickers</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { name: "Admission", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500" },
                            { name: "Job Prep", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500" },
                            { name: "HSC Wing", url: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=500" },
                            { name: "Exams", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500" },
                            { name: "Books", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500" },
                            { name: "Global Study", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500" }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCategoryImageInput(preset.url)}
                              className={`relative border rounded-xl overflow-hidden h-12 transition focus:outline-none ${
                                categoryImageInput === preset.url ? "border-rose-600 ring-2 ring-rose-600/10" : "border-slate-200 hover:border-slate-300"
                              }`}
                              title={preset.name}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/30 transition">
                                <span className="text-[9.5px] text-white font-extrabold leading-none">{preset.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Preview zone */}
                      {categoryImageInput && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Card Banner Live Preview</span>
                          <div className="border border-slate-200 rounded-xl overflow-hidden h-24 bg-slate-50 flex items-center justify-center">
                            <img 
                              src={categoryImageInput} 
                              alt="Live preview" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500";
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Modal Footer actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setCategoryModalOpen(false)}
                          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition cursor-pointer shadow-sm"
                        >
                          {editingCategory ? "Apply Update" : "Create Category"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================ ACTIVE CONTENT VIEW 6: TEACHERS MANAGEMENT ================ */}
          {activeMenu === "teachers" && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl shadow-lg space-y-4">
                <h3 className="text-sm font-black text-white">Academy Educators Registry</h3>
                <p className="text-[#a3b3cc] mt-0.5">Assigned educators of Success Academy training panels.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-4 bg-[#161a29]/70 border border-slate-800 rounded-2xl flex items-center gap-4">
                    <img
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=zakir"
                      alt="Zakir Cadre"
                      className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900"
                    />
                    <div>
                      <strong className="text-white block text-sm">Professor Zakir Hossain</strong>
                      <span className="text-[10px] text-amber-400 font-mono uppercase block">38th BCS Cadre Cadet</span>
                      <p className="text-slate-500 text-[10px] mt-0.5">Specialized in Bangladesh Affairs & Grammar.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#161a29]/70 border border-slate-800 rounded-2xl flex items-center gap-4">
                    <img
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=monjur"
                      alt="Zakir Cadet"
                      className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900"
                    />
                    <div>
                      <strong className="text-white block text-sm">Dr. Monjurul Karim</strong>
                      <span className="text-[10px] text-blue-400 font-mono block">English Masterclass Instructor</span>
                      <p className="text-slate-500 text-[10px] mt-0.5">General and Advanced English Literature.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================ ACTIVE CONTENT VIEW 7: EXAMS LISITNGS ================ */}
          {activeMenu === "all_exams" && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl shadow-lg space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-white">Live MCQ Mock Exams</h3>
                    <p className="text-slate-400 mt-0.5">Administer or remove compiled mock exams from history.</p>
                  </div>
                  <button
                    onClick={() => setActiveMenu("add_exam")}
                    className="px-3 py-1.5 bg-[#1565c0] text-white font-bold rounded-xl text-xs hover:bg-blue-600 transition"
                  >
                    Add Exam Set +
                  </button>
                </div>

                <div className="space-y-2.5">
                  {exams.map((exam) => (
                    <div key={exam.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#161a29]/60 border border-slate-800 rounded-xl gap-3">
                      <div>
                        <strong className="text-white text-sm">{lang === "en" ? exam.title : exam.titleBn}</strong>
                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono mt-2 font-bold uppercase">
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-500">{exam.category}</span>
                          <span>Difficulty: {exam.difficulty}</span>
                          <span className="text-indigo-400">{exam.questions.length} Questions</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this custom mock exam?")) {
                            onDeleteExam(exam.id);
                          }
                        }}
                        className="p-2 hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:border-rose-500/40 rounded-xl transition cursor-pointer"
                        title="Delete Exam"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================ ACTIVE CONTENT VIEW 8: REGISTER NEW EXAM ================ */}
          {activeMenu === "add_exam" && (
            <form onSubmit={handleCreateExamSubmit} className="bg-[#121422] border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-lg space-y-6 text-xs animate-fade-in text-left">
              <h3 className="text-sm font-black text-white border-b border-slate-800 pb-3">
                {lang === "en" ? "Compile Custom Mock Examination" : "নতুন মক ডিস্ট্রিবিউটর এডিটর"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">Exam Title (ENG)</label>
                  <input
                    type="text"
                    required
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    placeholder="e.g. General Knowledge Booster 05"
                    className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">পরীক্ষার নাম (বাংলা)</label>
                  <input
                    type="text"
                    required
                    value={newExam.titleBn}
                    onChange={(e) => setNewExam({ ...newExam, titleBn: e.target.value })}
                    placeholder="যেমন: সাধারণ জ্ঞান মক বুস্টার গাইড ০৫"
                    className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">Mock Track Category</label>
                  <select
                    value={newExam.category}
                    onChange={(e) => setNewExam({ ...newExam, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white"
                  >
                    <option value="BCS">BCS GK (বিসিএস)</option>
                    <option value="Primary Prep">Primary Prep (প্রাইমারি শিক্ষক)</option>
                    <option value="University Live">University (বিশ্ববিদ্যালয় ভর্তি)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">Difficulty Level</label>
                  <select
                    value={newExam.difficulty}
                    onChange={(e) => setNewExam({ ...newExam, difficulty: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white"
                  >
                    <option value="Easy">Easy / সহজ</option>
                    <option value="Medium">Medium / মাঝারি</option>
                    <option value="Hard">Hard / কঠিন</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">Duration (in Minutes)</label>
                  <select
                    onChange={(e) => setNewExam({ ...newExam, durationMs: Number(e.target.value) * 60 * 1000 })}
                    className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white"
                  >
                    <option value="5">5 Minutes</option>
                    <option value="10">10 Minutes</option>
                    <option value="15" selected>15 Minutes</option>
                    <option value="30">30 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#171b2d] p-4 rounded-xl border border-dashed border-slate-800 text-xs text-left mb-4">
                <span className="font-bold text-slate-400 block mb-1">Assigned Questions Buffer</span>
                <p className="text-slate-500">Currently storing <strong className="text-blue-400 font-mono">{questions.length}</strong> compiled questions. Ensure you review the "Prepare Questions" tab if you want to buffer more.</p>
              </div>

              <button
                type="submit"
                disabled={questions.length === 0}
                className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition tracking-wide cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Compile and Publish Exam
              </button>
            </form>
          )}

          {/* ================ ACTIVE CONTENT VIEW 9: VIEW ACTIVE QUESTIONS POOL ================ */}
          {activeMenu === "view_questions" && (
            <div className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl shadow-lg space-y-4 animate-fade-in text-xs text-left">
              <h3 className="text-sm font-black text-white">Buffered Question Pool ({questions.length} questions loaded)</h3>
              <p className="text-slate-500">Review other question segments assigned to the active custom booster examination.</p>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-[#161a29]/70 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase font-mono">
                      <span>Question #{idx+1}</span>
                      <span className="text-emerald-500">Answer Index: {q.correctAnswerIndex}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{q.questionText}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{q.questionTextBn}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-1.5 rounded ${oIdx === q.correctAnswerIndex ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900/40 text-slate-400'}`}>
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================ ACTIVE CONTENT VIEW 10: PREPARE QUESTIONS BUFFER ================ */}
          {activeMenu === "prepare_questions" && (
            <div className="bg-[#121422] border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-lg space-y-6 text-xs animate-fade-in text-left">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white">Prepare MCQ Question Bank</h3>
                  <p className="text-slate-500 mt-0.5">Inject dynamic individual segments into the active buffer.</p>
                </div>
                <button
                  onClick={() => {
                    setBulkCsvContent("");
                    setBulkImportStatus("");
                    setBulkImportOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#1e233d] hover:bg-[#252a4a] border border-slate-850 hover:border-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Import CSV +
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Question Text (ENG)</label>
                  <input
                    type="text"
                    value={tempQ.questionText}
                    onChange={(e) => setTempQ({ ...tempQ, questionText: e.target.value })}
                    placeholder="e.g. Which layer is closest to Earth's surface?"
                    className="w-full px-3 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">প্রশ্ন টেক্সট (বাংলা)</label>
                  <input
                    type="text"
                    value={tempQ.questionTextBn}
                    onChange={(e) => setTempQ({ ...tempQ, questionTextBn: e.target.value })}
                    placeholder="যেমন: বায়ুমণ্ডলের কোন স্তরটি পৃথিবীর সবচেয়ে কাছে অবস্থিত?"
                    className="w-full px-3 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 pt-2 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#1565c0]">A</span>
                  <input
                    type="text"
                    placeholder="Option A (ENG)"
                    value={tempQ.optionA}
                    onChange={(e) => setTempQ({ ...tempQ, optionA: e.target.value })}
                    className="flex-grow px-3 py-2 bg-[#171b2d] rounded-xl border border-slate-850 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="অপশন ক"
                    value={tempQ.optionABn}
                    onChange={(e) => setTempQ({ ...tempQ, optionABn: e.target.value })}
                    className="w-1/3 px-3 py-2 bg-[#171b2d] rounded-xl border border-slate-850 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#1565c0]">B</span>
                  <input
                    type="text"
                    placeholder="Option B (ENG)"
                    value={tempQ.optionB}
                    onChange={(e) => setTempQ({ ...tempQ, optionB: e.target.value })}
                    className="flex-grow px-3 py-2 bg-[#171b2d] rounded-xl border border-slate-850 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="অপশন খ"
                    value={tempQ.optionBBn}
                    onChange={(e) => setTempQ({ ...tempQ, optionBBn: e.target.value })}
                    className="w-1/3 px-3 py-2 bg-[#171b2d] rounded-xl border border-slate-850 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#1565c0]">C</span>
                  <input
                    type="text"
                    placeholder="Option C (ENG)"
                    value={tempQ.optionC}
                    onChange={(e) => setTempQ({ ...tempQ, optionC: e.target.value })}
                    className="flex-grow px-3 py-2 bg-[#171b2d] rounded-xl border border-slate-850 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="অপশন গ"
                    value={tempQ.optionCBn}
                    onChange={(e) => setTempQ({ ...tempQ, optionCBn: e.target.value })}
                    className="w-1/3 px-3 py-2 bg-[#171b2d] rounded-xl border border-slate-850 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#1565c0]">D</span>
                  <input
                    type="text"
                    placeholder="Option D (ENG)"
                    value={tempQ.optionD}
                    onChange={(e) => setTempQ({ ...tempQ, optionD: e.target.value })}
                    className="flex-grow px-3 py-2 bg-[#171b2d] rounded-xl border border-slate-850 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="অপশন ঘ"
                    value={tempQ.optionDBn}
                    onChange={(e) => setTempQ({ ...tempQ, optionDBn: e.target.value })}
                    className="w-1/3 px-3 py-2 bg-[#171b2d] rounded-xl border border-slate-850 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2 font-bold select-none text-slate-400">
                  <span>Target Correct Option Index:</span>
                  <select
                    value={tempQ.correctAnswerIndex}
                    onChange={(e) => setTempQ({ ...tempQ, correctAnswerIndex: Number(e.target.value) })}
                    className="px-3 py-1 bg-[#171b2d] border border-slate-850 rounded-xl text-white font-extrabold"
                  >
                    <option value="0">Option A (ক)</option>
                    <option value="1">Option B (খ)</option>
                    <option value="2">Option C (গ)</option>
                    <option value="3">Option D (ঘ)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddTempQuestion}
                  className="px-6 py-2.5 bg-[#1565c0] hover:bg-blue-600 text-white font-bold rounded-2xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Question to Buffer</span>
                </button>
              </div>
            </div>
          )}

          {/* ================ ACTIVE CONTENT VIEW 11: SMART PUSH NOTIFICATIONS BROADCASTER ================ */}
          {activeMenu === "notifications" && (
            <div className="bg-[#121422] border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-lg space-y-6 text-xs text-left animate-fade-in">
              <form onSubmit={handleCreateNotificationSubmit} className="space-y-6">
                <h3 className="text-sm font-black text-white border-b border-slate-800 pb-3">
                  {lang === "en" ? "Broadcast Academic Real-Time Alerts" : "স্মার্ট নোটিফিকেশন ব্রডকাস্ট করুন"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">Notification Title (ENG)</label>
                    <input
                      type="text"
                      required
                      value={newNotif.title}
                      onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                      placeholder="e.g. Mega BCS Science Mock Exam is Live!"
                      className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">বার্তা টাইটেল (বাংলা)</label>
                    <input
                      type="text"
                      required
                      value={newNotif.titleBn}
                      onChange={(e) => setNewNotif({ ...newNotif, titleBn: e.target.value })}
                      placeholder="যেমন: প্রাইমারী সহকারী শিক্ষক স্পেশাল মক রিলিজ!"
                      className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">Broadcast Notification Type</label>
                    <select
                      value={newNotif.type}
                      onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white"
                    >
                      <option value="exam">Live Exam alert (পরীক্ষা সতর্কতা)</option>
                      <option value="content">Syllabus update (নতুন টাস্ক বা কন্টেন্ট)</option>
                      <option value="reminder">Advisory Reminder (সাধারণ নোটিস)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">Detailed Message (ENG)</label>
                    <textarea
                      value={newNotif.message}
                      onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="Explain what steps or modules have been added..."
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-black">বিস্তারিত মেসেজ (বাংলা)</label>
                    <textarea
                      value={newNotif.messageBn}
                      onChange={(e) => setNewNotif({ ...newNotif, messageBn: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="শিক্ষার্থীদের উৎসাহিত করতে বিস্তারিত নির্দেশনা প্রদান করুন..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Broadcast Message Alerts</span>
                  </button>
                </div>
              </form>

              {/* Broadcast history index */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <span className="text-xs font-mono font-black uppercase text-slate-500 tracking-wider block">Sent Notifications Registry</span>
                
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 text-xs bg-[#161a29]/30 border border-slate-850 rounded-xl">
                    No notifications recorded in history.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 bg-[#161a29]/60 border border-slate-800 rounded-xl flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-black font-mono ${
                              n.type === "exam" ? "bg-red-500/10 text-red-400 border border-red-500/25" :
                              n.type === "content" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" :
                              "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                            }`}>
                              {n.type}
                            </span>
                            <span className="text-[10px] text-slate-500">{n.date}</span>
                          </div>
                          <h5 className="font-extrabold text-white text-xs mt-2">{lang === "en" ? n.title : n.titleBn}</h5>
                          <p className="text-slate-400 text-[11px] mt-1">{lang === "en" ? n.message : n.messageBn}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteNotification(n.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition shrink-0"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==================== MODAL 1: ADD RAW SUBJECT SETTINGS ==================== */}
      {addSubjectModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in text-xs text-left">
          <div className="bg-[#121422] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-blue-500" />
              <span>Create New Study Subject</span>
            </h3>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Define a new category in the parent LMS database. This becomes instantly selectable during course planning.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] block font-bold text-slate-500 uppercase tracking-widest font-black">Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Bangladesh Liberation War History"
                value={newSubjectValue}
                onChange={(e) => setNewSubjectValue(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3.5 pt-3.5 border-t border-slate-800/80">
              <button
                onClick={() => setAddSubjectModalOpen(false)}
                className="px-4 py-2.5 text-slate-400 font-bold hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitAddSubject}
                className="px-5 py-2.5 bg-[#1565c0] hover:bg-blue-600 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Save Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: BULK CSV IMPORT PANEL ==================== */}
      {bulkImportOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 text-xs text-left">
          <div className="bg-[#121422] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl relative ring-1 ring-slate-800 animate-slide-down">
            
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-500" />
                <span>Bulk Import MCQ Set</span>
              </h3>
              <button
                onClick={() => setBulkImportOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Quickly populate the exam questions database by dropping a CSV file or copying formatted values.
              The format must be strictly ordered: <code className="text-orange-400 font-mono">Question Text, Option A, Option B, Option C, Option D, Correct Option Index (0 to 3)</code>.
            </p>

            {/* DRAG AND DROP AREA GUIDELINES */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                dragActive ? "border-orange-500 bg-orange-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-900/40"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv,text/plain"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCsvFile(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <span className="font-bold text-slate-300 block text-xs">Drag and drop your MCQ CSV outline here</span>
              <span className="text-[10px] text-slate-500 block mt-1">or click to browse manual CSV logs</span>
            </div>

            {/* STATUS OR MANUAL LOG PARSER */}
            {bulkImportStatus && (
              <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl text-[10px] text-emerald-400 font-mono">
                {bulkImportStatus}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] block font-bold text-slate-500 uppercase tracking-widest font-mono">Manual CSV Copy/Paste Content</label>
              <textarea
                rows={4}
                value={bulkCsvContent}
                onChange={(e) => setBulkCsvContent(e.target.value)}
                placeholder="Question text, Option A, Option B, Option C, Option D, correctIndex (0-3)&#10;What is the value of Pi?, 3.14, 2.71, 1.41, 0, 0&#10;Which is the national bird?, Robin, Magpie, Eagle, Parrot, 1"
                className="w-full px-4 py-3 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3.5 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setBulkImportOpen(false)}
                className="px-4 py-2.5 text-slate-400 font-bold hover:text-white transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleBulkImportSubmit}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl transition cursor-pointer shadow-lg shadow-orange-500/10"
              >
                Parse & Import Set
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== MODAL 3: EDIT COURSE MODAL ==================== */}
      {editCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 text-xs text-left overflow-y-auto">
          <div className="bg-[#121422] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-5 shadow-2xl relative ring-1 ring-slate-800 animate-slide-down my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-400" />
                <span>{lang === "en" ? "Edit Course Parameters" : "কোর্সের তথ্য সংশোধন করুন"}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditCourseModalOpen(false);
                  setEditingCourse(null);
                }}
                className="text-[#a3b3cc] hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditCourseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                {/* Course Name */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Course Name</label>
                  <input
                    type="text"
                    required
                    value={editCourseName}
                    onChange={(e) => setEditCourseName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                {/* Direct Image File Upload Zone and URL Row for edit */}
                <div className="space-y-1.5 md:col-span-2 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end bg-[#15192c]/40 p-3 rounded-2xl border border-slate-800/80">
                  <div className="sm:col-span-7 space-y-1.5">
                    <label className="text-[10px] block font-black text-rose-400 uppercase tracking-widest font-mono flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      Direct Picture Upload (সরাসরি পিকচার আপলোড করুন)
                    </label>
                    <div 
                      onDragOver={(e) => {
                        e.preventDefault();
                        setEditImageDrag(true);
                      }}
                      onDragLeave={() => setEditImageDrag(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setEditImageDrag(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleImageUpload(e.dataTransfer.files[0], "edit");
                        }
                      }}
                      onClick={() => document.getElementById("direct-image-upload-edit")?.click()}
                      className={`border border-dashed rounded-xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                        editImageDrag 
                          ? "border-rose-500 bg-rose-500/10" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
                      }`}
                    >
                      <Upload className={`w-4 h-4 mb-0.5 ${editImageDrag ? "text-rose-400 animate-bounce" : "text-slate-500"}`} />
                      <span className="text-[9.5px] font-bold text-slate-300">Click to upload or Drag-drop</span>
                      <input 
                        id="direct-image-upload-edit"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(e.target.files[0], "edit");
                          }
                        }}
                      />
                    </div>
                    
                    {/* Fallback/Custom URL Input */}
                    <input
                      type="text"
                      value={editCourseCoverImage}
                      onChange={(e) => setEditCourseCoverImage(e.target.value)}
                      placeholder="Or paste external image URL (https://...)"
                      className="w-full px-3 py-1.8 bg-[#171b2d] rounded-lg border border-slate-800 text-[11px] text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  {/* Edit Image Preview panel */}
                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Selected Preview</label>
                    <div className="border border-slate-800/80 rounded-xl p-2 bg-[#0e101b] flex flex-col items-center justify-center h-[96px] text-center overflow-hidden">
                      {editCourseCoverImage ? (
                        <div className="w-full h-full flex flex-col justify-between items-center py-0.5">
                          <img 
                            src={editCourseCoverImage} 
                            alt="Course Cover" 
                            className="max-h-[55px] max-w-full object-contain rounded border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[9px] font-mono text-emerald-400 font-bold block">✓ Ready to Save</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 font-mono text-[9px]">No thumbnail loaded</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instructor Name - CUSTOM EDIT INPUT TO FIX REPEATED TEACHERS OR REMOVE THEM */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Instructor / Teachers (শিক্ষকদের নাম সংশোধন) *</label>
                  <input
                    type="text"
                    required
                    value={editCourseInstructor}
                    onChange={(e) => setEditCourseInstructor(e.target.value)}
                    className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
                    placeholder="e.g. Zakir Sir & Success Panel"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Category</label>
                    <div className="relative">
                      <select
                        value={editCourseCategory}
                        onChange={(e) => setEditCourseCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="Admission">Admission</option>
                        <option value="SSC">SSC</option>
                        <option value="HSC">HSC</option>
                        <option value="Job Prep">Job Prep</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Status</label>
                    <div className="relative">
                      <select
                        value={editCourseStatus}
                        onChange={(e) => setEditCourseStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Regular Price & Sale Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Regular Price (Tk)</label>
                    <input
                      type="number"
                      required
                      value={editCourseRegularPrice}
                      onChange={(e) => setEditCourseRegularPrice(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Sale Price (Tk)</label>
                    <input
                      type="number"
                      required
                      value={editCourseSalePrice}
                      onChange={(e) => setEditCourseSalePrice(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Duration & Hand-picked Already Enrolled */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Duration (Months)</label>
                    <input
                      type="text"
                      required
                      value={editCourseDuration}
                      onChange={(e) => setEditCourseDuration(e.target.value)}
                      className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Simulated Enrollments</label>
                    <input
                      type="number"
                      required
                      value={editCourseAlreadyEnrolled}
                      onChange={(e) => setEditCourseAlreadyEnrolled(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Community Facebook & Telegram Group Link */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Facebook Group URL</label>
                    <input
                      type="text"
                      value={editCourseFbGroup}
                      onChange={(e) => setEditCourseFbGroup(e.target.value)}
                      className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
                      placeholder="e.g. facebook.com/groups/..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Telegram Chat URL</label>
                    <input
                      type="text"
                      value={editCourseTgGroup}
                      onChange={(e) => setEditCourseTgGroup(e.target.value)}
                      className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
                      placeholder="e.g. t.me/..."
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox toggles */}
              <div className="space-y-1.5">
                <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Platform Integration Enablers</label>
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300 hover:text-white transition">
                    <input
                      type="checkbox"
                      checked={editCommunityChecked}
                      onChange={(e) => setEditCommunityChecked(e.target.checked)}
                      className="rounded accent-indigo-500 text-indigo-500"
                    />
                    <span>Chat Room</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300 hover:text-white transition">
                    <input
                      type="checkbox"
                      checked={editExamChecked}
                      onChange={(e) => setEditExamChecked(e.target.checked)}
                      className="rounded accent-indigo-500 text-indigo-500"
                    />
                    <span>MCQ Exams</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300 hover:text-white transition">
                    <input
                      type="checkbox"
                      checked={editLiveClassChecked}
                      onChange={(e) => setEditLiveClassChecked(e.target.checked)}
                      className="rounded accent-indigo-500 text-indigo-500"
                    />
                    <span>Live Classes</span>
                  </label>
                </div>
              </div>

              {/* Course Short & Detailed Description */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Short Headline Description</label>
                <input
                  type="text"
                  value={editCourseShortDesc}
                  onChange={(e) => setEditCourseShortDesc(e.target.value)}
                  placeholder="e.g. সম্পূর্ণ সিলেবাস কভারিং মাস্টারক্লাস কুইকরান ব্যাচ।"
                  className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Long Markdown Syllabus Description</label>
                <textarea
                  rows={4}
                  value={editCourseDescription}
                  onChange={(e) => setEditCourseDescription(e.target.value)}
                  placeholder="Insert complete details about course content, milestones, etc."
                  className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* Course Syllabus outline */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest font-mono">Course Syllabus Milestones (One line per item)</label>
                <textarea
                  rows={4}
                  value={editCourseSyllabusInput}
                  onChange={(e) => setEditCourseSyllabusInput(e.target.value)}
                  placeholder="Syllabus line 1&#10;Syllabus line 2&#10;Syllabus line 3"
                  className="w-full px-4 py-2 bg-[#171b2d] rounded-xl border border-slate-800 text-xs text-white font-mono placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setEditCourseModalOpen(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 text-slate-400 font-bold hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-blue-600 text-white font-bold rounded-xl transition cursor-pointer shadow-lg"
                >
                  Save Modifications
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==================== MODAL 4: COURSE ENROLLED STUDENTS INSPECTOR ==================== */}
      {studentsModalOpen && viewingStudentsCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 text-xs text-left overflow-y-auto">
          <div className="bg-[#121422] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full space-y-5 shadow-2xl relative ring-1 ring-slate-800 animate-slide-down my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    <span>{lang === "en" ? "Course Registered Learners" : "কোর্সে নিবন্ধিত শিক্ষার্থীদের তালিকা"}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-md">
                    {lang === "en" ? viewingStudentsCourse.title : viewingStudentsCourse.titleBn}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStudentsModalOpen(false);
                  setViewingStudentsCourse(null);
                }}
                className="text-[#a3b3cc] hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* MANUAL REGISTRATION ACCORDION / BOX */}
            <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-3 font-sans">
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === "en" ? "Register Student Manually" : "ম্যানুয়ালি নতুন শিক্ষার্থী এনরোল করুন"}</span>
              </h4>

              <form onSubmit={handleManualRegisterStudent} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Md. Sajidul"
                    className="w-full px-3 py-1.5 bg-[#171b2d] rounded-lg border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none font-medium text-left"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="sajidul@gmail.com"
                    className="w-full px-3 py-1.5 bg-[#171b2d] rounded-lg border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-bold">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-1.5 bg-[#171b2d] rounded-lg border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 block font-bold">Payment Status</label>
                    <select
                      value={newStudentPayment}
                      onChange={(e) => setNewStudentPayment(e.target.value as "paid" | "pending")}
                      className="w-full h-8 px-2 bg-[#171b2d] rounded-lg border border-slate-800 text-xs text-white focus:outline-none appearance-none font-bold"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full px-3 py-1.5 bg-[#1565c0] hover:bg-blue-600 text-white font-bold rounded-lg transition text-xs cursor-pointer flex items-center justify-center gap-1 h-8 shadow"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{lang === "en" ? "Register" : "যোগ করুন"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* REGISTERED STUDENTS LIST */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              <h4 className="font-bold text-slate-400 block text-[10px] uppercase tracking-wider font-mono">
                {lang === "en" ? `Enrollments Directory (${enrolledStudentsList.length} total)` : `লাইভ এনরোলমেন্ট ডাটাবেজ (মোট ${enrolledStudentsList.length} জন)`}
              </h4>

              {enrolledStudentsList.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-900/10 border border-slate-850 rounded-2xl font-mono text-xs">
                  {lang === "en" ? "No students enrolled in this course yet." : "এই কোর্সে এখনও কোন শিক্ষার্থী নথিভুক্ত হয়নি।"}
                </div>
              ) : (
                <div className="space-y-2.5 font-sans">
                  {enrolledStudentsList.map((student) => (
                    <div
                      key={student.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#161a29]/60 border border-slate-850 rounded-2xl gap-3 text-xs"
                    >
                      {/* Left: Avatar initial, details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-black flex-shrink-0 text-xs">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-white text-xs truncate leading-snug">
                            {student.name}
                          </h5>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-500 font-mono mt-0.5">
                            <span className="flex items-center gap-0.5 text-slate-400">
                              <Mail className="w-3 h-3 text-slate-600 shrink-0" />
                              <span className="truncate">{student.email}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-slate-400">
                              <Phone className="w-3 h-3 text-slate-600 shrink-0" />
                              <span>{student.phone}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions, Badges */}
                      <div className="flex items-center gap-3 flex-shrink-0 justify-between sm:justify-end border-t sm:border-t-0 border-slate-850 pt-2 sm:pt-0">
                        {/* Enroll date */}
                        <div className="text-[10px] text-slate-500 font-mono text-right hidden md:block">
                          <span className="block text-slate-600 font-black text-[9px] uppercase tracking-wide">Enroll Date</span>
                          <span className="block mt-0.5">{student.enrolledDate || "Jun 18, 2026"}</span>
                        </div>

                        {/* Payment Toggle Badge */}
                        <button
                          type="button"
                          onClick={() => handleToggleStudentPayment(student.id)}
                          className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase transition cursor-pointer border ${
                            student.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15"
                              : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/15"
                          }`}
                        >
                          {student.paymentStatus === "paid" ? "Paid (Tk. 399)" : "Pending"}
                        </button>

                        {/* Status Toggle Badge */}
                        <button
                          type="button"
                          onClick={() => handleToggleStudentStatus(student.id)}
                          className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase transition cursor-pointer border ${
                            student.status === "active"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/15"
                              : "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/15"
                          }`}
                        >
                          {student.status === "active" ? "Active" : "Suspended"}
                        </button>

                        {/* Delete Registration */}
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-1 px-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg border border-transparent hover:border-slate-800 transition cursor-pointer"
                          title="Cancel Registration"
                        >
                          ✕
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Back to admin board */}
            <div className="flex justify-end pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setStudentsModalOpen(false);
                  setViewingStudentsCourse(null);
                }}
                className="px-5 py-2.5 bg-[#1b1e36] hover:bg-slate-800 text-slate-300 hover:text-white font-bold rounded-xl transition cursor-pointer"
              >
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
