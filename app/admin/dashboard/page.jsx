// src/app/dashboard/page.jsx (বা এর কাছাকাছি)

"use client";
import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, userProfile, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if a user profile exists and the component is not in a loading state
    if (userProfile && !isLoading) {
      if (userProfile.role === "superAdmin" || userProfile.role === "admin") {
        // Since this page is already /dashboard, no need to redirect again
        // You can simply show the content here.
        // For example, you might render the admin dashboard content.
        // return;
      } else if (userProfile.role === "user") {
        redirect("/");
      }
    } else if (!userProfile && !isLoading) {
      redirect("/sign-in");
    }
  }, [userProfile, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Your actual dashboard content should go here.
  // The redirects will handle the access control.
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>This page is only for admins and super admins.</p>
    </div>
  );
}