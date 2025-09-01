"use client";
import { useAuth } from "@/providers/auth-provider";
import { UserProfile } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, userProfile, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if a user profile exists and the component is not in a loading state
    if (userProfile && !isLoading) {
      if (userProfile.role === "superAdmin" || userProfile.role === "admin") {
      } else if (userProfile.role === "user") {
        redirect("/");
      }
    } else if (!UserProfile) {
      redirect("/sign-in");
    }
  }, [userProfile, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Your actual dashboard content should go here.
  // The redirects will handle the access control.
  return (
    <div className="container mx-auto p-4">
      <h1>Welcome to the Dashboard</h1>
      <p>This page is only for admins and super admins.</p>
    </div>
  );
}
