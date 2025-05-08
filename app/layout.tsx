import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AcadGuide - Academic Learning Platform",
  description: "A comprehensive platform for academic learning and management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize data on page load
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  try {
                    // Initialize data directly without importing
                    if (!localStorage.getItem("acadGuideInitialized")) {
                      console.log("Initializing application data...");
                      
                      // Mark as initialized to prevent repeated initialization
                      localStorage.setItem("acadGuideInitialized", "true");
                      
                      // Add basic departments if they don't exist
                      const departments = [
                        {
                          id: "cs",
                          name: "Computer Science",
                          code: "CS",
                          description: "Study of computers and computational systems"
                        },
                        {
                          id: "math",
                          name: "Mathematics",
                          code: "MATH",
                          description: "Study of numbers, quantity, and space"
                        },
                        {
                          id: "phys",
                          name: "Physics",
                          code: "PHYS",
                          description: "Study of matter, energy, and the interaction between them"
                        },
                        {
                          id: "bio",
                          name: "Biology",
                          code: "BIO",
                          description: "Study of living organisms"
                        },
                        {
                          id: "chem",
                          name: "Chemistry",
                          code: "CHEM",
                          description: "Study of substances and their interactions"
                        },
                        {
                          id: "eng",
                          name: "Engineering",
                          code: "ENG",
                          description: "Application of scientific knowledge to design and build"
                        },
                        {
                          id: "bsis",
                          name: "Bachelor of Science in Information Systems",
                          code: "BSIS",
                          description: "Study of information systems and their application in business and organizations"
                        }
                      ];
                      
                      localStorage.setItem("acadGuideDepartments", JSON.stringify(departments));
                      console.log("Basic data initialized successfully");
                    }
                  } catch (error) {
                    console.error('Error in initialization script:', error);
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} dark bg-[#0F0A1A] text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
