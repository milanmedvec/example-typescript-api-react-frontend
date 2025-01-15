import * as winston from 'winston';
import type { Command } from 'commander';
import { createCommand } from 'commander';
import { PrismaClient } from '@prisma/client';
import { spawnServer } from './server';
import type { Config } from './env';
import { loadConfig } from './env';

function errorColor(str: any) {
    // Add ANSI escape codes to display text in red.
    return `\x1b[31m${str}\x1b[0m`;
}

function createServerCommands(program: Command, config: Config, logger: winston.Logger, db: PrismaClient) {
    const serverGroup = program
        .command('server') //
        .description('server commands');

    serverGroup
        .command('spawn-server')
        .description('start the server')
        .action(() => {
            spawnServer(config, logger, db);
        });
}

function main() {
    const config = loadConfig(process.env);

    const db = new PrismaClient({
        datasources: {
            db: {
                url: config.DATABASE_URL,
            },
        },
    });

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [new winston.transports.Console()],
    });

    const program = createCommand()
        .name('example-cli')
        .description('CLI for project')
        .version('0.0.1')
        .configureOutput({
            // Visibly override write routines as example!
            writeOut: (str: any) => process.stdout.write(`[OUT] ${str}`),
            writeErr: (str: any) => process.stdout.write(`[ERR] ${str}`),
            // Highlight errors in color.
            outputError: (str, write) => write(errorColor(str)),
        });

    createServerCommands(program, config, logger, db);

    try {
        program.parse(process.argv);
    } catch (err: any) {
        logger.error(err.message);
        process.exit(1);
    }
}

main();
