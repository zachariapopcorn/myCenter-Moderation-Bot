import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.trainingRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let message = await fs.readFile("./messages/scenario-3.txt", "utf8");
    return await interaction.editReply({content: message});
}

export let data = new Builders.SlashCommandBuilder()
    .setName("scenario-3")
    .setDescription("Loads Scenario 3")