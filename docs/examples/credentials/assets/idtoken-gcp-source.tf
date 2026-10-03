terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.9.0"
    }
  }
}

variable "gcp_concourse_url" {
  description = "Concourse URL"
  type        = string

  default = "https://ci.concourse-ci.org"
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "project_number" {
  description = "GCP Project Number"
  type        = string
}

resource "google_iam_workload_identity_pool" "concourse_pool" {
  workload_identity_pool_id = "concourse-pool"
  display_name              = "Concourse"
  description               = "Identity pool for Concourse pipelines"
}

resource "google_iam_workload_identity_pool_provider" "concourse_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.concourse_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "concourse-provider"

  attribute_mapping = {
    "google.subject" = "assertion.sub"
  }

  oidc {
    issuer_uri = var.gcp_concourse_url
    allowed_audiences = [
      "https://iam.googleapis.com/projects/${var.project_number}/locations/global/workloadIdentityPools/concourse-pool/providers/concourse-provider"
    ]
  }
}

resource "google_service_account" "pipeline_sa" {
  account_id   = "concourse-deploy"
  display_name = "Concourse Deploy Pipeline"
}

resource "google_service_account_iam_member" "workload_identity_binding" {
  service_account_id = google_service_account.pipeline_sa.name
  role                = "roles/iam.workloadIdentityUser"
  member              = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.concourse_pool.name}/subject/main/deploy-to-gcp"
}

resource "google_project_iam_member" "storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.pipeline_sa.email}"
}
