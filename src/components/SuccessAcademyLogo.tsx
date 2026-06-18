import React from "react";

interface LogoProps {
  className?: string;
  size?: number | string;
  variant?: "full" | "icon" | "badge";
}

export default function SuccessAcademyLogo({
  className = "",
  size = 48,
  variant = "full"
}: LogoProps) {
  // Deep Navy: #061e43, Warm Gold: #c79e34
  const navy = "#061e43";
  const gold = "#c79e34";

  if (variant === "icon") {
    // Return only the graphical emblem (Graduation cap, student reaching for star, open book)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Open Book Base */}
        <path
          d="M15 88C35 84 50 88 60 96C70 88 85 84 105 88"
          stroke={navy}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 95C37 91 50 94 60 100C70 94 83 91 101 95"
          stroke={gold}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Human Figure (Student) Reaching Up */}
        <path
          d="M51 68C48 64 54 58 59 62C69 70 78 57 82 48"
          stroke={navy}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <circle cx="68" cy="54" r="5.5" fill={navy} />

        {/* Swooping path to the Star */}
        <path
          d="M60 78C72 74 80 62 84 42C86 34 88 28 89 22"
          stroke={gold}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Golden Star at the top right */}
        <path
          d="M89 10L92.2 16.5L99.4 17.5L94.2 22.6L95.4 29.8L89 26.4L82.6 29.8L83.8 22.6L78.6 17.5L85.8 16.5L89 10Z"
          fill={gold}
        />

        {/* Graduation Cap (Mortarboard) */}
        <g transform="translate(32, 22)">
          {/* Cap Diamond */}
          <path
            d="M24 6L44 14L24 22L4 14L24 6Z"
            fill={navy}
            stroke={navy}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Cap Base under-block */}
          <path
            d="M12 17.5V23.5C12 26 16.5 28 24 28C31.5 28 36 26 36 23.5V17.5"
            fill={navy}
          />
          {/* Tassel */}
          <path
            d="M7 15.5V28.5L5.5 31.5L4 28.5V15.5"
            stroke={navy}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  if (variant === "badge") {
    // Just the emblem in a premium rounded circular card
    return (
      <div className={`relative flex items-center justify-center rounded-full bg-white border-2 border-slate-100 shadow-md ${className}`} style={{ width: size, height: size }}>
        <SuccessAcademyLogo variant="icon" size="75%" />
      </div>
    );
  }

  // "full" - Complete original professional circular logo layout with "THE SUCCESS ACADEMY" typography
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Circle Ring */}
      <circle cx="100" cy="100" r="97.5" stroke={navy} strokeWidth="5" fill="white" />
      
      {/* 1. Open Book at the center */}
      <g transform="translate(0, -6)">
        {/* Book pages */}
        <path
          d="M50 102C74 97 90 102 100 110C110 102 126 97 150 102"
          stroke={navy}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M54 108C78 103 91 106 100 113.5C109 106 122 103 146 108"
          stroke={gold}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Human Figure (Student) Reaching Up */}
        <path
          d="M87 81C84 76 91 69 97 74C109 84 120 68 124 57"
          stroke={navy}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="111" cy="64" r="6" fill={navy} />

        {/* Swooping path to the Star */}
        <path
          d="M93 92C111 88 122 74 128 50C130 40 132 30 134 23"
          stroke={gold}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Golden Star at the top right */}
        <path
          d="M134 11L137.8 18.5L146 19.7L140 25.5L141.4 33.7L134 29.8L126.6 33.7L128 25.5L122 19.7L130.2 18.5L134 11Z"
          fill={gold}
        />

        {/* Graduation Cap (Mortarboard) */}
        <g transform="translate(68, 27)">
          {/* Cap Diamond */}
          <path
            d="M26 6L47 14L26 22L5 14L26 6Z"
            fill={navy}
            stroke={navy}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Cap Base */}
          <path
            d="M13 17.5V23C13 25.5 18 27.5 26 27.5C34 27.5 39 25.5 39 23V17.5"
            fill={navy}
          />
          {/* Tassel */}
          <path
            d="M8 15.5V29.5L6.5 32.5L5 29.5V15.5"
            stroke={navy}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* 2. TEXT SECTION (Beautiful classic serif style matching the brand logo) */}
      
      {/* "THE" with flanking thin horizontal lines */}
      <line x1="48" y1="120" x2="78" y2="120" stroke={navy} strokeWidth="1" />
      <text
        x="100"
        y="124"
        fontFamily="Times New Roman, Georgia, serif"
        fontSize="12"
        fontWeight="800"
        fill={navy}
        textAnchor="middle"
        letterSpacing="2"
      >
        THE
      </text>
      <line x1="122" y1="120" x2="152" y2="120" stroke={navy} strokeWidth="1" />

      {/* "SUCCESS" - curved/styled big serif letters */}
      <text
        x="100"
        y="150"
        fontFamily="Times New Roman, Georgia, serif"
        fontSize="21"
        fontWeight="900"
        fill={navy}
        textAnchor="middle"
        letterSpacing="1"
      >
        SUCCESS
      </text>

      {/* "ACADEMY" - gold elegance */}
      <text
        x="100"
        y="166"
        fontFamily="Times New Roman, Georgia, serif"
        fontSize="12.5"
        fontWeight="bold"
        fill={gold}
        textAnchor="middle"
        letterSpacing="4"
      >
        ACADEMY
      </text>

      {/* Flanking bottom stars & lines */}
      <line x1="54" y1="177" x2="78" y2="177" stroke={navy} strokeWidth="1" />
      
      {/* 3 Bottom stars (Center star is larger) */}
      <polygon points="85,176 86.5,179 89.5,179 87,181 88,184 85,182 82,184 83,181 80.5,179 83.5,179" fill={navy} />
      <polygon points="100,172 102.3,176.5 107.3,176.5 103.3,179.5 104.8,184 100,181 95.2,184 96.7,179.5 92.7,176.5 97.7,176.5" fill={navy} />
      <polygon points="115,176 116.5,179 119.5,179 117,181 118,184 115,182 112,184 113,181 110.5,179 113.5,179" fill={navy} />

      <line x1="122" y1="177" x2="146" y2="177" stroke={navy} strokeWidth="1" />
    </svg>
  );
}
