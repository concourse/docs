---
title: Config Basics
---

Concourse configuration for things like [Pipelines](pipelines/index.md) and [Tasks](tasks.md) is done through
declarative [YAML](https://en.wikipedia.org/wiki/YAML) files.

Concourse configuration supports basic variable substitution by way of `((vars))`. There is no built-in support for
fancier templating constructs, e.g. loops and conditionals; users are free to use whatever templating system they like.

## Intro to YAML

[YAML](https://yaml.org/) is a human-friendly syntax for writing structured documents. You can think of it as JSON
without the sharp edges.

If you want a slightly more in-depth overview of YAML compared to what we provide below, we recommend
reading [Learn YAML in Y Minutes](https://learnxinyminutes.com/yaml/).

Here's a quick example demonstrating common YAML syntax:

```yaml
# commented lines are prefixed with the '#' character

# strings
quoted_string: "bar"
unquoted_string: hello world!
multiline_string: |
  hello, world!
  this is one big string with a trailing linebreak!

# arrays
array: [ hello, world ]
multiline_array:
  - hello
  - world

# objects
object: { one: uno, two: dos }
multiline_object:
  one: uno
  two: dos

# boolean values
booleans: [ true, false ]

# numeric values
numeric: [ 1234, 12.34 ]
```

### YAML Tips & Tricks

YAML anchor syntax can be used to avoid repetition within configuration.

For example, the following YAML document...:

```yaml
large_value: &my_anchor
  do_the_thing: true
  with_these_values: [ 1, 2, 3 ]

duplicate_value: *my_anchor
```

...is exactly equivalent to:

```yaml
large_value:
  do_the_thing: true
  with_these_values: [ 1, 2, 3 ]

duplicate_value:
  do_the_thing: true
  with_these_values: [ 1, 2, 3 ]
```

If you find yourself repeating configuration throughout your pipeline, it may be a sign that Concourse is missing some
kind of abstraction to make your pipeline less verbose. If you have the time and are interested in helping out with
Concourse's design, feedback of this sort is welcome
in [GitHub Discussions](https://github.com/concourse/concourse/discussions)!

We do want to avoid implementing an entire YAML templating engine within Concourse. We encourage you to reach for your
favourite templating tool if you're eager about [DRYing](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up your
pipelines as much as possible.

### YAML Quirks

YAML has some weird parts. For example, all the following terms are acceptable boolean values: `true`, `false`, `yes`,
`no`, `on`, `off`.

YAML is also whitespace-sensitive. For the most part, this is really handy because it keeps you from having to count
curly-braces in deeply nested parts of configuration such as [
`job.plan`](https://concourse-ci.org/jobs.html#schema.job.plan). Sometimes, though, it can be hard to keep track of the
correct indentation level.

## Basic Schemas

Throughout the Concourse documentation you will come across schema definitions for each API.

The following are basic schema definitions that the other schemas refer to. You can probably skip past this and just
make assumptions along the way; this is just here for completeness!

### `number` schema

Any integer, i.e. `1000`.

### `string` schema

An arbitrary string value with no content restrictions.

### `config` schema

An arbitrary object representing configuration that is not directly interpreted by Concourse - typically given to
a [resource type](resource-types/index.md).

```yaml
uri: https://github.com/vito/booklit
branch: master
```

All object keys must be strings, preferably `snake_cased`.

### `vars` schema

An arbitrary object representing key-value definitions for `((vars))`.

As with [`config` schema](#config-schema), all object keys must be strings, preferably `snake_cased`.

### `env-vars` schema

An object containing string keys and string values. Each pair represents an environment variable to set to the given
value.

```yaml
SOME_SIMPLE_VAR: simple-var
SOME_LONG_VAR: |
  This is an example of using YAML multi-line string syntax to set a very
  long environment variable value.
SOME_NUMERIC_VALUE: "1"
```

Note that in the last example we took special care to quote the number.

### `boolean` schema

`true` or `false`.

YAML also supports the alias `yes`, `no`, `on`, or `off`, but ... please don't.

### `value` schema

An arbitrary YAML value. It may be a [`number` schema](#number-schema), [`string` schema](#string-schema), [
`boolean` schema](#boolean-schema), [`config` schema](#config-schema), or a [`[value` schema`]`](#value-schema).

```yaml
values:
  - 123
  - bar
  - true
  - key1: abc
    key2: def
  - [ hello, world ]
```

### `identifier` schema

An _identifier_ is a string value. The following defines the allowed character set for an _identifier_:

* Unicode lowercase letters, while still supporting languages that don't have any casing (e.g. Japanese).
* Decimal numbers.
* Hyphens `-` and underscores `_` as word separators.
* Periods `.` in order to support domain names and version numbers.

The validation rule is as follows:

```regexp
^[\p{Ll}\p{Lt}\p{Lm}\p{Lo}\d][\p{Ll}\p{Lt}\p{Lm}\p{Lo}\d\-_.]*$
```

Where all _identifier_ must start with a Unicode lowercase letter or number, followed by any number of allowed
characters.

Currently, the validation will only show as warnings. For the sake of future-proofing, you may want to conform to it.

### `dir-path` schema

A string value specifying a (typically relative) path of a directory.

### `file-path` schema

A string value specifying a (typically relative) path of a file.

### `duration` schema

A string value in [Go `time.ParseDuration` format](https://golang.org/pkg/time/#ParseDuration). `1h` for one hour, `5m`
for 5 minutes.

### `version` schema

An object with string keys and string values.

The following is an array of versions:

```yaml
- { "ref": "33042e15e930b6786fc9b0a9ea5dec78689c5e4b" }
- ref: v1.2.0,
  sha: 33042e15e930b6786fc9b0a9ea5dec78689c5e4b
- foo: "0"
```

Note that in the last example we took special care to quote the number.

In many scenarios where a version can be specified, e.g. [`get` step
`version`](https://concourse-ci.org/get-step.html#schema.get.version), only a subset of the full set of fields is
necessary. The latest version matching the fields specified will be chosen.
