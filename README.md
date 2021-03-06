<h1 align="center">
  <img src="https://raw.githubusercontent.com/ngryman/artworks/master/fauda/heading/fauda@2x.png" alt="Fauda" with="600">
</h1>
<h4 align="center">Configuration made simple.</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/fauda">
    <img src="https://img.shields.io/npm/v/fauda" />
  </a>
  <a href="https://github.com/ngryman/fauda/actions">
    <img src="https://img.shields.io/github/workflow/status/ngryman/fauda/ci" />
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#how-does-it-work">How does it work?</a> •
  <a href="#usage">Usage</a> •
  <a href="#api">API</a> •
  <a href="#cli">CLI</a> •
  <a href="#faq">FAQ</a>
</p>

---

## Features

Fauda is an all-in-one library that:

1. **loads** options from multiple sources: env vars, CLI options, and configuration files.
2. **merges** them together in one unified configuration object.
3. **normalizes** it by validating against a JSON schema and setting default values.

It offers the following advantages:

- **Simple** - a single dependency to load, merge, and validate your configuration.
- **Flexible** - multiple file formats support out of the box such as JSON, YAML, JavaScript, and even Typescript!
- **Reliable** - a unique source of truth defined in a JSON schema.
- **Typescript friendly** - generated typings for your code and configuration files (bonus: auto-completion in VSCode).

## Getting Started

<details>
<summary><b>1️⃣ Install</b> Fauda</summary><br>

```sh
npm install fauda
```

</details>

<details>
<summary><b>2️⃣ Set up</b> your JSON schema</summary><br>

Fauda uses a [JSON schema](https://json-schema.org/) to load and normalize your configuration.

Create a schema.json file:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "My awesome app configuration",
  "type": "object",
  "properties": {
    "$schema": {
      "description": "Path to my app's schema.",
      "type": "string"
    },
    "port": {
      "description": "The port the server listens to.",
      "type": "number",
      "default": 3000
    },
    "open": {
      "description": "Open in a browser tab if true.",
      "type": "boolean",
      "default": false
    },
    "mode": {
      "description": "Mode of the app.",
      "type": "string",
      "enum": ["development", "production"],
      "default": "${NODE_ENV}"
    },
    "publicPages": {
      "description": "A list of public pages.",
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": ["publicPages"]
}
```

For more information on JSON schemas, you can take a look at their [Getting Started](https://json-schema.org/learn/getting-started-step-by-step.html) guide.

</details>

<details>
<summary><b>3️⃣ Generate</b> types <i>(optional)</i></summary><br>

Generating types allows you to have a strongly typed configuration object in your code. As a bonus, it also enables autocompletion for Typescript configuration files!

Generate a `src/configuration.ts` file:

```sh
$ npx fauda types
```

This will generate the following file:

```ts
export interface Configuration {
  port?: number
  open?: boolean
  mode?: 'development' | 'production'
  publicPages: string[]
}
```

For more information about generating types, please take a look at the [CLI](#cli) section.

</details>

<details>
<summary><b>4️⃣ Load & validate</b> your configuration.</summary><br>

Assuming your package's name is `my-app`:

```ts
import { fauda } from 'fauda'
import { Configuration } from './configuration'

async function loadConfiguration() {
  try {
    const configuration = await fauda<Configuration>('my-app')
  } catch (err) {
    console.error(err.message)
  }
}
```

</details>

## How does it work?

Fauda loads your configuration from several sources using the following order of precedence: `environment variables > CLI options > configuration files`.

Option names are inflected according the source's typical naming convention:

| Source               | Casing        | Example               |
| -------------------- | ------------- | --------------------- |
| Configuration file   | `camel`       | `publicPages`         |
| CLI options          | `kebab`       | `--public-pages`      |
| Environment variable | `upper+snake` | `MY_APP_PUBLIC_PAGES` |

Once your configuration is loaded, Fauda normalizes it into a valid configuration object that your library / application can use. The normalization process validates your configuration using the provided JSON schema. It checks that the type of options are valid, required options are specified, sets default values, and also expand environment variables references!

<details>
<summary>🙋🏻‍♂️ <i>What is environment variable expansion?</i></summary><br>

You can reference an environment variable name's as your option's value. Fauda will replace its value at runtime, giving you the opportunity to depend on any environment variable in your configuration.

For instance, if you have a `mode` option that varies depending on the `NODE_ENV`'s value, you can do it like this:

```json
"mode": {
  "default": "${NODE_ENV}"
}
```

Note that you can also reference environment variables in your JSON schema using the `default` value:

```json
"mode": {
  "description": "Mode of the app.",
  "type": "string",
  "enum": ["development", "production"],
  "default": "${NODE_ENV}"
}
```

</details>

## Usage

### Configuration files

Fauda first searches for a `config.${myApp}` property in the `package.json` file of your users. If not found, it then searches for a various configuration files, starting from the current directory up to the root.

Here is a list of the configuration file names and formats that are supported:

| File                               | Format |
| ---------------------------------- | ------ |
| `.${myPackage}rc`                  | `json` |
| `${myPackage}.config.js`           | `js`   |
| `${myPackage}.config.json`         | `json` |
| `${myPackage}.config.ts`           | `ts`   |
| `${myPackage}.config.yaml`         | `yaml` |
| `${myPackage}.config.yml`          | `yaml` |
| `.config/${myPackage}rc`           | `json` |
| `.config/${myPackage}.config.js`   | `js`   |
| `.config/${myPackage}.config.json` | `json` |
| `.config/${myPackage}.config.ts`   | `ts`   |
| `.config/${myPackage}.config.yaml` | `yaml` |
| `.config/\${myPackage}.config.yml` | `yaml` |

### CLI options

Fauda parses CLI options as you can expect from any other argument parsers!

Options are "kebab-"cased. For instance, the `publicPages` option is transposed as the `--public-pages` CLI argument.

<details>
<summary>🙋🏻‍♂️ <i>What about arrays?</i></summary><br>

Arrays are supported in two ways.

1. Declare a JSON-compatible array as value.
2. Use the same argument multiple times.

Here's an example that gives the same result:

```sh
$ my-app --public-pages=/home --public-pages=/about
$ my-app --types="['/home', '/about']"
```

</details>

### Environment variables

Fauda parses environment variables prefixed with your package's name. This is precaution to avoid name clashes with other application or system-wide environment variables.

For instance, if your package's name is `my-app`, Fauda will parse variables with the `MY_APP_` prefix.

<details>
<summary>🙋🏻‍♂️ <i>What about arrays?</i></summary><br>

Arrays are supported! You simply need to declare a JSON-compatible array wrapped between quotes.

Here's an example:

```sh
$ MY_APP_PUBLIC_PAGES="['/home', '/about']"
```

</details>

## API

### [fauda](src/fauda.ts)

Loads, normalizes, and returns a configuration object from multiple sources.

**Params**

- **namespace** `string`: String used to prefix environment variables and namespace your configuration in the `package.json`. It's typically your package's name.
- **schema** `string | JsonObject`: Path to a JSON schema, or the schema itself, used to normalize your configuration.
- **options?** `Partial<FaudaOptions>`: See available [options](#options).

**Examples**

```ts
import { fauda } from 'fauda'

const configuration = await fauda('my-app', 'schema.json')
```

### [FaudaOptions](src/types.ts)

| Option | Type                | Default         | Description                                                                    |
| ------ | ------------------- | --------------- | ------------------------------------------------------------------------------ |
| `args` | `string[]`          | `process.argv`  | Array of CLI options, used by the CLI options loader.                          |
| `env`  | `NodeJS.ProcessEnv` | `process.env`   | Dictionary of environment variables, used by the environment variables loader. |
| `cwd`  | `string`            | `process.cwd()` | Array of CLI options, used by the configuration files loader.                  |

### [normalize](src/normalizer/normalize.ts)

Normalizes a configuration object using the provided JSON schema.

**Params**

- **config**: `JsonObject`: Configuration object to normalize.
- **schema**: `string | JsonObject`: Path to a JSON schema, or the schema itself.
- **env?**: `NodeJS.ProcessEnv`: _(default: `process.env`)_ An object containing environment variables, used to expand variables in the schema.

**Examples**

```ts
import { normalize } from 'fauda'

const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      default: 'bar'
    }
  }
}

