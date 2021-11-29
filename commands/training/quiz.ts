import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.trainingRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let message = await fs.readFile("./messages/quiz.txt", "utf8");
    message = message.replaceAll("{user}", `<@${interaction.user.id}>`);
    return await interaction.editReply({content: message});
}

export let data = new Builders.SlashCommandBuilder()
    .setName("quiz")
    .setDescription("A quiz on moderation concepts")