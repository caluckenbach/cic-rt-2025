import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, EyeOff, Gauge, ShoppingBag, Sparkles, Users } from "lucide-react";
import { BenefitsMarketplace } from "@/components/BenefitsMarketplace";
import "./index.css";
import artivionLogo from "../assets/Artivion_4C-scaled.png";

type Section = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  icon: typeof Gauge;
  cta: string;
};

const sections: Section[] = [
  {
    id: "total-rewards",
    title: "Total Rewards",
    tagline: "Financial transparency in one glance",
    description:
      "Launch the consolidated value card and privacy-first reveal flow so employees can answer “What’s my total monthly compensation?” without hunting through PDFs.",
    highlights: [
      "Value Card formula: Base Salary + Bonus + Employer Pension + Benefits + Tax Savings",
      "Privacy Mode toggle keeps amounts blurred until Face ID / Touch ID verification",
      "Auth-first reveal guidelines for mobile and desktop",
      "Context strip linking directly to HR data sources for traceability",
    ],
    icon: Gauge,
    cta: "Draft Value Card",
  },
  {
    id: "benefits-marketplace",
    title: "Benefits Marketplace",
    tagline: "E-commerce style browsing",
    description:
      "Treat every benefit like a product—you can browse by category, simulate leasing scenarios, and complete enrollment without leaving the dashboard.",
    highlights: [
      "Carousel rail for Mobility, Health, Family, and more",
      "Simulator inputs for bike / car leasing vs. retail price",
      "One-click enroll sheet with webhook trigger to HR",
      "UI state updates to Pending / Approved without page reload",
    ],
    icon: ShoppingBag,
    cta: "Map Marketplace Flow",
  },
  {
    id: "pulse-feed",
    title: "Pulse Feed",
    tagline: "Stories, not memos",
    description:
      "Replace wall-of-text updates with bite-sized, vertical stories that understand roles, office tags, and surface a TL;DR generated from long-form content.",
    highlights: [
      "Story-style cards for announcements with autoplay opt-in",
      "Tag filtering: #All, #Engineering, #Sales, #MunichOffice",
      "Emoji reactions only (🔥, 👏, ❤️) to keep vibes positive",
      "AI summarizer slot for 3-bullet TL;DR of leadership posts",
    ],
    icon: Sparkles,
    cta: "Shape Pulse Feed",
  },
  {
    id: "orbit-bot",
    title: "Orbit Bot",
    tagline: "Conversational concierge",
    description:
      "Swap the static search bar for a retrieval-augmented assistant grounded in the handbook, travel policy, and benefits playbooks.",
    highlights: [
      "RAG pipeline seeded with policy + benefits docs",
      "Direct answers with links back to forms or policies",
      "Tone guidelines: helpful, casual, factual",
      "Fallback escalation rules for human HR follow-up",
    ],
    icon: Bot,
    cta: "Design Bot Canvas",
  },
  {
    id: "community",
    title: "Community & Gamification",
    tagline: "Make it sticky",
    description:
      "Close the loop with recognition loops and cross-team serendipity, so the dashboard earns a daily visit beyond payroll tasks.",
    highlights: [
      "Kudos Coins ledger that converts to raffle tickets",
      "Simple issuance flow with note + tag fields",
      "Lunch Roulette opt-in roster with department pairing rules",
      "Weekly recap module showing participation stats",
    ],
    icon: Users,
    cta: "Outline Community Layer",
  },
];

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-fog via-white to-brand-fog/70 text-left">
      <header className="border-b bg-gradient-to-r from-brand-teal via-brand-azure via-70% to-brand-navy text-white shadow-lg">
        <div className="container flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4">
            <img
              src={artivionLogo}
              alt="Artivion"
              className="h-auto w-full max-w-[220px] object-contain drop-shadow-lg filter brightness-110 contrast-125 sm:max-w-[240px] md:max-w-[280px]"
            />
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-lime text-brand-navy font-semibold shadow-lg shadow-brand-navy/30">
                TR
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Orbit Command</p>
                <h1 className="text-3xl font-semibold">Total Rewards Mission Control</h1>
                <p className="text-sm text-white/80">Powered by Artivion&apos;s people-first operating system.</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <EyeOff className="size-4" />
            Privacy Mode (coming soon)
          </Button>
        </div>
      </header>

      <div className="container flex flex-col gap-8 py-10 lg:flex-row">
        <nav className="lg:w-72">
          <div className="sticky top-8 rounded-3xl border border-brand-navy/15 bg-white/80 p-5 shadow-xl shadow-brand-navy/5 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-brand-navy/60">Navigation</p>
            <div className="mt-4 flex flex-col gap-2">
              {sections.map(section => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className="justify-start gap-3 rounded-2xl px-3 py-3 text-brand-navy hover:bg-brand-lime/20 hover:text-brand-navy"
                  asChild
                >
                  <a href={`#${section.id}`} className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <section.icon className="size-4 text-brand-azure" />
                      <span className="font-semibold">{section.title}</span>
                    </div>
                    <span className="text-xs text-brand-navy/70">{section.tagline}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </nav>

        <main className="flex-1 space-y-10">
          {sections.map(section => (
            <section id={section.id} key={section.id} className="scroll-mt-32">
              {section.id === "benefits-marketplace" ? (
                <BenefitsMarketplace />
              ) : (
                <Card className="border-brand-navy/10 bg-white/95 shadow-lg shadow-brand-navy/5">
                  <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-brand-azure/10 p-3 text-brand-azure">
                        <section.icon className="size-5" />
                      </div>
                      <div>
                        <p className="mb-1 inline-flex items-center gap-2 rounded-full bg-brand-lime/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy/80">
                          {section.title === "Total Rewards" ? "Phase Zero" : "In Discovery"}
                          <span className="inline-flex h-2 w-2 rounded-full bg-brand-teal" />
                        </p>
                        <CardTitle className="text-2xl text-brand-navy">{section.title}</CardTitle>
                        <CardDescription className="text-brand-navy/70">{section.tagline}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-brand-teal text-white shadow-brand-teal/40 hover:bg-brand-teal/90"
                    >
                      {section.cta}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-brand-navy/80">{section.description}</p>
                    <ul className="grid gap-3 text-sm sm:grid-cols-2">
                      {section.highlights.map(item => (
                        <li
                          key={item}
                          className="flex items-start gap-3 rounded-2xl border border-brand-navy/10 bg-brand-fog/60 p-4 text-brand-navy shadow-sm"
                        >
                          <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-brand-azure" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
