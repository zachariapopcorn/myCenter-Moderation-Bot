import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

import { fixGrammer } from "../../utils/grammarFixer"

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let embedObject = functions.embedMaker(interaction.user, "Offence Logged", "A new offence from the myCenter Discord has been logged");
    let embed = embedObject.embeds[0];
    embed.addField("Moderator", `<@${interaction.user.id}> (${interaction.user.id})`);
    for(let i = 0; i < args.length; i++) {
        embed.addField(await fixGrammer(args[i].name), args[i].value);
    }
    let offenceChannel = interaction.guild.channels.cache.find(channel => channel.id === "735234708778123325") as Discord.TextChannel;
    offenceChannel.send(embedObject);
    try {
        await functions.updateLogs(interaction.user.id, "discord");
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to update your moderation count on the database: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully logged this offence for you`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("logoffence")
    .setDescription("Logs an offence to the offence channel")
    .addStringOption(option => option.setName("username").setDescription("The username of the offender").setRequired(true))
    .addStringOption(option => option.setName("id").setDescription("The id of the offender").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("The reason for this offence").setRequired(true))
    .addStringOption(option => option.setName("proof").setDescription("The proof of this offence").setRequired(true))