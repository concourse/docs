---
title: Load Var Step
---

# `load_var` Step

Load the value for a var at runtime from a file, making it available to subsequent steps as
a [local build var](../vars.md#local-var) named after the given identifier. Expand each section below for more
details and examples.

??? warning "**`load_var`**: [`identifier`](../config-basics.md#identifier-schema)"

    The identifier will be the name of var, available to subsequent steps as a [local build var](../vars.md#local-var).

    ??? example "Loading a simple value as a var"

        The following pipeline loads vars from a text file whose contents are used as a version number to 
        [`put`](put.md).

        ```yaml
        jobs:
          - name: loading-vars
            plan:
              - get: examples
              - load_var: version
                file: examples/misc/simple-value.txt
              - put: img
                params:
                  version: ((.:version))
        
        
        resources:
          - name: examples
            type: git
            icon: github
            source:
              uri: https://github.com/concourse/examples.git
          - name: img
            type: mock
        ```

        `simple-value.txt` looks like this:

        ```text
        2.6.0
        ```

??? warning "**`file`**: [`file-path`](../config-basics.md#file-path-schema)"

    The path to a file whose content shall be read and used as the var's value.

??? info "**`format`**: `json` | `yaml` | `yml` | `trim` | `raw`"

    The format of the file's content.

    If unset, Concourse will try to detect the format from the file extension. If the file format cannot be determined, 
    Concourse will fallback to `trim`.

    If set to `json`, `yaml`, or `yml`, the file content will be parsed accordingly and the resulting structure will be 
    the value of the var.

    If set to `trim`, the var will be set to the content of the file with any trailing and leading whitespace removed.

    If set to `raw`, the var will be set to the content of the file without modification (i.e. with any existing 
    whitespace).

    ??? example "Loading a var with multiple fields"

        Let's say we have a file with multiple fields, like this `yaml` file:

        ```yaml
        first: initial
        number: "9000"
        hello: HAL
        ```

        We could pass these values to subsequent steps by loading it into a var with `load_var`, which will detect that 
        it is in YAML format based on the file extension:

        ```yaml
        jobs:
          - name: loading-vars
            plan:
              - get: examples
              - load_var: version
                file: examples/pipelines/vars-file.yml
              - put: img
                params:
                  version: "((.:version.hello))-((.:version.number))"
        
        
        resources:
          - name: examples
            type: git
            icon: github
            source:
              uri: https://github.com/concourse/examples.git
          - name: img
            type: mock
        ```

        If the file `vars-file.yml` was generated in a task and printed these values, they would be automatically 
        redacted unless `reveal: true` is set.

??? info "**`reveal`**: [`boolean`](../config-basics.md#boolean-schema)"

    _Default `false`_. If set to `true`, allow the var's content to be printed in the build output even with secret 
    redaction enabled.