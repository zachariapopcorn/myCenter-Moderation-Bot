import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

import { commands } from "../../index";

async function generateDescription() : Promise<string> {
    let description = `There are ${commands.length} commands\n\n`;

    for(let i = 0; i < commands.length; i++) {
        let data;
        let helpString = "";
        try {
            data = commands[i].data.name;
        } catch {
            helpString = "**Load Failed** - Help display of command failed to load\n";
            description += helpString;
            continue;
        }
        data = commands[i].data;
        helpString = `**${data.name}** - ${data.description}\n`;
        description += helpString;
    }

    return description;
}

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : String[]) {
    let embedObject = functions.embedMaker(interaction.user, "Command List", "");
    let description = await generateDescription();
    embedObject.embeds[0].setDescription(description);
    return interaction.editReply(embedObject);
}

export let data = new Builders.SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays the help menu")