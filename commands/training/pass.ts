import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.trainingRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let uID = functions.getArguement("id");
    let message = await fs.readFile("./messages/pass.txt", "utf8");
    let roles = Array.from((await interaction.guild.roles.fetch()).values());
    let member;
    try {
        member = await interaction.guild.members.fetch(uID);
        if(member) {
            let dmChannel = await member.createDM();
            await dmChannel.send({content: message});
        } else {
            throw new Error("User unable to be fetched");
        }
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to send this user a DM: ${e}`));
    }
    try {
        await member.roles.remove(roles.find(r => r.name === "Trainee"));
        await member.roles.remove(roles.find(r => r.name === "[TR] HA"));
        await member.roles.remove(roles.find(r => r.name === "[TR] FA"));
        await member.roles.remove(roles.find(r => r.name === "[TR] RT"));
        await member.roles.add(roles.find(r => r.name === "Trial Enforcement"));
        await member.roles.add(roles.find(r => r.name === "Roled"));
        await member.roles.add(roles.find(r => r.name === "2FA Enabled"));
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to modify the user's roles: ${e}`));
    }
    return await interaction.editReply({content: "Interaction completed"});
}

export let data = new Builders.SlashCommandBuilder()
    .setName("pass")
    .setDescription("Passes a user")
    .addStringOption(option => option.setName("id").setDescription("The id of the person to pass").setRequired(true));