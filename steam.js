import axios from "axios";
import 'dotenv/config'
import express from "express";

const BASE_URL = "https://api.steampowered.com/";
const GET_ITEMS_REQUEST_LIMIT = 700;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

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
    console.log(response.data.response?.steamid);
	return response.data.response?.steamid;
}

async function getWishlistItemIds(steamUserId) {
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
    const wishlistItems = response.data.response.items?.map(game => game.appid)
    console.log(wishlistItems);
	return wishlistItems;
}

async function main() {
    const id = await resolveVanityUrl("bigpapaganon");
    await getWishlistItemIds(id);
};

main();
