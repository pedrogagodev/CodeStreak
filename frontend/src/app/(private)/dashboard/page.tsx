"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-24">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="mt-4 text-lg">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg">Welcome to the dashboard!</p>
    </div>
  );
}
