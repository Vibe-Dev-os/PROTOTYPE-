// Sample departments
export const departments = [
  {
    id: "dept-1",
    name: "Computer Science",
    code: "CS",
    description: "Study of computers and computational systems",
  },
  {
    id: "dept-2",
    name: "Mathematics",
    code: "MATH",
    description: "Study of numbers, quantity, and space",
  },
  {
    id: "dept-3",
    name: "Physics",
    code: "PHYS",
    description: "Study of matter, energy, and the interaction between them",
  },
  {
    id: "dept-4",
    name: "Biology",
    code: "BIO",
    description: "Study of living organisms and their interactions",
  },
  {
    id: "dept-5",
    name: "Chemistry",
    code: "CHEM",
    description: "Study of the composition, properties, and reactions of substances",
  },
  {
    id: "dept-6",
    name: "Engineering",
    code: "ENG",
    description: "Application of scientific knowledge to design and build systems",
  },
  {
    id: "bsis",
    name: "Bachelor of Science in Information Systems",
    code: "BSIS",
    description: "Study of information systems and their application in business and organizations",
  },
]

// Generate sample courses
export function generateSampleCourses() {
  return [
    {
      id: "course-1",
      departmentId: "dept-1",
      name: "Introduction to Programming",
      code: "CS101",
      description: "Fundamentals of programming using Python",
      credits: 3,
      instructor: "Dr. Jane Smith",
      year: 1,
      semester: 1,
    },
    {
      id: "course-2",
      departmentId: "dept-1",
      name: "Data Structures and Algorithms",
      code: "CS201",
      description: "Study of data structures and algorithms for efficient problem solving",
      credits: 4,
      instructor: "Prof. John Doe",
      year: 2,
      semester: 1,
    },
    {
      id: "course-3",
      departmentId: "dept-1",
      name: "Web Development",
      code: "CS301",
      description: "Building modern web applications using HTML, CSS, and JavaScript",
      credits: 3,
      instructor: "Dr. Emily Chen",
      year: 3,
      semester: 1,
    },
    {
      id: "course-4",
      departmentId: "dept-2",
      name: "Calculus I",
      code: "MATH101",
      description: "Introduction to differential and integral calculus",
      credits: 4,
      instructor: "Prof. Michael Johnson",
      year: 1,
      semester: 1,
    },
    {
      id: "course-5",
      departmentId: "dept-2",
      name: "Linear Algebra",
      code: "MATH201",
      description: "Study of linear equations, matrices, and vector spaces",
      credits: 3,
      instructor: "Dr. Sarah Williams",
      year: 2,
      semester: 1,
    },
    {
      id: "course-6",
      departmentId: "dept-3",
      name: "Classical Mechanics",
      code: "PHYS201",
      description: "Study of motion and forces in classical physics",
      credits: 4,
      instructor: "Prof. Robert Brown",
      year: 2,
      semester: 1,
    },
    {
      id: "course-7",
      departmentId: "dept-4",
      name: "Cell Biology",
      code: "BIO201",
      description: "Study of cell structure, function, and processes",
      credits: 4,
      instructor: "Dr. Lisa Garcia",
      year: 2,
      semester: 1,
    },
    {
      id: "course-8",
      departmentId: "dept-5",
      name: "Organic Chemistry",
      code: "CHEM301",
      description: "Study of carbon compounds and their reactions",
      credits: 4,
      instructor: "Prof. David Wilson",
      year: 3,
      semester: 1,
    },
    {
      id: "course-9",
      departmentId: "dept-6",
      name: "Introduction to Electrical Engineering",
      code: "ENG201",
      description: "Fundamentals of electrical circuits and systems",
      credits: 3,
      instructor: "Dr. Thomas Lee",
      year: 2,
      semester: 1,
    },
    // BSIS Courses
    {
      id: "bsis-course-1",
      departmentId: "bsis",
      name: "Introduction to Information Systems",
      code: "BSIS101",
      description: "Overview of information systems concepts, components, and their role in business",
      credits: 3,
      instructor: "Dr. Maria Santos",
      year: 1,
      semester: 1,
    },
    {
      id: "bsis-course-2",
      departmentId: "bsis",
      name: "Database Management Systems",
      code: "BSIS201",
      description: "Design and implementation of database systems for business applications",
      credits: 4,
      instructor: "Prof. Juan Cruz",
      year: 1,
      semester: 2,
    },
    {
      id: "bsis-course-3",
      departmentId: "bsis",
      name: "Systems Analysis and Design",
      code: "BSIS301",
      description: "Methods and techniques for analyzing and designing information systems",
      credits: 3,
      instructor: "Dr. Ana Reyes",
      year: 2,
      semester: 1,
    },
  ]
}

