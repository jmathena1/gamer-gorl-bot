import axios from "axios";
import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import * as steam from './steam.js';
import { getAppIdAndKey, getRandomEmoji } from './utils.js';

const WEBHOOKS_URL = "https://discord.com/api/v10/webhooks/"
const PORT = process.env.PORT || 3000;

const { appId, publicKey } = await getAppIdAndKey();

const app = express();

async function sendDataToDiscord(discordData, interaction_token) {
    let response = "";
    console.log(`${WEBHOOKS_URL}${appId}/${interaction_token}`)
    try {
        response = await axios({
            method: "post",
            baseURL: WEBHOOKS_URL,
            url: `${appId}/${interaction_token}`,
            headers: {"Content-Type": "application/json"},
            data : {
                content: discordData
            }
        })
    }
    catch {
        return undefined
    }
    console.log(response);
    return response;
}

app.post('/interactions', verifyKeyMiddleware(publicKey), async function (req, res) {
    const { data, token, type } = req.body;

    if (type === InteractionType.PING) {
        return res.send({type: InteractionResponseType.PONG});
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

        if (name === 'test') {
            return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `hello world ${getRandomEmoji()}`,
            },
            });
        }
        if (name === 'wishlist') {
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Wait a moment while we fetch the wishlist...",
                },
            });
            const wishlist = await steam.displayWishlistGames(); 
            await sendDataToDiscord(wishlist, token);
            return "Wishlist sent!"; 
        }
    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
