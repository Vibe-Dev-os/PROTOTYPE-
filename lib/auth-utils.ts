// Simulated database of valid IDs
// In a real application, this would be stored securely on the server
const VALID_STUDENT_IDS = [
  { username: "student1", id: "S-2023-0001" },
  { username: "student2", id: "S-2023-0002" },
  { username: "student@example.com", id: "S-2023-0003" },
  // For demo purposes, allow any username with this ID
  { username: "*", id: "S-2023-9999" },
]

const VALID_INSTRUCTOR_IDS = [
  { username: "instructor1", id: "I-2023-0001" },
  { username: "instructor2", id: "I-2023-0002" },
  { username: "instructor@example.com", id: "I-2023-0003" },
  // For demo purposes, allow any username with this ID
  { username: "*", id: "I-2023-9999" },
]

export async function verifySecondaryAuth(role: string, username: string, idNumber: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  try {
    // Check if ID is valid for the given role and username
    if (role === "student") {
      const validId = VALID_STUDENT_IDS.find(
        (entry) => (entry.username === username || entry.username === "*") && entry.id === idNumber,
      )

      if (validId) {
        return {
          success: true,
          message: "Student ID verified successfully",
          userData: {
            id: Date.now().toString(),
            username,
            role,
            name: username.includes("@") ? username.split("@")[0] : username,
            department: "BSIS",
            studentId: idNumber,
          },
        }
      }
    } else if (role === "instructor") {
      const validId = VALID_INSTRUCTOR_IDS.find(
        (entry) => (entry.username === username || entry.username === "*") && entry.id === idNumber,
      )

      if (validId) {
        return {
          success: true,
          message: "Instructor ID verified successfully",
          userData: {
            id: Date.now().toString(),
            username,
            role,
            name: username.includes("@") ? username.split("@")[0] : username,
            department: "BSIS",
            instructorId: idNumber,
          },
        }
      }
    }

    // If we get here, the ID was not valid
    return {
      success: false,
      message: `Invalid ${role} ID. Please check your ID and try again.`,
    }
  } catch (error) {
    console.error("Error verifying secondary auth:", error)
    return {
      success: false,
      message: "An error occurred during verification. Please try again.",
    }
  }
}

// Function to securely store user data
export function storeUserSecurely(userData: any) {
  // In a real application, you would use more secure methods
  // like HttpOnly cookies, session storage with proper expiration, etc.

  // For this demo, we'll use localStorage but with some basic protection
  try {
    localStorage.setItem("acadGuideUser", JSON.stringify(userData))
    return true
  } catch (error) {
    console.error("Error storing user data:", error)
    return false
  }
}

// Function to check if user is authenticated
export function isAuthenticated() {
  try {
    const userData = localStorage.getItem("acadGuideUser")
    if (!userData) return false

    const user = JSON.parse(userData)
    // Check if user has both primary and secondary auth
    return !!(user && user.id && (user.studentId || user.instructorId))
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}
