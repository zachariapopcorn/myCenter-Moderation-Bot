import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = ["MP"];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let message = await fs.readFile("./messages/dm-advertising.txt", "utf8");
    return interaction.editReply(message);
}

export let data = new Builders.SlashCommandBuilder()
    .setName("dm-advertising")
    .setDescription("Gives the dm-advertising prompt");