export type AISource = "CHATGPT" | "CLAUDE" | "PERPLEXITY";

export interface CompanyInfo {
  companyName: string;
  websiteUrl: string;
}

export interface CompanyDetails {
  shortDescription: string;
  category: string;
  fullDescription: string;
  keyFeatures: string[];
}

export interface Competitor {
  name: string;
  websiteUrl: string;
}

export interface ExtractDataResponse {
  companyData: CompanyInfo & CompanyDetails;
  competitors: Competitor[];
  promptSuggestions: string[];
}

export interface OnboardingFormData {
  // Step 1
  companyInfo: CompanyInfo;
  // Step 2
  sourcesToMonitor: AISource[];
  // Step 3
  companyDetails: CompanyDetails;
  // Step 4
  competitors: Competitor[];
  // Step 5
  promptsToMonitor: string[];
}

export interface CreateOnboardingPayload {
  company: CompanyInfo & CompanyDetails;
  competitors: Competitor[];
  promptsToMonitor: string[];
  sourcesToMonitor: AISource[];
}
