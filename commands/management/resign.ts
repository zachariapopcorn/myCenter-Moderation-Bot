import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.teamLeaderRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let discordId = functions.getArguement("id");
    let resignMessage = await fs.readFile("./messages/resign.txt", "utf8");
    try {
        await functions.removeStaff(discordId);
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to remove this staff member from the database: ${e}`));
    }
    try {
        let member = await interaction.client.users.fetch(discordId);
        if(member) {
            let dmChannel = await member.createDM();
            await dmChannel.send({content: resignMessage});
        } else {
            throw new Error("User unable to be fetched");
        }
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to send this user a DM: ${e}`));
    }
    await (await interaction.guild.members.fetch(discordId) as Discord.GuildMember).kick("Resigned");
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully resigned this user`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("resign")
    .setDescription("Resigns a user")
    .addStringOption(option => option.setName("id").setDescription("The staff id of the staff member that you wish to resign").setRequired(true))