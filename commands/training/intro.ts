import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.trainingRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let uID = functions.getArguement("id");
    let message = await fs.readFile("./messages/intro.txt", "utf8");
    message = message.replaceAll("$1", uID);
    return await interaction.editReply({content: message});
}

export let data = new Builders.SlashCommandBuilder()
    .setName("intro")
    .setDescription("Introduces the user to a training session")
    .addStringOption(option => option.setName("id").setDescription("The id of the person to introduce").setRequired(true));