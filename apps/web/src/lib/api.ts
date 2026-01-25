import axios from "axios"
import type { ExtractDataResponse, CreateOnboardingPayload } from "@/types/onboarding"
import type { Company } from "@/store/company-store"
import type { FetchResponsesResponse, GetMentionsResponse, MentionWithBrand, PromptsWithResponseAndMentions, PromptWithRelevantMentions } from "@/types"
import { env } from "@prompt-lens/env/web"

const axiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_SERVER_URL + "/api" || "http://localhost:3000/api",
    withCredentials: true,
})

export async function isOnboardingComplete() {
    const response = await axiosInstance.get("/onboarding/is-completed")
    return response.data.isCompleted
}

export async function extractCompanyData(
    companyName: string,
    websiteUrl: string
): Promise<ExtractDataResponse> {
    const response = await axiosInstance.post<ExtractDataResponse>("/onboarding/extract-data", {
        companyName,
        websiteUrl,
    })
    return response.data
}

export async function createOnboarding(data: CreateOnboardingPayload): Promise<void> {
    await axiosInstance.post("/onboarding/create", data)
}

export async function getUserCompanies(): Promise<{ companies: Company[] }> {
    const response = await axiosInstance.get("/user/companies")
    return response.data
}

export async function fetchCitations(trackingCompanyId: string, startDate: Date, endDate: Date): Promise<string[]> {
    const response = await axiosInstance.post("/dashboard/citations", {
        trackingCompanyId,
        startDate,
        endDate,
    })
    return response.data.citations
}

export async function fetchMentions(trackingCompanyId: string, startDate: Date, endDate: Date): Promise<GetMentionsResponse> {
    const response = await axiosInstance.post("/dashboard/mentions", {
        trackingCompanyId,
        startDate,
        endDate,
    })
    return response.data
}

export async function fetchPrompts(trackingCompanyId: string): Promise<PromptWithRelevantMentions[]> {
    const response = await axiosInstance.get(`/prompts/all/${trackingCompanyId}`)
    return response.data.prompts
}

export async function fetchResponses({
    trackingCompanyId,
    startDate,
    endDate,
    page,
    limit,
    promptId,
}: {
    trackingCompanyId: string;
    startDate: Date;
    endDate: Date;
    page: number;
    limit: number;
    promptId?: string;
}): Promise<FetchResponsesResponse> {
    const response = await axiosInstance.post("/responses/all", {
        trackingCompanyId,
        startDate,
        endDate,
        page,
        limit,
        promptId,
    })
    return response.data
}