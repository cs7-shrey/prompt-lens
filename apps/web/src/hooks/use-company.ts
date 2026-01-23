"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/store/company-store";
import { getUserCompanies } from "@/lib/api";
import axios from "axios";

export function useCompany() {
  const router = useRouter();
  const { currentCompany, companies, isLoading, setCurrentCompany, setCompanies, setIsLoading } = useCompanyStore();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const data = await getUserCompanies();
        
        if (!data.companies || data.companies.length === 0) {
          // No companies found, redirect to onboarding
          router.push("/onboarding" as any);
          return;
        }

        setCompanies(data.companies);
        // Set the first company as the current company
        setCurrentCompany(data.companies[0]);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Unauthorized, redirect to home
          router.push("/" as any);
        } else {
          // For other errors, also redirect to onboarding
          router.push("/onboarding" as any);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [router, setCurrentCompany, setCompanies, setIsLoading]);

  return {
    currentCompany,
    companies,
    isLoading,
  };
}
