import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import axios from "axios";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// -------------------------------------------------------------
// READY
// -------------------------------------------------------------
client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

// -------------------------------------------------------------
// MESSAGE LISTENER
// -------------------------------------------------------------
client.on("messageCreate", async (msg) => {
  if (!msg.guild) return;
  if (msg.author.bot) return;

  const text = msg.content.toLowerCase();

  if (text.includes("hey bot, make team")) {
    console.log("Command received!");

    const channel = msg.guild.channels.cache.get(
      process.env.VOICE_CHANNEL_ID
    );

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      msg.reply("I can't find that voice channel!");
      return;
    }

    const members = [...channel.members.values()].map(
      (m) => m.user.username
    );

    if (members.length === 0) {
      msg.reply("Voice channel is empty!");
      return;
    }

    // Shuffle members
    const shuffled = members.sort(() => Math.random() - 0.5);

    // Reply
    msg.reply(`Randomized team:\n${shuffled.join("\n")}`);

    // Optional: send to n8n
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          members: shuffled,
        });
      } catch (err) {
        console.log("n8n webhook error:", err.message);
      }
    }
  }
});

// -------------------------------------------------------------
// KEEP-ALIVE WEB SERVER FOR RENDER
// -------------------------------------------------------------
const app = express();
app.get("/", (req, res) => res.send("Bot is running."));
app.listen(3000, () => console.log("Uptime server started"));

// -------------------------------------------------------------
client.login(process.env.DISCORD_TOKEN);
