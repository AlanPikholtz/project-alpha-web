// "use client";

import { auth } from "@/auth";
import React from "react";

export default async function Dashboard() {
  const session = await auth();

  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }

  if (!session) {
    return <p>You are not logged in.</p>;
  }

  console.log("🔹 Session from Client-Side:", session);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
}
