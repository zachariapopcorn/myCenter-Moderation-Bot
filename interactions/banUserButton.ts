import Discord = require('discord.js');

import * as functions from "../utils/functions"

import { pendingApplications } from '../utils/globalVariables';

export async function run(interaction : Discord.ButtonInteraction, client : Discord.Client, args : any) {
    let application = args.app;
    let button = args.button;
    try {
        await functions.banUser(application.RobloxId, `Actual moderator was ${interaction.user.tag} (${interaction.user.id}) | ${args.reason}`);
    } catch(e) {
        let index = pendingApplications.find(v => v === application.ResponseId);
        pendingApplications.splice(index, 1);
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to preform this action: ${e}`));
        await interaction.editReply({content: "Interaction completed"});
        await button.editReply({content: "Interaction completed"});
        return;
    }
    let index = pendingApplications.find(v => v === application.ResponseId);
    pendingApplications.splice(index, 1);

    let descriptions : string[] = [`${application.Username}'s application\n\n`];

    let embeds = [functions.embedMaker(client.user, "New Ban Log", `This log was generated by <@${interaction.user.id}> (${interaction.user.id})\n\n**Roblox Username**: ${application.Username}\n**Reason**: ${args.reason}\n\nThe application is attached below`)];

    let descriptionIndex = 0;

    let responseObject = JSON.parse(functions.fixString(application.Response));

    let response = responseObject.response;

    for(let i = 0; i < response.length; i++) {
        let description = descriptions[descriptionIndex];
        let question = response[i].question;
        let res = response[i].response;
        let newElement = `**${question}**\n${res}\n\n`;
        if(description.length >= 4096) {
            descriptions.push("");
            descriptionIndex++
            continue;
        } else if(description.length + newElement.length >= 4096) {
            descriptions.push("");
            descriptionIndex++;
            continue;
        }
        description += `**${question}**\n${res}\n\n`;
        descriptions[descriptionIndex] = description;
    }

    embeds.push(functions.embedMaker(client.user, "Reported Application", descriptions[0]));

    for(let i = 1; i < descriptions.length; i++) {
        embeds.push(functions.embedMaker(client.user, "", descriptions[i]));
    }

    for(let i = 0; i < embeds.length; i++) {
        let channel = interaction.guild.channels.cache.find(v => v.id === "742088133482512414") as Discord.TextChannel;
        await channel.send(embeds[i]);
    }
    
    try {
        await functions.updateLogs(interaction.user.id, "reportedApps");
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to update your moderation count on the database: ${e}`));
    }

    await interaction.channel.send(functions.embedMaker(interaction.user, "Success", `I have successfully pushed this action towards this reported application and it's author`));
    await interaction.editReply({content: "Interaction completed"});
    await button.editReply({content: "Interaction completed"});
}