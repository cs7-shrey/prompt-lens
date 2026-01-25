# Prompt Lens
Prompt lens is an AI SEO monitoring tool. tldr; you tell us prompts, we monitor if your brand gets mentioned in AI search responses from perplexity, chatgpt, claude, etc. We help you understand how well your brand ranks in AI responses, how often and in what context. We also help you understand who your top competitors are, how often is your website cited compared to other websites, and many more.

## How does it work?
The monitoring happens in a 3 step process.

1. Generation — we generate responses from the sources you'd like to monitor.
2. Analysis — we analyze the responses to extract what brands are mentioned, the sentiment of those mentions and the ranking.
3. Structuring — we structure the data and present to you on the frontend.

Lets dive deep into how each of the step happens.

## Generation

Prompt lens uses a [playwright](https://playwright.dev/) + [chrome](https://www.google.com/chrome/what-you-make-of-it/) setup to automate the generation of responses. Here is how it handles bot detection. The philosophy is simple; behave like a real user and optimize for reliability instead of throughput.

1. Using chrome is a non-headless manner — using chrome instead of chromium in a non-headless manner ensures that your browser fingerprints match a real user.
2. Using websites with your account logged in — bot detection measures tend to be lenient towards users that are already logged in. Since your cookie data is saved across browser sessions, you can login once and use it for quite a long time before you're required to login again.
3. Behaving like a real user — this includes typing with keystrokes like a normal user, taking random pauses, etc.

While better configurations surely exist that bypass bot detection with browsers like [camoufox](https://camoufox.com/), this is the simplest one that has worked for me.

The code for this logic lives inside `packages/scraper`

## Analysis

From the responses we get, we need to extract valuable information such as brand mentions, positioning, citations and sentiments. We build a list of mentions for a response, where each mention gets a `score`. This score is based on the brand's ranking and the sentiment of the ranking.

Sentiment coefficients 
$$
positive = 1 \\\\
neutral = 0.6 \\\\
negative = 0.2
$$

The score is calculated as <br>

$$
\text{score} = \text{sentiment} \times \frac{1}{\text{position}}
$$

The code for this can be found in `packages/analytics`. 

To make sure that we count different brand names of the same product as the same, for example, `HubSpot` and `HubSpot CRM` should count as a single brand, we maintain a `BrandRegistry` that maintains aliases for each brand/product. This registry gets built dynamically when analysing brand mentions in responses. Upon encountering two brand names with the same websites, they are merged as aliases with a single brand entity.

The code for this can be found in `packages/brands`.

## Structuring

Data is presented via REST APIs (built using [Express](https://expressjs.com/)) on the dashboard (built using [NextJS](https://nextjs.org/)).


## Running locally

First, install the dependencies:

```bash
bun install
```

- Make sure you have chrome installed on your system.
- Add environment variables to `apps/web` and `apps/server`. See `packages/env/src/web.ts` and `packages/env/src/server.ts`.

This project uses PostgreSQL with Prisma.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
prompt-lens/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Express)
├── packages/
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
│   └── scraper/     # Handles scraping information from AI sources.
│   └── brands/      # Handles the Brand registry logic.
│   └── analytics/   # Performs analytics on the responses.
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open database studio UI