// Generate sample lessons
export function generateSampleLessons(courses: any[]) {
  const lessons = []

  // CS101 Lessons
  lessons.push({
    id: "lesson-1",
    courseId: "course-1",
    title: "Introduction to Python",
    content: `
# Introduction to Python Programming

## Learning Objectives
- Understand what Python is and its applications
- Set up a Python development environment
- Write and execute your first Python program
- Learn basic Python syntax and data types

## What is Python?
Python is a high-level, interpreted programming language known for its readability and simplicity. It was created by Guido van Rossum and first released in 1991. Python's design philosophy emphasizes code readability with its notable use of significant whitespace.

### Key Features of Python
- Easy to learn and use
- Interpreted language (no compilation needed)
- Dynamically typed
- Extensive standard library
- Cross-platform compatibility
- Strong community support

## Setting Up Your Environment
To start programming in Python, you need to:
1. Download and install Python from [python.org](https://python.org)
2. Choose and install a code editor (VS Code, PyCharm, etc.)
3. Set up a virtual environment (optional but recommended)

## Your First Python Program
Let's write the traditional "Hello, World!" program:

\`\`\`python
print("Hello, World!")
\`\`\`

To run this program:
1. Save it as hello.py
2. Open your terminal/command prompt
3. Navigate to the directory containing your file
4. Type \`python hello.py\` and press Enter

## Basic Python Syntax
Python uses indentation to define code blocks:

\`\`\`python
if 5 > 2:
    print("Five is greater than two!")
\`\`\`

### Variables and Data Types
Python has several built-in data types:

\`\`\`python
# Integer
x = 5

# Float
y = 3.14

# String
name = "Python"

# Boolean
is_fun = True

# List
fruits = ["apple", "banana", "cherry"]

# Dictionary
person = {"name": "John", "age": 30}
\`\`\`

## Practice Exercise
Write a program that asks for the user's name and then greets them.

\`\`\`python
name = input("What is your name? ")
print(f"Hello, {name}! Welcome to Python programming.")
\`\`\`

## Summary
In this lesson, we've learned:
- What Python is and why it's popular
- How to set up a Python development environment
- How to write and run a simple Python program
- Basic Python syntax and data types

## Next Steps
In the next lesson, we'll explore control flow in Python, including if statements, loops, and functions.
`,
    dateCreated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  })

  lessons.push({
    id: "lesson-2",
    courseId: "course-1",
    title: "Control Flow in Python",
    content: `
# Control Flow in Python

## Learning Objectives
- Understand conditional statements (if, elif, else)
- Learn how to use loops (for, while)
- Implement functions in Python
- Handle exceptions with try/except

## Conditional Statements
Conditional statements allow your program to make decisions based on certain conditions.

### If Statement
\`\`\`python
age = 18
if age >= 18:
    print("You are an adult")
\`\`\`

### If-Else Statement
\`\`\`python
age = 16
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")
\`\`\`

### If-Elif-Else Statement
\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
print(f"Your grade is {grade}")
\`\`\`

## Loops
Loops allow you to execute a block of code multiple times.

### For Loop
\`\`\`python
# Iterating through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Using range
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)
\`\`\`

### While Loop
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## Functions
Functions are reusable blocks of code that perform a specific task.

### Defining a Function
\`\`\`python
def greet(name):
    """This function greets the person passed in as a parameter"""
    return f"Hello, {name}!"

# Calling the function
message = greet("Alice")
print(message)  # Output: Hello, Alice!
\`\`\`

### Function with Default Parameters
\`\`\`python
def power(base, exponent=2):
    return base ** exponent

print(power(3))     # Output: 9 (3^2)
print(power(2, 3))  # Output: 8 (2^3)
\`\`\`

## Exception Handling
Exception handling allows your program to respond to unexpected situations.

\`\`\`python
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"10 divided by {number} is {result}")
except ValueError:
    print("You must enter a valid number")
except ZeroDivisionError:
    print("You cannot divide by zero")
    \`\`\``,
    dateCreated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // MATH101 Lessons
  lessons.push({
    id: "lesson-3",
    courseId: "course-4",
    title: "Introduction to Limits",
    content: `
# Introduction to Limits

## Learning Objectives
- Understand the concept of a limit
- Evaluate limits graphically and numerically
- Apply limit laws to find limits
- Understand one-sided limits

## What is a Limit?
In calculus, a limit is the value that a function "approaches" as the input (or index) "approaches" some value. Limits are essential to calculus and are used to define continuity, derivatives, and integrals.

### Formal Definition
The limit of f(x) as x approaches c is L, written as:

\`\`\`
lim (x→c) f(x) = L
\`\`\`

This means that as x gets closer and closer to c, the value of f(x) gets closer and closer to L.

## Evaluating Limits Graphically
By examining the graph of a function, we can determine the limit as x approaches a certain value.

### Example
Consider the function f(x) = x^2. As x approaches 2, f(x) approaches 4.

## Evaluating Limits Numerically
We can also evaluate limits by creating a table of values and observing the behavior of the function as x gets closer to the target value.

### Example
Consider the function f(x) = (x - 1) / (x - 1). As x approaches 1, we can create a table:

| x      | f(x)   |
| -------- | -------- |
| 0.9    | 1      |
| 0.99   | 1      |
| 0.999  | 1      |
| 1.001  | 1      |
| 1.01   | 1      |
| 1.1    | 1      |

As x approaches 1, f(x) approaches 1.

## Limit Laws
Limit laws allow us to simplify the process of finding limits.

### Basic Limit Laws
- Limit of a constant: lim (x→c) k = k
- Limit of x: lim (x→c) x = c
- Limit of a sum: lim (x→c) [f(x) + g(x)] = lim (x→c) f(x) + lim (x→c) g(x)
- Limit of a product: lim (x→c) [f(x) * g(x)] = lim (x→c) f(x) * lim (x→c) g(x)
- Limit of a quotient: lim (x→c) [f(x) / g(x)] = lim (x→c) f(x) / lim (x→c) g(x), provided lim (x→c) g(x) ≠ 0

## One-Sided Limits
One-sided limits consider the behavior of a function as x approaches c from either the left or the right.

### Left-Hand Limit
The limit of f(x) as x approaches c from the left is L, written as:

\`\`\`
lim (x→c-) f(x) = L
\`\`\`

### Right-Hand Limit
The limit of f(x) as x approaches c from the right is L, written as:

\`\`\`
lim (x→c+) f(x) = L
\`\`\`

## Practice Exercise
Find the limit of f(x) = (x^2 - 4) / (x - 2) as x approaches 2.

## Summary
In this lesson, we've learned:
- The concept of a limit
- How to evaluate limits graphically and numerically
- How to apply limit laws to find limits
- The concept of one-sided limits
`,
    dateCreated: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // BIO201 Lessons
  lessons.push({
    id: "lesson-4",
    courseId: "course-7",
    title: "Cell Structure and Function",
    content: `
# Cell Structure and Function

## Learning Objectives
- Identify the main components of a cell
- Understand the function of each component
- Differentiate between prokaryotic and eukaryotic cells
- Learn about cell transport mechanisms

## Introduction to Cells
Cells are the basic units of life. They are the smallest structures capable of performing all the processes necessary for life.

### Main Components of a Cell
- **Cell Membrane**: Outer boundary that separates the cell from its environment.
- **Cytoplasm**: Gel-like substance within the cell that contains organelles.
- **Nucleus**: Control center of the cell, containing DNA.
- **Organelles**: Specialized structures within the cell that perform specific functions.

## Cell Membrane
The cell membrane is a selectively permeable barrier that regulates the movement of substances in and out of the cell.

### Structure
- **Phospholipid Bilayer**: Double layer of phospholipids with hydrophilic heads and hydrophobic tails.
- **Proteins**: Embedded in the lipid bilayer, facilitating transport and communication.

### Functions
- **Protection**: Provides a barrier against the external environment.
- **Transport**: Regulates the movement of molecules in and out of the cell.
- **Communication**: Contains receptors that allow the cell to respond to external signals.

## Cytoplasm
The cytoplasm is the gel-like substance within the cell that contains organelles and other cellular components.

### Components
- **Cytosol**: Fluid portion of the cytoplasm.
- **Organelles**: Structures with specific functions.

## Nucleus
The nucleus is the control center of the cell, containing DNA and regulating gene expression.

### Structure
- **Nuclear Envelope**: Double membrane surrounding the nucleus.
- **Chromatin**: DNA and proteins that make up chromosomes.
- **Nucleolus**: Site of ribosome synthesis.

### Functions
- **DNA Storage**: Contains the cell's genetic material.
- **Gene Expression**: Regulates the synthesis of proteins.
- **Cell Division**: Controls the process of cell division.

## Organelles
Organelles are specialized structures within the cell that perform specific functions.

### Types of Organelles
- **Mitochondria**: Powerhouse of the cell, producing ATP through cellular respiration.
- **Endoplasmic Reticulum (ER)**: Network of membranes involved in protein and lipid synthesis.
- **Golgi Apparatus**: Modifies, sorts, and packages proteins and lipids.
- **Lysosomes**: Contain enzymes that break down cellular waste.
- **Ribosomes**: Site of protein synthesis.

## Prokaryotic vs. Eukaryotic Cells
Cells can be classified into two main types: prokaryotic and eukaryotic.

### Prokaryotic Cells
- **No Nucleus**: DNA is located in the cytoplasm.
- **Simple Structure**: Lack membrane-bound organelles.
- **Examples**: Bacteria and Archaea.

### Eukaryotic Cells
- **Nucleus**: DNA is enclosed within a nucleus.
- **Complex Structure**: Contain membrane-bound organelles.
- **Examples**: Animal, plant, fungi, and protist cells.

## Cell Transport Mechanisms
Cell transport mechanisms regulate the movement of substances across the cell membrane.

### Types of Transport
- **Passive Transport**: Does not require energy (e.g., diffusion, osmosis).
- **Active Transport**: Requires energy (e.g., ion pumps, endocytosis, exocytosis).

## Practice Exercise
Draw a diagram of a eukaryotic cell and label its main components.

## Summary
In this lesson, we've learned:
- The main components of a cell and their functions
- The differences between prokaryotic and eukaryotic cells
- The mechanisms of cell transport
`,
    dateCreated: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // Add BSIS lessons
  lessons.push({
    id: "bsis-lesson-1",
    courseId: "bsis-course-1",
    title: "Introduction to Information Systems",
    content: `
# Introduction to Information Systems

## Learning Objectives
- Understand what information systems are and their importance
- Learn about the components of information systems
- Explore the role of information systems in business
- Understand different types of information systems

## What are Information Systems?
Information systems (IS) are integrated sets of components for collecting, storing, processing, and communicating information. Business firms, other organizations, and individuals in contemporary society rely on information systems to manage their operations, compete in the marketplace, supply services, and enhance personal lives.

### Components of Information Systems
Information systems typically include:
- **Hardware**: Physical devices (computers, servers, networks)
- **Software**: Programs and applications
- **Data**: Raw facts and figures
- **Procedures**: Policies and methods
- **People**: Users, developers, and managers

## Information Systems in Business
Information systems play a crucial role in modern business operations:
- Supporting day-to-day operations
- Enabling effective decision-making
- Providing competitive advantage
- Facilitating communication and collaboration
- Enhancing customer service

## Types of Information Systems
Different types of information systems serve various organizational needs:

### Transaction Processing Systems (TPS)
- Handle routine business transactions
- Examples: Point-of-sale systems, payroll systems

### Management Information Systems (MIS)
- Provide reports for management decision-making
- Examples: Sales analysis, inventory reports

### Decision Support Systems (DSS)
- Help managers make semi-structured decisions
- Examples: Financial modeling tools, risk analysis systems

### Executive Information Systems (EIS)
- Provide high-level information for strategic decisions
- Examples: Executive dashboards, trend analysis tools

## The Information Systems Development Lifecycle
The process of creating and maintaining information systems follows a structured approach:
1. Planning
2. Analysis
3. Design
4. Implementation
5. Maintenance

## Practice Exercise
Identify an information system you use regularly and analyze its components (hardware, software, data, procedures, and people).

## Summary
In this lesson, we've learned:
- What information systems are and their components
- The role of information systems in business
- Different types of information systems
- The information systems development lifecycle

## Next Steps
In the next lesson, we'll explore database management systems and their role in information systems.
`,
    dateCreated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  })

  return lessons
}

// Generate sample events
export function generateSampleEvents() {
  const events = []

  events.push({
    id: "event-1",
    departmentId: "dept-1",
    title: "CS Department Seminar",
    description: "Weekly seminar featuring guest speakers from the computer science field",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Gates Building, Room 101",
    type: "Seminar",
  })

  events.push({
    id: "event-2",
    departmentId: "dept-2",
    title: "Math Club Meeting",
    description: "Weekly meeting of the math club to discuss interesting problems and topics",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Building 380, Room 380C",
    type: "Club Meeting",
  })

  // Add BSIS event
  events.push({
    id: "event-3",
    departmentId: "bsis",
    title: "BSIS Career Fair",
    description: "Annual career fair for BSIS students to connect with potential employers",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Main Campus, Building B, Room 201",
    type: "Career Fair",
  })

  return events
}

// Generate sample flashcards
export function generateSampleFlashcards() {
  const flashcards = []

  flashcards.push({
    id: "flashcard-1",
    courseId: "course-1",
    title: "Python Basics",
    cards: [
      {
        term: "Variable",
        definition: "A named storage location in memory",
      },
      {
        term: "Function",
        definition: "A reusable block of code",
      },
    ],
  })

  flashcards.push({
    id: "flashcard-2",
    courseId: "course-4",
    title: "Calculus Concepts",
    cards: [
      {
        term: "Limit",
        definition: "The value that a function approaches as the input approaches some value",
      },
      {
        term: "Derivative",
        definition: "The rate of change of a function",
      },
    ],
  })

  // Add BSIS flashcards
  flashcards.push({
    id: "flashcard-3",
    courseId: "bsis-course-1",
    title: "Information Systems Concepts",
    cards: [
      {
        term: "Information System",
        definition:
          "An integrated set of components for collecting, storing, processing, and communicating information",
      },
      {
        term: "Database",
        definition: "An organized collection of data stored and accessed electronically",
      },
      {
        term: "System Development Life Cycle",
        definition: "A process for planning, creating, testing, and deploying an information system",
      },
    ],
  })

  return flashcards
}

// Generate sample quizzes
export function generateSampleQuizzes() {
  const quizzes = []

  quizzes.push({
    id: "quiz-1",
    courseId: "course-1",
    title: "Python Quiz",
    questions: [
      {
        question: "What is the correct way to comment a single line in Python?",
        options: [
          "// This is a comment",
          "# This is a comment",
          "/* This is a comment */",
          "<!-- This is a comment -->",
        ],
        answer: 1,
      },
      {
        question: "Which keyword is used to define a function in Python?",
        options: ["def", "function", "define", "fun"],
        answer: 0,
      },
    ],
  })

  quizzes.push({
    id: "quiz-2",
    courseId: "course-4",
    title: "Calculus Quiz",
    questions: [
      {
        question: "What is the derivative of x^2?",
        options: ["x", "2x", "x^3", "2"],
        answer: 1,
      },
      {
        question: "What is the integral of 1?",
        options: ["0", "x", "C", "1"],
        answer: 1,
      },
    ],
  })

  // Add BSIS quiz
  quizzes.push({
    id: "quiz-3",
    courseId: "bsis-course-1",
    title: "Information Systems Fundamentals",
    questions: [
      {
        question: "Which of the following is NOT a component of an information system?",
        options: ["Hardware", "Software", "Data", "Marketing"],
        answer: 3,
      },
      {
        question: "What type of information system handles routine business transactions?",
        options: [
          "Decision Support System",
          "Executive Information System",
          "Transaction Processing System",
          "Expert System",
        ],
        answer: 2,
      },
      {
        question: "Which phase of the SDLC involves gathering requirements?",
        options: ["Planning", "Analysis", "Design", "Implementation"],
        answer: 1,
      },
    ],
  })

  return quizzes
}

// Generate sample bookmarks
export function generateSampleBookmarks() {
  const bookmarks = []

  bookmarks.push({
    id: "bookmark-1",
    type: "lesson",
    title: "Introduction to Python",
    timestamp: new Date().toISOString(),
  })

  bookmarks.push({
    id: "bookmark-2",
    type: "event",
    title: "CS Department Seminar",
    timestamp: new Date().toISOString(),
  })

  // Add BSIS bookmark
  bookmarks.push({
    id: "bsis-lesson-1",
    type: "lesson",
    title: "Introduction to Information Systems",
    timestamp: new Date().toISOString(),
  })

  return bookmarks
}
