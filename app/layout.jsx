import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { Toaster } from "@/components/ui/sonner"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

export const metadata = {
  title: "Ladies Tailoring Management System",
  description: "Premium dashboard system for multi-shop ladies tailoring business",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${workSans.variable} ${openSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
