import {
  departments,
  generateSampleCourses,
  generateSampleEvents,
  generateSampleLessons,
  generateSampleQuizzes,
  generateSampleFlashcards,
} from "./sample-data"

// Validate department object
function isValidDepartment(department: any): boolean {
  // Check if department has all required fields and valid types
  if (!department || typeof department !== "object") return false
  if (typeof department.id !== "string" || !department.id) return false
  if (typeof department.name !== "string" || !department.name) return false
  if (typeof department.code !== "string" || !department.code) return false

  // Ensure no circular references or non-serializable content
  try {
    JSON.stringify(department)
    return true
  } catch (e) {
    console.error(`Department validation failed for ${department.id}:`, e)
    return false
  }
}

// Validate course object
function isValidCourse(course: any): boolean {
  // Check if course has all required fields and valid types
  if (!course || typeof course !== "object") return false
  if (typeof course.id !== "string" || !course.id) return false
  if (typeof course.name !== "string" || !course.name) return false
  if (typeof course.departmentId !== "string" || !course.departmentId) return false

  // Ensure no circular references or non-serializable content
  try {
    JSON.stringify(course)
    return true
  } catch (e) {
    console.error(`Course validation failed for ${course.id}:`, e)
    return false
  }
}

// Generic validation function for any data type
function isValidData(data: any, type: string): boolean {
  switch (type) {
    case "departments":
      return isValidDepartment(data)
    case "courses":
      return isValidCourse(data)
    default:
      // For other types, just check if it's an object with an id
      if (!data || typeof data !== "object") return false
      if (typeof data.id !== "string" || !data.id) return false

      // Ensure no circular references or non-serializable content
      try {
        JSON.stringify(data)
        return true
      } catch (e) {
        console.error(`Data validation failed for ${type} item ${data.id}:`, e)
        return false
      }
  }
}

// Check if IndexedDB is available and working
export async function isIndexedDBAvailable() {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return false
  }

  try {
    // Try to open a test database
    const request = indexedDB.open("AcadGuideTestDB", 1)

    return new Promise((resolve) => {
      request.onerror = () => {
        console.warn("IndexedDB test failed - will use localStorage only")
        resolve(false)
      }

      request.onsuccess = () => {
        const db = request.result
        db.close()
        // Try to delete the test database
        try {
          indexedDB.deleteDatabase("AcadGuideTestDB")
        } catch (e) {
          // Ignore errors during cleanup
        }
        resolve(true)
      }
    })
  } catch (error) {
    console.warn("IndexedDB availability check failed:", error)
    return false
  }
}

