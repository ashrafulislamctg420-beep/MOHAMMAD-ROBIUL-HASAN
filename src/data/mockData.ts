import { Course, Exam, LeaderboardEntry } from "../types";

export const initialCourses: Course[] = [
  {
    id: "course-dcu-20days",
    title: "DCU 20 Days Challenge B Unit Class + Exam Batch",
    titleBn: "ডিসিইউ ২০ ডেস চ্যালেঞ্জ বি ইউনিট ক্লাস + এক্সাম ব্যাচ",
    description: "Prepare strategically for DCU admission within 20 days with premium tutorials and daily tests.",
    descriptionBn: "২০ দিনে ডিসিইউ বি ইউনিটের সম্পূর্ণ প্রস্তুতি নিশ্চিত করতে ডিজাইনকৃত সেরা ক্লাস ও এক্সাম প্যাক।",
    instructor: "Zakir Sir & Success Team",
    lessonsCount: 20,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    enrolled: false,
    category: "Admission Prep",
    syllabus: [
      "Day 1 - English Grammar Hacks",
      "Day 2 - Bangla Literature Core",
      "Day 3 - General Knowledge Booster",
      "Day 4 - Live Practice Session"
    ],
    regularPrice: 1000,
    salePrice: 399
  },
  {
    id: "course-hsc-free",
    title: "HSC Free Course & Final Suggestion",
    titleBn: "এইচএসসি ফ্রি কোর্স এবং ফাইনাল সাজেশন",
    description: "Completely free masterclass sessions along with exclusive last minute suggestions for HSC candidates.",
    descriptionBn: "এইচএসসি পরীক্ষার্থীদের জন্য সম্পূর্ণ ফ্রি স্পেশাল কোর্স এবং শেষ মুহূর্তের হট সাজেশন।",
    instructor: "Success Academy Panel",
    lessonsCount: 10,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    enrolled: false,
    category: "HSC",
    syllabus: [
      "Physics MCQ Hacks",
      "Chemistry Formula Booster",
      "Higher Math Tricks"
    ],
    regularPrice: 0,
    salePrice: 0
  },
  {
    id: "course-2ndtier-c",
    title: "2nd Timer C Unit Exam Batch",
    titleBn: "২য় বার ভর্তি পরীক্ষার্থী সি ইউনিট এক্সাম ব্যাচ",
    description: "Special dedicated mock test preparation batch tailored specifically for 2nd time C unit applicants.",
    descriptionBn: "২য় বার শিক্ষার্থীদের জন্য ঢাবির সি ইউনিট বিজনেস ফাইটার্স এক্সাম ব্যাচ।",
    instructor: "Sajid Ahmed, CPA",
    lessonsCount: 15,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    enrolled: false,
    category: "Admission",
    syllabus: [
      "Accounting Essentials",
      "Business Organization Concepts",
      "Management Hacks"
    ],
    regularPrice: 500,
    salePrice: 250
  },
  {
    id: "course-2ndtier-bd",
    title: "2nd Timer B+D Unit Exam Batch",
    titleBn: "২য় বার ভর্তি পরীক্ষার্থী বি+ডি ইউনিট এক্সাম ব্যাচ",
    description: "Advanced level MCQ solver modules for prospective arts and social science students.",
    descriptionBn: "২য় বার বি ও ডি ইউনিটের পরীক্ষার্থীদের জন্য মানসম্মত এক্সাম সিরিজ ও সেলফ টেস্ট।",
    instructor: "Tahmid Hasan",
    lessonsCount: 25,
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    enrolled: false,
    category: "Admission",
    syllabus: [
      "English Common Mistakes",
      "Bangla Fast Track MCQ",
      "GK Special World Affairs"
    ],
    regularPrice: 500,
    salePrice: 299
  },
  {
    id: "course-cuc-2nd",
    title: "CUC UNIT 2ND TIMER BATCH",
    titleBn: "সিইউসি ইউনিট ২য় বার স্পেশাল ব্যাচ",
    description: "Targeted preparation suite for Chittagong University admission aspirants of 2nd time attempt.",
    descriptionBn: "চট্টগ্রাম বিশ্ববিদ্যালয়ের কস্ট-ইফেক্টিভ এ ও বি ইউনিট এক্সাম রেডি কোর্স।",
    instructor: "Professor Arif Chowdhury",
    lessonsCount: 30,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    enrolled: false,
    category: "Admission",
    syllabus: [
      "CU Special GK",
      "Grammar Rule Compilation",
      "Analytical Ability Practice"
    ],
    regularPrice: 1000,
    salePrice: 499
  }
];

