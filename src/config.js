import 'dotenv/config';

/**
 * Parse and validate user configuration from USERS environment variable
 * Expected format: JSON array of {name, steamId} objects
 */
function parseUserConfig() {
    const usersJson = process.env.USERS;
    
    if (!usersJson) {
        throw new Error('USERS environment variable is not defined');
    }

    let users;
    try {
        users = JSON.parse(usersJson);
    } catch (error) {
        throw new Error(`Failed to parse USERS environment variable as JSON: ${error.message}`);
    }

    if (!Array.isArray(users)) {
        throw new Error('USERS must be a JSON array');
    }

    if (users.length === 0) {
        throw new Error('USERS array cannot be empty');
    }

    // Validate each user has required fields
    users.forEach((user, index) => {
        if (!user.name) {
            throw new Error(`User at index ${index} is missing required field: name`);
        }
        if (!user.steamId) {
            throw new Error(`User at index ${index} is missing required field: steamId`);
        }
        if (typeof user.name !== 'string' || typeof user.steamId !== 'string') {
            throw new Error(`User at index ${index} has invalid field types (name and steamId must be strings)`);
        }
    });

    return users;
}

// Parse config once at module load
const users = parseUserConfig();

// Export user list as before
export const STEAM_USER_LIST = Object.fromEntries(
    users.map(user => [user.name, user.steamId])
);

export const STEAM_USER_IDS = Object.values(STEAM_USER_LIST);

// Export raw users for discord components
export const USERS = users;
