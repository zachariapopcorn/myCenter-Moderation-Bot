import Discord = require('discord.js');
import Builders = require('@discordjs/builders');
import fs = require('then-fs');

import * as functions from "../../utils/functions"

import { Arguements } from "../../utils/classes";

export let ranks = [process.env.trainingRole];

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : Arguements[]) {
    let uID = functions.getArguement("id");
    let message = await fs.readFile("./messages/failk.txt", "utf8");
    try {
        let member = await interaction.client.users.fetch(uID);
        if(member) {
            let dmChannel = await member.createDM();
            await dmChannel.send({content: message});
        } else {
            throw new Error("User unable to be fetched");
        }
    } catch(e) {
        await interaction.channel.send(functions.embedMaker(interaction.user, "Error", `There was an error while trying to send this user a DM: ${e}`));
    }
    await (await interaction.guild.members.fetch(uID) as Discord.GuildMember).kick("Failed");
    return await interaction.editReply(functions.embedMaker(interaction.user, "Success", `I have successfully kicked this user`));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("failk")
    .setDescription("Kicks a user with a fail message")
    .addStringOption(option => option.setName("id").setDescription("The id of the person to kick").setRequired(true));