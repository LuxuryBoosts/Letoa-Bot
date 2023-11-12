import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import DatabaseClient from "../clients/DatabaseClient";
import { CommandType } from "../utils/CommandType";
import http from "http";
import axios from "axios";
import { Emojis } from "../utils/Emojis";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Make the bot leave a server.")
        .setDefaultPermission(false)
        .addStringOption((option) =>
            option
                .setName("server_id")
                .setDescription("The server id of the server")
                .setRequired(true),
        ),
    hidden: true,
    permissions: [
        {
            id: "891311138082549810",
            type: "USER",
            permission: true,
        },
    ],
    dms: false,
    async execute(interaction: CommandInteraction) {
        if (interaction.user.id !== "891311138082549810")
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Error")
                        .setDescription(
                            `${Emojis.deny} You do not have permissions to run this command`,
                        ),
                ],
            });

        const id = interaction.options.getString("server_id", true);
        const guild = interaction.client.guilds.cache.get(id);

        if (!guild) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Error Occurred")
                        .setDescription(
                            `You provided an invalid id of \`${id}\` meaning we cannot leave that server.`,
                        ),
                ],
                ephemeral: true,
            });
        }
        await guild.leave();
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Success")
                    .setDescription(
                        `We have left the server **${guild.name}** - \`${id}\`.`,
                    ),
            ],
            ephemeral: true,
        });
    },
};

export default Payload;