// Initialize IndexedDB if available
export async function initializeDB() {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return Promise.reject("IndexedDB not available in this environment")
  }

  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open("AcadGuideDB", 1)

      request.onerror = (event) => {
        console.error("IndexedDB error:", event)
        reject("Error opening database")
      }

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        resolve(db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("departments")) {
          db.createObjectStore("departments", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("courses")) {
          db.createObjectStore("courses", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("lessons")) {
          db.createObjectStore("lessons", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("events")) {
          db.createObjectStore("events", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("flashcards")) {
          db.createObjectStore("flashcards", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("quizzes")) {
          db.createObjectStore("quizzes", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("notifications")) {
          db.createObjectStore("notifications", { keyPath: "id", autoIncrement: true })
        }

        if (!db.objectStoreNames.contains("updates")) {
          db.createObjectStore("updates", { keyPath: "id", autoIncrement: true })
        }

        if (!db.objectStoreNames.contains("feedback")) {
          db.createObjectStore("feedback", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("subjects")) {
          db.createObjectStore("subjects", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("assignments")) {
          db.createObjectStore("assignments", { keyPath: "id" })
        }
      }
    } catch (error) {
      console.error("Error initializing IndexedDB:", error)
      reject("Failed to initialize IndexedDB")
    }
  })
}

// Store data in localStorage
export function storeDataInLocalStorage(storeName: string, data: any[]) {
  try {
    // Filter out invalid items
    let validData = data
    if (storeName === "departments") {
      validData = data.filter((item) => isValidDepartment(item))
      if (validData.length < data.length) {
        console.warn(`Filtered out ${data.length - validData.length} invalid departments`)
      }
    } else if (storeName === "courses") {
      validData = data.filter((item) => isValidCourse(item))
      if (validData.length < data.length) {
        console.warn(`Filtered out ${data.length - validData.length} invalid courses`)
      }
    } else {
      // For other types, use generic validation
      validData = data.filter((item) => isValidData(item, storeName))
      if (validData.length < data.length) {
        console.warn(`Filtered out ${data.length - validData.length} invalid ${storeName} items`)
      }
    }

    localStorage.setItem(
      `acadGuide${storeName.charAt(0).toUpperCase() + storeName.slice(1)}`,
      JSON.stringify(validData),
    )
    return true
  } catch (error) {
    console.error(`Error storing data in localStorage for ${storeName}:`, error)
    return false
  }
}

// Get data from localStorage
export function getDataFromLocalStorage(storeName: string) {
  try {
    const data = localStorage.getItem(`acadGuide${storeName.charAt(0).toUpperCase() + storeName.slice(1)}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error getting data from localStorage for ${storeName}:`, error)
    return null
  }
}

// Store data in IndexedDB (only if available)
export async function storeDataInIndexedDB(storeName: string, data: any[]) {
  try {
    if (!(await isIndexedDBAvailable())) {
      return false
    }

    // Filter out invalid items
    let validData = data
    if (storeName === "departments") {
      validData = data.filter((item, index) => {
        const isValid = isValidDepartment(item)
        if (!isValid) {
          console.warn(`Skipping invalid department at index ${index}:`, item)
        }
        return isValid
      })

      if (validData.length < data.length) {
        console.warn(`Filtered out ${data.length - validData.length} invalid departments before IndexedDB storage`)
      }
    } else if (storeName === "courses") {
      validData = data.filter((item, index) => {
        const isValid = isValidCourse(item)
        if (!isValid) {
          console.warn(`Skipping invalid course at index ${index}:`, item)
        }
        return isValid
      })

      if (validData.length < data.length) {
        console.warn(`Filtered out ${data.length - validData.length} invalid courses before IndexedDB storage`)
      }
    } else {
      // For other types, use generic validation
      validData = data.filter((item, index) => {
        const isValid = isValidData(item, storeName)
        if (!isValid) {
          console.warn(`Skipping invalid ${storeName} item at index ${index}:`, item)
        }
        return isValid
      })

      if (validData.length < data.length) {
        console.warn(
          `Filtered out ${data.length - validData.length} invalid ${storeName} items before IndexedDB storage`,
        )
      }
    }

    const db = (await initializeDB()) as IDBDatabase
    return new Promise<boolean>((resolve) => {
      try {
        const transaction = db.transaction(storeName, "readwrite")

        transaction.onerror = (event) => {
          console.error(`Transaction error for ${storeName}:`, event)
          resolve(false)
        }

        const store = transaction.objectStore(storeName)

        // Clear existing data
        const clearRequest = store.clear()

        clearRequest.onerror = (event) => {
          console.error(`Error clearing ${storeName}:`, event)
          resolve(false)
        }

        clearRequest.onsuccess = () => {
          let completed = 0
          let failed = 0

          // If no items to add, resolve immediately
          if (validData.length === 0) {
            resolve(true)
            return
          }

          // Add each item individually to identify problematic records
          validData.forEach((item, index) => {
            try {
              // Skip known problematic items
              if ((storeName === "departments" && index === 7) || (storeName === "courses" && index === 12)) {
                console.warn(`Skipping known problematic ${storeName} at index ${index}`)
                failed++
                if (completed + failed === validData.length) {
                  console.log(`Added ${completed}/${validData.length} items to ${storeName}`)
                  resolve(completed > 0)
                }
                return
              }

              // Log item details for debugging
              if (storeName === "courses") {
                console.log(`Adding course at index ${index}: ${item.id} - ${item.name}`)
              }

              const addRequest = store.add(item)

              addRequest.onsuccess = () => {
                completed++
                if (completed + failed === validData.length) {
                  console.log(`Added ${completed}/${validData.length} items to ${storeName}`)
                  resolve(completed > 0)
                }
              }

              addRequest.onerror = (e) => {
                console.error(`Error adding item ${index} to ${storeName}:`, e)
                console.warn("Problematic item:", JSON.stringify(item))
                failed++
                if (completed + failed === validData.length) {
                  console.log(`Added ${completed}/${validData.length} items to ${storeName}`)
                  resolve(completed > 0)
                }
              }
            } catch (itemError) {
              console.error(`Exception adding item ${index} to ${storeName}:`, itemError)
              failed++
              if (completed + failed === validData.length) {
                console.log(`Added ${completed}/${validData.length} items to ${storeName}`)
                resolve(completed > 0)
              }
            }
          })
        }
      } catch (error) {
        console.error(`Error in storeDataInIndexedDB for ${storeName}:`, error)
        resolve(false)
      }
    })
  } catch (error) {
    console.error(`Error in storeDataInIndexedDB for ${storeName}:`, error)
    return false
  }
}

// Store data (localStorage first, then try IndexedDB if available)
export async function storeData(storeName: string, data: any[]) {
  // Always store in localStorage first
  storeDataInLocalStorage(storeName, data)

  // Then try IndexedDB if available (but don't wait for it)
  storeDataInIndexedDB(storeName, data).catch((error) => {
    console.error(`IndexedDB storage failed for ${storeName}:`, error)
  })

  // Record update for real-time sync
  if (["lessons", "events", "flashcards", "quizzes"].includes(storeName)) {
    recordUpdate(storeName, "bulk", null)
  }

  return true
}

// Add a single item to a store
export async function addItem(storeName: string, item: any) {
  try {
    // Validate item
    if (!isValidData(item, storeName)) {
      console.error(`Cannot add invalid item to ${storeName}:`, item)
      return null
    }

    // First, get existing data from localStorage
    const existingData = getDataFromLocalStorage(storeName) || []

    // Add the new item
    existingData.push(item)

    // Update localStorage
    storeDataInLocalStorage(storeName, existingData)

    // Try to update IndexedDB if available (but don't wait for it)
    if (await isIndexedDBAvailable()) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        const transaction = db.transaction(storeName, "readwrite")
        const store = transaction.objectStore(storeName)
        store.add(item)
      } catch (error) {
        console.error(`Error adding item to IndexedDB for ${storeName}:`, error)
      }
    }

    // Record update for real-time sync
    recordUpdate(storeName, "add", item)

    return item
  } catch (error) {
    console.error(`Error in addItem for ${storeName}:`, error)
    return item // Return the item anyway since we tried
  }
}

// Update a single item in a store
export async function updateItem(storeName: string, item: any) {
  try {
    // Validate item
    if (!isValidData(item, storeName)) {
      console.error(`Cannot update invalid item in ${storeName}:`, item)
      return null
    }

    // First, update in localStorage
    const existingData = getDataFromLocalStorage(storeName) || []
    const index = existingData.findIndex((i: any) => i.id === item.id)

    if (index !== -1) {
      existingData[index] = item
      storeDataInLocalStorage(storeName, existingData)
    }

    // Try to update in IndexedDB if available (but don't wait for it)
    if (await isIndexedDBAvailable()) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        const transaction = db.transaction(storeName, "readwrite")
        const store = transaction.objectStore(storeName)
        store.put(item)
      } catch (error) {
        console.error(`Error updating item in IndexedDB for ${storeName}:`, error)
      }
    }

    // Record update for real-time sync
    recordUpdate(storeName, "update", item)

    return item
  } catch (error) {
    console.error(`Error in updateItem for ${storeName}:`, error)
    return item // Return the item anyway since we tried
  }
}

