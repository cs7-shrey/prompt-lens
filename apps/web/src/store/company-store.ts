import { create } from 'zustand';

export interface Company {
  id: string;
  name: string;
  url: string;
  category: string | null;
  competitors: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

interface CompanyState {
  currentCompany: Company | null;
  companies: Company[];
  isLoading: boolean;
  setCurrentCompany: (company: Company) => void;
  setCompanies: (companies: Company[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  currentCompany: null,
  companies: [],
  isLoading: false,
  setCurrentCompany: (company) => set({ currentCompany: company }),
  setCompanies: (companies) => set({ companies }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
