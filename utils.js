import 'dotenv/config';
import { getCredential } from './credentials.js'

export async function DiscordRequest(endpoint, options) {
    const url = 'https://discord.com/api/v10/' + endpoint;
    const discordToken = getCredential("DISCORD_TOKEN");
    if (options.body) {
        options.body = JSON.stringify(options.body); 
    }
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${discordToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'GamerGorlBot (https://github.com/jmathena/gamer-gorl-bot)',
            },
        ...options
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }

    return res;
}

export async function InstallGlobalCommands(appId, commands) {
    // API endpoint to overwrite global commands
    const endpoint = `applications/${appId}/commands`;
    console.log(appId);
    try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    } catch (err) {
        console.error(err);
    }
}



// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
