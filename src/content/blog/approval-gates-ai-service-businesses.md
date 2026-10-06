---
title: When should an AI assistant ask for approval?
description: A practical way to decide what an AI assistant can draft, send, or promise inside a home-service business.
publishedAt: 2026-09-29
author: Ian McCallum
slug: approval-gates-ai-service-businesses
socialImage: /images/ian-mccallum-headshot.jpg
imageAlt: Ian McCallum’s Aero-inspired personal website
draft: false
schemaType: BlogPosting
---

An AI assistant can write a plausible reply to a customer in seconds. That is useful. It is also the easy part. The harder question is whether the assistant should **send** the reply, and what the business has actually authorized it to say.

I think about this while building [Clockwork](/portfolio/clockwork), a CRM for home-service teams. A message about a clogged drain is not merely a piece of text. It can become a price, an appointment, or a promise made in the owner's name. The approval rule has to follow the action, not the model's confidence.

## Separate drafting from doing

Drafting a reply is usually reversible. A person can edit it, decline it, or ask for more information. Sending it is different: the customer may act on it before anyone at the business sees it.

That suggests a simple starting point:

- Let the assistant organize information and prepare drafts where the source request is visible.
- Allow a routine acknowledgement to send automatically only when that specific message type, channel, and customer consent permit it.
- Require a person to review a price, a visit time, or anything else the business cannot verify automatically.
- Record what was sent and whether the delivery actually worked.

This is not one global switch labeled “AI on.” The same assistant may prepare a quote for review, send a permitted acknowledgement, and stop before confirming an appointment. Each action needs its own boundary.

## A confident answer is not a verified fact

Prices should come from a rate card or another approved source, not from how convincing a generated sentence sounds. Even then, matching a job to a line item is a separate question from calculating the number. If the work does not match the rate card, an estimate in a draft must remain an estimate until a person checks it.

Scheduling has a similar trap. An empty calendar slot is not proof that the right technician, equipment, and travel time are available. Before software promises a visit, it needs a dependable source for capacity. Otherwise, asking for approval is better than making up certainty.

The important distinction is between *information the system can point to* and *language the system can produce*. The latter is abundant. The former is what earns trust.

## The record matters after the send

An approval screen is only part of the story. Once a message leaves, the business needs to know what happened: what was approved, what was attempted, what failed, and what the customer actually received. A retry should not quietly turn into a duplicate text. An opt-out should still apply on the final send path, not just when the draft was created.

This is why I care about outboxes, explicit failure states, and narrow permissions. They are not glamorous features, but they make it possible to answer a customer's question with evidence instead of a guess.

## Where Clockwork is today

Clockwork's current app is lead-oriented. It handles intake and follow-up work, includes quote and invoice workflows, and mixes human-reviewed drafts with configured automatic messages. Matching rate-card work can use deterministic pricing; unmatched quote drafts can still contain unverified estimates. The deeper residential service loop I want to build is still in development.

The lesson from that work is not that every AI message needs a human click. It is that the permission to act should be as specific as the consequence of acting. Start with what the business can verify, make uncertainty visible, and expand automation only where the result can be checked.
