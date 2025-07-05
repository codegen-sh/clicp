# CLICP - Command Line Interface Context Protocol

A TypeScript-based CLI tool that allows models to interact with various Model Context Protocol (MCP) servers.

## Features

- 🚀 TypeScript-based CLI with full type safety
- 📦 Distributed on npm as `clicp`
- 🔧 Built-in support for popular MCP servers (filesystem, git)
- 🎨 Beautiful colored output with chalk
- ✅ Comprehensive testing with Jest
- 🔍 Code formatting with Prettier
- 🪝 Pre-commit hooks with Husky
- 🤖 GitHub Actions CI/CD pipeline

## Installation

```bash
npm install -g clicp
```

## Usage

### List all available MCP servers

```bash
clicp list
```

### List tools for a specific MCP server

```bash
clicp filesystem list
clicp git list
```

## Available MCP Servers

### Filesystem Server

- **read_file**: Read contents of a file
- **write_file**: Write contents to a file
- **list_directory**: List contents of a directory

### Git Server

- **git_status**: Get git repository status
- **git_log**: Get git commit history
- **git_diff**: Get git diff for changes

## Development

### Prerequisites

- Node.js 16+
- Yarn package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/codegen-sh/clicp.git
cd clicp

# Install dependencies
yarn install

# Build the project
yarn build

# Run tests
yarn test

# Run in development mode
yarn dev
```

### Scripts

- `yarn build` - Build the TypeScript project
- `yarn dev` - Run TypeScript compiler in watch mode
- `yarn test` - Run Jest tests
- `yarn lint` - Check code formatting with Prettier
- `yarn format` - Format code with Prettier

### Pre-commit Hooks

This project uses Husky and lint-staged to ensure code quality:

- TypeScript compilation check
- Prettier formatting check
- Automatic code formatting

## Architecture

```
src/
├── cli.ts              # Main CLI entry point
├── index.ts            # Library exports
├── types/
│   └── mcp.ts         # MCP type definitions
├── services/
│   └── mcpService.ts  # MCP server management
├── commands/
│   └── list.ts        # List command implementation
└── __tests__/
    └── mcpService.test.ts # Unit tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
