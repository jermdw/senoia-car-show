#!/usr/bin/env bash
# One-time GCP setup for .github/workflows/deploy.yml (keyless GitHub → Firebase
# deploys). Idempotent: safe to re-run. Needs gcloud authed as a project Owner:
#
#   gcloud auth login jermdw@gmail.com
#   bash scripts/setup-ci-deploy.sh
#
# What it does, and why:
#  1. A dedicated service account, github-deploy, that only GitHub Actions uses.
#  2. Least-privilege roles for `firebase deploy --only firestore:rules,functions,hosting`
#     (hosting admin; rules admin so a security-rule change ships with the page
#     that depends on it; functions developer + serviceAccountUser to act as the
#     runtime SA; read-only on secrets/APIs/registry so the CLI's pre-deploy
#     checks pass). No editor/owner.
#
#     Re-run this script after adding a role — it is idempotent, and the deploy
#     workflow fails loudly on the missing permission until you do.
#  3. A Workload Identity pool + GitHub OIDC provider, restricted to THIS repo,
#     so GitHub's short-lived job token can be exchanged for the SA — no
#     downloaded key, nothing to rotate or leak.
set -euo pipefail

PROJECT=senoiacar
PROJECT_NUMBER=679851800295
REPO=jermdw/senoia-car-show
SA_NAME=github-deploy
SA="$SA_NAME@$PROJECT.iam.gserviceaccount.com"
POOL=github
PROVIDER=github

echo "== APIs"
gcloud services enable iamcredentials.googleapis.com sts.googleapis.com --project "$PROJECT"

echo "== Service account $SA"
if ! gcloud iam service-accounts describe "$SA" --project "$PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SA_NAME" --project "$PROJECT" \
    --display-name "GitHub Actions deploy ($REPO)"
fi

# IAM is eventually consistent: a policy binding issued right after the account
# is created fails with "Service account ... does not exist" for a few seconds.
# Retry the binding rather than racing it.
bind_project_role() {
  local role=$1 attempt
  for attempt in 1 2 3 4 5 6; do
    if gcloud projects add-iam-policy-binding "$PROJECT" \
         --member "serviceAccount:$SA" --role "$role" --condition=None --quiet >/dev/null 2>&1; then
      return 0
    fi
    sleep 5
  done
  echo "!! could not bind $role after $attempt attempts" >&2
  return 1
}

echo "== Roles"
for role in \
  roles/firebasehosting.admin \
  roles/firebaserules.admin \
  roles/firebase.viewer \
  roles/cloudfunctions.developer \
  roles/iam.serviceAccountUser \
  roles/secretmanager.viewer \
  roles/serviceusage.serviceUsageViewer \
  roles/artifactregistry.reader \
  roles/run.viewer
do
  bind_project_role "$role"
  echo "   $role"
done

echo "== Workload Identity pool/provider"
if ! gcloud iam workload-identity-pools describe "$POOL" --project "$PROJECT" --location global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$POOL" --project "$PROJECT" --location global \
    --display-name "GitHub Actions"
fi
if ! gcloud iam workload-identity-pools providers describe "$PROVIDER" --project "$PROJECT" \
      --location global --workload-identity-pool "$POOL" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" --project "$PROJECT" \
    --location global --workload-identity-pool "$POOL" \
    --display-name "GitHub" \
    --issuer-uri "https://token.actions.githubusercontent.com" \
    --attribute-mapping "google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition "assertion.repository == '$REPO'"
fi

echo "== Let $REPO's workflows impersonate $SA"
gcloud iam service-accounts add-iam-policy-binding "$SA" --project "$PROJECT" \
  --role roles/iam.workloadIdentityUser \
  --member "principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL/attribute.repository/$REPO" \
  --quiet >/dev/null

cat <<EOF

Done. Provider resource name (already in .github/workflows/deploy.yml):
  projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL/providers/$PROVIDER

Test it: gh workflow run deploy.yml && gh run watch
EOF
