import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { hasAdmin } from "../utils/Permissions";
import DatabaseClient from "../clients/DatabaseClient";
import { CommandType } from "../utils/CommandType";
import { Emojis } from "../utils/Emojis";

const Payload: CommandType = {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("Link your current server to your Desipher account"),
    dms: false,
    async execute(interaction: CommandInteraction) {
        const account = await DatabaseClient.logins.findOne({
            discordId: interaction.user.id,
        });

        if (!account) {
            return await interaction.reply({
                content: `${Emojis.warn} It appears you do not have your Desipher account linked to your discord account. You may link them here: https://desipher.io/link/discord`,
                ephemeral: true,
            });
        }

        if (!hasAdmin(interaction)) {
            return await interaction.reply({
                content: `${Emojis.deny} You do not own this server. This means you can not link this server to your Desipher account.`,
                ephemeral: true,
            });
        }

        let guild = await DatabaseClient.guilds.findOne({
            id: interaction.guild?.id,
        });

        if (!guild)
            guild = await DatabaseClient.guilds.create({
                id: interaction.guild?.id,
            });

        if (guild && guild.accountId !== account.accountId) {
            return await interaction.reply({
                content: `${Emojis.warn} It appears this guild is already linked to someone else...`,
                ephemeral: true,
            });
        }

        await DatabaseClient.guilds.findOneAndUpdate({
            id: interaction.guild?.id,
            accountID: account.accountID,
        });

        await interaction.reply({
            content: `${Emojis.approve} Linked guild successfully. You may visit your linked guilds here: https://desipher.io/dashboard/account/users`,
            ephemeral: true,
        });
    },
};

export default Payload;
