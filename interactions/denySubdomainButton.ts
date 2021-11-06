import Discord = require('discord.js');

import * as functions from "../utils/functions"

import { pendingSubdomains } from '../utils/globalVariables';

export async function run(interaction : Discord.ButtonInteraction, client : Discord.Client, args : any) {
    let subdomainObject = args.domain;
    let button = args.button;
    try {
        await functions.denySubdomain(subdomainObject.Subdomain);
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to process this subdomain: ${e}`))
        await interaction.editReply({content: "Interaction completed"});
        await button.editReply({content: "Interaction completed"});
    }
    let index = pendingSubdomains.find(v => v === subdomainObject.Subdomain);
    pendingSubdomains.splice(index, 1);
    
    let description = `This subdomain was processed by <@${interaction.user.id}> (${interaction.user.id})\n\n`;

    description += `**Center ID**: ${subdomainObject.CenterId}\n`;
    description += `**Domain**: ${subdomainObject.Subdomain}\n`;
    description += `**Time Requested**: ${subdomainObject.Created}\n`;
    description += `**Status**: Denied\n`;

    let channel = interaction.guild.channels.cache.find(v => v.id === "735843585605238807") as Discord.TextChannel;
    let embed = functions.embedMaker(client.user, "New Subdomain", description);
    await channel.send(embed);


    try {
        await functions.updateLogs(interaction.user.id, "subdomains");
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to update your moderation count on the database: ${e}`));
    }

    await interaction.channel.send(functions.embedMaker(interaction.user, "Success", `I have successfully processed this subdomain`));
    await interaction.editReply({content: "Interaction completed"});
    await button.editReply({content: "Interaction completed"});
}