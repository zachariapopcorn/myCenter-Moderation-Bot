const express = require('express');
import Discord = require('discord.js');
import fs = require('then-fs');

import * as functions from './utils/functions';

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const token = process.env.token;

export const commands = [];
export const interactions = [];

app.get('/', async (request, response) => {
     response.sendStatus(200);
});

let listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is currently listening on port: ${listener.address().port}`);
});

async function readCommandDir(dirName) {
    let files = await fs.readdir(`./commands/${dirName}`);

    for(var i = 0; i < files.length; i++) {
        let file = files[i];
        file = file.replace(".ts", ".js");
        let coreFile = require(`./commands/${dirName}/${file}`);
        commands.push({
            file: coreFile,
            name: file.split('.')[0],
            data: coreFile.data
        });
    }
}

async function readInteractions() {
    let files = await fs.readdir(`./interactions/`);

    for(var i = 0; i < files.length; i++) {
        let file = files[i];
        file = file.replace(".ts", ".js");
        let coreFile = require(`./interactions/${file}`);
        interactions.push({
            file: coreFile,
            name: file.split('.')[0],
        });
    }
}

async function registerSlashCommands() {
    let slashCommands = [];
    for(let i = 0; i < commands.length; i++) {
        let commandData;
        try {
            commandData = await commands[i].data.toJSON();
            slashCommands.push(commandData);
        } catch(e) {
            console.log(`Couldn't load slash command data for ${commands[i].name} with error: ${e}`);
        }
    }
    let rest = new REST({version: 9}).setToken(token);
    try {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, "693156892956033086"),
            {body: slashCommands}
        )
    } catch(e) {
        console.error(`There was an error while registering slash commands: ${e}`);
    }
}

client.on('ready', async() => {
    console.log(`Logged into the Discord account - ${client.user.tag}`);
    await readCommandDir("general");
    await readCommandDir("logging");
    await readCommandDir("management");
    await readCommandDir("training");
    await readCommandDir("trial");
    await readCommandDir("website");
    await registerSlashCommands();
    await readInteractions();
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;
    let command = interaction.commandName.toLowerCase();
    for(let i = 0; i < commands.length; i++) {
        if(commands[i].name === command) {
            await interaction.deferReply();
            let args = functions.getArguements(interaction);
            if(!functions.checkPermissions(interaction, commands[i].file)) {
                await interaction.editReply(functions.embedMaker(interaction.user, "No Permission", `You don't have permission to use this command or this command was ran on a server that's not whitelisted for this command`));
                return;
            }
            try {
                await commands[i].file.run(interaction, client, args);
            } catch(e) {
                await interaction.editReply(functions.embedMaker(interaction.user, "Error", `There was an error while processing this command: ${e}`));
            }
        }
    }
});

client.login(token);