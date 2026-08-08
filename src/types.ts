// --- Steam API DTOs ---
export interface SteamWishlistEntry {
  appId: number;
  name: string;
  priceCents: number;
  discountPercent: number;
  salePriceCents: number;
}

export interface WishlistGame {
  appId: number;
  name: string;
  originalPrice: string;
  salePrice: string;
  discountPercent: number;
  isOnSale: boolean;
  wantedBy: string[];
}

// --- User / Config ---
export interface UserConfig {
  name: string;
  steamId: string;
}

// --- Discord Interaction Types ---
export interface DiscordInteraction {
  type: InteractionType;
  token: string;
  data: {
    name?: string;
    values?: string[];
    custom_id?: string;
  };
}

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
}

export enum InteractionResponseType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
}

// --- Command Pattern ---
export interface BotCommand {
  name: string;
  description: string;
  execute: (
    interaction: DiscordInteraction,
    context: BotContext,
  ) => Promise<void>;
}

export interface BotContext {
  sendFollowup: (content: string, token: string) => Promise<void>;
}

export interface CommandRegistration {
  name: string;
  description: string;
}
