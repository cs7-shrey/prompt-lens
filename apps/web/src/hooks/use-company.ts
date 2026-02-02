"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/store/company-store";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCompany() {
  const router = useRouter();
  const { currentCompany, companies, setCurrentCompany, setCompanies } = useCompanyStore();

  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.user.getTrackingCompanies.queryOptions())

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (error) {
      console.error(error)
      toast.error(error.message)
      return;
    }

    if (!data || !data.companies || data.companies.length === 0) {
      router.push("/onboarding" as any);
      return;
    }

    setCompanies(data.companies);
    setCurrentCompany(data.companies[0]);

  }, [router, setCurrentCompany, setCompanies, data, isLoading]);

  return {
    currentCompany,
    companies,
    isLoading,
  };
}
