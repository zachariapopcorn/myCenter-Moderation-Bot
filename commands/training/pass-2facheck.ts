import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = ["MP"];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let uID = functions.getArguement("id");
    let message = await fs.readFile("./messages/pass-2facheck.txt", "utf8");
    message = message.replaceAll("$1", uID);
    return await interaction.editReply({content: message});
}

export let data = new Builders.SlashCommandBuilder()
    .setName("pass-2facheck")
    .setDescription("Command to ask user to turn on 2FA and send here")
    .addStringOption(option => option.setName("id").setDescription("The id of the person to check").setRequired(true));