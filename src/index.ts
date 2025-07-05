/**
 * CLICP - Command Line Interface Context Protocol
 *
 * A TypeScript CLI for interacting with Model Context Protocol (MCP) servers
 */

export { MCPService } from './services/mcpService';
export * from './types/mcp';

// Re-export main CLI functionality
export { createListCommand } from './commands/list';
