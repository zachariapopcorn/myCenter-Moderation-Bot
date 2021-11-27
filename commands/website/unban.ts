import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import { getIdFromUsername } from 'noblox.js';

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = ["Team Member"];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    return await interaction.editReply(functions.embedMaker(interaction.user, "Broken Command", `This command currently doesn't work due to a backend bug, bug the real developers of myCenter to fix it`));
    let rbxID
    try {
        rbxID = await getIdFromUsername(functions.getArguement("username"));
    } catch {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Invalid Username", `The username that you supplied was an invalid Roblox username`));
    }
    try {
        await functions.unbanUser(rbxID);
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while attempting to unban this user: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully unbanned this user from myCenter`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user from myCenter")
    .addStringOption(option => option.setName("username").setDescription("The username of the person that you wish to unban").setRequired(true))