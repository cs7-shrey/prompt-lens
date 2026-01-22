import { generateText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { perplexity } from "@ai-sdk/perplexity";
import { z } from "zod";
import { companyDataSchema } from "@/schema/onboarding.schema";

export const extractCompanyData = async (content: string) => {
    const prompt = `You are analyzing website content to extract key company information. Based on the content below, extract the following details:

1. shortDescription: A brief 1-2 sentence summary of what the company does
2. fullDescription: A comprehensive 2-3 paragraph description covering the company's offerings, value proposition, and target audience
3. category: A specific, descriptive 4-6 word category that captures the company's market niche and what they actually do. Be SPECIFIC and DESCRIPTIVE, not generic.
   - BAD examples: "SaaS", "E-commerce", "Technology", "Software"
   - GOOD examples: "AI observability and evaluations", "Customer data platform for marketers", "Automated billing for B2B SaaS", "Collaborative video editing software"
   - Focus on WHAT they do and WHO they serve, not just the broad industry
4. keyFeatures: A list of 4-6 main features, capabilities, or value propositions that differentiate this company

Guidelines:
- Be concise and factual
- Focus on what the company actually offers, not marketing fluff
- For the category field, avoid generic industry terms - be as specific and descriptive as possible
- Extract information directly from the content provided
- If information is unclear or missing, make reasonable inferences based on available data

Website Content:
${content}`
    const { output }  = await generateText({
        model: anthropic("claude-haiku-4-5"),
        prompt: prompt,
        output: Output.object({
            schema: companyDataSchema
        })
    })
    return output
}

export const competitorSchema = z.object({
    competitors: z.array(z.object({
        websiteUrl: z.url(),
        name: z.string(),
    }))
})

export const getCompetitors = async (companyName: string, companyData: z.infer<typeof companyDataSchema>) => {
    const prompt = `You are a market intelligence assistant identifying direct competitors for a company.

Company Name: ${companyName}

Category: ${companyData.category}

Short Description: ${companyData.shortDescription}

Full Description: ${companyData.fullDescription}

---

A "competitor" is defined as:
- A company or product that solves a SIMILAR core problem to ${companyName}
- Targets a SIMILAR customer segment in the "${companyData.category}" space
- Would realistically be considered an alternative by a buyer

DO NOT include:
- Generic tools or platforms unless they are commonly used as direct alternatives
- Infrastructure providers unless they directly compete at the product level
- Open-source libraries unless they are widely adopted as substitutes to ${companyName}
- Integrations, partners, or complementary tools
- Parent companies unless they sell a competing product directly

Instructions:
1. Identify 4-6 direct competitors to ${companyName} in the "${companyData.category}" space
2. Prefer well-known, established competitors over obscure startups
3. Only include companies that are realistically comparable to ${companyName}
4. If the competitive landscape is narrow, return fewer competitors
5. Accuracy is MORE important than completeness — do NOT guess wildly
6. For each competitor, provide:
   - name: The official company name
   - websiteUrl: The complete, valid website URL (must start with http:// or https://)

Quality checks:
- Only include competitors you are confident about
- Ensure all website URLs are accurate and functional
- If a company has multiple products, only include them if they compete in the "${companyData.category}" category

Search for current, accurate information about competitors in this specific market space.`

    const { output } = await generateText({
        model: perplexity("sonar-pro"),
        prompt,
        output: Output.object({
            schema: competitorSchema
        })
    })
    
    return output
}

const promptsSchema = z.object({
    prompts: z.array(z.string())
});

export const getPromptsToMonitorSuggestions = async (companyName: string, companyData: z.infer<typeof companyDataSchema>) => {
    const prompt = `You are helping a company identify prompts they should monitor to track their visibility in LLM responses.

Company Name: ${companyName}

Category: ${companyData.category}

Short Description: ${companyData.shortDescription}

Key Features: ${companyData.keyFeatures.join(', ')}

---

Context: 
Users ask questions to LLMs (like ChatGPT, Claude, Perplexity, etc.), and we monitor whether ${companyName} is mentioned in the responses. We need to identify the most relevant prompts/questions that users would naturally ask where ${companyName} might appear in the answer.

Task:
Generate exactly 5 realistic prompts/questions that:
1. Users would naturally ask LLMs when looking for solutions in the "${companyData.category}" space
2. Would likely result in ${companyName} being mentioned in responses (as a recommendation, comparison, or example)
3. Are specific enough to be relevant, but broad enough to be commonly asked
4. Represent different angles or use cases within the category

Prompt Types to Consider:
- Tool recommendations ("What are the best tools for X?")
- Comparison questions ("How does X compare to Y?")
- Solution-seeking ("How do I solve X problem?")
- Best practices ("What's the best way to X?")
- Alternatives ("What are alternatives to X?")

Guidelines:
- Write prompts as if YOU are the user asking the LLM
- Make them natural and conversational (how real people ask questions)
- Focus on the problem space, not just the company name
- Avoid mentioning ${companyName} directly in most prompts (we want to see if LLMs mention it organically)
- Vary the prompt types and angles
- Keep prompts concise (1-2 sentences max each)

Return exactly 5 prompts as an array of strings.`

    const { output }  = await generateText({
        model: anthropic("claude-haiku-4-5"),
        prompt: prompt,
        output: Output.object({
            schema: promptsSchema
        })
    })
    return output.prompts
}