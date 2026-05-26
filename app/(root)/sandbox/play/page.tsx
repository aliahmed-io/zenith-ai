import React from "react";
import { generateSandboxScenario } from "@/lib/actions/sandbox.actions";
import SandboxPlayArea from "@/components/sandbox/SandboxPlayArea";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SandboxPlayPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');

  const scenario = await generateSandboxScenario();

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <SandboxPlayArea scenario={scenario} userId={session.user.id} />
    </div>
  );
}
