# Nx-ng-nest-elec

// TODO: update dependencies with ncu
// TODO: use RsPack to start NestJS backend

## Overview

This is a sample Electron app powered by Angular, Nest, SQLite3, Electron, and Nx. The project showcases the minimum setup to build an Electron app.

## Development

Please run `pnpm install` to install the required dependencies.

For local development, please run

```bash
pnpm run dev-front
```

```bash
pnpm run dev-back
```

For local Electron development, please run

```bash
pnpm run dev-back
```

```bash
pnpm run dev-electron
```

## Build

Please run

```bash
pnpm run make
```

The command generates a zip file and it's for Windows machine. Please change the settings in the `forge.config.js` to build the app according to the OS.
