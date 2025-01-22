import axios from "axios";
import 'dotenv/config'

const BASE_URL = "https://api.steampowered.com/";
const GET_ITEMS_REQUEST_LIMIT = 700;
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_LIST = process.env.STEAM_USER_IDS.split(",");
const STORE_URL = "https://store.steampowered.com/api/";

export async function getUserWishlistGameIds(steamUserId) {
	let response = "";
	try {
		response = await axios({
			method: "get",
			baseURL: BASE_URL,
			url: "IWishlistService/GetWishlist/v1",
			params: {
			    steamid: steamUserId
			},
		});
	} catch {
		return undefined;
	}
    const userWishlistGameIds = response.data.response.items?.map(game => game.appid)
	return userWishlistGameIds;
}

export async function getGameDetails(gameId) {
    let response = "";
	try {
		response = await axios({
			method: "get",
			baseURL: STORE_URL,
			url: "appdetails",
			params: {
			    appids: gameId
			},
		});
	} catch {
		return undefined;
	};
    const gameDetails = response.data[`${gameId}`].data;
    if (gameDetails.release_date.coming_soon === true) {
        console.info(`${gameDetails.name} (app id: ${gameId}) not yet released`);
        return undefined;
    }
    return (({name, price_overview: {final, final_formatted, discount_percent} }) =>
        ({name, price_overview: {final, final_formatted, discount_percent} }))(gameDetails);
}

export async function getGamesOnSale(wishlistGamesIds) {
   let gamesOnSale = [];
   for (const gameId of wishlistGamesIds) {
       const gameDetails = await getGameDetails(gameId);
       if (gameDetails && gameDetails.price_overview.discount_percent > 0) {
           gamesOnSale.push(gameDetails)
       };
   }
   return gamesOnSale;
};

export async function combineWishlists() {
    let combinedWishlistGameIds = [];
    for (const user of STEAM_USER_LIST) {
        const gameIds = await getUserWishlistGameIds(user);
        if (gameIds) {
            combinedWishlistGameIds.push(...gameIds);
        };
    };
    return combinedWishlistGameIds;
}

export async function displayGamesOnSale() {
    const wishlistGameIds = await combineWishlists();
    const onSaleGameDetails = await getGamesOnSale([...new Set(wishlistGameIds)]);
    if (onSaleGameDetails.length === 0) {
        return "Gamer Gorl Bot did not find any shared games on sale"
    }
};

export async function displayWishlistGames() {
    let allGameDetails = [];
    const wishlistGameIds = await combineWishlists();
    for (const gameId of wishlistGameIds) {
        const gameDetails = await getGameDetails(gameId);
        if (gameDetails) {
            allGameDetails.push(gameDetails);
        }
    }
    allGameDetails.sort((gameOne, gameTwo) => {
        return gameOne.price_overview.final - gameTwo.price_overview.final
    });
    let allGameMessages = [];
    for (const gameDetail of allGameDetails) {
        allGameMessages.push(`${gameDetail.name} selling for ${gameDetail.price_overview.final_formatted}`)
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

