/**
 * Types for Model Context Protocol (MCP) integration
 */

export interface MCPServer {
  name: string;
  description: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  status: 'active' | 'inactive' | 'error';
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  server: string;
}

export interface MCPServerConfig {
  servers: Record<string, MCPServer>;
}

export interface ToolListResponse {
  tools: MCPTool[];
}

export interface ServerListResponse {
  servers: MCPServer[];
}