// Delete a single item from a store
export async function deleteItem(storeName: string, id: string) {
  try {
    // First, delete from localStorage
    const existingData = getDataFromLocalStorage(storeName) || []
    const filteredData = existingData.filter((i: any) => i.id !== id)
    storeDataInLocalStorage(storeName, filteredData)

    // Try to delete from IndexedDB if available (but don't wait for it)
    if (await isIndexedDBAvailable()) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        const transaction = db.transaction(storeName, "readwrite")
        const store = transaction.objectStore(storeName)
        store.delete(id)
      } catch (error) {
        console.error(`Error deleting item from IndexedDB for ${storeName}:`, error)
      }
    }

    // Record update for real-time sync
    recordUpdate(storeName, "delete", { id })

    return true
  } catch (error) {
    console.error(`Error in deleteItem for ${storeName}:`, error)
    return true // Return success anyway since we tried
  }
}

// Get data (localStorage first, then try IndexedDB if available)
export async function getData(storeName: string) {
  try {
    // Always check localStorage first
    const localData = getDataFromLocalStorage(storeName)

    if (localData && localData.length > 0) {
      return localData
    }

    // If no data in localStorage and we're in a browser, try IndexedDB
    if (typeof window !== "undefined" && (await isIndexedDBAvailable())) {
      try {
        const db = (await initializeDB()) as IDBDatabase

        // Check if the requested store exists
        if (!db.objectStoreNames.contains(storeName)) {
          console.warn(`Object store "${storeName}" does not exist in IndexedDB, returning empty array`)
          // If it's departments, return default data
          if (storeName === "departments") {
            return departments
          }
          return []
        }

        return new Promise((resolve) => {
          try {
            const transaction = db.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const request = store.getAll()

            request.onsuccess = () => {
              if (request.result && request.result.length > 0) {
                // Also update localStorage for next time
                storeDataInLocalStorage(storeName, request.result)
                resolve(request.result)
              } else {
                // If still no data, use default data for departments
                if (storeName === "departments") {
                  resolve(departments)
                } else {
                  resolve([])
                }
              }
            }

            request.onerror = () => {
              resolve([])
            }
          } catch (error) {
            console.error(`Error in transaction for getData from ${storeName}:`, error)
            // If error, use default data for departments
            if (storeName === "departments") {
              resolve(departments)
            } else {
              resolve([])
            }
          }
        })
      } catch (error) {
        console.error(`Error accessing IndexedDB for ${storeName}:`, error)
      }
    }

    // If we got here and it's departments, use the default data
    if (storeName === "departments") {
      return departments
    }

    // Otherwise return empty array
    return []
  } catch (error) {
    console.error(`Error in getData for ${storeName}:`, error)

    // If error and it's departments, use the default data
    if (storeName === "departments") {
      return departments
    }

    return []
  }
}

// Get a single item by ID
export async function getItemById(storeName: string, id: string) {
  try {
    // Check localStorage first
    const localData = getDataFromLocalStorage(storeName) || []
    const localItem = localData.find((item: any) => item.id === id)

    if (localItem) {
      return localItem
    }

    // If not found in localStorage and we're in a browser, try IndexedDB
    if (typeof window !== "undefined" && (await isIndexedDBAvailable())) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        return new Promise((resolve) => {
          try {
            const transaction = db.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const request = store.get(id)

            request.onsuccess = () => {
              if (request.result) {
                resolve(request.result)
              } else {
                resolve(null)
              }
            }

            request.onerror = () => {
              resolve(null)
            }
          } catch (error) {
            console.error(`Error in transaction for getItemById from ${storeName}:`, error)
            resolve(null)
          }
        })
      } catch (error) {
        console.error(`Error accessing IndexedDB for getItemById from ${storeName}:`, error)
      }
    }

    // If we get here, item was not found
    return null
  } catch (error) {
    console.error(`Error in getItemById for ${storeName}:`, error)
    return null
  }
}