export const examsData: Exam[] = [
  {
    id: "exam-bcs-gk",
    title: "BCS Bangladesh Affairs Mega Mock Test (20 MCQs)",
    titleBn: "বিসিএস বাংলাদেশ বিষয়াবলি মেগা মক টেস্ট (২০টি এমসিকিউ)",
    category: "BCS GK",
    categoryBn: "বিসিএস সাধারণ জ্ঞান",
    durationMs: 15 * 60 * 1000, // 15 minutes
    difficulty: "Medium",
    questions: [
      {
        id: "bcs-q1",
        questionText: "What is the official name of Bangladesh according to the Constitution?",
        questionTextBn: "সংবিধান অনুযায়ী বাংলাদেশের রাষ্ট্রীয় সরকারি নাম কী?",
        options: [
          "Republic of Bangladesh",
          "People's Republic of Bangladesh",
          "Democratic People's Republic of Bangladesh",
          "Government of Bangladesh"
        ],
        optionsBn: [
          "বাংলাদেশ প্রজাতন্ত্র",
          "গণপ্রজাতন্ত্রী বাংলাদেশ",
          "গণতান্ত্রিক বাংলাদেশ প্রজাতন্ত্র",
          "বাংলাদেশ সরকার"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "bcs-q2",
        questionText: "Which is the highest peak in Bangladesh?",
        questionTextBn: "বাংলাদেশের সর্বোচ্চ পর্বতশৃঙ্গ কোনটি?",
        options: [
          "Saka Haphong",
          "Keokradong",
          "Tazing Dong",
          "Mowdok Mual"
        ],
        optionsBn: [
          "সাকা হাফং",
          "কেওক্রাডং",
          "তাজিং ডং (বিজয়)",
          "মওদক মুয়াল"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q3",
        questionText: "Which sector contributed the most to Bangladesh's GDP historically?",
        questionTextBn: "বাংলাদেশের জিডিপিতে ঐতিহাসিক অনুযায়ী সবচেয়ে বেশি অবদান রয়েছে কোন খাতের?",
        options: [
          "Agriculture",
          "Manufacturing Sector",
          "Services",
          "Remittances"
        ],
        optionsBn: [
          "কৃষি খাত",
          "শিল্প খাত",
          "সেবা খাত",
          "প্রবাসী আয় (রেমিট্যান্স)"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q4",
        questionText: "In which year was the historic Six-Point Demand placed by Bangabandhu Sheikh Mujibur Rahman?",
        questionTextBn: "বঙ্গবন্ধু শেখ মুজিবুর রহমান কত সালে ঐতিহাসিক ৬-দফা দাবি উত্থাপন করেন?",
        options: [
          "1964",
          "1965",
          "1966",
          "1969"
        ],
        optionsBn: [
          "১৯৬৪ সালে",
          "১৯৬৫ সালে",
          "১৯৬৬ সালে",
          "১৯৬৯ সালে"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q5",
        questionText: "Which unique mangrove forest of Bangladesh is recognized as a UNESCO World Heritage site?",
        questionTextBn: "বাংলাদেশের কোন অনন্য ম্যানগ্রোভ বন ইউনেস্কো কর্তৃক বিশ্ব ঐতিহ্যবাহী স্থান হিসেবে স্বীকৃত?",
        options: [
          "Bhawal National Park",
          "Sunderbans",
          "Ratargul Swamp Forest",
          "Srimangal Rain Forest"
        ],
        optionsBn: [
          "ভাওয়াল জাতীয় উদ্যান",
          "সুন্দরবন",
          "রাতারগুল জলাবন",
          "শ্রীমঙ্গল চিরহরিৎ বন"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "bcs-q6",
        questionText: "Who was the first President of Bangladesh?",
        questionTextBn: "বাংলাদেশের প্রথম রাষ্ট্রপতি কে ছিলেন?",
        options: [
          "Tajuddin Ahmad",
          "Syed Nazrul Islam",
          "Bangabandhu Sheikh Mujibur Rahman",
          "Ziaur Rahman"
        ],
        optionsBn: [
          "তাজউদ্দীন আহমদ",
          "সৈয়দ নজরুল ইসলাম",
          "বঙ্গবন্ধু শেখ মুজিবুর রহমান",
          "জিয়াউর রহমান"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q7",
        questionText: "What is the name of the official currency of Bangladesh?",
        questionTextBn: "বাংলাদেশের রাষ্ট্রীয় মুদ্রার নাম কী?",
        options: [
          "Rupee",
          "Taka",
          "Dollar",
          "Riyal"
        ],
        optionsBn: [
          "রুপি",
          "টাকা",
          "ডলার",
          "রিয়াল"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "bcs-q8",
        questionText: "Which is the longest or most volumetric river in Bangladesh?",
        questionTextBn: "বাংলাদেশের দীর্ঘতম বা সবচেয়ে বেশি পানিপ্রবাহ সম্পন্ন নদী কোনটি?",
        options: [
          "Padma",
          "Jamuna",
          "Meghna",
          "Karnafuli"
        ],
        optionsBn: [
          "পদ্মা",
          "যমুনা",
          "মেঘনা",
          "কর্ণফুলী"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q9",
        questionText: "What is the name of the central bank of Bangladesh?",
        questionTextBn: "বাংলাদেশের কেন্দ্রীয় ব্যাংকের নাম কী?",
        options: [
          "State Bank of Bangladesh",
          "National Bank of Bangladesh",
          "Bangladesh Bank",
          "Central Bank of Dhaka"
        ],
        optionsBn: [
          "স্টেট ব্যাংক অব বাংলাদেশ",
          "ন্যাশনাল ব্যাংক অব বাংলাদেশ",
          "বাংলাদেশ ব্যাংক",
          "সেন্ট্রাল ব্যাংক অব ঢাকা"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q10",
        questionText: "What is the national flower of Bangladesh?",
        questionTextBn: "বাংলাদেশের জাতীয় ফুল কোনটি?",
        options: [
          "Rose",
          "Water Lily (Shapla)",
          "Marigold",
          "Lotus"
        ],
        optionsBn: [
          "গোলাপ",
          "সাদা শাপলা",
          "গেন্দা ফুল",
          "পদ্ম"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "bcs-q11",
        questionText: "On which date is Bangladesh's Independence Day celebrated?",
        questionTextBn: "বাংলাদেশের স্বাধীনতা দিবস কোন তারিখে উদযাপন করা হয়?",
        options: [
          "16th December",
          "21st February",
          "26th March",
          "14th April"
        ],
        optionsBn: [
          "১৬ই ডিসেম্বর",
          "২১শে ফেব্রুয়ারি",
          "২৬শে মার্চ",
          "১৪ই এপ্রিল"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q12",
        questionText: "On which date is Bangladesh's Victory Day celebrated?",
        questionTextBn: "বাংলাদেশের বিজয় দিবস কোন তারিখে উদযাপন করা হয়?",
        options: [
          "26th March",
          "16th December",
          "17th April",
          "15th August"
        ],
        optionsBn: [
          "২৬শে মার্চ",
          "১৬ই ডিসেম্বর",
          "১৭ই এপ্রিল",
          "১৫ই আগস্ট"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "bcs-q13",
        questionText: "Which event is celebrated globally as International Mother Language Day?",
        questionTextBn: "কোন ঘটনাটি বিশ্বব্যাপী আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে পালিত হয়?",
        options: [
          "26th March (Independence Day)",
          "16th December (Victory Day)",
          "21st February (Language Martyrs Day)",
          "15th August (National Mourning Day)"
        ],
        optionsBn: [
          "২৬শে মার্চ (স্বাধীনতা দিবস)",
          "১৬ই ডিসেম্বর (বিজয় দিবস)",
          "২১শে ফেব্রুয়ারি (শহীদ দিবস)",
          "১৫ই আগস্ট (জাতীয় শোক দিবস)"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q14",
        questionText: "Who is the National Poet of Bangladesh?",
        questionTextBn: "বাংলাদেশের জাতীয় কবি কে?",
        options: [
          "Rabindranath Tagore",
          "Kazi Nazrul Islam",
          "Jasimuddin",
          "Jibanananda Das"
        ],
        optionsBn: [
          "রবীন্দ্রনাথ ঠাকুর",
          "কাজী নজরুল ইসলাম",
          "জসীমউদ্দীন",
          "জীবনানন্দ দাশ"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "bcs-q15",
        questionText: "What was the duration of the historic Bangladesh Liberation War?",
        questionTextBn: "ঐতিহাসিক বাংলাদেশের মহান মুক্তিযুদ্ধের সময়কাল কত মাস ছিল?",
        options: [
          "3 months",
          "6 months",
          "9 months",
          "12 months"
        ],
        optionsBn: [
          "৩ মাস",
          "৬ মাস",
          "৯ মাস",
          "১২ মাস"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q16",
        questionText: "Which city is the administrative and political capital of Bangladesh?",
        questionTextBn: "কোন শহরটি বাংলাদেশের প্রশাসনিক ও রাজনৈতিক রাজধানী?",
        options: [
          "Chattogram",
          "Dhaka",
          "Sylhet",
          "Khulna"
        ],
        optionsBn: [
          "চট্টগ্রাম",
          "ঢাকা",
          "সিলেট",
          "খুলনা"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "bcs-q17",
        questionText: "Which is the largest continuous mangrove forest in the world located in Bangladesh?",
        questionTextBn: "বাংলাদেশে অবস্থিত বিশ্বের বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন কোনটি?",
        options: [
          "Sundarbans",
          "Amazon",
          "Ratargul",
          "Madhupur Forest"
        ],
        optionsBn: [
          "সুন্দরবন",
          "আমাজন",
          "রাতারগুল",
          "মধুপুর প্রান্তর"
        ],
        correctAnswerIndex: 0
      },
      {
        id: "bcs-q18",
        questionText: "When did the Constitution of the People's Republic of Bangladesh come into effect?",
        questionTextBn: "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান কত তারিখ থেকে কার্যকর হয়?",
        options: [
          "16th December 1971",
          "26th March 1972",
          "16th December 1972",
          "17th April 1972"
        ],
        optionsBn: [
          "১৬ই ডিসেম্বর ১৯৭১",
          "২৬শে মার্চ ১৯৭২",
          "১৬ই ডিসেম্বর ১৯৭২",
          "১৭ই এপ্রিল ১৯৭২"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "bcs-q19",
        questionText: "Who was the first Prime Minister of Bangladesh during the 1971 wartime government?",
        questionTextBn: "১৯৭১ সালের যুদ্ধকালীন প্রবাসী সরকারের প্রথম প্রধানমন্ত্রী কে ছিলেন?",
        options: [
          "M. Mansur Ali",
          "Tajuddin Ahmad",
          "A. H. M. Qamaruzzaman",
          "Khandaker Mostaq Ahmad"
        ],
        optionsBn: [
          "এম মনসুর আলী",
          "তাজউদ্দীন আহমদ",
          "এ এইচ এম কামারুজ্জামান",
          "খন্দকার মোশতাক আহমদ"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "bcs-q20",
        questionText: "Which is the national bird of Bangladesh?",
        questionTextBn: "বাংলাদেশের জাতীয় পাখি কোনটি?",
        options: [
          "House Sparrow",
          "Magpie Robin (Doyel)",
          "Common Myna",
          "Black Drongo"
        ],
        optionsBn: [
          "চড়ুই পাখি",
          "দোয়েল পাখি",
          "শালিক পাখি",
          "ফিঙে পাখি"
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: "exam-web-css",
    title: "Responsive Web & CSS Layout Challenge",
    titleBn: "রেসপনসিভ ওয়েব ও সিএসএস লেআউট কুইজ",
    category: "Web Coding",
    categoryBn: "ওয়েব কোডিং",
    durationMs: 2 * 60 * 1000, // 2 minutes
    difficulty: "Easy",
    questions: [
      {
        id: "css-q1",
        questionText: "Which CSS layout module aligns items in columns and/or rows dynamically?",
        questionTextBn: "কলাম এবং সারিতে আইটেমগুলোকে পরিবর্তনশীল উপায়ে সাজাতে কোন সিএসএস লেআউট ব্যবহার করা হয়?",
        options: [
          "Standard Floats",
          "Absolute Positioning Block",
          "CSS Grid Layout",
          "Table Cells Mode"
        ],
        optionsBn: [
          "স্ট্যান্ডার্ড ফ্লোট",
          "অ্যাবসলিউট পজিশনিং",
          "সিএসএস গ্রিড লেআউট",
          "টেবিল সেলস মোড"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "css-q2",
        questionText: "What does responsive designs prioritize according to modern layout guidelines?",
        questionTextBn: "আধুনিক গাইডলাইন অনুযায়ী রেসপনসিভ ডিজাইনে কোনটি সবচেয়ে বেশি গুরুত্ব পায়?",
        options: [
          "Fixed desktop-only spacing",
          "Adapting neatly on any device screen size",
          "Extensive JavaScript state updates",
          "High resolution full-page background images"
        ],
        optionsBn: [
          "স্থির ডেস্কটপ-অনলি স্পেসিং",
          "যেকোনো ডিভাইসের স্ক্রিন সাইজে মানানসই অ্যাডাপ্টেশন",
          "অতিরিক্ত জাভাস্ক্রিপ্ট স্টেট আপডেট",
          "হাই রেজোলিউশন ফুল-পেজ ব্যাকগ্রাউন্ড ছবি"
        ],
        correctAnswerIndex: 1
      },
      {
        id: "css-q3",
        questionText: "What is the equivalent breakpoint configuration prefix for mobile devices in Tailwind?",
        questionTextBn: "টেলউইন্ড সিএসএস-এ মোবাইলের জন্য ডিফল্ট ব্রেকপয়েন্ট প্রিফিক্স কোনটি?",
        options: [
          "No prefix needed (mobile-first approach)",
          "xs:",
          "sm:",
          "md:"
        ],
        optionsBn: [
          "কোনো পূর্বনির্ধারিত প্রিফিক্স প্রয়োজন নেই (মোবাইল-ফাস্ট পদ্ধতি)",
          "xs:",
          "sm:",
          "md:"
        ],
        correctAnswerIndex: 0
      }
    ]
  },
  {
    id: "exam-general-sci",
    title: "HSC Physics Standard Gravitation Board MCQs",
    titleBn: "এইচএসসি মহাকর্ষ ও অভিকর্ষ স্ট্যান্ডার্ড এমসিকিউ",
    category: "Physics HSC",
    categoryBn: "এইচএসসি পদার্থবিজ্ঞান",
    durationMs: 4 * 60 * 1000, // 4 minutes
    difficulty: "Hard",
    questions: [
      {
        id: "sci-q1",
        questionText: "Where is the acceleration due to gravity (g) maximum on Earth?",
        questionTextBn: "পৃথিবীর কোথায় অভিকর্ষজ ত্বরণ (g)-এর মান সর্বোচ্চ?",
        options: [
          "At the center of Earth",
          "At the equator line",
          "At the poles of Earth",
          "At an altitude equal to half Earth's radius"
        ],
        optionsBn: [
          "পৃথিবীর কেন্দ্রে",
          "নিরক্ষরেখায়",
          "মেরু অঞ্চলে (পোলসে)",
          "পৃথিবীর ব্যাসার্ধের অর্ধেক উচ্চতায়"
        ],
        correctAnswerIndex: 2
      },
      {
        id: "sci-q2",
        questionText: "What is the escape velocity of any object launched from Earth surface?",
        questionTextBn: "ভূপৃষ্ঠ থেকে যেকোনো বস্তুর মুক্তিবেগ (Escape Velocity) কত?",
        options: [
          "9.8 km/s",
          "11.2 km/s",
          "7.9 km/s",
          "15.0 km/s"
        ],
        optionsBn: [
          "৯.৮ কিমি/সেকেন্ড",
          "১১.২ কিমি/সেকেন্ড",
          "৭.৯ কিমি/সেকেন্ড",
          "১৫.০ কিমি/সেকেন্ড"
        ],
        correctAnswerIndex: 1
      }
    ]
  }
];

export const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Sajid Rahman", studentId: "TSA-992", examsCompleted: 15, averageScorePercentage: 98 },
  { rank: 2, name: "Sadia Chowdhury", studentId: "TSA-875", examsCompleted: 14, averageScorePercentage: 96 },
  { rank: 3, name: "Tanvir Ahmed", studentId: "TSA-644", examsCompleted: 12, averageScorePercentage: 95 },
  { rank: 4, name: "Nusrat Jahan", studentId: "TSA-559", examsCompleted: 10, averageScorePercentage: 92 },
  { rank: 5, name: "Ashraful Islam (You)", studentId: "TSA-007", examsCompleted: 8, averageScorePercentage: 89, isCurrentUser: true },
  { rank: 6, name: "Imran Khan", studentId: "TSA-201", examsCompleted: 7, averageScorePercentage: 84 },
  { rank: 7, name: "Tamanna Yasmin", studentId: "TSA-312", examsCompleted: 6, averageScorePercentage: 81 }
];
