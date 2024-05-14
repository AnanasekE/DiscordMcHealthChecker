const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const urls_to_check = [
 { url: process.env.DOMAIN_1, port: 25565, channel_id: process.env.CHANNEL_ID_1 },
 { url: process.env.DOMAIN_2, port: 25566, channel_id: process.env.CHANNEL_ID_2 }
];
const interval_ms = 300000; // 5 minutes

client.once('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 checkURLStatus();
 setInterval(checkURLStatus, interval_ms);
});

async function checkURLStatus() {
 console.log("Current time: " + new Date().getHours() + ":" + new Date().getMinutes());
 for (const { url, port, channel_id } of urls_to_check) {
  let isUp = false;
  try {
   const response = await axios.get(`${url}:${port}`);
   if (response.status === 200) {
    isUp = true;
   }
  } catch (error) {
   console.log(`Failed to reach ${url}:${port}`);
  }

  updateChannelName(channel_id, `${url}:${port} is ${isUp ? 'Up' : 'Down'}`);
 }
}

async function updateChannelName(channel_id, newName) {
 const channel = await client.channels.fetch(channel_id);
 if (!channel) return;

 if (channel.name !== newName) {
  channel.setName(newName)
   .then(updated => console.log(`Channel name updated to ${updated.name}`))
   .catch(console.error);
 }
}

client.login(process.env.TOKEN);
