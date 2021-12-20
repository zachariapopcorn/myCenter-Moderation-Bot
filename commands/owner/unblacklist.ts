import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : String[]) {
    if(interaction.user.id !== "465362236693807115") {
        return await interaction.editReply(functions.embedMaker(interaction.user, "No Permission", `You don't have permission to use this command or this command was ran on a server that's not whitelisted for this command`));
    }
    let id = functions.getArguement("id");
    try {
        await functions.unblacklistUser(id);
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while attempting to unblacklist this user from the bot: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully unblacklisted this user for you`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("unblacklist")
    .setDescription("Unblacklists someone from the bot")
    .addStringOption(option => option.setName("id").setDescription("The user ID of the user that you wish to unblacklist").setRequired(true))