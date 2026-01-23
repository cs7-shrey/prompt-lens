import axios from "axios"
import type { ExtractDataResponse, CreateOnboardingPayload } from "@/types/onboarding"

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_SERVER_URL || "http://localhost:3000/api",
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