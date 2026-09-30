---
name: Clockwork
slug: clockwork
category: AI & Engineering
role: Architect & Sole Engineer
dateRange: Late 2025 – Present
summary: A lead-oriented CRM for home-service teams, with AI-assisted intake, follow-up, quote review, and invoice workflows.
seoTitle: 'Clockwork: AI-Assisted CRM for Trades | Ian McCallum'
technologies: [Python, LLM integration, Prompt engineering, Multi-tenant SaaS, Messaging, Payments]
website: https://beatyourclock.com/clockwork
featuredOrder: 1
evidence: Implemented intake, follow-up, quote review, invoice, and outbox mechanisms; the deeper service loop remains in development.
decisions:
  - Rate-card matches use deterministic prices; unmatched quote drafts can contain unverified estimates.
  - Background work retains explicit retry and failure states instead of hiding them.
  - The send path records outbound work and applies channel and consent controls.
  - Human review and configured automation differ by action, rather than one global AI mode.
  - Tenant access is scoped by company and role.
---

Clockwork is the software I build through Beat the Clock. Its current application is a lead-oriented CRM for home-service teams: a request comes in, Tock prepares a brief, follow-ups are scheduled, and quote and invoice work stays visible. I am building a deeper residential service workflow, but that full loop is still in development.

Tock can draft a reply in the owner's voice. Some messages need a person's confirmation; configured acknowledgements and follow-ups can run automatically when channel and consent rules allow them. The important question is what this particular action is allowed to do.

Matching work can use a company's rate card to calculate a price. Unmatched quote drafts may contain model-generated or heuristic estimates, which are not verified company prices. Background retries and the outbox help make failures and outbound actions visible. The engineering work is connecting useful drafts to evidence, permission, and an actual execution result.
