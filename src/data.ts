import {
  Eye,
  Headphones,
  BookOpen,
  User,
  Activity,
  Network,
  Users,
} from "lucide-react";
import { FontOption, Virtue } from "./types";

export const virtues: Virtue[] = [
  {
    id: "visual",
    name: "Visual",
    icon: Eye,
    color: "bg-brown-900",
    iconColor: "text-icon-gray",
    description: "Learn best through seeing and visual representations",
  },
  {
    id: "auditory",
    name: "Auditory",
    icon: Headphones,
    color: "bg-brown-700",
    iconColor: "text-icon-gray",
    description: "Learn best through listening and verbal instruction",
  },
  {
    id: "kinesthetic",
    name: "Kinesthetic",
    icon: Activity,
    color: "bg-cream-3000",
    iconColor: "text-icon-gray",
    description: "Learn best through hands-on experience and physical activity",
  },
  {
    id: "reading-writing",
    name: "Reading/Writing",
    icon: BookOpen,
    color: "bg-brown-300",
    iconColor: "text-icon-gray",
    description: "Learn best through reading and writing activities",
  },
  {
    id: "social",
    name: "Social",
    icon: Users,
    color: "bg-brown-100",
    iconColor: "text-icon-gray",
    description: "Learn best in groups and through collaboration",
  },
  {
    id: "solitary",
    name: "Solitary",
    icon: User,
    color: "bg-grey-700",
    iconColor: "text-icon-gray",
    description: "Learn best independently and through self-study",
  },
  {
    id: "logical",
    name: "Logical",
    icon: Network,
    color: "bg-grey-500",
    iconColor: "text-icon-gray",
    description: "Learn best through logic, reasoning, and systems thinking",
  },
];

// Learning topics for selection - using colored circles instead of images
export const learningTopics = [
  {
    id: "topic1",
    title: "User Experience Design",
    color: "bg-red-500",
    innerColor: "bg-red-700",
  },
  {
    id: "topic2",
    title: "Design Systems",
    color: "bg-orange-500",
    innerColor: "bg-orange-700",
  },
  {
    id: "topic3",
    title: "Web Development",
    color: "bg-yellow-500",
    innerColor: "bg-yellow-700",
  },
  {
    id: "topic4",
    title: "Product Strategy",
    color: "bg-green-500",
    innerColor: "bg-green-700",
  },
  {
    id: "topic5",
    title: "Data Analytics",
    color: "bg-teal-500",
    innerColor: "bg-teal-700",
  },
  {
    id: "topic7",
    title: "Sustainability",
    color: "bg-indigo-500",
    innerColor: "bg-indigo-700",
  },
  {
    id: "topic8",
    title: "Business Skills",
    color: "bg-purple-500",
    innerColor: "bg-purple-700",
  },
  {
    id: "topic9",
    title: "Innovation",
    color: "bg-pink-500",
    innerColor: "bg-pink-700",
  },
  {
    id: "topic10",
    title: "Communication",
    color: "bg-rose-500",
    innerColor: "bg-rose-700",
  },
  {
    id: "topic11",
    title: "Leadership",
    color: "bg-cyan-500",
    innerColor: "bg-cyan-700",
  },
  {
    id: "topic12",
    title: "Technology",
    color: "bg-emerald-500",
    innerColor: "bg-emerald-700",
  },
  {
    id: "topic13",
    title: "Marketing",
    color: "bg-amber-500",
    innerColor: "bg-amber-700",
  },
  {
    id: "topic14",
    title: "Finance",
    color: "bg-violet-500",
    innerColor: "bg-violet-700",
  },
  {
    id: "topic15",
    title: "Personal Growth",
    color: "bg-fuchsia-500",
    innerColor: "bg-fuchsia-700",
  },
  {
    id: "topic16",
    title: "Career Development",
    color: "bg-sky-500",
    innerColor: "bg-sky-700",
  },
  {
    id: "topic17",
    title: "Creative Skills",
    color: "bg-lime-500",
    innerColor: "bg-lime-700",
  },
];

// Keep sdgGoals for backward compatibility if needed elsewhere
export const sdgGoals = learningTopics;

export const fontOptions: FontOption[] = [
  {
    id: "nunito-poppins",
    name: "Nunito + Poppins",
    className: "font-poppins",
    headingClassName: "font-nunito",
  },
  {
    id: "raleway-inter",
    name: "Raleway + Inter",
    className: "font-inter",
    headingClassName: "font-raleway",
  },
  {
    id: "inter-krub",
    name: "Inter + Krub",
    className: "font-krub",
    headingClassName: "font-inter",
  },
  {
    id: "quicksand-bold-regular",
    name: "Quicksand Bold + Regular",
    className: "font-quicksand",
    headingClassName: "font-quicksand font-bold",
  },
  {
    id: "sintony-roboto",
    name: "Sintony + Roboto",
    className: "font-roboto",
    headingClassName: "font-sintony",
  },
  {
    id: "philosopher-mulish",
    name: "Philosopher + Mulish",
    className: "font-mulish",
    headingClassName: "font-philosopher",
  },
  {
    id: "archivo-narrow-geist",
    name: "Archivo Narrow + Geist",
    className: "font-geist",
    headingClassName: "font-archivo-narrow",
  },
];

