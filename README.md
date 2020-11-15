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
# or
yarn add fauda
```

</details>

<details>
<summary><b>2️⃣ Set up</b> your JSON schema</summary><br>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "My awesome app settings",
  "type": "object",
  "properties": {
    "$schema": {
      "description": "My awesome app schema.",
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

```ts
export interface Settings {
  address?: string
  port?: number
  pages?: string[]
}
```

This will generate the `Settings` type in `src/settings.ts` by default.

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

### Load

Before using the hook, you need to place the `AuthProvider` component as high as possible your components hierarchy. This component will provide the necessary React context to the `useAuth` hook.

In a typical Next.js project it would be in the `pages/_app.tsx` file:

```tsx
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
```

### Manual authentication flow

If you need to handle the authentication flow manually, `useAuth` provides a `login` function that you can call to redirect to the login page.

```tsx
import { useAuth } from '@zapier/react-hook-auth'

function MyPage() {
  const { isAuthenticated, isLoading, error, user, login } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  if (!isAuthenticated) {
    return <button onClick={login}>Login</button>
  }

  return <div>👋 Hello {user.fullName}</div>
}
```

### Automatic authentication flow

When enabled, the automatic authentication flow will redirect to the login page if the user is not authenticated.

```tsx
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider autoLogin={true}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
```

### Optimistic login <sup>beta</sup>

To improve the authentication UX, this library optimistically returns `isAuthenticated: true` when it thinks the client is a returning user.
It does this by setting a flag in localStorage after the first login. If that flag is present, `useAuth` will return `isAuthenticated: true` and `isLoading: true`.

Example usage:

```tsx
// pages/_app.tsx
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider optimisticLogin={true}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

// components/MyComponent.tsx
function MyComponent() {
  const { isAuthenticated, isLoading, user } = useAuth()

  // For returning users, `isAuthenticated` will be `true` and they will skip
  // the loading!
  if (isLoading && !isAuthenticated)
    return <div>loading... (new / logged out users)</div>

  // Early returns for errors or logged out users
  if (error) return <div>{error.message}</div>
  if (!isAuthenticated) return <button onClick={login}>Log in</button>

  // At this point the user is "likely" or "surely" logged in.
  // You can tell the difference using `isLoading`:
  const confidence = isLoading ? 'likely' : 'surely'

  // You can make authenticated requests.
  const { data } = useQuery(/* ... */)

  return (
    <div>
      Hey, I'm {confidence} to be logged in! Here's some of my data: {data}
    </div>
  )
}
```

## API

🚧 TODO 🚧

## Conventions

- Flat options, nested options are separated with a dot (eg. `foo.bar`).

## Generate types

```sh
$ fauda types -o src/types/settings.ts
```

In your package:

```ts
import { Settings } from './types'
import fauda from 'fauda'

const settings = await fauda<Settings>()
```

In a user configuration:

```ts
import { Settings } from 'your-awesome-package'

export default <Settings>{
  ...
}
```
