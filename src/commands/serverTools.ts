import { Command } from 'commander';
const chalk = require('chalk');
import { MCPService } from '../services/mcpService';

/**
 * Command to list tools for a specific MCP server
 */
export function createServerToolsCommand(): Command {
  const command = new Command('<server-name>');
  command
    .description('Interact with a specific MCP server')
    .command('list')
    .description('List all tools available for the specified server')
    .action(async () => {
      const serverName = command.parent?.args[0];

      if (!serverName) {
        console.log(chalk.red('Error: Server name is required'));
        console.log(chalk.gray('Usage: clicp <server-name> list'));
        return;
      }

      const mcpService = new MCPService();
      const server = mcpService.getServer(serverName);

      if (!server) {
        console.log(chalk.red(`Error: Server '${serverName}' not found`));
        console.log(chalk.gray('Use "clicp list" to see available servers'));
        return;
      }

      try {
        const tools = await mcpService.getToolsForServer(serverName);

        if (tools.length === 0) {
          console.log(
            chalk.yellow(`No tools available for server '${serverName}'`)
          );
          return;
        }

        console.log(chalk.bold.blue(`Tools for ${serverName} server:`));
        console.log('');

        tools.forEach((tool) => {
          console.log(`${chalk.bold.green(tool.name)}`);
          console.log(`  ${chalk.gray(tool.description)}`);

          if (tool.inputSchema && tool.inputSchema.properties) {
            console.log(`  ${chalk.dim('Parameters:')}`);
            Object.entries(tool.inputSchema.properties).forEach(
              ([param, schema]: [string, any]) => {
                const required = tool.inputSchema.required?.includes(param)
                  ? chalk.red('*')
                  : '';
                console.log(
                  `    ${param}${required}: ${chalk.dim(schema.description || schema.type)}`
                );
              }
            );
          }
          console.log('');
        });

        console.log(chalk.dim('* Required parameters'));
      } catch (error) {
        console.log(
          chalk.red(`Error fetching tools for server '${serverName}': ${error}`)
        );
      }
    });

  return command;
}
