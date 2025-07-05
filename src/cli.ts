#!/usr/bin/env node

import { Command } from 'commander';
const chalk = require('chalk');
import { createListCommand } from './commands/list';
import { MCPService } from './services/mcpService';

const program = new Command();

program
  .name('clicp')
  .description(
    'Command Line Interface Context Protocol - Interact with MCP servers'
  )
  .version('0.1.0');

// Add the list command
program.addCommand(createListCommand());

// Add dynamic server commands
const mcpService = new MCPService();
const servers = mcpService.getServers();

servers.forEach((server) => {
  const serverCommand = new Command(server.name);
  serverCommand
    .description(`Interact with ${server.name} MCP server`)
    .command('list')
    .description(`List all tools available for ${server.name} server`)
    .action(async () => {
      try {
        const tools = await mcpService.getToolsForServer(server.name);

        if (tools.length === 0) {
          console.log(
            chalk.yellow(`No tools available for server '${server.name}'`)
          );
          return;
        }

        console.log(chalk.bold.blue(`Tools for ${server.name} server:`));
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
          chalk.red(
            `Error fetching tools for server '${server.name}': ${error}`
          )
        );
      }
    });

  program.addCommand(serverCommand);
});

// Handle unknown commands
program.on('command:*', () => {
  console.log(chalk.red(`Unknown command: ${program.args.join(' ')}`));
  console.log(chalk.gray('Use "clicp --help" to see available commands'));
  process.exit(1);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