const safeConfig = await normalize({}, 'schema.json')
// { foo: 'bar' }
```

### [generateTypes](src/generator.ts)

Returns the `Configuration` type definition inferred from the given JSON schema.

**Params**

- **schema** `string | JsonObject`: Path to a JSON schema, or the schema itself, used to generate the `Configuration ` type.
- **options?** `Partial<Options>`: See available [options of `json-schema-to-typescript`](https://github.com/bcherny/json-schema-to-typescript#options).

**Examples**

```ts
import { promises as fs } from 'fs'
import { generateTypes } from 'fauda'

const source = await generateTypes('schema.json')
await fs.writeFile('src/configuration.ts', source)
```

## CLI

### Generate types

Fauda comes with a CLI utility that automatically generates types from your JSON schema. This is especially useful to provide a strongly typed configuration object to your Typescript project, but also to provide auto-completion for your users using a `.ts` configuration file.

By default, the `types` command will read a `schema.json` file and write the output to a `src/configuration.ts` file:

You can change these defaults with the following CLI options:

- **--input, -i**: Path to a JSON schema file.
- **--output, -o**: Path to the output Typescript file.

**Examples**

```sh
$ fauda types
$ fauda types -i my-schema.json -o src/types/configuration.ts
```

<details>
<summary>🙋🏻‍♂️ <i>How can I integrate this in my workflow?</i></summary><br>

Typescript projects generally have a `build` script to transpile sources to plain JavaScript. You can generate your types right before using with the `prebuild` script:

```json
{
  "scripts": {
    "build": "tsc",
    "prebuild": "fauda types"
  }
}
```

Usually you will also want to watch for changes to your schema and reflect these changes in the generated types to benefit from your IDE's automcompletion.

Assuming you have `dev` script that watches for changes, you could split your scripts to transpile your code and generate your types in two different scripts, and use a tool like [npm-run-all](https://www.npmjs.com/package/npm-run-all) to run them sequentially:

```json
{
  "scripts": {
    "dev": "run-s dev:*",
    "dev:types": "fauda types",
    "dev:build": "tsc -w"
  }
}
```

</details>

## FAQ

### Why not supporting nested options?

Fauda only supports a flat options object, simply because it's easier to manipulate and to reason about. In my opinion, nested options are usually neither a good idea as it makes merging default options harder, nor necessary as one can express a sense of hierarchy using "dotted names" instead (eg. `cooking.time`) or just camel case (eg. `cookingTime`).
