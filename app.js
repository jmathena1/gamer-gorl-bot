import axios from "axios";
import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import * as steam from './steam.js';
import { getRandomEmoji } from './utils.js';


const app = express();
const WEBHOOKS_URL = "https://25d5-174-172-91-168.ngrok-free.app/webhooks/"
const PORT = process.env.PORT || 3000;

async function sendDataToDiscord(discordData, interaction_token) {
    let response = "";
    try {
        response = await axios({
            method: "post",
            baseURL: WEBHOOKS_URL,
            url: `${process.env.APP_ID}/${interaction_token}`,
            params: {
                type: CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: discordData
                }
            }
        })
    }
    catch {
        return undefined
    }
    console.log(response);
    return response;
}

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
    const { data, token, type } = req.body;

        if (type === InteractionType.PING) {
        return res.send({
            type: InteractionResponseType.PONG,
            status: 204
        });
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
            console.log(token);
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
