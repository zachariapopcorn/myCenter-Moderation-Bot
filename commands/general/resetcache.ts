import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as globals from '../../utils/globalVariables';

import * as functions from "../../utils/functions"

function removeElements(arr) {
    arr.splice(0, arr.length);
}

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : String[]) {
    removeElements(globals.pendingApplications);
    removeElements(globals.pendingSubdomains);
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully cleared the cache`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("resetcache")
    .setDescription("Resets the bot's reported application and subdomain cache, to be used if it breaks");