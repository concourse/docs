terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "3.0.2"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.15.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "azure_concourse_url" {
  description = "Concourse URL"
  type        = string

  default = "https://ci.concourse-ci.org"
}

resource "azuread_application_registration" "pipeline_app" {
  display_name = "concourse-deploy"
}

resource "azuread_service_principal" "pipeline_sp" {
  client_id = azuread_application_registration.pipeline_app.client_id
}

resource "azuread_application_federated_identity_credential" "concourse_federation" {
  application_id = azuread_application_registration.pipeline_app.id
  display_name   = "concourse-oidc"
  description    = "Federated credential trusting JWTs issued by Concourse"

  issuer  = var.azure_concourse_url
  subject = "main/deploy-to-azure"
  audiences = [
    "api://AzureADTokenExchange"
  ]
}

data "azurerm_resource_group" "target" {
  name = "example-resources"
}

resource "azurerm_role_assignment" "pipeline_access" {
  scope                = data.azurerm_resource_group.target.id
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.pipeline_sp.object_id
}
