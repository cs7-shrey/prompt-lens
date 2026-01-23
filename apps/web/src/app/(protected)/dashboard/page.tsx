"use client";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { isOnboardingComplete } from "@/lib/api";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        await isOnboardingComplete();
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          router.push("/onboarding" as any);
        } else {
          router.push("/" as any);
        }
      } finally {
        setIsChecking(false);
      }
    }
    checkOnboarding();
  }, [router]);

  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin" />
    </div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}