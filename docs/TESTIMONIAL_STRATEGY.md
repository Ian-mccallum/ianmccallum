# Testimonial Strategy & Email Formula

Audit of the current testimonial system, a plan for building it out, and a reusable
email formula for asking anyone — clients, teachers, coaches, teammates — for a
testimonial. Written for Ian, one operator to another.

---

## 1. Current State (as of this audit)

**Where testimonials live today:**
- `src/pages/testimonials.html` — dedicated page, "Vista window" card grid
- `src/pages/index.html` — duplicated in two places: a desktop "testimonials-window"
  popup and a separate mobile/iOS-style panel
- Total testimonial count: **2** (Timmy Miller / TMM Photography, Nicolas Villalobos /
  Nics Marketing), both freelance web-dev clients

**Bugs found and fixed in this pass:**
- Timmy Miller's photo pointed at `/img/other/IMG_7878.JPG`, which doesn't exist on
  the site — it rendered as a broken image on the homepage, the standalone
  testimonials page, and the mobile view. Repointed to the real asset at
  `/img/IMG_7878.JPG`.
- Nicolas Villalobos's photo pointed at `/img/other/placeholder.png`, also missing.
  Replaced with an initials avatar (matching the pattern already used correctly in
  the mobile iOS view) instead of a broken `<img>`.
- Nicolas's company link was a dead `href="#"`. Pointed to the real site,
  `nicsmarketing.co`.
- The standalone `testimonials.html` page only had **one** of the two testimonials —
  Nicolas's was missing entirely, even though it's on the homepage. Added it for
  parity.

**Note on collection:** an earlier pass added a self-service "Share Your Experience"
CTA to `testimonials.html`. Removed at Ian's direction — he wants to reach out to
past clients and collaborators himself rather than route it through an on-site
form. The email formula and templates in §4–§5 are written for that direct-outreach
approach.

**What this means:** the display layer (cards, glass/blur styling, hover states) is
genuinely well-designed — the bottleneck isn't presentation, it's supply. Two
testimonials, both from the same service line (freelance web dev), collected
informally, is not enough to do real work as a trust signal. A visitor who lands on
"Testimonials & Praise" and sees two cards will (correctly) read it as early-stage,
not as weak work.

---

## 2. What's Missing, and Why It Matters

| Gap | Why it matters |
|---|---|
| Only 2 testimonials, both web dev | Doesn't cover automation consulting, the other skills on the CV, or anything non-client (internships, school projects, org leadership) |
| No collection mechanism | There was no on-site path to *ask* — testimonials only existed because two clients happened to write them unprompted |
| No specificity in the quotes | Both are warm but generic ("great experience," "highly recommend") — nothing a reader can't get from any freelancer's page |
| No third-party verification | Testimonials living only on Ian's own site carry less weight than the same words on LinkedIn, Google, or Clutch, where they can't be edited by the subject |
| No visual/format variety | All text-only. No video, no screenshots of Slack/text praise, no LinkedIn recommendation embeds |
| No use-permission trail | No record that Timmy or Nicolas agreed to have their name, photo, and company linked publicly — worth having in writing, even informally |
| No SEO structured data | No `Review`/`AggregateRating` schema, so testimonials don't help search or AI-answer visibility the way they could |

---

## 3. The Plan: How Ian Should Actually Get Testimonials

### 3.1 Ask at the moment of peak goodwill, not "eventually"
The best time to ask is **within 48 hours of delivering the final result** — site
launch, project handoff, event wrap — while the relief and excitement are fresh.
Waiting a month means asking a person who has moved on mentally; waiting a year
means the request feels random and out of nowhere.

### 3.2 Make it a system, not a one-off
Every time a project, internship, or collaboration wraps, it should trigger the same
next step automatically — not something Ian has to remember to feel like doing.
Concretely:
- Add "send testimonial ask" as the literal last line item on every project
  checklist/invoice, same tier as "send final invoice."
