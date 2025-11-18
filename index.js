if (text.includes("hey bot, make team")) {
  console.log("Command received!");

  const sourceChannel = msg.guild.channels.cache.get(
    process.env.VOICE_CHANNEL_ID
  );

  if (!sourceChannel || sourceChannel.type !== ChannelType.GuildVoice) {
    msg.reply("I can't find that voice channel!");
    return;
  }

  const blueChannel = msg.guild.channels.cache.get("755702625235632138");
  const redChannel = msg.guild.channels.cache.get("755702550371762206");

  if (!blueChannel || !redChannel) {
    msg.reply("I cannot find the Blue or Red team voice channels!");
    return;
  }

  // Get voice members as actual GuildMember objects
  const members = [...sourceChannel.members.values()];

  if (members.length === 0) {
    msg.reply("Voice channel is empty!");
    return;
  }

  // TRUE RANDOM SHUFFLE (Fisher–Yates)
  const shuffled = [...members]; // <- IMPORTANT: create COPY
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Split evenly
  const half = Math.ceil(shuffled.length / 2);
  const blueTeam = shuffled.slice(0, half);
  const redTeam = shuffled.slice(half);

  // Move members
  for (const member of blueTeam) {
    await member.voice.setChannel(blueChannel).catch(() =>
      console.log(`${member.user.tag} could not be moved to Blue.`)
    );
  }

  for (const member of redTeam) {
    await member.voice.setChannel(redChannel).catch(() =>
      console.log(`${member.user.tag} could not be moved to Red.`)
    );
  }

  // Reply nicely
  msg.reply(
    `Teams formed!\n\n**Blue Team (${blueTeam.length}):**\n` +
    blueTeam.map(m => m.user.username).join("\n") +
    `\n\n**Red Team (${redTeam.length}):**\n` +
    redTeam.map(m => m.user.username).join("\n")
  );

  // Send to n8n if needed
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      await axios.post(process.env.N8N_WEBHOOK_URL, {
        blue: blueTeam.map(m => m.user.username),
        red: redTeam.map(m => m.user.username)
      });
    } catch (err) {
      console.log("n8n webhook error:", err.message);
    }
  }
}