// Course Library Data
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: CourseLesson[];
  image?: string;
  instructor?: string;
  tags: string[];
}

export interface CourseLesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: "video" | "reading" | "exercise" | "quiz";
}

export const courses: Course[] = [
  {
    id: "intro-to-ux",
    title: "Introduction to User Experience Design",
    description:
      "Learn the fundamentals of UX design, including user research, wireframing, prototyping, and usability testing. Perfect for beginners looking to start their UX journey.",
    category: "Design",
    duration: "4 weeks",
    level: "Beginner",
    instructor: "Sarah Chen",
    tags: ["UX", "Design", "User Research"],
    lessons: [
      {
        id: "lesson-1",
        title: "What is UX Design?",
        content: `User Experience (UX) Design is the process of creating products that provide meaningful and relevant experiences to users. This involves the design of the entire process of acquiring and integrating the product, including aspects of branding, design, usability, and function.

Key Concepts:
- User-Centered Design: Putting the user at the center of the design process
- Usability: Making products easy to use and understand
- Accessibility: Ensuring products can be used by people with disabilities
- Information Architecture: Organizing and structuring content effectively

The UX Design Process:
1. Research: Understanding users, their needs, and context
2. Design: Creating wireframes, prototypes, and visual designs
3. Testing: Validating designs with real users
4. Iteration: Refining based on feedback

Why UX Matters:
Good UX design leads to:
- Increased user satisfaction
- Higher conversion rates
- Reduced development costs
- Better brand perception`,
        duration: "15 min",
        type: "reading",
      },
      {
        id: "lesson-2",
        title: "User Research Methods",
        content: `User research is the foundation of good UX design. It helps you understand your users' needs, behaviors, and motivations.

Common Research Methods:

#1. User Interviews
- One-on-one conversations with users
- Best for: Understanding motivations and pain points
- Duration: 30-60 minutes

#2. Surveys
- Quantitative data collection
- Best for: Gathering data from many users quickly
- Use when: You need statistical validation

#3. Usability Testing
- Observing users interact with your product
- Best for: Identifying usability issues
- Can be done in-person or remotely

#4. Personas
- Creating fictional representations of your users
- Best for: Keeping the team focused on user needs
- Should be based on real research data

Exercise:
Create a user persona for a mobile banking app. Include demographics, goals, frustrations, and behaviors.`,
        duration: "20 min",
        type: "reading",
      },
      {
        id: "lesson-3",
        title: "Wireframing Basics",
        content: `Wireframes are low-fidelity visual representations of a user interface. They focus on layout, structure, and functionality rather than visual design.

Wireframing Principles:
- Simplicity: Keep it simple and focused on structure
- Clarity: Make the hierarchy and flow clear
- Iteration: Start rough and refine gradually

Tools:
- Pen and Paper: Fastest way to start
- Figma: Popular design tool with wireframing features
- Balsamiq: Dedicated wireframing tool
- Sketch: Mac-based design tool

Exercise:
Create wireframes for a simple login page. Focus on:
- Layout structure
- Content hierarchy
- User flow
- Call-to-action placement`,
        duration: "25 min",
        type: "exercise",
      },
    ],
  },
  {
    id: "design-systems",
    title: "Building Design Systems",
    description:
      "Learn how to create and maintain scalable design systems that ensure consistency across products and teams. Master component libraries, design tokens, and documentation.",
    category: "Design",
    duration: "6 weeks",
    level: "Intermediate",
    instructor: "Michael Park",
    tags: ["Design Systems", "Components", "Figma"],
    lessons: [
      {
        id: "lesson-1",
        title: "What is a Design System?",
        content: `A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.

Components of a Design System:
- Design Tokens: Colors, typography, spacing, shadows
- Component Library: Reusable UI components
- Patterns: Common interaction patterns
- Guidelines: Usage documentation and best practices

Benefits:
- Consistency across products
- Faster development
- Easier maintenance
- Better collaboration`,
        duration: "15 min",
        type: "reading",
      },
      {
        id: "lesson-2",
        title: "Creating Design Tokens",
        content: `Design tokens are the visual design atoms of a design system. They represent design decisions like colors, spacing, and typography.

Token Categories:
- Color: Primary, secondary, neutral, semantic colors
- Typography: Font families, sizes, weights, line heights
- Spacing: Consistent spacing scale (4px, 8px, 16px, etc.)
- Shadows: Elevation and depth
- Border Radius: Consistent corner rounding

Exercise:
Create a design token system for a new product. Define at least:
- 5 color tokens
- Typography scale (heading and body)
- Spacing scale
- Shadow tokens`,
        duration: "30 min",
        type: "exercise",
      },
    ],
  },
  {
    id: "web-development-basics",
    title: "Web Development Basics",
    description:
      "Start your journey into web development. Learn HTML, CSS, and JavaScript fundamentals, and build your first responsive website.",
    category: "Development",
    duration: "8 weeks",
    level: "Beginner",
    instructor: "Alex Rodriguez",
    tags: ["HTML", "CSS", "JavaScript", "Web"],
    lessons: [
      {
        id: "lesson-1",
        title: "HTML Fundamentals",
        content: `HTML (HyperText Markup Language) is the foundation of web pages. It provides the structure and content of a webpage.

Basic HTML Structure:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first webpage.</p>
</body>
</html>
\`\`\`

Key HTML Elements:
- Headings: \`<h1>\` through \`<h6>\`
- Paragraphs: \`<p>\`
- Links: \`<a href="...">\`
- Images: \`<img src="..." alt="...">\`
- Lists: \`<ul>\`, \`<ol>\`, \`<li>\`
- Semantic HTML: \`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\`

Exercise:
Create an HTML page with:
- A header with your name
- A navigation menu
- A main section with an article
- A footer with contact information`,
        duration: "20 min",
        type: "exercise",
      },
      {
        id: "lesson-2",
        title: "CSS Styling",
        content: `CSS (Cascading Style Sheets) controls the visual appearance of HTML elements.

CSS Basics:
- Selectors: Target HTML elements
- Properties: Define styles (color, size, spacing)
- Values: Specific settings for properties

Example:
\`\`\`css
h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}
\`\`\`

Key Concepts:
- Box Model: Content, padding, border, margin
- Flexbox: Modern layout system
- Grid: Two-dimensional layout
- Responsive Design: Media queries for different screen sizes`,
        duration: "25 min",
        type: "reading",
      },
    ],
  },
  {
    id: "product-strategy",
    title: "Product Strategy & Roadmapping",
    description:
      "Learn how to develop product strategies that align with business goals and user needs. Master roadmapping, prioritization, and stakeholder management.",
    category: "Product",
    duration: "5 weeks",
    level: "Intermediate",
    instructor: "Jessica Kim",
    tags: ["Product", "Strategy", "Roadmap"],
    lessons: [
      {
        id: "lesson-1",
        title: "Understanding Product Strategy",
        content: `Product strategy is the high-level plan that outlines what a product will achieve and how it will achieve it.

Key Components:
- Vision: Where you want to be
- Goals: What you want to achieve
- Target Users: Who you're building for
- Competitive Advantage: What makes you unique
- Success Metrics: How you'll measure success

The Strategy Process:
1. Research: Market, users, competitors
2. Define: Vision, goals, positioning
3. Plan: Roadmap, features, timeline
4. Execute: Build, launch, iterate
5. Measure: Track metrics, gather feedback`,
        duration: "20 min",
        type: "reading",
      },
    ],
  },
  {
    id: "data-analytics",
    title: "Data Analytics Fundamentals",
    description:
      "Learn how to collect, analyze, and visualize data to make data-driven decisions. Cover SQL, data visualization, and statistical analysis basics.",
    category: "Analytics",
    duration: "6 weeks",
    level: "Beginner",
    instructor: "David Lee",
    tags: ["Data", "Analytics", "SQL", "Visualization"],
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to Data Analytics",
        content: `Data analytics is the process of examining data sets to draw conclusions and identify patterns.

Types of Analytics:
- Descriptive: What happened? (Historical data)
- Diagnostic: Why did it happen? (Root cause analysis)
- Predictive: What will happen? (Forecasting)
- Prescriptive: What should we do? (Recommendations)

Common Tools:
- Excel/Google Sheets: Basic analysis
- SQL: Database queries
- Python/R: Statistical analysis
- Tableau/Power BI: Data visualization

Key Metrics:
- KPIs: Key Performance Indicators
- Conversion Rates: Percentage of users who complete an action
- Retention: How many users return
- Engagement: How users interact with your product`,
        duration: "15 min",
        type: "reading",
      },
    ],
  },
  {
    id: "sustainability-practices",
    title: "Sustainable Living Practices",
    description:
      "Learn practical ways to live more sustainably. Cover waste reduction, sustainable consumption, and environmental impact awareness.",
    category: "Sustainability",
    duration: "5 weeks",
    level: "Beginner",
    instructor: "Rachel Green",
    tags: ["Sustainability", "Environment", "Lifestyle"],
    lessons: [
      {
        id: "lesson-1",
        title: "The Three R's: Reduce, Reuse, Recycle",
        content: `The foundation of sustainable living starts with the three R's.

Reduce:
- Buy only what you need
- Choose products with less packaging
- Reduce water and energy consumption
- Minimize food waste

Reuse:
- Repair instead of replace
- Buy second-hand items
- Repurpose items creatively
- Use reusable containers and bags

Recycle:
- Know what can be recycled in your area
- Clean items before recycling
- Follow local recycling guidelines
- Support products made from recycled materials

Beyond the Three R's:
- Refuse: Say no to unnecessary items
- Rot: Compost organic waste
- Repair: Fix items instead of replacing
- Rethink: Question consumption habits`,
        duration: "15 min",
        type: "reading",
      },
    ],
  },
];
