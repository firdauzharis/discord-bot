import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  if (msg.content.toLowerCase().includes("hey bot, make team")) {
    console.log("Command received!");

    // Example: fetch users in your specific voice channel
    const channel = msg.guild.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (!channel || channel.type !== 2) {
      msg.reply("I can't find that voice channel!");
      return;
    }

    const members = [...channel.members.values()].map(m => m.user.username);

    // Randomize:
    const shuffled = members.sort(() => Math.random() - 0.5);

    msg.reply(`Randomized team:\n${shuffled.join("\n")}`);

    // Optional: notify n8n
    if (process.env.N8N_WEBHOOK_URL) {
      axios.post(process.env.N8N_WEBHOOK_URL, {
        members: shuffled
      }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Bot is running."));
app.listen(3000, () => console.log("Uptime server started"));

