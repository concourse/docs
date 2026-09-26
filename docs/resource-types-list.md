---
title: Resource Types
hide:
  - navigation
  - toc
---

This is a list of [Resource Types](./docs/resource-types/index.md) that users
of the community have written and made public for others to use. If you'd like
to add a resource type that you've made, make a Pull Request in the
[`concourse/docs`](https://github.com/concourse/docs/) repo.

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
{% for rt in resource_types %}
            <tr>
              <td class="name">
                  <a href="{{ rt.url }}">{{ rt.name }}</a>
              </td>
              <td class="description">
                  {{ rt.description }}
              </td>
              <td class="pipeline-yaml">
                ```yaml
                  - name: {{ rt.resource_name | default(rt.name) }}
                    type: registry-image
                    source:
                      repository: {{ rt.image }}
                      {% if rt.tag %}
                      tag: {{ rt.tag }}
                      {% endif %}
                ```
              </td>
            </tr>
{% endfor %}
    </tbody>
  </table>
</div>
