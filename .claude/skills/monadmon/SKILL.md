```markdown
# monadmon Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `monadmon` TypeScript codebase. You'll learn how to structure files, write and organize code, follow commit conventions, and implement and run tests. This guide is ideal for contributors looking to quickly align with the project's established practices.

## Coding Conventions

### File Naming
- Use **PascalCase** for file names.
  - Example: `MyModule.ts`, `UserService.ts`

### Imports
- Use **relative import paths** for importing modules.
  - Example:
    ```typescript
    import { MyFunction } from './MyFunction';
    ```

### Exports
- Use **named exports** instead of default exports.
  - Example:
    ```typescript
    // In MyModule.ts
    export function myFunction() { ... }
    export const MY_CONSTANT = 42;
    ```

### Commit Messages
- Follow the **conventional commit** format.
- Use the `feat` prefix for new features.
  - Example:
    ```
    feat: add UserService for user management
    ```

## Workflows

### Feature Development
**Trigger:** When adding a new feature or module  
**Command:** `/feature-development`

1. Create a new file using PascalCase, e.g., `NewFeature.ts`.
2. Implement your feature using TypeScript.
3. Use relative imports to include dependencies.
4. Export your functions or constants using named exports.
5. Write corresponding tests in a file named `NewFeature.test.ts`.
6. Commit your changes with a message like:  
   `feat: add NewFeature for improved performance`

### Testing
**Trigger:** When validating code correctness  
**Command:** `/run-tests`

1. Write tests in files matching the `*.test.*` pattern (e.g., `MyModule.test.ts`).
2. Use the project's preferred (unknown) testing framework.
3. Run the test suite using the appropriate command (see project documentation or package scripts).

## Testing Patterns

- Test files are named with the pattern `*.test.*` (e.g., `MyModule.test.ts`).
- Place test files alongside the modules they test or in a dedicated test directory.
- The specific testing framework is not detected; refer to project documentation for details.

## Commands
| Command              | Purpose                                   |
|----------------------|-------------------------------------------|
| /feature-development | Start a new feature using project patterns|
| /run-tests           | Run all tests in the codebase             |
```