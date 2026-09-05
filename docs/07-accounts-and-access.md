# 07 · Accounts & access

Every service the show depends on. **No secrets, tokens, passwords or access
codes belong in this file** — it records *what exists, who owns it, and where
the credential lives*, not the credential.

## The inventory

| Service | What it does | Where the credential lives | Fails how |
| --- | --- | --- | --- |
| **Domain `senoiacar.show`** | The canonical host | Registrar account | Site unreachable; **auto-renew must stay on** |
| **Firebase / GCP project `senoiacar`** | Hosting, Firestore, Functions, Auth | Google accounts with project IAM | Everything |
| **GitHub `jermdw/senoia-car-show`** | Source, CI, and the published copy of this playbook | GitHub account | No deploys; site keeps serving |
| **Resend** | Confirmation & cancellation emails | Functions secret `RESEND_API_KEY` | Sign-ups still work — email is best-effort — but volunteers get no confirmation |
| **Mapbox** | Static Images API for the venue map | A personal access token, used at export time only | Only blocks *regenerating* the map; the exported WebP is committed and keeps serving |
| **reCAPTCHA Enterprise** | App Check on prod callables | Site key is in `src/firebase.js` (public by design) | Sign-ups fail with `UNAUTHENTICATED` |
| **Google Tag Manager / GA4** | Analytics, container `GTM-5P5465M9` | Google account | Analytics only |
| **Ticket Tailor (SDDA box office)** | Vehicle registration + sponsorships | SDDA account | Nobody can register or sponsor |
| **enjoysenoia.com** | DDA site + online shirt store | DDA | Shirt sales |
| **senoiahistory.com** | Poker run ticket sales (Stripe) | SAHS | Poker run sales |

## What is public and fine

- **The Firebase web API key in `src/firebase.js`.** GitHub secret-scanning
  flags it; it is a public client identifier, not a secret, and the alert was
  resolved as such (alert #1). Don't rotate it in a panic when the alert fires
  again.
- **The reCAPTCHA Enterprise site key.** Site keys are public by definition.
- **The GCP project number and service account name.** Not secrets; they're in
  `scripts/setup-ci-deploy.sh` and the deploy workflow.

## What must never be committed

- `RESEND_API_KEY` or any Resend value
- Mapbox access tokens (`$MB_TOKEN` is an environment variable in the map
  recipe for this reason)
- Ticket Tailor **ticket access codes** — each unlocks one reserved curbside
  sponsor space
- Any service-account JSON key. There isn't one, and there shouldn't be — see
  below.
- Volunteer names, emails, phone numbers, or an exported roster CSV

`.gitignore` won't save you from all of these. Check what you're staging.

## Deploy credentials: there is no key

GitHub Actions authenticates to GCP with **Workload Identity Federation**:
GitHub's short-lived OIDC job token is exchanged for the `github-deploy` service
account, and the provider is restricted to this repository. No downloaded key
exists, so there is nothing to rotate and nothing to leak — which matters
because this repo is public.

`scripts/setup-ci-deploy.sh` is the one-time setup, and it is idempotent. Re-run
it after adding a role. The roles it binds are least-privilege for
`firebase deploy --only firestore:rules,functions,hosting` — hosting admin,
rules admin, functions developer, `serviceAccountUser` to act as the runtime SA,
and read-only on secrets/APIs/registry so the CLI's pre-deploy checks pass. **No
editor, no owner.** If a deploy fails on a missing permission, add the role and
re-run the script; don't reach for a broader one.

## Organizer access to the dashboard

Managed as **data, not deploys**: a document at `admins/<lowercase-email>` in
Firestore, created in the Firebase console.

| Role | Can |
| --- | --- |
| `admin` | Everything: manage shifts, remove volunteers, Awards tab, Announcement tab |
| `viewer` | Read and export the volunteer roster. Nothing else. |

**Write the role explicitly.** A document with no `role` is read as `admin` by
both the rules and the UI — a backwards-compatibility floor for entries written
before the viewer role existed, not a way to grant access.

Sign-in is Google popup or email magic link; both depend on `email_verified` in
the token, which is what the rules actually check.

**Adding a new Hosting domain?** Add it by hand to the Firebase Auth
*authorized domains* list, or Google sign-in fails from it with a generic,
unhelpful error.

## Annual access review

Do this at rollover, every year:

- [ ] Domain auto-renew on, payment card not expired
- [ ] `admins/*` — remove people who rotated off, add new ones with explicit roles
- [ ] GCP IAM — same question for humans with project access
- [ ] GitHub collaborators
- [ ] Ticket Tailor and DDA account access
- [ ] Resend: is the API key still valid, is `senoiacar.show` still a verified
      sending domain, are DNS records (SPF/DKIM) intact?
- [ ] Firebase billing: is the project still comfortably inside free tier?
- [ ] **At least two people can do each of the above.** A single-maintainer
      event website is one job change away from being unmaintainable.

## The bus-factor list

Write down, somewhere the DDA controls, who currently holds:

- [ ] Registrar login for `senoiacar.show`
- [ ] Owner on the `senoiacar` GCP project
- [ ] Admin on the GitHub repo
- [ ] Resend account
- [ ] Mapbox account (and which style id the map uses)
- [ ] Ticket Tailor box office
- [ ] The design source files ([05](05-assets-and-artwork.md))

That list must not live only in this repo, because the repo is one of the things
it grants access to.