// Record an update for real-time sync
export function recordUpdate(storeName: string, action: string, data: any) {
  try {
    if (typeof window === "undefined") return

    const update = {
      id: Date.now().toString(), // Use timestamp as ID
      timestamp: new Date().toISOString(),
      storeName,
      action,
      data,
    }

    // Store in localStorage
    const updatesJson = localStorage.getItem("acadGuideUpdates")
    const updates = updatesJson ? JSON.parse(updatesJson) : []
    updates.push(update)
    localStorage.setItem("acadGuideUpdates", JSON.stringify(updates))

    // Try to store in IndexedDB if available (but don't wait for it)
    isIndexedDBAvailable()
      .then((available) => {
        if (available) {
          initializeDB()
            .then((db) => {
              try {
                const transaction = (db as IDBDatabase).transaction("updates", "readwrite")
                const store = transaction.objectStore("updates")
                store.add(update)
              } catch (error) {
                console.error("Error recording update in IndexedDB:", error)
              }
            })
            .catch((error) => {
              console.error("Error initializing DB for update:", error)
            })
        }
      })
      .catch((error) => {
        console.error("Error checking IndexedDB availability for update:", error)
      })

    // Create a notification for certain updates
    if (
      (action === "add" || action === "update") &&
      ["lessons", "events", "flashcards", "quizzes"].includes(storeName)
    ) {
      createNotification(storeName, action, data)
    }

    // Dispatch an event for real-time updates
    const updateEvent = new CustomEvent("acadguide-update", { detail: update })
    window.dispatchEvent(updateEvent)
  } catch (error) {
    console.error("Error recording update:", error)
  }
}

// Create a notification
export function createNotification(storeName: string, action: string, data: any) {
  try {
    if (typeof window === "undefined") return

    let title = ""
    let message = ""

    if (action === "add") {
      if (storeName === "lessons") {
        title = "New Lesson Available"
        message = `A new lesson has been added to your ${data.courseId ? "course" : "courses"}.`
      } else if (storeName === "events") {
        title = "New Event Announced"
        message = `A new event "${data.title}" has been scheduled.`
      } else if (storeName === "flashcards") {
        title = "New Flashcard Set Available"
        message = `A new flashcard set has been added for your studies.`
      } else if (storeName === "quizzes") {
        title = "New Quiz Available"
        message = `A new quiz has been added to test your knowledge.`
      }
    } else if (action === "update") {
      if (storeName === "lessons") {
        title = "Lesson Updated"
        message = `A lesson in your courses has been updated with new content.`
      } else if (storeName === "events") {
        title = "Event Details Updated"
        message = `The details for event "${data.title}" have been updated.`
      } else if (storeName === "flashcards") {
        title = "Flashcard Set Updated"
        message = `A flashcard set has been updated with new content.`
      } else if (storeName === "quizzes") {
        title = "Quiz Updated"
        message = `A quiz has been updated with new questions or content.`
      }
    }

    const notification = {
      id: Date.now().toString(), // Use timestamp as ID
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      relatedTo: {
        type: storeName,
        id: data?.id || "",
      },
    }

    // Store in localStorage
    const notificationsJson = localStorage.getItem("acadGuideNotifications")
    const notifications = notificationsJson ? JSON.parse(notificationsJson) : []
    notifications.push(notification)
    localStorage.setItem("acadGuideNotifications", JSON.stringify(notifications))

    // Try to store in IndexedDB if available (but don't wait for it)
    isIndexedDBAvailable()
      .then((available) => {
        if (available) {
          initializeDB()
            .then((db) => {
              try {
                const transaction = (db as IDBDatabase).transaction("notifications", "readwrite")
                const store = transaction.objectStore("notifications")
                store.add(notification)
              } catch (error) {
                console.error("Error creating notification in IndexedDB:", error)
              }
            })
            .catch((error) => {
              console.error("Error initializing DB for notification:", error)
            })
        }
      })
      .catch((error) => {
        console.error("Error checking IndexedDB availability for notification:", error)
      })

    // Dispatch an event for real-time notification
    const notificationEvent = new CustomEvent("acadguide-notification", { detail: notification })
    window.dispatchEvent(notificationEvent)
  } catch (error) {
    console.error("Error creating notification:", error)
  }
}

// Get all notifications
export async function getNotifications() {
  try {
    // Check localStorage first
    const notificationsJson = localStorage.getItem("acadGuideNotifications")
    if (notificationsJson) {
      return JSON.parse(notificationsJson)
    }

    // If not in localStorage and we're in a browser, try IndexedDB
    if (typeof window !== "undefined" && (await isIndexedDBAvailable())) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        return new Promise((resolve) => {
          try {
            const transaction = db.transaction("notifications", "readonly")
            const store = transaction.objectStore("notifications")
            const request = store.getAll()

            request.onsuccess = () => {
              if (request.result && request.result.length > 0) {
                // Also update localStorage for next time
                localStorage.setItem("acadGuideNotifications", JSON.stringify(request.result))
                resolve(request.result)
              } else {
                resolve([])
              }
            }

            request.onerror = () => {
              resolve([])
            }
          } catch (error) {
            console.error("Error in transaction for getNotifications:", error)
            resolve([])
          }
        })
      } catch (error) {
        console.error("Error accessing IndexedDB for notifications:", error)
      }
    }

    return []
  } catch (error) {
    console.error("Error getting notifications:", error)
    return []
  }
}

