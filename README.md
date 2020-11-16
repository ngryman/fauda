<h3 align="center">fauda</h3>
<h4 align="center">Don't worry about configuration anymore.</h4>

<p align="center">
  <a href="https://zapier.slack.com/archives/CD4LXLTK5">
    <img src="https://img.shields.io/badge/team-foundations-brightgreen?style=flat-square" />
  </a>
  <a href="https://zapier.slack.com/archives/CD4LXLTK5">
    <img src="https://img.shields.io/badge/maintained-yes-brightgreen?style=flat-square" />
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#usage">Usage</a> •
  <a href="#api">API</a> •
</p>

---

## Features

- **One dependency** to load and validate your configuration.
- **Load from multiple sources** such as JSON, YAML, JavaScript, Typescript, command-line arguments, and environment variables.
- **Validate your configuration** with a JSON schema. BONUS: Your configuration files have auto-completion in VSCode!
- **Generate types** for your Typescript code and for Typescript configuration files.
- **Expand environment variables** in any configuration value.

## Getting Started

<details>
<summary><b>1️⃣ Install</b> Fauda</summary><br>

```sh
npm install fauda
```

</details>

<details>
<summary><b>2️⃣ Set up</b> your JSON schema</summary><br>

Fauda relies on a [JSON schema](https://json-schema.org/) to load and validate your configuration, but also to generate types.

For more information please take a look at TODO.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "My awesome pasta app configuration",
  "type": "object",
  "properties": {
    "$schema": {
      "description": "Path to my pasta app's schema.",
      "type": "string"
    },
    "type": {
      "description": "The type of pasta.",
      "type": "string",
      "enum": ["Fettuccine", "Tagliatelle"],
      "required": true,
      "default": "Fettuccine"
    },
    "cookingTime": {
      "description": "Cooking time in seconds.",
      "type": "number",
      "default": 300
    },
    "seasoning": {
      "description": "A list of seasoning ingredients.",
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": ["Salt", "Pepper", "Olive Oil", "Pecorino"]
    }
  }
}
```

</details>

<details>
<summary><b>3️⃣ Generate</b> Typescript typings <i>optional</i></summary><br>

```sh
$ npx fauda types
```

This will generate the `Configuration` type in `src/configuration.ts` by default.

```ts
export interface Configuration {
  type: 'Fettuccine' | 'Tagliatelle'
  cookingTime?: number
  seasoning?: string[]
}
```

</details>

<details>
<summary><b>4️⃣ Load & validate</b> your configuration.</summary><br>

Assuming your package is named `pasta`:

```ts
import fauda from 'fauda'
import { Configuration } from './configuration'

async function loadConfiguration() {
  try {
    const configuration = await fauda<Configuration>('pasta')
  } catch (err) {
    console.error(err.message)
  }
}
```

</details>

## How does Fauda work?

It collects your configuration from various sources at the same time:

- Environment variables
- Command-line arguments
- Configuration files

Once collected, configurations are merged using the above order of precedence. It means that if the same option is collected from both an environment variable and a configuration file, the former will kept.

Finally, it normalizes your configuration. The normalization process validates your configuration using the provided JSON schema. It checks that the types of the collected options are valid and sets default values if necessary. It also expand environment variables that are references in options.

<details>
<summary>🙋🏻‍♂️ <i>What is environment variable expansion?</i></summary><br>

You can reference an environment variable's name as your option's value. Fauda will replace it by the variable's value when loading the configuration.

Here's an example of an option referencing a environment variable:

```json
{
  "cookingTime": "${SOME_VAR}"
}
```

</details>

## Usage

## Configuration files

First, it tries to find the `config.${myPackage}` property in your `package.json` file.

Then, it tries to load a configuration file starting from the current directory up to the root.

The following files are supported by default:

| File                               | Format |
| ---------------------------------- | ------ |
| `.${namespace}rc`                  | `json` |
| `${namespace}.config.js`           | `js`   |
| `${namespace}.config.json`         | `json` |
| `${namespace}.config.ts`           | `ts`   |
| `${namespace}.config.yaml`         | `yaml` |
| `${namespace}.config.yml`          | `yaml` |
| `.config/${namespace}rc`           | `json` |
| `.config/${namespace}.config.js`   | `js`   |
| `.config/${namespace}.config.json` | `json` |
| `.config/${namespace}.config.ts`   | `ts`   |
| `.config/${namespace}.config.yaml` | `yaml` |
| `.config/\${namespace}.config.yml` | `yaml` |

You can however customize these defaults with the [TODO] options.

## Command-line arguments

Fauda parses command-line arguments as you can expect from any other argument parsers!

<details>
<summary>🙋🏻‍♂️ <i>What about arrays?</i></summary><br>

Arrays are supported in two ways.

1. Declare a JSON-compatible array as value.
2. Use the same argument multiple times.

Here's an example that gives the same result:

```sh
$ pasta --types=Fettuccine --types=Fettuccine
$ pasta --types="['Fettuccine', 'Tagliatelle']"
```

</details>

## Environment variables

Fauda parses environment variables that are prefixed with your package's name. This is done to avoid name clashes with other tools or system-wide environment variables.

For instance, if your package's name is `pasta`, then Fauda will parse variables starting with `PASTA_`.

<details>
<summary>🙋🏻‍♂️ <i>What about arrays?</i></summary><br>

Arrays are supported! You simply need to declare a JSON-compatible array wrapped between quotes.

Here's an example:

```sh
$ PASTA_TYPES="['Fettuccine', 'Tagliatelle']"
```

</details>

## FAQ

### Why not supporting nested options?

Fauda only supports a flat options object, simply because it's easier to manipulate and to reason about. Nested options are usually neither a good idea as it makes merging default options harder, nor necessary as one can express a sense of hierarchy using "dotted names" instead (eg. `cooking.time`) or just camel case (eg. `cookingTime`).
