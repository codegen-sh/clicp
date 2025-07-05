import { MCPServer, MCPTool, MCPServerConfig } from '../types/mcp';

/**
 * Service for managing MCP servers and tools
 */
export class MCPService {
  private servers: Map<string, MCPServer> = new Map();

  constructor() {
    this.initializeDefaultServers();
  }

  /**
   * Initialize with some default MCP servers for demonstration
   */
  private initializeDefaultServers(): void {
    // Filesystem MCP server
    this.servers.set('filesystem', {
      name: 'filesystem',
      description: 'File system operations and management',
      command: 'npx',
      args: ['@modelcontextprotocol/server-filesystem', '/tmp'],
      status: 'active',
    });

    // Git MCP server
    this.servers.set('git', {
      name: 'git',
      description: 'Git repository operations',
      command: 'npx',
      args: ['@modelcontextprotocol/server-git'],
      status: 'active',
    });

    // GitHub MCP server
    this.servers.set('github', {
      name: 'github',
      description: 'GitHub API operations for repository management, file operations, and search',
      command: 'npx',
      args: ['@modelcontextprotocol/server-github'],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '',
      },
      status: 'active',
    });

    // PostgreSQL MCP server
    this.servers.set('postgres', {
      name: 'postgres',
      description: 'PostgreSQL database operations and schema inspection',
      command: 'npx',
      args: ['@modelcontextprotocol/server-postgres', process.env.POSTGRES_CONNECTION_STRING || 'postgresql://localhost/postgres'],
      status: 'active',
    });
  }

  /**
   * Get all available MCP servers
   */
  public getServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  /**
   * Get a specific MCP server by name
   */
  public getServer(name: string): MCPServer | undefined {
    return this.servers.get(name);
  }

  /**
   * Get tools for a specific MCP server
   * In a real implementation, this would communicate with the actual MCP server
   */
  public async getToolsForServer(serverName: string): Promise<MCPTool[]> {
    const server = this.servers.get(serverName);
    if (!server) {
      throw new Error(`Server '${serverName}' not found`);
    }

    // Mock tools based on server type
    switch (serverName) {
      case 'filesystem':
        return [
          {
            name: 'read_file',
            description: 'Read contents of a file',
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', description: 'File path to read' },
              },
              required: ['path'],
            },
            server: serverName,
          },
          {
            name: 'write_file',
            description: 'Write contents to a file',
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', description: 'File path to write' },
                content: { type: 'string', description: 'Content to write' },
              },
              required: ['path', 'content'],
            },
            server: serverName,
          },
          {
            name: 'list_directory',
            description: 'List contents of a directory',
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', description: 'Directory path to list' },
              },
              required: ['path'],
            },
            server: serverName,
          },
        ];

      case 'git':
        return [
          {
            name: 'git_status',
            description: 'Get git repository status',
            inputSchema: {
              type: 'object',
              properties: {
                repo_path: {
                  type: 'string',
                  description: 'Path to git repository',
                },
              },
              required: ['repo_path'],
            },
            server: serverName,
          },
          {
            name: 'git_log',
            description: 'Get git commit history',
            inputSchema: {
              type: 'object',
              properties: {
                repo_path: {
                  type: 'string',
                  description: 'Path to git repository',
                },
                limit: {
                  type: 'number',
                  description: 'Number of commits to retrieve',
                },
              },
              required: ['repo_path'],
            },
            server: serverName,
          },
          {
            name: 'git_diff',
            description: 'Get git diff for changes',
            inputSchema: {
              type: 'object',
              properties: {
                repo_path: {
                  type: 'string',
                  description: 'Path to git repository',
                },
                commit: {
                  type: 'string',
                  description: 'Commit hash to diff against',
                },
              },
              required: ['repo_path'],
            },
            server: serverName,
          },
        ];

      case 'github':
        return [
          {
            name: 'create_or_update_file',
            description: 'Create or update a single file in a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string', description: 'Repository owner (username or organization)' },
                repo: { type: 'string', description: 'Repository name' },
                path: { type: 'string', description: 'Path where to create/update the file' },
                content: { type: 'string', description: 'Content of the file' },
                message: { type: 'string', description: 'Commit message' },
                branch: { type: 'string', description: 'Branch to create/update the file in' },
                sha: { type: 'string', description: 'SHA of file being replaced (for updates)' },
              },
              required: ['owner', 'repo', 'path', 'content', 'message', 'branch'],
            },
            server: serverName,
          },
          {
            name: 'get_file_contents',
            description: 'Get contents of a file or directory',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string', description: 'Repository owner' },
                repo: { type: 'string', description: 'Repository name' },
                path: { type: 'string', description: 'Path to file/directory' },
                branch: { type: 'string', description: 'Branch to get contents from' },
              },
              required: ['owner', 'repo', 'path'],
            },
            server: serverName,
          },
          {
            name: 'create_issue',
            description: 'Create a new issue',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string', description: 'Repository owner' },
                repo: { type: 'string', description: 'Repository name' },
                title: { type: 'string', description: 'Issue title' },
                body: { type: 'string', description: 'Issue description' },
                assignees: { type: 'array', items: { type: 'string' }, description: 'Usernames to assign' },
                labels: { type: 'array', items: { type: 'string' }, description: 'Labels to add' },
              },
              required: ['owner', 'repo', 'title'],
            },
            server: serverName,
          },
          {
            name: 'create_pull_request',
            description: 'Create a new pull request',
            inputSchema: {
              type: 'object',
              properties: {
                owner: { type: 'string', description: 'Repository owner' },
                repo: { type: 'string', description: 'Repository name' },
                title: { type: 'string', description: 'PR title' },
                body: { type: 'string', description: 'PR description' },
                head: { type: 'string', description: 'Branch containing changes' },
                base: { type: 'string', description: 'Branch to merge into' },
                draft: { type: 'boolean', description: 'Create as draft PR' },
              },
              required: ['owner', 'repo', 'title', 'head', 'base'],
            },
            server: serverName,
          },
          {
            name: 'search_repositories',
            description: 'Search for GitHub repositories',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                page: { type: 'number', description: 'Page number for pagination' },
                perPage: { type: 'number', description: 'Results per page (max 100)' },
              },
              required: ['query'],
            },
            server: serverName,
          },
        ];

      case 'postgres':
        return [
          {
            name: 'query',
            description: 'Execute read-only SQL queries against the connected database',
            inputSchema: {
              type: 'object',
              properties: {
                sql: { type: 'string', description: 'The SQL query to execute' },
              },
              required: ['sql'],
            },
            server: serverName,
          },
        ];

      default:
        return [];
    }
  }

  /**
   * Add a new MCP server
   */
  public addServer(name: string, server: Omit<MCPServer, 'name'>): void {
    this.servers.set(name, { ...server, name });
  }

  /**
   * Remove an MCP server
   */
  public removeServer(name: string): boolean {
    return this.servers.delete(name);
  }
}
