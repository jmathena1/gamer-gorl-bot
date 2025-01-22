import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Simple test command
const TEST_COMMAND = {
    name: 'test',
    description: 'Basic command',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
};

const WISHLIST_COMMAND = {
    name: 'wishlist',
    description: 'returns shared steam wishlist',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2]
};

const ALL_COMMANDS = [TEST_COMMAND, WISHLIST_COMMAND];

InstallGlobalCommands(
    process.env.TEST_ENV ? process.env.TEST_APP_ID : process.env.APP_ID, 
    ALL_COMMANDS
);
