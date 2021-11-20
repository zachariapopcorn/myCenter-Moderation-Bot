import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import { getIdFromUsername } from 'noblox.js';

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = ["Director"];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let rbxID
    try {
        rbxID = await getIdFromUsername(functions.getArguement("username"));
    } catch {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Invalid Username", `The username that you supplied was an invalid Roblox username`));
    }
    try {
        await functions.banUser(rbxID, `Actual moderator was ${interaction.user.tag} (${interaction.user.id}) | ${functions.getArguement("reason")}`);
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while attempting to ban this user: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully banned this user from myCenter`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from myCenter")
    .addStringOption(option => option.setName("username").setDescription("The username of the person that you wish to ban").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("The reason for you to ban this user").setRequired(true));