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

  // -------------------------------------------------------------
  // UPDATED "MAKE TEAM" FEATURE
  // -------------------------------------------------------------
  if (text.includes("hey bot, make team")) {
    console.log("Command received!");

    const sourceChannel = msg.guild.channels.cache.get(
      process.env.VOICE_CHANNEL_ID
    );

    if (!sourceChannel || sourceChannel.type !== ChannelType.GuildVoice) {
      msg.reply("I can't find that voice channel!");
      return;
