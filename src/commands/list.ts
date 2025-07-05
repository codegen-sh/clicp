import { Command } from 'commander';
const chalk = require('chalk');
import { MCPService } from '../services/mcpService';

/**
 * Command to list all available MCP servers
 */
export function createListCommand(): Command {
  const command = new Command('list');
  command.description('List all available MCP servers').action(async () => {
    const mcpService = new MCPService();
    const servers = mcpService.getServers();

    if (servers.length === 0) {
      console.log(chalk.yellow('No MCP servers configured.'));
      return;
    }

    console.log(chalk.bold.blue('Available MCP Servers:'));
    console.log('');

    servers.forEach((server) => {
      const statusColor =
        server.status === 'active'
          ? chalk.green
          : server.status === 'inactive'
            ? chalk.yellow
            : chalk.red;

      console.log(
        `${chalk.bold(server.name)} ${statusColor(`[${server.status}]`)}`
      );
      console.log(`  ${chalk.gray(server.description)}`);
      console.log(
        `  ${chalk.dim('Command:')} ${server.command} ${(server.args || []).join(' ')}`
      );
      console.log('');
    });
  });

  return command;
}
