import axios from "axios";
import "dotenv/config";

import { SteamWishlistEntry, WishlistGame } from "./types";

const BASE_URL: string = "https://api.steampowered.com/";
const GET_ITEMS_REQUEST_LIMIT: number = 700;
const STEAM_API_KEY: string | undefined = process.env.STEAM_API_KEY;
const STORE_URL: string = "https://store.steampowered.com/api/";

export async function getUserWishlistGameIds(
  steamUserId: string,
): Promise<number[] | []> {
  try {
    const response = await axios({
      method: "get",
      baseURL: BASE_URL,
      url: "IWishlistService/GetWishlist/v1",
      params: {
        steamid: steamUserId,
      },
    });
    return response.data.response.items?.map(
      (game: SteamWishlistEntry) => game.appid,
    );
  } catch (error) {
    console.error(
      `Failed to fetch wishlist game ids for user ${steamUserId}:`,
      error,
    );
    return [];
  }
}

export async function getGameDetails(
  gameId: number,
): Promise<WishlistGame | string | undefined> {
  try {
    const response = await axios({
      method: "get",
      baseURL: STORE_URL,
      url: "appdetails",
      params: {
        appids: gameId,
      },
    });
    const gameData = response.data[`${gameId}`];
    if (!gameData) {
      console.warn(`No data found for game ${gameId}`);
      return undefined;
    }

    const gameDetails: WishlistGame = gameData.data;

    if (gameDetails.release_date?.coming_soon === true) {
      console.info(`${gameDetails.name} (app id: ${gameId}) not yet released`);
      return undefined;
    }

    console.info(
      `Getting details for ${gameDetails.name} (app id: ${gameId})...`,
    );
    return gameDetails;
  } catch (error) {
    console.error(`Failed to fetch details for game id ${gameId}:`, error);
    return undefined;
  }
}

export async function getGamesOnSale(wishlistGamesIds) {
  let gamesOnSale = [];
  for (const gameId of wishlistGamesIds) {
    const gameDetails = await getGameDetails(gameId);
    if (
      gameDetails.price_overview &&
      gameDetails.price_overview.discount_percent > 0
    ) {
      gamesOnSale.push(gameDetails);
    }
  }
  return gamesOnSale;
}

export async function combineWishlists(userIds) {
  let combinedWishlistGameIds = [];
  for (const userId of userIds) {
    const gameIds = await getUserWishlistGameIds(userId);
    if (gameIds) {
      combinedWishlistGameIds.push(...gameIds);
    }
  }
  return [...new Set(combinedWishlistGameIds)];
}

export async function getOnSaleGameDetails() {
  const wishlistGameIds = await combineWishlists(STEAM_WISH_LIST);
  const onSaleGameDetails = await getGamesOnSale([...new Set(wishlistGameIds)]);
  if (onSaleGameDetails.length === 0) {
    return "Gamer Gorl Bot did not find any games on sale";
  }
}

export async function displayWishlistGames(wishlistGameIds) {
  let allGameDetails = [];
  for (const gameId of wishlistGameIds) {
    const gameDetails = await getGameDetails(gameId);
    if (gameDetails) {
      allGameDetails.push(gameDetails);
    }
  }
  allGameDetails.sort((gameOne, gameTwo) => {
    return gameOne.price_overview.final - gameTwo.price_overview.final;
  });
  let allGameMessages = [];
  for (const gameDetail of allGameDetails) {
    allGameMessages.push(
      `${gameDetail.name} selling for ${gameDetail.price_overview.final_formatted}`,
    );
  }
  return allGameMessages.join("\n");
}

async function resolveVanityUrl(vanityUrl) {
  let response = "";
  try {
    response = await axios({
      method: "get",
      baseURL: BASE_URL,
      url: "ISteamUser/ResolveVanityURL/v1",
      params: {
        key: STEAM_API_KEY,
        vanityUrl,
      },
    });
  } catch {
    return undefined;
  }
  return response.data.response?.steamid;
}
