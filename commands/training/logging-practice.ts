import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = ["MP"];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let message = await fs.readFile("./messages/logging-practice.txt", "utf8");
    return await interaction.editReply({content: message});
}

export let data = new Builders.SlashCommandBuilder()
    .setName("logging-practice")
    .setDescription("Practices logging for the user")