import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let data
    try {
        data = await functions.getLogs(functions.getArguement("id"));
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to get the activity data for this staff member: ${e}`));
    }
    let totalAmountOfLogs = data.discord + data.reportedApps + data.subdomains;
    return await interaction.editReply(functions.embedMaker(interaction.user, "Activity Data", `This staff member has completed ${totalAmountOfLogs} logs\n\n**Discord**: ${data.discord}\n**Reported Applications**: ${data.reportedApps}\n**Subdomains**: ${data.subdomains}`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("getactivitydata")
    .setDescription("Gets the activity data for a certain user")
    .addStringOption(option => option.setName("id").setDescription("The staff id of the staff member that you wish to view the activity data for").setRequired(true))