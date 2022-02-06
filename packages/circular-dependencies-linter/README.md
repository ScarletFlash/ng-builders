# Circular Dependencies Linter

> ⚠️ This Angular Builder is not recommended for enterprise usage. \
> Despite the fact that it works as intended, codebase is not covered with tests. Moreover Builder API may change. Use it
> on your own risks.

This Angular Builder finds all [circular dependencies](https://en.wikipedia.org/wiki/Circular_dependency) in your
project and prints easy-to-read message about found issues:

```bash
> ng run my-very-best-angular-project:lint-circular-deps

Found circular dependencies: 2

● 1:
⭡⮧ app/component-module-service/invalid.component.ts
⭡⭣ app/component-module-service/invalid.module.ts
⮤⭣ app/component-module-service/invalid.service.ts

● 2:
⭡⮧ app/interface-type/invalid.interface.ts
⮤⭣ app/interface-type/invalid.type.ts
```

You may use this Builder in CI: it returns non-zero exit code if there are some circular dependencies.

## Installation & Usage

To use this builder, `angular-builders` package should be already installed. If not, follow steps,
[described here](./../../README.md#installation--usage).

Now, update your `angular.json` with the following:

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
            "src": "./src",
            "tsConfig": "./tsconfig.app.json"
          }
        }
      }
    }
  },
  ...
}
```

Then, check that everything works as needed:

```bash
ng run my-very-best-angular-project:lint-circular-deps
```

If there are no circular dependencies, you'll get something like this:

```bash
> ng run with-circular-dependencies:lint-circular-deps

No circular dependencies found.
```
