import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let embedObject = functions.embedMaker(interaction.user, "Moderation Logged", "A new moderation from the myCenter Discord has been logged");
    let embed = embedObject.embeds[0];
    embed.addField("Moderator", `<@${interaction.user.id}> (${interaction.user.id})`);
    for(let i = 0; i < args.length; i++) {
        let name = args[i].name;
        let firstLetter = args[i].name.charAt(0).toUpperCase();
        name = name.slice(1, name.length);
        embed.addField(`${firstLetter + name}`, args[i].value);
    }
    let moderationChannel = interaction.guild.channels.cache.find(channel => channel.id === "693238189489651794") as Discord.TextChannel;
    moderationChannel.send(embedObject);
    try {
        await functions.updateLogs(interaction.user.id, "discord");
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to update your moderation count on the database: ${e}`));
    }
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully logged this moderation for you`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("logmoderation")
    .setDescription("Logs a moderation to the moderation channel")
    .addStringOption(option => option.setName("username").setDescription("The username of the offender").setRequired(true))
    .addStringOption(option => option.setName("id").setDescription("The id of the offender").setRequired(true))
    .addStringOption(option => option.setName("type").setDescription("The type of moderation action inflicted").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("The reason for this moderation").setRequired(true))
    .addStringOption(option => option.setName("proof").setDescription("The proof of this moderation").setRequired(true))