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
  <a href="#getting-started">Gettings Started</a> •
  <a href="#usage">Usage</a> •
  <a href="#api">API</a> •
</p>

---

## Features

- **One dependency** to load and validate your settings.
- **Load from multiple sources** such as JSON, YAML, JavaScript, Typescript, CLI arguments, and environment variables.
- **Validate your settings** with a JSON schema. BONUS: Your settings files have auto-completion in VSCode!
- **Generate types** for your Typescript code and for Typescript configuration files.
- **Expand environment variables** in any settings value.

## Getting Started

<details>
<summary><b>1️⃣ Install</b> Fauda</summary><br>

```sh
npm install fauda
```

</details>

<details>
<summary><b>2️⃣ Set up</b> your JSON schema</summary><br>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "My awesome package settings",
  "type": "object",
  "properties": {
    "$schema": {
      "description": "Path to my package's schema.",
      "type": "string"
    },
    "address": {
      "description": "The address the server listens on.",
      "type": "string",
      "default": "0.0.0.0"
    },
    "port": {
      "description": "The port the server listens on.",
      "type": "number",
      "default": 3000
    },
    "pages": {
      "description": "A list of pages to serve.",
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": ["/home"]
    }
  }
}
```

Fauda relies on a [JSON schema](https://json-schema.org/) to load and validate your settings, but also to generate types.

For more information please take a look at TODO.

</details>

<details>
<summary><b>3️⃣ Generate</b> Typescript typings _(optional)_</summary><br>

```sh
$ npx fauda types
```

This will generate the `Settings` type in `src/settings.ts` by default.

```ts
export interface Settings {
  address?: string
  port?: number
  pages?: string[]
}
```

</details>

<details>
<summary><b>4️⃣ Load & validate</b> your settings.</summary><br>

```ts
import fauda from 'fauda'
import { Settings } from './settings'

async function loadSettings() {
  try {
    const settings = await fauda<Settings>('myPackage')
  } catch (err) {
    console.error(err.message)
  }
}
```

</details>
