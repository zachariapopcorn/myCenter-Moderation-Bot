import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = ["Director"];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    try {
        await functions.addStrike(`${interaction.user.tag} (${interaction.user.id})`, functions.getArguement("id"), functions.getArguement("reason"));
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to add a strike to this staff member: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully added a strike to this staff member`));
}


export let data = new Builders.SlashCommandBuilder()
    .setName("addstrike")
    .setDescription("Adds a strike to a staff member")
    .addStringOption(option => option.setName("id").setDescription("The staff id of the staff member that you wish to strike").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("The reason for the strike").setRequired(true));