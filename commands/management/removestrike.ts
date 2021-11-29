import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.teamLeaderRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    try {
        await functions.removeStrike(functions.getArguement("staffid"), Number(functions.getArguement("strikeid")));
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to remove the strike from the staff member: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully removed this strike from this user`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("removestrike")
    .setDescription("Removes a strike from a staff member")
    .addStringOption(option => option.setName("staffid").setDescription("The staff id of the staff member that owns the strike that you wish to remove").setRequired(true))
    .addStringOption(option => option.setName("strikeid").setDescription("The strike id of the strike that you wish to remove").setRequired(true))