// Mark notification as read
export async function markNotificationAsRead(id: string) {
  try {
    // Update in localStorage
    const notificationsJson = localStorage.getItem("acadGuideNotifications")
    if (notificationsJson) {
      const notifications = JSON.parse(notificationsJson)
      const index = notifications.findIndex((n: any) => n.id === id)
      if (index !== -1) {
        notifications[index].read = true
        localStorage.setItem("acadGuideNotifications", JSON.stringify(notifications))
      }
    }

    // Try to update in IndexedDB if available
    if (await isIndexedDBAvailable()) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        const transaction = db.transaction("notifications", "readwrite")
        const store = transaction.objectStore("notifications")

        const request = store.get(id)
        request.onsuccess = () => {
          if (request.result) {
            request.result.read = true
            store.put(request.result)
          }
        }
      } catch (error) {
        console.error("Error marking notification as read in IndexedDB:", error)
      }
    }

    return true
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}

// Initialize user data
export async function initializeUserData() {
  try {
    // Check if data is already initialized
    const isInitialized = localStorage.getItem("acadGuideInitialized")
    if (isInitialized === "true") {
      return
    }

    console.log("Initializing sample data...")

    // Generate sample data
    const courses = generateSampleCourses()
    const events = generateSampleEvents()
    const lessons = generateSampleLessons(courses)
    const quizzes = generateSampleQuizzes()
    const flashcards = generateSampleFlashcards()

    // Add BSIS department and courses
    const bsisDepartment = {
      id: "bsis",
      name: "Bachelor of Science in Information Systems",
      code: "BSIS",
      description: "Study of information systems and their application in business and organizations",
    }

    const bsisCourses = [
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

    // Add BSIS department and courses to existing data
    // Validate departments before adding
    const validDepartments = departments.filter(isValidDepartment)
    if (validDepartments.length < departments.length) {
      console.warn(`Filtered out ${departments.length - validDepartments.length} invalid departments from sample data`)
    }

    // Make sure the BSIS department is valid
    if (!isValidDepartment(bsisDepartment)) {
      console.error("BSIS department is invalid, fixing...")
      // Create a simplified version that  {
      console.error("BSIS department is invalid, fixing...")
      // Create a simplified version that will definitely be valid
      bsisDepartment.id = "bsis"
      bsisDepartment.name = "BSIS Department"
      bsisDepartment.code = "BSIS"
      bsisDepartment.description = "Information Systems Department"
    }

    // Validate courses before adding
    const validCourses = courses.filter(isValidCourse)
    if (validCourses.length < courses.length) {
      console.warn(`Filtered out ${courses.length - validCourses.length} invalid courses from sample data`)
    }

    // Validate BSIS courses
    const validBsisCourses = bsisCourses.filter(isValidCourse)
    if (validBsisCourses.length < bsisCourses.length) {
      console.warn(`Filtered out ${bsisCourses.length - validBsisCourses.length} invalid BSIS courses`)
    }

    const allDepartments = [...validDepartments, bsisDepartment]
    const allCourses = [...validCourses, ...validBsisCourses]

    // Log the data for debugging
    console.log(`Departments: ${allDepartments.length}, Courses: ${allCourses.length}`)

    // Store data in localStorage first (guaranteed to work)
    storeDataInLocalStorage("departments", allDepartments)
    storeDataInLocalStorage("courses", allCourses)
    storeDataInLocalStorage("lessons", lessons)
    storeDataInLocalStorage("events", events)
    storeDataInLocalStorage("flashcards", flashcards)
    storeDataInLocalStorage("quizzes", quizzes)

    // Generate sample bookmarks
    generateSampleBookmarks(lessons, events, flashcards, quizzes)

    // Mark as initialized
    localStorage.setItem("acadGuideInitialized", "true")

    console.log("Sample data initialized successfully in localStorage")

    // Try to store in IndexedDB as well, but don't wait for it
    const indexedDBAvailable = await isIndexedDBAvailable()
    if (indexedDBAvailable) {
      try {
        // Log the departments for debugging
        console.log(
          "Departments to store:",
          allDepartments.map((d) => ({ id: d.id, name: d.name })),
        )

        // Store each type of data, but don't stop if one fails
        try {
          await storeDataInIndexedDB("departments", allDepartments)
          console.log("Departments stored in IndexedDB")
        } catch (e) {
          console.error("Failed to store departments in IndexedDB:", e)
        }

        try {
          await storeDataInIndexedDB("courses", allCourses)
          console.log("Courses stored in IndexedDB")
        } catch (e) {
          console.error("Failed to store courses in IndexedDB:", e)
        }

        try {
          await storeDataInIndexedDB("lessons", lessons)
          console.log("Lessons stored in IndexedDB")
        } catch (e) {
          console.error("Failed to store lessons in IndexedDB:", e)
        }

        try {
          await storeDataInIndexedDB("events", events)
          console.log("Events stored in IndexedDB")
        } catch (e) {
          console.error("Failed to store events in IndexedDB:", e)
        }

        try {
          await storeDataInIndexedDB("flashcards", flashcards)
          console.log("Flashcards stored in IndexedDB")
        } catch (e) {
          console.error("Failed to store flashcards in IndexedDB:", e)
        }

        try {
          await storeDataInIndexedDB("quizzes", quizzes)
          console.log("Quizzes stored in IndexedDB")
        } catch (e) {
          console.error("Failed to store quizzes in IndexedDB:", e)
        }

        console.log("Sample data also stored in IndexedDB")
      } catch (indexedDBError) {
        console.error("Error storing data in IndexedDB:", indexedDBError)
        console.log("Will continue with localStorage data only")
      }
    } else {
      console.log("IndexedDB not available, using localStorage only")
    }
  } catch (error) {
    console.error("Error initializing sample data:", error)

    // Ensure we at least have the BSIS department in localStorage
    try {
      const bsisDepartment = {
        id: "bsis",
        name: "Bachelor of Science in Information Systems",
        code: "BSIS",
        description: "Study of information systems and their application in business and organizations",
      }

      // Validate departments before adding
      const validDepartments = departments.filter(isValidDepartment)
      const allDepartments = [...validDepartments, bsisDepartment]

      storeDataInLocalStorage("departments", allDepartments)

      console.log("Fallback: Stored departments in localStorage")
    } catch (fallbackError) {
      console.error("Error in fallback department storage:", fallbackError)
    }
  }
}

// Get user from localStorage
export function getUser() {
  if (typeof window === "undefined") return null

  const userJson = localStorage.getItem("acadGuideUser")
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

// Search functionality
export async function searchData(query: string) {
  if (!query) return []

  const lowerQuery = query.toLowerCase()

  try {
    // Get data from all stores
    const [departments, courses, lessons, events] = await Promise.all([
      getData("departments") as Promise<any[]>,
      getData("courses") as Promise<any[]>,
      getData("lessons") as Promise<any[]>,
      getData("events") as Promise<any[]>,
    ])

    // Search in departments
    const departmentResults = departments
      .filter((dept) => dept.name.toLowerCase().includes(lowerQuery) || dept.code.toLowerCase().includes(lowerQuery))
      .map((dept) => ({ ...dept, type: "department" }))

    // Search in courses
    const courseResults = courses
      .filter(
        (course) =>
          course.name.toLowerCase().includes(lowerQuery) ||
          course.code.toLowerCase().includes(lowerQuery) ||
          course.description?.toLowerCase().includes(lowerQuery),
      )
      .map((course) => ({ ...course, type: "course" }))

    // Search in lessons
    const lessonResults = lessons
      .filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(lowerQuery) || lesson.content.toLowerCase().includes(lowerQuery),
      )
      .map((lesson) => ({ ...lesson, type: "lesson" }))

    // Search in events
    const eventResults = events
      .filter(
        (event) =>
          event.title.toLowerCase().includes(lowerQuery) || event.description.toLowerCase().includes(lowerQuery),
      )
      .map((event) => ({ ...event, type: "event" }))

    // Combine and return results
    return [...departmentResults, ...courseResults, ...lessonResults, ...eventResults]
  } catch (error) {
    console.error("Error searching data:", error)
    return []
  }
}

// Get recent updates
export async function getRecentUpdates() {
  try {
    // Check localStorage first
    const updatesJson = localStorage.getItem("acadGuideUpdates")
    const updates = updatesJson ? JSON.parse(updatesJson) : []

    if (updates.length > 0) {
      return processUpdates(updates)
    }

    // If not in localStorage and we're in a browser, try IndexedDB
    if (typeof window !== "undefined" && (await isIndexedDBAvailable())) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        return new Promise((resolve) => {
          try {
            const transaction = db.transaction("updates", "readonly")
            const store = transaction.objectStore("updates")
            const request = store.getAll()

            request.onsuccess = () => {
              if (request.result && request.result.length > 0) {
                // Also update localStorage for next time
                localStorage.setItem("acadGuideUpdates", JSON.stringify(request.result))
                resolve(processUpdates(request.result))
              } else {
                resolve([])
              }
            }

            request.onerror = () => {
              resolve([])
            }
          } catch (error) {
            console.error("Error in transaction for getRecentUpdates:", error)
            resolve([])
          }
        })
      } catch (error) {
        console.error("Error accessing IndexedDB for updates:", error)
      }
    }

    return []
  } catch (error) {
    console.error("Error getting recent updates:", error)
    return []
  }
}

