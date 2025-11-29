import {
  Target,
  Sparkles,
  Palette,
  Home,
  Code,
  TrendingUp,
  Globe,
} from "lucide-react";
import { Virtue, FontOption } from "./types";

export const virtues: Virtue[] = [
  {
    id: "intro-to-ux",
    name: "Intro to UX",
    icon: Palette,
    color: "bg-brown-900",
    iconColor: "text-icon-gray",
    description: "Master the fundamentals of user experience design",
  },
  {
    id: "design-systems",
    name: "Design Systems",
    icon: Sparkles,
    color: "bg-brown-700",
    iconColor: "text-icon-gray",
    description: "Build scalable and consistent design systems",
  },
  {
    id: "energy-efficiency",
    name: "Energy Efficiency at Home",
    icon: Home,
    color: "bg-cream-3000",
    iconColor: "text-icon-gray",
    description:
      "Reduce your carbon footprint with practical home improvements",
  },
  {
    id: "web-development",
    name: "Web Development Basics",
    icon: Code,
    color: "bg-brown-300",
    iconColor: "text-icon-gray",
    description: "Learn modern web development fundamentals",
  },
  {
    id: "product-strategy",
    name: "Product Strategy",
    icon: Target,
    color: "bg-brown-100",
    iconColor: "text-icon-gray",
    description: "Develop products that users love and businesses need",
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    icon: TrendingUp,
    color: "bg-grey-700",
    iconColor: "text-icon-gray",
    description: "Turn data into actionable insights",
  },
  {
    id: "sustainability",
    name: "Sustainability Practices",
    icon: Globe,
    color: "bg-grey-500",
    iconColor: "text-icon-gray",
    description: "Learn sustainable practices for modern living",
  },
];

// Learning topics for selection - can use course icons or create simple badge-style visuals
export const learningTopics = [
  { id: "topic1", title: "User Experience", image: "/4-education.png" },
  { id: "topic2", title: "Design Systems", image: "/5-Gender-Equality.png" },
  {
    id: "topic3",
    title: "Web Development",
    image: "/3-Good-Health.png",
  },
  { id: "topic4", title: "Product Strategy", image: "/4-education.png" },
  { id: "topic5", title: "Data Analytics", image: "/5-Gender-Equality.png" },
  {
    id: "topic6",
    title: "Energy Efficiency",
    image: "/Property 1=Clean Water.png",
  },
  {
    id: "topic7",
    title: "Sustainability",
    image: "/7-Affordable-and-Clean-Energy.png",
  },
  {
    id: "topic8",
    title: "Business Skills",
    image: "/8-Decent-Work-and-Economic-Growth.png",
  },
  {
    id: "topic9",
    title: "Innovation",
    image: "/Property 1=Variant18.png",
  },
  {
    id: "topic10",
    title: "Communication",
    image: "/Property 1=Reduced Inequalities.png",
  },
  {
    id: "topic11",
    title: "Leadership",
    image: "/11-sustainable-cities.png",
  },
  {
    id: "topic12",
    title: "Technology",
    image: "/12-responsible.png",
  },
  { id: "topic13", title: "Marketing", image: "/13-Climate-Action.png" },
  {
    id: "topic14",
    title: "Finance",
    image: "/14-Life-Below-Water.png",
  },
  { id: "topic15", title: "Personal Growth", image: "/15-life-on-land.png" },
  {
    id: "topic16",
    title: "Career Development",
    image: "/16-peace-justice.png",
  },
  {
    id: "topic17",
    title: "Creative Skills",
    image: "/17-partnership-for-the-goals.png",
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
