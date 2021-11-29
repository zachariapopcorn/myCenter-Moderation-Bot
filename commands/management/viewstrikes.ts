import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes"; 

import { fixGrammer } from '../../utils/grammarFixer';

export let ranks = [process.env.teamLeaderRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let strikes;
    try {
        strikes = await functions.getStrikes(functions.getArguement("id"));
    } catch(e) {
        return await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to get the staff member's strikes: ${e}`));
    }
    let description = `This staff member currently has ${strikes.length} strikes\n\n`;
    for(let i = 0; i < strikes.length; i++) {
        let keys = Object.keys(strikes[i]);
        let values = Object.values(strikes[i]);
        for(let o = 0; o < keys.length; o++) {
            description += `**${await fixGrammer(keys[o])}** - ${values[o]}\n`;
        }
        description += "\n";
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Strikes", description));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("viewstrikes")
    .setDescription("Views the strikes that a staff member has")
    .addStringOption(option => option.setName("id").setDescription("The staff id of the staff member that you wish to view the strikes of").setRequired(true))