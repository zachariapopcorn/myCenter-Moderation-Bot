import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : String[]) {
    return interaction.editReply(functions.embedMaker(interaction.user, "Bot's Ping", `Latency is ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Gets the bot's ping")