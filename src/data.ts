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
    title: "Energy",
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

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct answer
  explanation?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: "video" | "reading" | "exercise" | "quiz";
  questions?: QuizQuestion[]; // For quiz type lessons
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
      {
        id: "quiz-1",
        title: "Course Quiz",
        content: "Test your knowledge of UX Design fundamentals",
        duration: "15 min",
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "What is the primary goal of UX Design?",
            options: [
              "To make products look beautiful",
              "To create meaningful and relevant experiences for users",
              "To use the latest design trends",
              "To minimize development costs",
            ],
            correctAnswer: 1,
            explanation:
              "UX Design focuses on creating meaningful and relevant experiences for users, considering their needs, behaviors, and context.",
          },
          {
            id: "q2",
            question:
              "Which research method is best for understanding user motivations?",
            options: ["Surveys", "User Interviews", "Analytics", "A/B Testing"],
            correctAnswer: 1,
            explanation:
              "User interviews are one-on-one conversations that allow deep exploration of user motivations and pain points.",
          },
          {
            id: "q3",
            question: "What is the main purpose of wireframes?",
            options: [
              "To show final visual design",
              "To focus on layout, structure, and functionality",
              "To demonstrate color schemes",
              "To create animations",
            ],
            correctAnswer: 1,
            explanation:
              "Wireframes are low-fidelity representations that focus on layout, structure, and functionality rather than visual design.",
          },
          {
            id: "q4",
            question:
              "Which of the following is NOT a key component of the UX Design process?",
            options: ["Research", "Design", "Testing", "Marketing"],
            correctAnswer: 3,
            explanation:
              "The UX Design process includes Research, Design, Testing, and Iteration. Marketing is a separate business function.",
          },
        ],
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
      {
        id: "quiz-1",
        title: "Course Quiz",
        content: "Test your knowledge of Design Systems",
        duration: "15 min",
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "What is the main benefit of a design system?",
            options: [
              "It makes designs look more modern",
              "It ensures consistency and scalability across products",
              "It reduces the need for designers",
              "It automatically generates code",
            ],
            correctAnswer: 1,
            explanation:
              "Design systems ensure consistency and scalability, making it easier to maintain and extend products.",
          },
          {
            id: "q2",
            question: "What are design tokens?",
            options: [
              "Visual design atoms like colors, spacing, and typography",
              "User authentication codes",
              "Database identifiers",
              "API endpoints",
            ],
            correctAnswer: 0,
            explanation:
              "Design tokens are the visual design atoms that represent design decisions like colors, spacing, and typography.",
          },
        ],
      },
    ],
  },
  {
    id: "python-basics",
    title: "Python Basics",
    description:
      "Learn Python programming fundamentals. Master variables, data types, control structures, functions, and start building your first Python programs.",
    category: "Development",
    duration: "6 weeks",
    level: "Beginner",
    tags: ["Python", "Programming", "Coding", "Basics"],
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to Python",
        content: `Python is a versatile, high-level programming language known for its simplicity and readability.

Why Python?
- Easy to learn and read
- Powerful and versatile
- Large community and libraries
- Used in web development, data science, automation, and more

Your First Python Program:
\`\`\`python
print("Hello, World!")
\`\`\`

Python Basics:
- Python uses indentation to define code blocks
- No semicolons needed
- Comments start with #
- Variables don't need type declarations

Data Types:
- Strings: Text data ("hello")
- Integers: Whole numbers (42)
- Floats: Decimal numbers (3.14)
- Booleans: True or False
- Lists: Ordered collections [1, 2, 3]
- Dictionaries: Key-value pairs {"name": "John"}

Exercise:
Write a Python program that:
- Prints your name
- Stores your age in a variable
- Prints a message with your name and age`,
        duration: "20 min",
        type: "exercise",
      },
      {
        id: "lesson-2",
        title: "Variables and Data Types",
        content: `Understanding variables and data types is fundamental to Python programming.

Variables:
Variables store data and can be reassigned:
\`\`\`python
name = "Alice"
age = 30
price = 19.99
is_active = True
\`\`\`

Common Data Types:
- String (str): Text data
- Integer (int): Whole numbers
- Float (float): Decimal numbers
- Boolean (bool): True/False
- List: Ordered, mutable collection
- Dictionary: Key-value pairs
- Tuple: Ordered, immutable collection

Type Conversion:
\`\`\`python
age = "25"
age_int = int(age)  # Convert to integer
price = 19.99
price_str = str(price)  # Convert to string
\`\`\`

String Operations:
- Concatenation: "Hello" + " " + "World"
- Formatting: f"Name: {name}, Age: {age}"
- Methods: .upper(), .lower(), .strip()`,
        duration: "25 min",
        type: "reading",
      },
      {
        id: "lesson-3",
        title: "Control Structures and Functions",
        content: `Control structures and functions help you write more organized and reusable code.

Conditional Statements:
\`\`\`python
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")
\`\`\`

Loops:
- For loops: Iterate over sequences
\`\`\`python
for i in range(5):
    print(i)
\`\`\`
- While loops: Repeat while condition is true
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

Functions:
Functions are reusable blocks of code:
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)
\`\`\`

Exercise:
Create a function that:
- Takes a number as input
- Returns "Even" if the number is even, "Odd" if it's odd
- Test it with several numbers`,
        duration: "30 min",
        type: "exercise",
      },
      {
        id: "quiz-1",
        title: "Course Quiz",
        content: "Test your knowledge of Python Basics",
        duration: "15 min",
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "What is Python primarily known for?",
            options: [
              "Complex syntax",
              "Simplicity and readability",
              "Only web development",
              "Requiring semicolons",
            ],
            correctAnswer: 1,
            explanation:
              "Python is known for its simplicity and readability, making it an excellent language for beginners.",
          },
          {
            id: "q2",
            question: "Which of the following is a valid Python variable name?",
            options: ["2name", "my-name", "my_name", "my name"],
            correctAnswer: 2,
            explanation:
              "Variable names in Python can contain letters, numbers, and underscores, but cannot start with a number or contain spaces.",
          },
          {
            id: "q3",
            question: "What does the following code print? print(2 + 3 * 4)",
            options: ["20", "14", "24", "Error"],
            correctAnswer: 1,
            explanation:
              "Python follows order of operations: multiplication (3 * 4 = 12) happens before addition (2 + 12 = 14).",
          },
          {
            id: "q4",
            question: "How do you define a function in Python?",
            options: [
              "function my_function():",
              "def my_function():",
              "function my_function() {",
              "my_function = function()",
            ],
            correctAnswer: 1,
            explanation:
              "Functions in Python are defined using the 'def' keyword followed by the function name and parentheses.",
          },
        ],
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
      {
        id: "quiz-1",
        title: "Course Quiz",
        content: "Test your knowledge of Product Strategy",
        duration: "15 min",
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "What is the primary purpose of a product strategy?",
            options: [
              "To create detailed feature specifications",
              "To outline what a product will achieve and how",
              "To design the user interface",
              "To write code",
            ],
            correctAnswer: 1,
            explanation:
              "Product strategy is the high-level plan that outlines what a product will achieve and how it will achieve it.",
          },
          {
            id: "q2",
            question: "Which is NOT a key component of product strategy?",
            options: [
              "Vision",
              "Target Users",
              "Success Metrics",
              "Code Implementation",
            ],
            correctAnswer: 3,
            explanation:
              "Code implementation is part of execution, not strategy. Strategy focuses on vision, goals, users, and metrics.",
          },
        ],
      },
    ],
  },
  {
    id: "n8n-automation",
    title: "n8n Workflow Automation",
    description:
      "Master n8n to automate workflows and connect apps without code. Learn to build powerful automations that save time and streamline your processes.",
    category: "Automation",
    duration: "5 weeks",
    level: "Beginner",
    tags: ["Automation", "Workflows", "Integration", "n8n"],
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to n8n",
        content: `n8n is a powerful workflow automation tool that allows you to connect different apps and services without writing code.

What is n8n?
- Open-source workflow automation platform
- Visual workflow builder with drag-and-drop interface
- Connects to 400+ apps and services
- Self-hostable or cloud-based

Key Concepts:
- Nodes: Building blocks that perform specific actions
- Workflows: Sequences of connected nodes
- Triggers: Events that start a workflow
- Actions: Operations performed by nodes

Use Cases:
- Automate repetitive tasks
- Sync data between applications
- Send notifications and alerts
- Process and transform data
- Integrate different services

Getting Started:
1. Sign up for n8n Cloud or install self-hosted version
2. Explore the node library
3. Create your first simple workflow
4. Test and iterate`,
        duration: "20 min",
        type: "reading",
      },
      {
        id: "lesson-2",
        title: "Building Your First Workflow",
        content: `Creating workflows in n8n is intuitive and visual. Let's build a simple automation.

Workflow Structure:
- Start with a Trigger node (webhook, schedule, manual)
- Add Action nodes to perform operations
- Connect nodes to create a flow
- Test each step as you build

Example: Email Notification Workflow
1. Trigger: Schedule node (runs daily at 9 AM)
2. Action: HTTP Request node (fetch data from API)
3. Action: IF node (check if conditions are met)
4. Action: Email node (send notification if true)

Best Practices:
- Start simple and add complexity gradually
- Use descriptive names for nodes
- Test workflows before activating
- Add error handling with IF nodes
- Document your workflows with notes

Exercise:
Create a workflow that:
- Triggers on a schedule
- Fetches data from an API
- Filters the results
- Sends an email with the filtered data`,
        duration: "30 min",
        type: "exercise",
      },
      {
        id: "lesson-3",
        title: "Advanced n8n Features",
        content: `Once you're comfortable with basics, explore n8n's advanced capabilities.

Advanced Features:
- Code Node: Write custom JavaScript/Python code
- Function Node: Transform data with expressions
- Sub-workflows: Reusable workflow components
- Error Workflows: Handle failures gracefully
- Webhooks: Trigger workflows from external apps

Data Transformation:
- Use Set node to modify data structure
- Use Function node for complex transformations
- Use Split In Batches for large datasets
- Use Aggregate for data summarization

Integration Patterns:
- API to Database: Fetch and store data
- Database to Email: Send reports automatically
- Multi-step Approvals: Workflow with conditions
- Data Synchronization: Keep systems in sync

Tips for Complex Workflows:
- Break large workflows into smaller sub-workflows
- Use variables for configuration
- Test each node individually
- Use the Execute Workflow node for reusability`,
        duration: "25 min",
        type: "reading",
      },
      {
        id: "quiz-1",
        title: "Course Quiz",
        content: "Test your knowledge of n8n Workflow Automation",
        duration: "15 min",
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "What is n8n primarily used for?",
            options: [
              "Writing code",
              "Workflow automation and connecting apps",
              "Data visualization",
              "Project management",
            ],
            correctAnswer: 1,
            explanation:
              "n8n is a workflow automation tool that allows you to connect different apps and services without writing code.",
          },
          {
            id: "q2",
            question: "What are the building blocks of n8n workflows called?",
            options: ["Blocks", "Nodes", "Components", "Modules"],
            correctAnswer: 1,
            explanation:
              "Nodes are the building blocks that perform specific actions in n8n workflows.",
          },
          {
            id: "q3",
            question: "Which node type starts a workflow?",
            options: [
              "Action Node",
              "Trigger Node",
              "Function Node",
              "Set Node",
            ],
            correctAnswer: 1,
            explanation:
              "Trigger nodes start workflows when specific events occur, such as a schedule, webhook, or manual trigger.",
          },
          {
            id: "q4",
            question:
              "What is a good practice when building complex workflows?",
            options: [
              "Build everything in one large workflow",
              "Break workflows into smaller sub-workflows",
              "Never test workflows",
              "Use only trigger nodes",
            ],
            correctAnswer: 1,
            explanation:
              "Breaking large workflows into smaller, reusable sub-workflows makes them easier to manage, test, and maintain.",
          },
        ],
      },
    ],
  },
  {
    id: "react-typescript",
    title: "React with TypeScript",
    description:
      "Learn to build type-safe React applications with TypeScript. Master component typing, hooks, props, and best practices for scalable React development.",
    category: "Development",
    duration: "7 weeks",
    level: "Intermediate",
    tags: ["React", "TypeScript", "Frontend", "Web Development"],
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to React and TypeScript",
        content: `Combining React with TypeScript provides type safety and better developer experience for building robust applications.

Why TypeScript with React?
- Catch errors at compile time
- Better IDE autocomplete and IntelliSense
- Self-documenting code through types
- Easier refactoring and maintenance
- Improved team collaboration

Setting Up:
\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

Basic TypeScript Types:
- \`string\`: Text values
- \`number\`: Numeric values
- \`boolean\`: True/false
- \`Array<T>\` or \`T[]\`: Arrays
- \`object\`: Object types
- \`void\`: No return value
- \`null\` and \`undefined\`: Nullable types

Your First Typed Component:
\`\`\`typescript
import React from 'react';

interface Props {
  name: string;
  age: number;
}

const Greeting: React.FC<Props> = ({ name, age }) => {
  return <h1>Hello, {name}! You are {age} years old.</h1>;
};

export default Greeting;
\`\`\`

Exercise:
Create a React component with TypeScript that:
- Takes a title (string) and count (number) as props
- Displays the title and count
- Uses proper TypeScript types`,
        duration: "25 min",
        type: "exercise",
      },
      {
        id: "lesson-2",
        title: "Typing React Components and Props",
        content: `Properly typing components and props is essential for type-safe React applications.

Functional Components:
\`\`\`typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
\`\`\`

Common Prop Patterns:
- Optional props: \`prop?: type\`
- Default values: \`prop: type = defaultValue\`
- Children: \`children: React.ReactNode\`
- Event handlers: \`onClick: (event: React.MouseEvent) => void\`

Typing Hooks:
\`\`\`typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  // Effect logic
}, [dependencies]);
\`\`\`

Advanced Types:
- Union types: \`string | number\`
- Intersection types: \`TypeA & TypeB\`
- Generics: \`function<T>(arg: T): T\`
- Utility types: \`Partial<T>\`, \`Pick<T, K>\`, \`Omit<T, K>\``,
        duration: "30 min",
        type: "reading",
      },
      {
        id: "lesson-3",
        title: "Advanced Patterns and Best Practices",
        content: `Master advanced TypeScript patterns for React to build scalable applications.

Custom Hooks with TypeScript:
\`\`\`typescript
interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

function useCounter(initialValue: number = 0): UseCounterReturn {
  const [count, setCount] = useState<number>(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
\`\`\`

Context with TypeScript:
\`\`\`typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
\`\`\`

Form Handling:
\`\`\`typescript
interface FormData {
  email: string;
  password: string;
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  // Process form data
};
\`\`\`

Best Practices:
- Use interfaces for props and component state
- Leverage TypeScript's strict mode
- Create reusable type definitions
- Use type guards for runtime type checking
- Document complex types with JSDoc comments`,
        duration: "35 min",
        type: "reading",
      },
      {
        id: "quiz-1",
        title: "Course Quiz",
        content: "Test your knowledge of React with TypeScript",
        duration: "15 min",
        type: "quiz",
        questions: [
          {
            id: "q1",
            question:
              "What is the main benefit of using TypeScript with React?",
            options: [
              "Faster runtime performance",
              "Type safety and catching errors at compile time",
              "Smaller bundle size",
              "Better SEO",
            ],
            correctAnswer: 1,
            explanation:
              "TypeScript provides type safety, catching errors at compile time and improving developer experience with better autocomplete and IntelliSense.",
          },
          {
            id: "q2",
            question:
              "How do you define optional props in a TypeScript React component?",
            options: [
              "prop: type?",
              "prop?: type",
              "prop: type | undefined",
              "prop: optional<type>",
            ],
            correctAnswer: 1,
            explanation:
              "Optional props in TypeScript are defined using the question mark syntax: 'prop?: type'.",
          },
          {
            id: "q3",
            question:
              "What is the correct way to type a useState hook for a number?",
            options: [
              "useState(0)",
              "useState<number>(0)",
              "useState: number = 0",
              "useState<number>",
            ],
            correctAnswer: 1,
            explanation:
              "TypeScript generics are used with useState: 'useState<number>(0)' explicitly types the state as a number.",
          },
          {
            id: "q4",
            question:
              "Which TypeScript utility type makes all properties of a type optional?",
            options: ["Pick", "Partial", "Omit", "Required"],
            correctAnswer: 1,
            explanation:
              "The Partial<T> utility type makes all properties of type T optional, useful for update operations.",
          },
        ],
      },
    ],
  },
  {
    id: "rag-ai-integration",
    title: "AI Integration in RAG Applications",
    description:
      "Learn to build Retrieval-Augmented Generation (RAG) applications that combine AI language models with your own data. Master vector databases, embeddings, and prompt engineering.",
    category: "AI & Machine Learning",
    duration: "8 weeks",
    level: "Intermediate",
    tags: ["AI", "RAG", "LLM", "Vector Databases", "Embeddings"],
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to RAG",
        content: `Retrieval-Augmented Generation (RAG) combines the power of large language models with external knowledge sources to create more accurate and context-aware AI applications.

What is RAG?
- Combines retrieval (search) with generation (LLM)
- Allows AI to access up-to-date or private data
- Reduces hallucinations by grounding responses in retrieved documents
- Enables domain-specific AI applications

RAG Architecture:
1. Document Ingestion: Load and process documents
2. Embedding Generation: Convert text to vector embeddings
3. Vector Storage: Store embeddings in a vector database
4. Query Processing: Convert user query to embedding
5. Retrieval: Find similar documents using vector search
6. Generation: Use retrieved context to generate answer

Key Components:
- Embedding Models: Convert text to numerical vectors
- Vector Databases: Store and search embeddings efficiently
- LLM: Generate responses based on retrieved context
- Chunking Strategy: Break documents into searchable pieces

Use Cases:
- Question answering over documents
- Chatbots with domain knowledge
- Code documentation assistants
- Research and analysis tools`,
        duration: "25 min",
        type: "reading",
      },
      {
        id: "lesson-2",
        title: "Vector Databases and Embeddings",
        content: `Understanding vector databases and embeddings is crucial for building effective RAG applications.

Embeddings:
Embeddings are numerical representations of text that capture semantic meaning:
\`\`\`python
from openai import OpenAI

client = OpenAI()
text = "What is RAG?"
embedding = client.embeddings.create(
    model="text-embedding-3-small",
    input=text
).data[0].embedding
\`\`\`

Vector Databases:
Popular options include:
- Pinecone: Managed vector database
- Weaviate: Open-source vector search
- Chroma: Lightweight, embeddable
- Qdrant: High-performance, open-source
- pgvector: PostgreSQL extension

Similarity Search:
\`\`\`python
# Find similar documents using cosine similarity
def find_similar(query_embedding, top_k=5):
    results = vector_db.similarity_search(
        query_embedding,
        k=top_k
    )
    return results
\`\`\`

Best Practices:
- Choose appropriate embedding model for your domain
- Optimize chunk size (typically 200-500 tokens)
- Use metadata filtering for better retrieval
- Implement hybrid search (vector + keyword)`,
        duration: "30 min",
        type: "reading",
      },
      {
        id: "lesson-3",
        title: "Building a RAG Application",
        content: `Let's build a complete RAG application step by step.

Step 1: Document Processing
\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = splitter.split_text(documents)
\`\`\`

Step 2: Generate Embeddings
\`\`\`python
embeddings = OpenAIEmbeddings()
vector_store = Chroma.from_texts(
    chunks,
    embeddings,
    persist_directory="./vector_db"
)
\`\`\`

Step 3: Create Retrieval Chain
\`\`\`python
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    retriever=vector_store.as_retriever(),
    return_source_documents=True
)
\`\`\`

Step 4: Query Processing
\`\`\`python
query = "What is RAG?"
result = qa_chain({"query": query})
print(result["result"])
print(result["source_documents"])
\`\`\`

Advanced Techniques:
- Re-ranking: Improve retrieval quality
- Multi-query retrieval: Generate multiple queries
- Context compression: Reduce token usage
- Streaming responses: Real-time generation

Exercise:
Build a simple RAG application that:
- Loads documents from a directory
- Creates embeddings and stores in vector DB
- Answers questions using retrieved context
- Returns source citations`,
        duration: "40 min",
        type: "exercise",
      },
      {
        id: "lesson-4",
        title: "Optimization and Best Practices",
        content: `Optimizing RAG applications for production requires attention to several key areas.

Prompt Engineering:
- Clear instructions for the LLM
- Context formatting
- Few-shot examples
- Output format specification

Example Prompt Template:
\`\`\`python
template = """Use the following context to answer the question.
If you don't know the answer, say so.

Context: {context}

Question: {question}

Answer:"""
\`\`\`

Chunking Strategies:
- Semantic chunking: Split by meaning
- Fixed-size chunks: Simple and consistent
- Overlapping chunks: Preserve context
- Hierarchical chunking: Multiple granularities

Retrieval Optimization:
- Hybrid search: Combine vector and keyword search
- Re-ranking: Use cross-encoders to improve results
- Metadata filtering: Narrow search space
- Query expansion: Generate related queries

Performance Tips:
- Cache embeddings for frequently accessed documents
- Use async processing for batch operations
- Implement streaming for better UX
- Monitor token usage and costs
- Set appropriate temperature and max_tokens

Error Handling:
- Handle API rate limits
- Implement retry logic
- Validate retrieved context quality
- Fallback to keyword search if needed`,
        duration: "30 min",
        type: "reading",
      },
      {
        id: "quiz-1",
        title: "Course Quiz",
        content: "Test your knowledge of AI Integration in RAG Applications",
        duration: "15 min",
        type: "quiz",
        questions: [
          {
            id: "q1",
            question: "What does RAG stand for?",
            options: [
              "Random Access Generation",
              "Retrieval-Augmented Generation",
              "Real-time AI Generation",
              "Rapid Application Generation",
            ],
            correctAnswer: 1,
            explanation:
              "RAG stands for Retrieval-Augmented Generation, which combines retrieval of relevant documents with AI generation.",
          },
          {
            id: "q2",
            question: "What is the primary purpose of embeddings in RAG?",
            options: [
              "To compress documents",
              "To convert text to numerical vectors that capture semantic meaning",
              "To encrypt data",
              "To format text",
            ],
            correctAnswer: 1,
            explanation:
              "Embeddings convert text to numerical vectors that capture semantic meaning, enabling similarity search in vector databases.",
          },
          {
            id: "q3",
            question: "Which component is NOT typically part of a RAG system?",
            options: [
              "Vector Database",
              "Embedding Model",
              "Large Language Model",
              "Image Processing Pipeline",
            ],
            correctAnswer: 3,
            explanation:
              "RAG systems use vector databases, embedding models, and LLMs, but not image processing pipelines (unless building a multimodal RAG).",
          },
          {
            id: "q4",
            question: "What is a common chunk size for RAG applications?",
            options: [
              "50-100 tokens",
              "200-500 tokens",
              "1000-2000 tokens",
              "5000+ tokens",
            ],
            correctAnswer: 1,
            explanation:
              "Chunk sizes of 200-500 tokens are common as they balance context preservation with retrieval precision.",
          },
          {
            id: "q5",
            question: "What is hybrid search in RAG?",
            options: [
              "Using multiple LLMs",
              "Combining vector search with keyword search",
              "Searching across multiple databases",
              "Using both CPU and GPU",
            ],
            correctAnswer: 1,
            explanation:
              "Hybrid search combines vector (semantic) search with keyword (lexical) search to improve retrieval quality.",
          },
        ],
      },
    ],
  },
];
