<p align="center">
  <img width="128px" src="assets/logo.svg" />
</p>

# Multi-purpose CLI Builders for Angular

> ⚠️ Note: this project is not affiliated with Angular Core Team members.

## Contents

## Installation & Usage

Install package via your package manager:

##### NPM

```bash
npm install angular-builders --save-dev
```

##### Yarn

```bash
yarn add angular-builders --dev
```

Attach required Builder to the project in `angular.json`:

```json
// angular.json
{
  ...
  "projects": {
    "my-very-best-angular-project": { // 👈 your project name
      "architect": {
        "lint-circular-deps": { // 👈 CLI command name
          "builder": "angular-builders:circular-dependencies-linter", // 👈 required builder
          "options": {
            ... // 👈 builder-specific options
          }
        }
      }
    }
  },
  ...
}
```

You may find all Builder-specific docs next to Builder sources, in README.md. The list of all bundled and planned
Angular Builders [goes here](#Included-Builders).

Now, you may run configured Builder manually with this command:

```bash
ng run my-very-best-angular-project:lint-circular-deps
```

You may find it useful to add short alias for this command in `package.json`:

```json
// package.json
{
  ...
  "name": "my-very-best-angular-project",
  "scripts": {
    "lint": "npm run lint:eslint && npm run lint:circular-deps",
    "lint:eslint": "ng lint",
    "lint:circular-deps": "ng run my-very-best-angular-project:lint-circular-deps",
  },
  "devDependencies": {
    "angular-builders": "latest",
  },
  ...
}
```

## Included Builders

| Builder                      |                                                   More Info |
| :--------------------------- | ----------------------------------------------------------: |
| Circular Dependencies Linter | [README](./packages/circular-dependencies-linter/README.md) |
| Formatter                    |                                                   (planned) |
| Linter                       |                                                   (planned) |
| Codebase migration tool      |                                                   (planned) |
