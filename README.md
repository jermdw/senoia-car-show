# Senoia Car Show

Website and volunteer sign-up system for the Annual Fall Senoia Car Show —
live at [senoiacar.show](https://senoiacar.show).

## Stack

- **Frontend**: React (Vite) + Tailwind, deployed to Firebase Hosting
- **Backend**: Cloud Firestore + Cloud Functions (`signUp`, `cancelSignup` callables)
- **Email**: Resend, sent from the sign-up function (secret `RESEND_API_KEY`)

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/volunteer` | Public shift board — claim a spot with name/email/phone, no account |
| `/cancel?token=…` | Cancellation link from the confirmation email |
| `/admin` | Organizer dashboard — Google sign-in, allowlisted via `admins/{email}` docs |

## Development

```bash
npm install && (cd functions && npm install)
npx firebase-tools emulators:start --only auth,functions,firestore
npm run dev   # separate terminal; dev build auto-connects to emulators
node scripts/seed-shifts.mjs data/event_signups_2025_template.csv   # seed emulator
```

## Deploy

```bash
npm run build
npx firebase-tools deploy --project senoiacar
```

Seed production (idempotent, preserves filled-spot counts):

```bash
GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token) \
  node scripts/seed-shifts.mjs data/event_signups_2025_template.csv --prod
```
