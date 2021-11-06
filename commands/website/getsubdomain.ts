import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

import { pendingSubdomains } from '../../utils/globalVariables';
import { interactions } from '../../index';

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let domains
    try {
        domains = await functions.getSubdomains();
    } catch(e) {
        return interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while trying to get the subdomains: ${e}`));
    }
    if(domains.length == 0) {
        return interaction.editReply(functions.embedMaker(interaction.user, "No Subdomains", `There aren't any subdomains for you to review, check back later!`));
    }
    let validDomain = false;
    let domain;
    let tries = 0;
    while(validDomain == false) {
        let index = Math.floor(Math.random() * domains.length);
        let tempDomain = domains[index];
        let resId = tempDomain.ResponseId;
        if(!pendingSubdomains.find(v => v === resId)) {
            domain = tempDomain;
            validDomain = true;
        } else {
            domain = null;
            if(tries == domains.length) break;
            tries++;
        }
    }

    if(!domain) {
        return interaction.editReply(functions.embedMaker(interaction.user, "No Subdomains", `There aren't any subdomains for you to review, check back later!`));
    }

    pendingSubdomains.push(domain.Subdomain);

    let description = `Subdomain Data\n\n`;

    description += `**Center ID**: ${domain.CenterId}\n`;
    description += `**Domain**: ${domain.Subdomain}\n`;
    description += `**Time Requested**: ${domain.Created}\n`;

    let embed = functions.embedMaker(interaction.user, "Subdomain", description);

    functions.addButton(embed, "acceptSubdomainButton", "Accept Subdomain", "SUCCESS");
    functions.addButton(embed, "denySubdomainButton", "Deny Subdomain", "DANGER");

    let message = await interaction.channel.send(embed);

    const buttonFilter = (filterInteraction : Discord.Interaction) => {
        if(!filterInteraction.isButton()) return false;
        if(filterInteraction.user.id !== interaction.user.id) return false;
        return true;
    }

    let buttonActionEvent = message.createMessageComponentCollector({
        filter: buttonFilter,
        time: 120000,
        max: 1
    });
    
    buttonActionEvent.on('end', async collectedButtons => {
        if(collectedButtons.size == 0) {
            await interaction.channel.send(functions.embedMaker(interaction.user, "Time Limit Exceeded", "Your time limit for choosing an action had ran out! If you wish to complete a subdomain, please run the command again"));
            let index = pendingSubdomains.find(v => v === domain.Subdomain);
            pendingSubdomains.splice(index, 1);
            await interaction.editReply({content: "Interaction completed"});
            return;
        }
        let button = Array.from(collectedButtons.values())[0];
        await button.deferReply();
        let buttonId = button.customId;
        try {
            let index = interactions.findIndex(v => v.name === buttonId);
            await interactions[index].file.run(interaction, client, {
                domain: domain,
                button: button
            });
        } catch(e) {
            await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while attempting to grade this subdomain: ${e}`));
            await interaction.editReply({content: "Interaction completed"});
            await button.editReply({content: "Interaction completed"});
            return;
        }
    });
}

export let data = new Builders.SlashCommandBuilder()
    .setName("getsubdomain")
    .setDescription("Gets a random subdomain for you to review");