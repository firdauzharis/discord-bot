import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const TOKEN = process.env.DISCORD_TOKEN;
const WEBHOOK = process.env.N8N_WEBHOOK;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Bot online as ${client.user.tag}`);
});

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  if (msg.content.toLowerCase().trim() === "hey bot, make team") {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel_id: "755703109791121469",
        text_channel: msg.channelId,
        user: msg.author.id
      })
    });
  }
});

client.login(TOKEN);
