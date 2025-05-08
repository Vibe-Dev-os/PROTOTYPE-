// Simple initialization utility functions

/**
 * Initialize basic application data
 */
export function initializeBasicData() {
  if (typeof window === "undefined") return

  try {
    // Check if already initialized
    if (localStorage.getItem("acadGuideInitialized") === "true") {
      console.log("Application already initialized")
      return
    }

    console.log("Initializing application data...")

    // Add basic departments
    const departments = [
      {
        id: "cs",
        name: "Computer Science",
        code: "CS",
        description: "Study of computers and computational systems",
      },
      {
        id: "math",
        name: "Mathematics",
        code: "MATH",
        description: "Study of numbers, quantity, and space",
      },
      {
        id: "phys",
        name: "Physics",
        code: "PHYS",
        description: "Study of matter, energy, and the interaction between them",
      },
      {
        id: "bio",
        name: "Biology",
        code: "BIO",
        description: "Study of living organisms",
      },
      {
        id: "chem",
        name: "Chemistry",
        code: "CHEM",
        description: "Study of substances and their interactions",
      },
      {
        id: "eng",
        name: "Engineering",
        code: "ENG",
        description: "Application of scientific knowledge to design and build",
      },
      {
        id: "bsis",
        name: "Bachelor of Science in Information Systems",
        code: "BSIS",
        description: "Study of information systems and their application in business and organizations",
      },
    ]

    localStorage.setItem("acadGuideDepartments", JSON.stringify(departments))

    // Mark as initialized
    localStorage.setItem("acadGuideInitialized", "true")
    console.log("Basic data initialized successfully")
  } catch (error) {
    console.error("Error initializing basic data:", error)
  }
}