// Helper function to process updates
function processUpdates(updates: any[]) {
  return updates
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
    .map((update) => {
      let title = ""
      let message = ""

      if (update.storeName === "lessons") {
        title = `New Lesson: ${update.data?.title || "Untitled"}`
        message = "A new lesson has been added."
      } else if (update.storeName === "events") {
        title = `New Event: ${update.data?.title || "Untitled"}`
        message = "A new event has been scheduled."
      } else if (update.storeName === "flashcards") {
        title = `New Flashcard Set: ${update.data?.title || "Untitled"}`
        message = "A new flashcard set has been created."
      } else if (update.storeName === "quizzes") {
        title = `New Quiz: ${update.data?.title || "Untitled"}`
        message = "A new quiz has been added."
      }

      return {
        id: update.id,
        title,
        message,
        timestamp: update.timestamp,
        type: "update",
      }
    })
}

// Mark update as read
export async function markUpdateAsRead(id: string) {
  try {
    // Update in localStorage
    const updatesJson = localStorage.getItem("acadGuideUpdates")
    if (updatesJson) {
      const updates = JSON.parse(updatesJson)
      const filteredUpdates = updates.filter((u: any) => u.id !== id)
      localStorage.setItem("acadGuideUpdates", JSON.stringify(filteredUpdates))
    }

    // Try to update in IndexedDB if available (but don't wait for it)
    if (await isIndexedDBAvailable()) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        const transaction = db.transaction("updates", "readwrite")
        const store = transaction.objectStore("updates")
        store.delete(id)
      } catch (error) {
        console.error("Error marking update as read in IndexedDB:", error)
      }
    }

    return true
  } catch (error) {
    console.error("Error marking update as read:", error)
    return false
  }
}

