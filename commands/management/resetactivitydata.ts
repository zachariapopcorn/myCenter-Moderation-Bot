import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.teamLeaderRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    try {
        await functions.resetLogs(functions.getArguement("id"));
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to reset the staff member's activity data: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully reset this staff member's activity data`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("resetactivitydata")
    .setDescription("Resets the activity data for a certain user")
    .addStringOption(option => option.setName("id").setDescription("The staff id of the staff member that you wish to reset").setRequired(true))