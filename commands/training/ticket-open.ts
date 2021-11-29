import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.trainingRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let choices = ["General", "Partnership", "Bug", "Other"];
    let choice = choices[Math.floor(Math.random() * ((choices.length - 1) - 0 + 1) + 0)];
    let message = await fs.readFile("./messages/ticket-open.txt", "utf8");
    message = message.replaceAll("{choice}", choice);
    message = message.replaceAll("{user}", `<@${interaction.user.id}>`);
    return await interaction.editReply({content: message});
}

export let data = new Builders.SlashCommandBuilder()
    .setName("ticket-open")
    .setDescription("Example of an ticket opening")