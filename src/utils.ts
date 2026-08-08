import "dotenv/config";
import type { CommandRegistration } from "./types";
import { getCredential } from "./credentials";

interface DiscordRequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | unknown[];
}
export async function DiscordRequest(
  endpoint: string,
  options: DiscordRequestOptions,
): Promise<Response> {
  const url: string = `https://discord.com/api/v10/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bot ${getCredential("DISCORD_TOKEN")}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent": "GamerGorlBot (https://github.com/jmathena/gamer-gorl-bot)",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching ${endpoint}: ${response.status} ${response.statusText}`,
    );
  }

  return response;
}

export async function InstallGlobalCommands(
  appId: string,
  commands: CommandRegistration[],
): Promise<void> {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;
  try {
    await DiscordRequest(endpoint, {
      method: "PUT",
      body: commands,
    });
  } catch (err) {
    console.error("Failed to install global commands:", err);
  }
}