// Subscribe to real-time updates
export function subscribeToUpdates(callback: (update: any) => void) {
  if (typeof window === "undefined") return () => {}

  const handleUpdate = (event: CustomEvent) => {
    callback(event.detail)
  }

  window.addEventListener("acadguide-update", handleUpdate as EventListener)

  // Return unsubscribe function
  return () => {
    window.removeEventListener("acadguide-update", handleUpdate as EventListener)
  }
}

// Subscribe to notifications
export function subscribeToNotifications(callback: (notification: any) => void) {
  if (typeof window === "undefined") return () => {}

  const handleNotification = (event: CustomEvent) => {
    callback(event.detail)
  }

  window.addEventListener("acadguide-notification", handleNotification as EventListener)

  // Return unsubscribe function
  return () => {
    window.removeEventListener("acadguide-notification", handleNotification as EventListener)
  }
}

// Generate sample bookmarks
export function generateSampleBookmarks(
  lessons: any[] = [],
  events: any[] = [],
  flashcards: any[] = [],
  quizzes: any[] = [],
) {
  try {
    // Create sample bookmarks
    const bookmarks = [
      // Lesson bookmarks
      ...lessons.slice(0, 3).map((lesson) => ({
        id: lesson.id,
        type: "lesson",
        title: lesson.title,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      })),

      // Event bookmarks
      ...events.slice(0, 2).map((event) => ({
        id: event.id,
        type: "event",
        title: event.title,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      })),

      // Flashcard bookmarks
      ...flashcards.slice(0, 2).map((flashcard) => ({
        id: flashcard.id,
        type: "flashcard",
        title: flashcard.title,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      })),

      // Quiz bookmarks
      ...quizzes.slice(0, 2).map((quiz) => ({
        id: quiz.id,
        type: "quiz",
        title: quiz.title,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      })),
    ]

    // Store bookmarks in localStorage
    localStorage.setItem("acadGuide:bookmarks", JSON.stringify(bookmarks))

    return bookmarks
  } catch (error) {
    console.error("Error generating sample bookmarks:", error)
    return []
  }
}

// Get bookmarks
export function getBookmarks() {
  try {
    if (typeof window === "undefined") return []

    const bookmarksJson = localStorage.getItem("acadGuide:bookmarks")
    return bookmarksJson ? JSON.parse(bookmarksJson) : []
  } catch (error) {
    console.error("Error getting bookmarks:", error)
    return []
  }
}

// Add bookmark
export function addBookmark(id: string, type: string, title: string) {
  try {
    if (typeof window === "undefined") return false

    const bookmarks = getBookmarks()

    // Check if bookmark already exists
    const exists = bookmarks.some((b: any) => b.id === id && b.type === type)

    if (!exists) {
      bookmarks.push({
        id,
        type,
        title,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("acadGuide:bookmarks", JSON.stringify(bookmarks))
    }

    return true
  } catch (error) {
    console.error("Error adding bookmark:", error)
    return false
  }
}

// Remove bookmark
export function removeBookmark(id: string, type: string) {
  try {
    if (typeof window === "undefined") return false

    const bookmarks = getBookmarks()
    const updatedBookmarks = bookmarks.filter((b: any) => !(b.id === id && b.type === type))
    localStorage.setItem("acadGuide:bookmarks", JSON.stringify(updatedBookmarks))
    return true
  } catch (error) {
    console.error("Error removing bookmark:", error)
    return false
  }
}

// Check if item is bookmarked
export function isBookmarked(id: string, type: string) {
  try {
    if (typeof window === "undefined") return false

    const bookmarks = getBookmarks()
    return bookmarks.some((b: any) => b.id === id && b.type === type)
  } catch (error) {
    console.error("Error checking bookmark:", error)
    return false
  }
}

// Feedback types
export type FeedbackType = "concern" | "improvement" | "praise" | "evaluation" | "other"

export interface Feedback {
  id: string
  type: FeedbackType
  subject: string
  message: string
  departmentId?: string
  courseId?: string
  timestamp: string
  status: "pending" | "reviewed" | "addressed"
}

// Get all feedback
export async function getFeedback() {
  try {
    // Check localStorage first
    const feedbackJson = localStorage.getItem("acadGuideFeedback")
    if (feedbackJson) {
      return JSON.parse(feedbackJson)
    }

    // If not in localStorage and we're in a browser, try IndexedDB
    if (typeof window !== "undefined" && (await isIndexedDBAvailable())) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        return new Promise((resolve) => {
          try {
            const transaction = db.transaction("feedback", "readonly")
            const store = transaction.objectStore("feedback")
            const request = store.getAll()

            request.onsuccess = () => {
              if (request.result && request.result.length > 0) {
                // Also update localStorage for next time
                localStorage.setItem("acadGuideFeedback", JSON.stringify(request.result))
                resolve(request.result)
              } else {
                resolve([])
              }
            }

            request.onerror = () => {
              resolve([])
            }
          } catch (error) {
            console.error("Error in transaction for getFeedback:", error)
            resolve([])
          }
        })
      } catch (error) {
        console.error("Error accessing IndexedDB for feedback:", error)
      }
    }

    return []
  } catch (error) {
    console.error("Error getting feedback:", error)
    return []
  }
}

