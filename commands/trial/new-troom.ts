import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.trainingRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let embed = functions.embedMaker(client.user, "Welcome to your room!", "Here, everything will remain private. We ask that you do not share any images or messages from this chat.");
    embed.embeds[0].addField("Getting started", "Please wait for your trainer to respond! Once they have done so, you will begin. The room will be purged multiple times, so make sure to remember things!");
    embed.embeds[0].addField("Information", "You can have the [guide](https://bit.ly/mCModHandbook) when you wish. Make sure that you remember stuff from that!");
    embed.embeds[0].addField("AFK/GTG", "If you have to go for longer than 3 hours, please notify your trainer by pinging them.\nThis will allow us to see that you are AFK.\nWhen you are back, make sure to ping them!");
    embed.embeds[0].addField("Good Luck", "We wish you the best of luck!");
    return interaction.editReply(embed);
}

export let data = new Builders.SlashCommandBuilder()
    .setName("new-troom")
    .setDescription("Sends the trial room embed in a channel")