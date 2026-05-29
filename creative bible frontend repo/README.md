# Creative Bible - Frontend Repository

This folder is reserved for a separate frontend build using modern frameworks like React, Vue, Svelte, or Angular.

## Purpose

Currently, the frontend is a static HTML/CSS/JS application served from the Java backend (`../creative bible java backend/src/main/resources/static`). If you decide to migrate to a more sophisticated frontend build system, use this folder as the source directory.

## Setup (Future)

When adding a frontend framework:

1. Initialize your framework (e.g., `npm create react-app .` or `npm create vite@latest`)
2. Develop your frontend here
3. Configure the build output to publish to:
   ```
   ../creative bible java backend/src/main/resources/static
   ```
4. During Maven build, copy the frontend build output into `src/main/resources/static`

## Current Status

This folder is currently **empty** and not in use. The frontend is a static site in the Java backend project.

## See Also

- [Parent README](../README.md)
- [Java Backend + Current Frontend](../creative%20bible%20java%20backend/README.md)