- Track asks in one place (even a simple spreadsheet: name, project, date asked,
  date received, where it's published) so nothing falls through.

### 3.3 Diversify *who* is asked
Testimonials aren't just for paying clients. For a young entrepreneur/student
building a track record, all of these are fair game:
- Freelance/contract clients (current source)
- Teachers, professors, or academic advisors who supervised a project
- Coaches, club/organization leaders (evidence of leadership, reliability)
- Teammates or co-founders on group work
- Managers from any part-time job or internship
- People Ian has *helped informally* — debugged something, built a script,
  volunteered technical help — these are often the most enthusiastic and least asked

### 3.4 Diversify *what* gets collected
- **Written quote** (current format) — keep, but push for specificity (see §4)
- **LinkedIn recommendation** — public, third-party-hosted, doubles as a testimonial
  and a LinkedIn profile booster; ask for this *in addition to* a site quote
- **Video testimonial (30–60 sec)** — even a phone-shot clip outperforms text for
  trust; higher ask, so reserve for the strongest relationships
- **Before/after or results snapshot** — a screenshot of a compliment text/email/DM,
  a metric ("bookings up 30% after launch"), a screen recording of the finished site
- **Google Business Profile review** — if/when Ian formalizes a business entity, this
  is the single highest-leverage review surface for local SEO

### 3.5 Make giving it effortless
The #1 reason people don't leave testimonials isn't reluctance — it's friction and
blank-page paralysis. Every ask should:
- Include 2–3 specific prompt questions, not "could you write a testimonial?"
- Offer a done-for-them draft they can edit/approve rather than write from scratch
  (this alone dramatically raises response rate — most people are relieved, not
  offended, and still personalize it)
- Take under 5 minutes end to end
- Work from a phone (a reply-to-this-email or a short form, not a login-required
  portal)

### 3.6 Get explicit permission
When a testimonial arrives, confirm in writing (a one-line reply is enough) that it's
okay to publish their name, title, company, photo, and a link to their site. Keep
these replies. It's a small thing now; it matters more the more public Ian's brand
gets.

### 3.7 On-site follow-through
- Keep collection off-site and personal: Ian reaches out directly with the
  templates in §5 rather than routing it through a form on `testimonials.html`.
  Matches the "specific reminder, not a mail-merge" principle in §4 — a form
  invites generic answers, a direct email gets specific ones.
- As volume grows, group testimonials by service line (Web Development / Automation
  / Leadership & Collaboration) so each type of visitor sees relevant proof
  fast
- Add basic `Review` schema once there are 5+ genuine testimonials, so search/AI
  engines can surface star-style rich results
- Consider a simple "Wall of Love" — screenshots of unsolicited praise (texts,
  DMs, emails) — these read as more authentic than polished quotes precisely because
  they weren't written for publication

---

## 4. The Email Formula

A repeatable structure that works whether Ian is asking a client, a professor, or a
teammate. Five parts, in order:

1. **Specific reminder** — name the exact thing you did together (not "our project,"
   but "the prequalification flow we built for Nics Marketing"). Proves the ask is
   personal, not a mail-merge.
2. **Genuine, brief thanks** — one sentence, not a paragraph. Don't oversell it.
3. **The ask, framed as low-effort** — say plainly it's for testimonials/marketing,
   give a time estimate, and make clear a short answer is completely fine.
4. **2–3 open-ended prompt questions** — never "would you recommend me?" (yes/no
   kills specificity). Ask about the *before state*, the *outcome*, and what they'd
   tell someone considering hiring/working with Ian. Open questions produce quotable,
   specific answers; closed questions produce "great job!"
5. **A frictionless out** — reply-all, one line, or "happy to draft something for you
   to approve" — plus an explicit "no pressure if now's not a good time."

### Why open-ended, non-leading questions matter
"Great to work with!" is a compliment. "Ian shaved two days off our weekly reporting
by scripting what we used to do by hand" is a testimonial that closes deals. The
difference is entirely in the questions asked. Never suggest the answer in the
question (avoid "wasn't it great working together?") — let them tell the story in
their own words, then it's genuinely theirs, not Ian's words in their mouth.

---

## 5. Ready-to-Send Templates

Swap the bracketed fields. Subject lines are short and specific on purpose — they
read as personal, not templated.

### 5.1 Client / paid project (the core template)

**Subject:** Quick favor re: [Project Name]

> Hi [Name],
>
> [Specific detail — e.g., "Site's been live a week now — hope the launch traffic
> has treated you well!"]
>
> I'm putting together some case studies from projects I'm proud of, and
> [Project Name] is one of them. Would you be open to sharing a couple lines about
> the experience? Should take about 5 minutes, and I'd love to feature it on my site
> (with a link back to [their company/site], if that's useful for you).
>
> A few things that would help if you want a starting point — totally fine to
> answer just one, or write freely instead:
> 1. What was the situation before we started working together?
> 2. What changed after the project shipped — any specific results, or how has it
>    changed day-to-day for you/your team?
> 3. What would you tell someone who's considering working with me?
>
> No pressure at all if this isn't a good week — just reply whenever it's
> convenient, even a sentence or two is genuinely helpful. And if it's easier, I'm
> happy to draft something based on our conversations and send it over for you to
> edit or approve instead.
>
> Thanks again for trusting me with this one.
>
> [Ian]

### 5.2 Informal help (no money changed hands)

**Subject:** Thanks again for [specific thing]

> Hey [Name],
>
> Glad [the script/the fix/the setup] worked out — let me know if anything else
> comes up.
>
> Random ask: I'm building out a page of projects and people I've worked with, and
> since I'm just getting started I'd really value a couple lines from you about
> that, if you're up for it. Doesn't need to be formal — even a text-length version
> of "here's what Ian helped with and why it mattered" is exactly what I'm looking
> for.
>
> No worries if not — just wanted to ask while it was fresh.
>
> [Ian]

### 5.3 Teacher / professor / advisor

**Subject:** Quick ask — recommendation for [context, e.g. "my portfolio site"]

> Hi [Name],
>
> I've really valued [specific — "your guidance on the senior capstone project" /
> "the independent study we did on X"], and I'm building out a portfolio site as I
> start looking at [internships/college/next steps].
>
> Would you be willing to write a couple of sentences about working with me — what
> I worked on and how I approached it? It would mean a lot coming from you, and I'd
> only use it with your OK.
>
> If it's easier, I'm glad to send over a short summary of what we worked on as a
> refresher, or a draft you could adjust.
>
> Totally understand if you don't have the bandwidth right now — thank you either
> way for everything this year.
>
> [Ian]

### 5.4 Teammate / co-founder / group project

**Subject:** Testimonial swap? ([Project])

> Hey [Name],
>
> Working on [Project] with you was genuinely one of the better team experiences
> I've had — [one specific, real detail].
>
> I'm collecting a few testimonials for my site from people I've worked closely
> with, and would love a couple lines from you about what it was like collaborating
> together — happy to write one for you too if that's useful, since we know each
> other's work well.
>
> A couple prompts if helpful, or just write freely:
> - What was I actually like to work with day-to-day?
> - Is there a moment from the project that stuck with you?
>
> [Ian]

### 5.5 LinkedIn recommendation ask (send after any of the above says yes)

**Subject:** One more small ask — LinkedIn?

> Thank you again for that — it means a lot.
>
> If you're open to it, would you mind posting a short version as a LinkedIn
> recommendation too? It's the same idea, just on LinkedIn instead of email — takes
> about 2 minutes on your end
> ([linkedin.com/in/ian-mccallum-700722344](https://www.linkedin.com/in/ian-mccallum-700722344/))
> and it helps a lot with credibility there. No worries if email-only is easier for
> you.

### 5.6 Follow-up nudge (send once, 7–10 days after no response — then let it go)

**Subject:** Re: Quick favor re: [Project Name]

> Hi [Name] — no rush at all, just floating this back up in case it got buried.
> Totally fine either way!

---

## 6. Best Practices Checklist (young entrepreneur specific)

- **Ask early and often, not just at the top of your career.** The instinct is to
  wait until the work is "impressive enough" to deserve a testimonial. Wrong —
  ask after every project, from day one. Early testimonials from small projects
  compound into a track record; waiting means starting from zero later.
- **Never write words and ask someone to sign off on them.** Draft-to-approve is
  fine (§3.5); pre-written-and-rubber-stamped isn't — it reads as inauthentic
  and, more importantly, it isn't actually their voice.
- **Ask for permission to publish, explicitly, every time.** Don't assume a nice
  reply means "post this publicly with my name and photo."
- **One ask, one small follow-up, then stop.** A single polite nudge after a week
  or two is normal. More than that reads as pressure and burns goodwill for future
  asks.
- **Say thank you when it's used**, not just when it's given — a quick "just added
  your quote to the site, thank you again" closes the loop and makes the next ask
  easier.
- **Keep a running list of who to ask**, updated the moment a project/relationship
  wraps, not months later from memory.
- **Reciprocate.** Offering to write a testimonial/recommendation back (§5.4) costs
  nothing and meaningfully raises response rates — especially with peers, not just
  clients.
- **Diversify proof types as the body of work grows** (§3.4) — by the time there are
  10+ testimonials, a wall of identical text quotes is less convincing than a mix of
  written, video, LinkedIn, and screenshot-of-unsolicited-praise formats.
