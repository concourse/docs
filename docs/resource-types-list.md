---
title: Resource Types
hide:
  - navigation
  - toc
---

# Resource Types

This is a list of [Resource Types](./docs/resource-types/index.md) that users
of the community have written and made public for others to use. If you'd like
to add a resource type that you've made, make a Pull Request in the
[`concourse/docs`](https://github.com/concourse/docs/) repo.

<script src="/assets/javascripts/list.min.js"></script>

<div id="resource-types-table">
  <input type="search" class="search" placeholder="Search for a Resource Type" autofocus>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Add to Pipeline</th>
      </tr>
    </thead>
    <!-- IMPORTANT: tbody must have class "list" for List.js to work -->
    <tbody class="list">
      <tr>
          <td class="name">
              <a href="https://github.com/PixelAirIO/metadata-resource">metadata</a>
          </td>
          <td class="description">
              Returns the build metadata for a given build in a <code>build.json</code> file.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: metadata
                type: registry-image
                source:
                  repository: pixelairio/metadata-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cloudfoundry-community/github-pr-resource">github-pr</a>
          </td>
          <td class="description">
              Let Concourse pipelines to interact with GitHub Pull Requests
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: github-pr
                type: registry-image
                source:
                  repository: cfcommunity/github-pr-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/mockersf/concourse-slack-notifier">slack-notifier</a>
          </td>
          <td class="description">
              A structured and opinionated Slack notification resource
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: slack-notifier
                type: registry-image
                source:
                  repository: mockersf/concourse-slack-notifier
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cludden/concourse-keyval-resource">keyval</a>
          </td>
          <td class="description">
              A resource for passing arbitrary data between steps/jobs and curating dynamic filesystem content
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: keyval
                type: registry-image
                source:
                  repository: ghcr.io/cludden/concourse-keyval-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/rubenv/concourse-sentry-releases-resource">sentry-releases</a>
          </td>
          <td class="description">
              Manage releases in Sentry, can be used to upload sourcemaps.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: sentry-releases
                type: registry-image
                source:
                  repository: rubenv/concourse-sentry-releases-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/semver-resource">semver</a>
          </td>
          <td class="description">
              Automated semantic version bumping
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: semver
                type: registry-image
                source:
                  repository: concourse/semver-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/tomoyukim/concourse-appcenter-resource">appcenter-resource</a>
          </td>
          <td class="description">
              Concourse resource for distributing a build artifact to Microsoft App Center.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: appcenter-resource
                type: registry-image
                source:
                  repository: tomoyukim/concourse-appcenter-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/s3-resource">s3</a>
          </td>
          <td class="description">
              Concourse resource for interacting with AWS S3
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: s3
                type: registry-image
                source:
                  repository: concourse/s3-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/registry-image-resource">registry-image</a>
          </td>
          <td class="description">
              A resource for images in a Docker registry
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: registry-image
                type: registry-image
                source:
                  repository: concourse/registry-image-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/git-resource">git</a>
          </td>
          <td class="description">
              Tracks commits in a branch of a Git repository
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: git
                type: registry-image
                source:
                  repository: concourse/git-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/datadog-event-resource">datadog-event</a>
          </td>
          <td class="description">
              Fetch or emit events to Datadog.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: datadog-event
                type: registry-image
                source:
                  repository: concourse/datadog-event-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/coralogix/eng-concourse-resource-coralogix-event">coralogix-event</a>
          </td>
          <td class="description">
              Sends build events to Coralogix
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: coralogix-event
                type: registry-image
                source:
                  repository: quay.io/coralogix/eng-coralogix-event-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/digitalocean/artifactory-docker-resource">artifactory-docker</a>
          </td>
          <td class="description">
              Concourse resource for triggering, getting and putting new versions of docker / container image artifacts within Artifactory repositories.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: artifactory-docker
                type: registry-image
                source:
                  repository: digitalocean/artifactory-docker-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/michaellihs/prometheus-pushgateway-resource">prometheus-pushgateway</a>
          </td>
          <td class="description">
              Send metrics to Prometheus Push Gateway
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: prometheus-pushgateway
                type: registry-image
                source:
                  repository: michaellihs/prometheus-pushgateway-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/elgohr/concourse-sonarqube-notifier">sonarqube-notifier</a>
          </td>
          <td class="description">
              Gets Sonarqube results
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: sonarqube-notifier
                type: registry-image
                source:
                  repository: lgohr/sonarqube
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/haiku/irccat-resource">irccat</a>
          </td>
          <td class="description">
              A resource to send notifications to irc via an irccat service
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: irccat
                type: registry-image
                source:
                  repository: haiku/irccat-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cathive/concourse-sonarqube-resource">sonarqube</a>
          </td>
          <td class="description">
              Performs SonarQube analyses and tracks the state of SonarQube quality gates.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: sonarqube
                type: registry-image
                source:
                  repository: cathive/concourse-sonarqube-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cloudlena/apache-directory-index-resource">apache-directory-index</a>
          </td>
          <td class="description">
              Tracks changes to an Apache Directory Index (e.g. <code>http://mirror.easyname.ch/apache/tomcat/</code>)
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: apache-directory-index
                type: registry-image
                source:
                  repository: mastertinner/apache-directory-index-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/ringods/pulumi-resource">pulumi</a>
          </td>
          <td class="description">
              Manages infrastructure via Pulumi
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: pulumi
                type: registry-image
                source:
                  repository: ghcr.io/ringods/pulumi-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/tenjaa/concourse-github-app-token">github-app-token</a>
          </td>
          <td class="description">
              Get an installation token for your GitHub App to access the GitHub API
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: github-app-token
                type: registry-image
                source:
                  repository: tenjaa/concourse-github-app-token
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/frodenas/gcs-resource">gcs</a>
          </td>
          <td class="description">
              Concourse resource for interacting with Google Cloud Storage
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: gcs
                type: registry-image
                source:
                  repository: frodenas/gcs-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/arbourd/concourse-slack-alert-resource">slack-alert</a>
          </td>
          <td class="description">
              A structured Slack notification resource for Concourse
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: slack-alert
                type: registry-image
                source:
                  repository: arbourd/concourse-slack-alert-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/dcsg/datetime-version-resource">datetime-version</a>
          </td>
          <td class="description">
              A resource to generate a date time version
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: datetime-version
                type: registry-image
                source:
                  repository: dcsg/datetime-version-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cludden/concourse-steampipe-resource">steampipe</a>
          </td>
          <td class="description">
              A resource for implementing a wide variety of triggers and data integrations via Steampipe and its expansive plugin ecosystem
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: steampipe
                type: registry-image
                source:
                  repository: ghcr.io/cludden/concourse-steampipe-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/n7mobile/concourse-bitbucket-pr">bitbucket-pr</a>
          </td>
          <td class="description">
              Tracks pull requests on BitBucket and updates it's status
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: bitbucket-pr
                type: registry-image
                source:
                  repository: n7docker/concourse-bitbucket-pr
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cathive/concourse-chartmuseum-resource">chartmuseum</a>
          </td>
          <td class="description">
              Fetches, verifies and publishes Helm Charts from a running ChartMuseum instance.
              Harbor works as well, since it uses ChartMuseum under the hood.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: chartmuseum
                type: registry-image
                source:
                  repository: cathive/concourse-chartmuseum-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/github-release-resource">github-release</a>
          </td>
          <td class="description">
              A resource for github releases
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: github-release
                type: registry-image
                source:
                  repository: concourse/github-release-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/vmware-archive/concourse-vrealize-automation-resource">vrealize-automation</a>
          </td>
          <td class="description">
              Executes vRealize Automation pipelines
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: vrealize-automation
                type: registry-image
                source:
                  repository: projects.registry.vmware.com/concourse-vra-resource/concourse-vra-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/troykinsella/concourse-artifactory-deb-resource">artifactory-deb</a>
          </td>
          <td class="description">
              Fetch from, and publish to Debian/Ubuntu apt repositories in Artifactory.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: artifactory-deb
                type: registry-image
                source:
                  repository: troykinsella/concourse-artifactory-deb-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/SHyx0rmZ/aptly-cli-resource">aptly-cli</a>
          </td>
          <td class="description">
              Enables you to transfer packages between your job and an aptly repository
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: aptly-cli
                type: registry-image
                source:
                  repository: shyxormz/aptly-cli-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/srinivasa-vasu/concourse-k8s">k8s</a>
          </td>
          <td class="description">
              Custom K8s resource type to deploy manifests to K8s
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: k8s
                type: registry-image
                source:
                  repository: srinivasavasu/concourse-k8s
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/qudini/concourse-http-jq-resource">http-jq</a>
          </td>
          <td class="description">
              Exposing version of a resource over an HTTP endpoint and parsing it via jq into Concourse jobs
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: http-jq
                type: registry-image
                source:
                  repository: qudini/concourse-http-jq-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/totegamma/githubapps-content-resource">githubapps-content-resource</a>
          </td>
          <td class="description">
              A resource for clone github private repository with GithubApps credential.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: githubapps-content-resource
                type: registry-image
                source:
                  repository: ghcr.io/totegamma/githubapps-content-resource:master
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://git.sr.ht/~kdihalas/concourse-do-kubernetes-resource">digitalocean-kubernetes-resource</a>
          </td>
          <td class="description">
              Create, update and delete Digitalocean Kubernetes Clusters.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: digitalocean-kubernetes-resource
                type: registry-image
                source:
                  repository: kdihalas/digitalocean-kubernetes-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/ljfranklin/terraform-resource">terraform</a>
          </td>
          <td class="description">
              Manages infrastructure via Terraform
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: terraform
                type: registry-image
                source:
                  repository: ljfranklin/terraform-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cloudfoundry-community/slack-notification-resource">slack-notification</a>
          </td>
          <td class="description">
              A resource for sending notifications to Slack
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: slack-notification
                type: registry-image
                source:
                  repository: cfcommunity/slack-notification-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/spring-io/artifactory-resource">artifactory</a>
          </td>
          <td class="description">
              Check, deploy and retrieve artifacts using the "builds" and "artifact properties" Artifactory features.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: artifactory
                type: registry-image
                source:
                  repository: springio/artifactory-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/mdb/concourse-consul-kv-resource">consul-kv</a>
          </td>
          <td class="description">
              Get or set a key/value pair in Consul's KV store.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: consul-kv
                type: registry-image
                source:
                  repository: clapclapexcitement/concourse-consul-kv-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cloudfoundry-community/cf-resource">cf</a>
          </td>
          <td class="description">
              Concourse resource for interacting with Cloud Foundry
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: cf
                type: registry-image
                source:
                  repository: concourse/cf-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/cloudfoundry-community/bosh-config-resource">bosh-config</a>
          </td>
          <td class="description">
              A resource for interacting with configs (Cloud, Runtime, CPI, etc…) living on a Bosh server
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: bosh-config
                type: registry-image
                source:
                  repository: cfcommunity/bosh-config-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/pool-resource">pool</a>
          </td>
          <td class="description">
              Atomically manages the state of the world (e.g. external environments)
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: pool
                type: registry-image
                source:
                  repository: concourse/pool-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/troykinsella/concourse-rubygems-resource">rubygems</a>
          </td>
          <td class="description">
              Fetch and publish Ruby gem packages to a RubyGems repository.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: rubygems
                type: registry-image
                source:
                  repository: troykinsella/concourse-rubygems-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/makohoek/repo-resource">repo</a>
          </td>
          <td class="description">
              Track changes for projects using Google's repo (Gerrit).
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: repo
                type: registry-image
                source:
                  repository: mkorpershoek/repo-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/jghiloni/helm-chart-resource">helm-chart</a>
          </td>
          <td class="description">
              Download and publish helm charts from helm repositories.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: helm-chart
                type: registry-image
                source:
                  repository: jghiloni/helm-chart-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/jmkarthik/concourse-kubectl-resource">kubectl</a>
          </td>
          <td class="description">
              Deploys resources to a Kubernetes cluster using "kubectl apply -f" command
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: kubectl
                type: registry-image
                source:
                  repository: jmkarthik/concourse-kubectl-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/coralogix/eng-concourse-resource-dhall">dhall</a>
          </td>
          <td class="description">
              Tracks the changes in a remote Dhall expression, and makes them available locally.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: dhall
                type: registry-image
                source:
                  repository: quay.io/coralogix/eng-concourse-resource-dhall
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/troykinsella/concourse-fly-resource">fly</a>
          </td>
          <td class="description">
              Manipulate the Concourse fly command-line client.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: fly
                type: registry-image
                source:
                  repository: troykinsella/concourse-fly-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/navicore/teams-notification-resource">teams-notification</a>
          </td>
          <td class="description">
              Resource for pipeline notifications to Microsoft Teams
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: teams-notification
                type: registry-image
                source:
                  repository: navicore/teams-notification-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/orstensemantics/concourse-tfe-resource">tfe</a>
          </td>
          <td class="description">
              Create/read/update workspace variables, create/apply runs, and
              read root-level state outputs for Hashicorp Terraform Cloud and
              Terraform Enterprise workspaces.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: tfe
                type: registry-image
                source:
                  repository: orstensemantics/concourse-tfe-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/nulldriver/maven-resource">maven</a>
          </td>
          <td class="description">
              Integrate your pipeline with any Maven Repository Manager (Artifactory, Nexus, GitHub Packages, etc.)
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: maven
                type: registry-image
                source:
                  repository: nulldriver/maven-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/warricksothr/concourse-rclone-resource">rclone</a>
          </td>
          <td class="description">
              Publish arbitrary files and directories using Rclone.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: rclone
                type: registry-image
                source:
                  repository: sothr/concourse-rclone-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/ktchen14/static-resource">static</a>
          </td>
          <td class="description">
              A resource to expose static information as a directory
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: static
                type: registry-image
                source:
                  repository: ktchen14/static-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/mamercad/concourse-awx-resource">awx</a>
          </td>
          <td class="description">
              Launches AWX job templates and workflows
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: awx
                type: registry-image
                source:
                  repository: quay.io/mamercad/concourse-awx-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/elgohr/concourse-blackduck">blackduck</a>
          </td>
          <td class="description">
              Use Blackduck from Concourse
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: blackduck
                type: registry-image
                source:
                  repository: lgohr/blackduck-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/flavorjones/irc-notification-resource">irc-notification</a>
          </td>
          <td class="description">
              Sends notification messages to an IRC channel.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: irc-notification
                type: registry-image
                source:
                  repository: flavorjones/irc-notification-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/meshcloud/gate-resource">gate</a>
          </td>
          <td class="description">
              A generic gate resource for Concourse CI. Allows you to model
              quality gates and pipeline control flow.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: gate
                type: registry-image
                source:
                  repository: meshcloud/gate-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/nderjung/concourse-github-pr-comment-resource">github-pr-comment</a>
          </td>
          <td class="description">
              Monitors incoming comments on a Github Pull Request and is able
              to monitor for comments matching regular expressions, match
              comment author's association with the project, the pull request's
              state and any labels it has been assigned. 
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: github-pr-comment
                type: registry-image
                source:
                  repository: ndrjng/concourse-github-pr-comment-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/flavorjones/webhook-notification-resource">webhook-notification</a>
          </td>
          <td class="description">
              Sends notification messages to services like Discord and Gitter
              via webhook. Easily extensible to other services.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: webhook-notification
                type: registry-image
                source:
                  repository: flavorjones/webhook-notification-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/time-resource">time</a>
          </td>
          <td class="description">
              A resource for triggering on an interval
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: time
                type: registry-image
                source:
                  repository: concourse/time-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/SHyx0rmZ/capistrano-resource">capistrano</a>
          </td>
          <td class="description">
              Enables you to run Capistrano deployments from your pipeline
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: capistrano
                type: registry-image
                source:
                  repository: shyxormz/capistrano-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/coralogix/eng-concourse-resource-github-list-repos">github-list-repos</a>
          </td>
          <td class="description">
              Lists the repositories that belong to a GitHub organization or team, but does not clone them.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: github-list-repos
                type: registry-image
                source:
                  repository: quay.io/coralogix/concourse-resource-github-list-repos
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/dcsg/bugsnag-build-resource">bugsnag-build</a>
          </td>
          <td class="description">
              Notifies Bugsnag Build API of a new release
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: bugsnag-build
                type: registry-image
                source:
                  repository: dcsg/bugsnag-build-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/nulldriver/cf-cli-resource">cf-cli</a>
          </td>
          <td class="description">
              The missing link between Concourse and Cloud Foundry.  Push apps, create services, manage container networking and more!
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: cf-cli
                type: registry-image
                source:
                  repository: nulldriver/cf-cli-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/jgriff/k8s-resource">k8s-resource</a>
          </td>
          <td class="description">
              Tracks resources in a Kubernetes cluster
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: k8s-resource
                type: registry-image
                source:
                  repository: jgriff/k8s-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/alphagov/paas-grafana-annotation-resource">grafana-annotation</a>
          </td>
          <td class="description">
              Creates or updates a Grafana annotation
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: grafana-annotation
                type: registry-image
                source:
                  repository: gdsre/grafana-annotation-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/coralogix/eng-concourse-resource-pagerduty-incident">pagerduty-incident</a>
          </td>
          <td class="description">
              Triggers PagerDuty incidents (for example, on pipeline failure)
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: pagerduty-incident
                type: registry-image
                source:
                  repository: ghcr.io/coralogix/eng-concourse-resource-pagerduty-incident
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/bosh-io-release-resource">bosh-io-release</a>
          </td>
          <td class="description">
              Tracks BOSH releases published on https://bosh.io
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: bosh-io-release
                type: registry-image
                source:
                  repository: concourse/bosh-io-release-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/hdisysteme/artifacthub-resource">artifacthub</a>
          </td>
          <td class="description">
              Tracks and gets new versions of Helm Charts which are registered at https://artifacthub.io/
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: artifacthub
                type: registry-image
                source:
                  repository: ghcr.io/hdisysteme/artifacthub-resource:latest
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/vmware-archive/cron-resource">cron</a>
          </td>
          <td class="description">
              Implements a resource that reports new versions when the current time matches the crontab expression
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: cron
                type: registry-image
                source:
                  repository: cftoolsmiths/cron-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/jgriff/http-resource">http-resource</a>
          </td>
          <td class="description">
              Tracks resources from HTTP endpoints using custom version strategies (headers, body jq, hash, etc) from response
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: http-resource
                type: registry-image
                source:
                  repository: jgriff/http-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/hg-resource">hg</a>
          </td>
          <td class="description">
              Mercurial resource for Concourse
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: hg
                type: registry-image
                source:
                  repository: concourse/hg-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/gstackio/openssl-source-code-resource">openssl-source-code</a>
          </td>
          <td class="description">
              Concourse resource to track and fetch OpenSSL source code tarballs
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: openssl-source-code
                type: registry-image
                source:
                  repository: gstack/openssl-source-code-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/troykinsella/concourse-ansible-playbook-resource">ansible-playbook</a>
          </td>
          <td class="description">
              Execute ansible-playbook to provision remote systems.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: ansible-playbook
                type: registry-image
                source:
                  repository: troykinsella/concourse-ansible-playbook-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/Pix4D/cogito">cogito</a>
          </td>
          <td class="description">
              Cogito updates the GitHub status of a commit during a build. Simple configuration and lightweight image.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: cogito
                type: registry-image
                source:
                  repository: pix4d/cogito
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/troykinsella/concourse-docker-compose-resource">docker-compose</a>
          </td>
          <td class="description">
              Use docker-compose to control Docker containers on remote hosts.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: docker-compose
                type: registry-image
                source:
                  repository: troykinsella/concourse-docker-compose-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/tlwr/registry-tag-resource">registry-tag</a>
          </td>
          <td class="description">
              A resource for image tags in a Docker registry
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: registry-tag
                type: registry-image
                source:
                  repository: ghcr.io/tlwr/registry-tag-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/michaellihs/rocketchat-notification-resource">rocketchat-notification</a>
          </td>
          <td class="description">
              Send notification messages to RocketChat
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: rocketchat-notification
                type: registry-image
                source:
                  repository: michaellihs/rocket-notify-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/ckaznocha/marathon-resource">marathon</a>
          </td>
          <td class="description">
              Deploy applications to Marathon
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: marathon
                type: registry-image
                source:
                  repository: ckaznocha/marathon-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/huangyisan/wechat_notification_resource">wechat-notification-resource</a>
          </td>
          <td class="description">
              Send notification messages to WeChat
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: wechat-notification-resource
                type: registry-image
                source:
                  repository: dockerhuangyisan/wechat-notification-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/troykinsella/concourse-artifactory-resource">artifactory</a>
          </td>
          <td class="description">
              Publish artifacts, such as tarballs, to Artifactory generic repositories.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: artifactory
                type: registry-image
                source:
                  repository: troykinsella/concourse-artifactory-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/SHyx0rmZ/bitbucket-build-status-resource">bitbucket-build-status</a>
          </td>
          <td class="description">
              Lets you update the build status for commits in Bitbucket
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: bitbucket-build-status
                type: registry-image
                source:
                  repository: shyxormz/bitbucket-build-status-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/tenjaa/concourse-phraseapp-resource">phraseapp</a>
          </td>
          <td class="description">
              A resource to trigger a job on changes on a PhraseApp project
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: phraseapp
                type: registry-image
                source:
                  repository: tenjaa/concourse-phraseapp-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/suhlig/concourse-rss-resource">rss</a>
          </td>
          <td class="description">
              Tracks an RSS feed and provides the pubDate of items as new versions.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: rss
                type: registry-image
                source:
                  repository: suhlig/concourse-rss-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/docker-image-resource">docker-image</a>
          </td>
          <td class="description">
              A resource for docker images
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: docker-image
                type: registry-image
                source:
                  repository: concourse/docker-image-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/bosh-io-stemcell-resource">bosh-io-stemcell</a>
          </td>
          <td class="description">
              Tracks BOSH stemcells published on https://bosh.io
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: bosh-io-stemcell
                type: registry-image
                source:
                  repository: concourse/bosh-io-stemcell-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/Typositoire/concourse-helm3-resource">helm3</a>
          </td>
          <td class="description">
              Download and deploy Helm 3 charts to Kubernetes.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: helm3
                type: registry-image
                source:
                  repository: typositoire/concourse-helm3-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/ardavanhashemzadeh/concourse-webhook-resource">concourse-webhook-resource</a>
          </td>
          <td class="description">
              Use files in git repo to track and throttle API calls as pipeline trigger.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: concourse-webhook-resource
                type: registry-image
                source:
                  repository: ardavanhashemzadeh/concourse-webhook-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/ansd/lastpass-resource">lastpass</a>
          </td>
          <td class="description">
              Tracks LastPass items.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: lastpass
                type: registry-image
                source:
                  repository: ansd/lastpass
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/vmware-tanzu/observability-event-resource">observability-event</a>
          </td>
          <td class="description">
              Publish events to VMware Tanzu Observability by Wavefront
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: observability-event
                type: registry-image
                source:
                  repository: projects.registry.vmware.com/tanzu/observability-event-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/jgriff/hipchat-notification-resource">hipchat-notification</a>
          </td>
          <td class="description">
              Send notification messages to HipChat
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: hipchat-notification
                type: registry-image
                source:
                  repository: jgriff/hipchat-notification-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://fossil.avalos.me/fossil-concourse">fossil</a>
          </td>
          <td class="description">
              Tracks commits in a branch of a Fossil repository
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: fossil
                type: registry-image
                source:
                  repository: avalos/fossil-concourse-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/shyamz-22/newrelic-deployment-resource">newrelic-deployment-resource</a>
          </td>
          <td class="description">
              A concourse resource for adding deployment markers in New Relic
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: newrelic-deployment-resource
                type: registry-image
                source:
                  repository: shyamz22/newrelic-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/concourse/mock-resource">mock</a>
          </td>
          <td class="description">
              A resource for testing; reflects the version it's told, and is able to mirror itself
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: mock
                type: registry-image
                source:
                  repository: concourse/mock-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/gstackio/keyval-resource">key-value</a>
          </td>
          <td class="description">
              A resource that passes key-value pairs between jobs, using plain files in some directory
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: key-value
                type: registry-image
                source:
                  repository: gstack/keyval-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/brightzheng100/semver-config-concourse-resource">semver-config</a>
          </td>
          <td class="description">
              Detect desired semantic version changes and retrieve a set of semantic version-based configs from one single YAML file.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: semver-config
                type: registry-image
                source:
                  repository: itstarting/semver-config-concourse-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/ardavanhashemzadeh/metadata-resource">metadata</a>
          </td>
          <td class="description">
              Simple concourse resource which saves build metadata to a file
              which may be used by tasks because by default the environment
              variables are only available to resources and not tasks.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: semver-config
                type: registry-image
                source:
                  repository: ghcr.io/ardavanhashemzadeh/metadata-resource
                  tag: main
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/homeport/duct-tape-resource">duct-tape</a>
          </td>
          <td class="description">
              Generic custom Concourse resource with which one can define the
              check, in, and out as inline scripts right in the pipeline
              resource definition. It is for when you quickly need a Concourse
              resource for a specific task, but writing one from scratch would
              take too long. With this resource, one can glue things together.
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: semver-config
                type: registry-image
                source:
                  repository: ghcr.io/homeport/duct-tape-resource
              ```
          </td>
      </tr>
      <tr>
          <td class="name">
              <a href="https://github.com/higuoxing/concourse-google-chat-alert-resource">google-chat-alert</a>
          </td>
          <td class="description">
              A structured Google Chat notification resource for Concourse
          </td>
          <td class="pipeline-yaml">
              ```yaml
              - name: semver-config
                type: registry-image
                source:
                  repository: epic2/concourse-google-chat-alert-resource
              ```
          </td>
      </tr>
    </tbody>
  </table>

</div>

<script>
var options = {
  valueNames: [ 'name', 'description' ]
};

var resourceList = new List('resource-types-table', options);
// Randomly sort the list so we're never playing favourites
resourceList.sort('name', { sortFunction: function() { return Math.random() - 0.5; }})
</script>

