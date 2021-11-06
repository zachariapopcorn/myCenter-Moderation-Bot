import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import { getIdFromUsername } from 'noblox.js';

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let rbxID
    try {
        rbxID = await getIdFromUsername(functions.getArguement("username"));
    } catch {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Invalid Username", `The username that you supplied was an invalid Roblox username`));
    }
    let banData;
    try {
        banData = await functions.getUserBanData(rbxID);
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while attempting to get the ban data for this user: ${e}`));
    }
    let description = `I have successfully grabbed this user's ban data\n\n`;
    description += `**Globally Banned**: ${banData.globally_banned}\n`;
    description += `**Suspicous**: ${banData.suspicous}\n`;
    description += `**Reports**: ${banData.reports}\n`;
    description += `**Application Bans**: ${banData.application_bans}`;
    return interaction.editReply(functions.embedMaker(interaction.user, "Success", description));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("checkstatus")
    .setDescription("Checks the ban status of a user from myCenter")
    .addStringOption(option => option.setName("username").setDescription("The username of the person that you wish to check").setRequired(true))