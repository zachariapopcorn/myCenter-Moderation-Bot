import Discord = require('discord.js');
import Builders = require('@discordjs/builders');

import * as functions from "../../utils/functions"

export async function run(interaction : Discord.CommandInteraction, client : Discord.Client, args : String[]) {
    return interaction.editReply(functions.embedMaker(interaction.user, "Links", "**Website**: https://my-center.net/\n**Twitter**: https://twitter.com/mycenterrblx\n**Handbook**: https://bit.ly/mCModHandbook\n**Discord Invite**: https://my-center.net/discord\n**Moderation Website**: https://my-center.net/dashboard/moderation"));
}

export let data = new Builders.SlashCommandBuilder()
    .setName("links")
    .setDescription("Gives you important myCenter links")