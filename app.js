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
const PORT = process.env.PORT || 3000;

async function sendDataToDiscord(data, interaction_id) {
    let response = "";
    try {
        response = await axios({
            method: "post",
        })
    }
}

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
    const { data, id, type } = req.body;

    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
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
            const wishlist = steam.displayWishlistGames(); 
            return res.send ({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: wishlist
                },
            });
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
