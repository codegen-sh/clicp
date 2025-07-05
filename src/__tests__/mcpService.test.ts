import { MCPService } from '../services/mcpService';

describe('MCPService', () => {
  let mcpService: MCPService;

  beforeEach(() => {
    mcpService = new MCPService();
  });

  describe('getServers', () => {
    it('should return default servers', () => {
      const servers = mcpService.getServers();
      expect(servers).toHaveLength(2);
      expect(servers.map((s) => s.name)).toContain('filesystem');
      expect(servers.map((s) => s.name)).toContain('git');
    });
  });

  describe('getServer', () => {
    it('should return a server by name', () => {
      const server = mcpService.getServer('filesystem');
      expect(server).toBeDefined();
      expect(server?.name).toBe('filesystem');
      expect(server?.status).toBe('active');
    });

    it('should return undefined for non-existent server', () => {
      const server = mcpService.getServer('nonexistent');
      expect(server).toBeUndefined();
    });
  });

  describe('getToolsForServer', () => {
    it('should return tools for filesystem server', async () => {
      const tools = await mcpService.getToolsForServer('filesystem');
      expect(tools).toHaveLength(3);
      expect(tools.map((t) => t.name)).toContain('read_file');
      expect(tools.map((t) => t.name)).toContain('write_file');
      expect(tools.map((t) => t.name)).toContain('list_directory');
    });

    it('should return tools for git server', async () => {
      const tools = await mcpService.getToolsForServer('git');
      expect(tools).toHaveLength(3);
      expect(tools.map((t) => t.name)).toContain('git_status');
      expect(tools.map((t) => t.name)).toContain('git_log');
      expect(tools.map((t) => t.name)).toContain('git_diff');
    });

    it('should throw error for non-existent server', async () => {
      await expect(mcpService.getToolsForServer('nonexistent')).rejects.toThrow(
        "Server 'nonexistent' not found"
      );
    });
  });

  describe('addServer', () => {
    it('should add a new server', () => {
      mcpService.addServer('test', {
        description: 'Test server',
        command: 'test-command',
        status: 'active',
      });

      const server = mcpService.getServer('test');
      expect(server).toBeDefined();
      expect(server?.name).toBe('test');
      expect(server?.description).toBe('Test server');
    });
  });

  describe('removeServer', () => {
    it('should remove an existing server', () => {
      const result = mcpService.removeServer('filesystem');
      expect(result).toBe(true);
      expect(mcpService.getServer('filesystem')).toBeUndefined();
    });

    it('should return false for non-existent server', () => {
      const result = mcpService.removeServer('nonexistent');
      expect(result).toBe(false);
    });
  });
});
