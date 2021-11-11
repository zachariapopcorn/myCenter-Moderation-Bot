import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

import { pendingApplications } from '../../utils/globalVariables';
import { interactions } from '../../index';

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let apps
    try {
        apps = await functions.getReportedApps();
    } catch(e) {
        return interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to get the reported apps: ${e}`));
    }
    if(apps.length == 0) {
        return interaction.editReply(functions.embedMaker(interaction.user, "No Applications", `There aren't any applications for you to review, check back later!`));
    }
    let validApp = false;
    let application;
    let tries = 0;
    while(validApp == false) {
        let index = Math.floor(Math.random() * apps.length);
        let tempApp = apps[index];
        let resId = tempApp.ResponseId;
        if(!pendingApplications.find(v => v === resId)) {
            application = tempApp;
            validApp = true;
        } else {
            application = null;
            if(tries == apps.length) break;
            tries++;
        }
    }

    if(!application) {
        return interaction.editReply(functions.embedMaker(interaction.user, "No Applications", `There aren't any applications for you to review, check back later!`));
    }

    pendingApplications.push(application.ResponseId);

    let descriptions : string[] = [`${application.Username}'s application\n\n`];

    let embeds = [];

    let descriptionIndex = 0;

    let responseObject = JSON.parse(application.Response);

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

    embeds.push(functions.embedMaker(interaction.user, "Reported Application", descriptions[0]));

    for(let i = 1; i < descriptions.length; i++) {
        embeds.push(functions.embedMaker(interaction.user, "", descriptions[i]));
    }

    functions.addButton(embeds[embeds.length - 1], "deleteApplicationButton", "Delete Application", "SUCCESS");
    functions.addButton(embeds[embeds.length - 1], "banUserButton", "Ban User", "DANGER");

    let message : Discord.Message;

    try {
        for(let i = 0; i < embeds.length; i++) {
            message = await interaction.channel.send(embeds[i]);
        }
    } catch(e) {
        await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to send the reported application: ${e}`));
    }

    const buttonFilter = (filterInteraction : Discord.Interaction) => {
        if(!filterInteraction.isButton()) return false;
        if(filterInteraction.user.id !== interaction.user.id) return false;
        return true;
    }

    const messageFilter = (message : Discord.Message) => {
        if(message.author.id !== interaction.user.id) return false;
        return true;
    }

    let buttonActionEvent = message.createMessageComponentCollector({
        filter: buttonFilter,
        time: 120000,
        max: 1
    });

    buttonActionEvent.on('end', async collectedButtons => {
        if(collectedButtons.size == 0) {
            await interaction.channel.send(functions.embedMaker(interaction.user, "Time Limit Exceeded", "Your time limit for choosing an action had ran out! If you wish to complete a reported application, please run the command again"));
            let index = pendingApplications.find(v => v === application.ResponseId);
            pendingApplications.splice(index, 1);
            await interaction.editReply({content: "Interaction completed"});
            return;
        }
        let button = Array.from(collectedButtons.values())[0];
        await button.deferReply();
        let buttonId = button.customId;
        await interaction.channel.send(functions.embedMaker(interaction.user, "Reason", `Please specify the reason for this action`));
        let messageFilterEvent = interaction.channel.createMessageCollector({
            filter: messageFilter,
            time: 120000,
            max: 1
        });
        messageFilterEvent.on('end', async collectedMessages => {
            if(collectedMessages.size == 0) {
                await interaction.channel.send(functions.embedMaker(interaction.user, "Time Limit Exceeded", "Your time limit for creating a reason had ran out! If you wish to complete a reported application, please run the command again"));
                let index = pendingApplications.find(v => v === application.ResponseId);
                pendingApplications.splice(index, 1);
                await interaction.editReply({content: "Interaction completed"});
                await button.editReply({content: "Interaction completed"});
                return;
            }
            let reason = Array.from(collectedMessages.values())[0].content;
            try {
                let index = interactions.findIndex(v => v.name === buttonId);
                await interactions[index].file.run(interaction, client, {
                    app: application,
                    reason: reason,
                    button: button
                });
            } catch(e) {
                await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while attempting to punish this user: ${e}`));
                await interaction.editReply({content: "Interaction completed"});
                await button.editReply({content: "Interaction completed"});
                return;
            }
        });
    });
}

export let data = new Builders.SlashCommandBuilder()
    .setName("getreportedapp")
    .setDescription("Gets a random reported application for you to review");