import { USERS } from './config.js';

/**
 * Generate select menu options from configured users
 * Capitalizes user names for display labels
 */
function generateUserOptions() {
    return USERS.map(user => ({
        label: user.name.charAt(0).toUpperCase() + user.name.slice(1),
        value: user.name
    }));
}

export const compareComponent = [
    {
        type: 1,
        components: [
            {
                type: 3,
                custom_id: "steam_user_select",
                options: generateUserOptions(),
                placeholder: "Select people to compare their steam wishlists",
                min_values: 1,
                max_values: USERS.length
            }
        ]
    }
];