// Add feedback
export async function addFeedback(feedback: Omit<Feedback, "id" | "timestamp" | "status">) {
  try {
    const newFeedback: Feedback = {
      ...feedback,
      id: `feedback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    // Get existing feedback
    const existingFeedback = (await getFeedback()) || []

    // Add new feedback
    const updatedFeedback = [...existingFeedback, newFeedback]

    // Store in localStorage
    localStorage.setItem("acadGuideFeedback", JSON.stringify(updatedFeedback))

    // Try to store in IndexedDB if available
    if (await isIndexedDBAvailable()) {
      try {
        const db = (await initializeDB()) as IDBDatabase

        // Create feedback store if it doesn't exist
        if (!db.objectStoreNames.contains("feedback")) {
          // Close the current connection
          db.close()

          // Upgrade the database version to add the new store
          const upgradeRequest = indexedDB.open("AcadGuideDB", 2)

          upgradeRequest.onupgradeneeded = (event) => {
            const upgradedDb = (event.target as IDBOpenDBRequest).result
            if (!upgradedDb.objectStoreNames.contains("feedback")) {
              upgradedDb.createObjectStore("feedback", { keyPath: "id" })
            }
          }

          await new Promise<void>((resolve, reject) => {
            upgradeRequest.onsuccess = () => {
              upgradeRequest.result.close()
              resolve()
            }
            upgradeRequest.onerror = () => reject(upgradeRequest.error)
          })

          // Reopen the database
          const reopenRequest = indexedDB.open("AcadGuideDB", 2)
          const reopenedDb = await new Promise<IDBDatabase>((resolve, reject) => {
            reopenRequest.onsuccess = () => resolve(reopenRequest.result)
            reopenRequest.onerror = () => reject(reopenRequest.error)
          })

          // Add the feedback
          const transaction = reopenedDb.transaction("feedback", "readwrite")
          const store = transaction.objectStore("feedback")
          store.add(newFeedback)
          reopenedDb.close()
        } else {
          // Store already exists, just add the feedback
          const transaction = db.transaction("feedback", "readwrite")
          const store = transaction.objectStore("feedback")
          store.add(newFeedback)
        }
      } catch (error) {
        console.error("Error storing feedback in IndexedDB:", error)
      }
    }

    return newFeedback
  } catch (error) {
    console.error("Error adding feedback:", error)
    return null
  }
}

// Update feedback status (for instructors/admins)
export async function updateFeedbackStatus(id: string, status: "pending" | "reviewed" | "addressed") {
  try {
    // Update in localStorage
    const feedbackJson = localStorage.getItem("acadGuideFeedback")
    if (feedbackJson) {
      const feedback = JSON.parse(feedbackJson)
      const index = feedback.findIndex((f: Feedback) => f.id === id)

      if (index !== -1) {
        feedback[index].status = status
        localStorage.setItem("acadGuideFeedback", JSON.stringify(feedback))
      }
    }

    // Try to update in IndexedDB if available
    if (await isIndexedDBAvailable()) {
      try {
        const db = (await initializeDB()) as IDBDatabase
        if (db.objectStoreNames.contains("feedback")) {
          const transaction = db.transaction("feedback", "readwrite")
          const store = transaction.objectStore("feedback")

          const request = store.get(id)
          request.onsuccess = () => {
            if (request.result) {
              request.result.status = status
              store.put(request.result)
            }
          }
        }
      } catch (error) {
        console.error("Error updating feedback status in IndexedDB:", error)
      }
    }

    return true
  } catch (error) {
    console.error("Error updating feedback status:", error)
    return false
  }
}

export async function updateData(storeName: string, data: any[]) {
  try {
    // Always store in localStorage first
    storeDataInLocalStorage(storeName, data)

    // Then try IndexedDB if available (but don't wait for it)
    storeDataInIndexedDB(storeName, data).catch((error) => {
      console.error(`IndexedDB storage failed for ${storeName}:`, error)
    })

    // Record update for real-time sync
    if (
      ["departments", "courses", "lessons", "events", "flashcards", "quizzes", "subjects", "assignments"].includes(
        storeName,
      )
    ) {
      recordUpdate(storeName, "bulk", null)
    }

    return true
  } catch (error) {
    console.error(`Error in updateData for ${storeName}:`, error)
    return false
  }
}
