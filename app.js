import axios from "axios";
import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';

import { getCredential } from './credentials.js'
import { compareComponent } from './discord-components.js'
import * as steam from './steam.js';
import { getRandomEmoji } from './utils.js';

const WEBHOOKS_URL = "https://discord.com/api/v10/webhooks/"
const PORT = process.env.PORT || 3000;

const appId = getCredential("APP_ID");
const publicKey = getCredential("PUBLIC_KEY");

const app = express();

async function sendDataToDiscord(discordData, interaction_token) {
    let response = "";
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

        if (name === 'compare') {
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, 
                data: {
                    content: "Let's compare some wishlists!",
                    components: compareComponent                 
                }
            });
            return "Setting up user select options...";
        }
        if (name === 'on-sale') {
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Wait a moment while we look for some deals..."
                },
            });
            const onSaleWishlist = await steam.displayWishlistGames(
                await steam.combineWishlists(steam.STEAM_USER_IDS),
                true
            );
            await sendDataToDiscord(onSaleWishlist, token);
            return "On sale wishlist sent!";
        }
        if (name === 'wishlist') {
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Wait a moment while we fetch the wishlist...",
                },
            });
            const wishlist = await steam.displayWishlistGames(
                await steam.combineWishlists(steam.STEAM_USER_IDS)
            );
            await sendDataToDiscord(wishlist, token);
            return "Wishlist sent!"; 
        }
    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
      const userChoices = data.values;
      res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
              content: `Comparing wishlists...`,
          }
      });
      const usersToCompare = Object.fromEntries(
          Object.entries(steam.STEAM_USER_LIST)
            .filter(([name]) => userChoices.includes(name))
      );
      const comparedWishlist = await steam.displayWishlistGames(
          await steam.combineWishlists(Object.values(usersToCompare), true)
      );
      await sendDataToDiscord(comparedWishlist, token);
      return "Wishlist Comparison sent!";
  }
  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
