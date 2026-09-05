# The Senoia Car Show Planning Playbook

**Start here.** This is the handover document for whoever runs the digital side
of the Senoia Car Show next year — the website, the volunteer system, the show
day map, the award board, and every piece of artwork that feeds them.

It exists because the show happens once a year. Twelve months is long enough to
forget how the map was generated, which Ticket Tailor event holds the sponsor
slots, and why the Volunteer link disappears from the nav the day after the
show. Everything in here was reconstructed from the 2026 build; the parts only
the organizers know are listed as open questions in
[09-open-questions.md](09-open-questions.md) rather than guessed at.

## There are two playbooks — this is the second one

| | Operations playbook | This playbook (`docs/`) |
| --- | --- | --- |
| **Covers** | Site plans, gate assignments, DJ run-of-show, equipment lists, barricades, insurance, permits, the volunteer role list | The website, volunteer sign-ups, the map, the award board, artwork, accounts |
| **Owner** | Senoia DDA / show chair | Whoever maintains the site |
| **Lives** | An organizer-maintained document held by the DDA (referenced in `src/data/eventMap.js` as "the 2026 Senoia Car Show Playbook") | This repo, public at <https://github.com/jermdw/senoia-car-show/tree/main/docs> |

They depend on each other. The operations playbook is the **source of truth for
event facts** — every gate time, address, and schedule entry on the website was
copied from it, never invented. This playbook is the source of truth for **how
the digital artifacts were built**. Keep a link to each in the other, and
resolve conflicts in favour of the operations playbook.

> **Rule inherited from `CLAUDE.md`, and it matters more than anything else
> here:** event facts (pricing, dates, sponsor tiers and names, gate times) come
> from the organizers. Never invent or extrapolate them. When the operations
> playbook is silent or contradicts itself, the website carries the entry with
> `confirmed: false` and simply does not render it until a human resolves it.

## Contents

| Doc | Read it when |
| --- | --- |
| [00 · Annual timeline](00-annual-timeline.md) | You want to know what happens in which month |
| [01 · Year rollover checklist](01-year-rollover.md) | **First job of the new cycle.** Turning the 2026 site into the 2027 site, in order |
| [02 · Website runbook](02-website-runbook.md) | You need to run, change, or deploy the site |
| [03 · Volunteer system](03-volunteer-system.md) | Shifts, sign-ups, the organizer dashboard, the shirt order |
| [04 · Show day operations](04-show-day.md) | The day itself: award board, announcement banner, who does what |
| [05 · Assets & artwork](05-assets-and-artwork.md) | Recreating the map, poster, share card, logos, shirt art, signage |
| [06 · Where every fact lives](06-content-map.md) | "Someone emailed to say the gate time is wrong — which file?" |
| [07 · Accounts & access](07-accounts-and-access.md) | Every service the show depends on, and who holds the keys |
| [08 · Troubleshooting](08-troubleshooting.md) | Something is broken and you'd like it to not be |
| [09 · Open questions](09-open-questions.md) | Gaps this playbook can't fill without an organizer |

Also in the repo, and worth knowing about:

- **`CLAUDE.md`** — the same knowledge compressed for an AI coding assistant.
  If you use Claude Code or similar, it reads that file automatically. Keep it
  in sync with these docs; it is the machine-readable index to the same
  invariants.
- **`README.md`** — the two-minute version for a developer who just cloned.

## How to keep this from rotting

One rule: **a change to the code and the change to its doc go in the same pull
request.** That is the entire reason the playbook lives in the repo instead of
in a Google Doc. If you change how the map is generated, the recipe in
[05-assets-and-artwork.md](05-assets-and-artwork.md) changes in the same commit,
and `git log docs/` tells the next person what moved and why.

Second rule: **when something surprises you, write it down that day.** Most of
the hard-won detail in here — that the `buytickets.at` short link silently drops
query strings, that Tailwind v4 drops theme variables no utility references, that
`node --test test/` behaves differently on Node 20 and 22 — cost someone an hour
to discover and thirty seconds to record.
