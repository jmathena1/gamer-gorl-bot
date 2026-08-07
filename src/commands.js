import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
import { getCredential } from './credentials.js'

const COMPARE_COMMAND = {
    name: 'compare',
    description: 'returns shared steam wishlist between specific users',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2]
};

const ONSALE_COMMAND = {
    name: 'on-sale',
    description: 'returns onsale games after comparing all users\' wishlists',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2]
};

const WISHLIST_COMMAND = {
    name: 'wishlist',
    description: 'returns combined wishlist from all users',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2]
};

const ALL_COMMANDS = [COMPARE_COMMAND, ONSALE_COMMAND, WISHLIST_COMMAND];

InstallGlobalCommands(
    getCredential("APP_ID"),
    ALL_COMMANDS
);
