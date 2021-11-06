import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = ["Director"];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    try {
        await functions.removeStaff(functions.getArguement("id"));
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to remove the staff member from the database: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully removed this user from the staff database`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("removestaff")
    .setDescription("Removes a staff member from the database")
    .addStringOption(option => option.setName("id").setDescription("The staff id of the staff member that you wish to remove").setRequired(true))