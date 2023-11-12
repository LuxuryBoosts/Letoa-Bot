import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} from "discord.js";
import DatabaseClient from "../clients/DatabaseClient";
import {
    fetchPremiumBackupLimit,
    fetchPremiumMessagesCap,
} from "../utils/PremiumUtils";
import { CommandType } from "../utils/CommandType";
import { hasAdmin } from "../utils/Permissions";
import { MemoryCache } from "../clients/MemoryCache";
import { DiscordClient } from "../schemas/Client";
import { isStaff } from "../utils/Utils";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("error")
        .setDescription("Get the description of an error")
        .addStringOption((option) =>
            option
                .setName("code")
                .setDescription("The error code provided")
                .setRequired(true),
        ),
    dms: false,
    hidden: true,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
        });

        const staff = await isStaff(interaction.client, interaction.user.id);

        const errorCode = interaction.options.getString("code", true);

        if (!staff) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("You do not have permissions")
                        .setDescription(
                            "You do not have permissions to run this command.",
                        )
                        .setTimestamp(),
                ],
            });
        }

        const error = await DatabaseClient.errors.findOne({ errorCode });

        if (!error) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Invalid Error Code")
                        .setDescription(
                            "We could not find the error code provided.",
                        )
                        .setTimestamp(),
                ],
            });
        }

        return interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Error Information")
                    .setDescription(
                        "Some details about the Error Code provided",
                    )
                    .addFields([
                        {
                            name: "Guild",
                            value: `${
                                interaction.client.guilds.cache.get(
                                    error.data.guildId,
                                )
                                    ? interaction.client.guilds.cache.get(
                                          error.data.guildId,
                                      )?.name
                                    : "Invalid Guild"
                            } - ${error.data.guildId}`,
                        },
                        {
                            name: "Author",
                            value: `<@${error.data.authorId}>${error.data.authorId}`,
                        },
                        {
                            name: "Error Information",
                            value: `${error.data.error}`,
                        },
                    ])
                    .setTimestamp(),
            ],
        });
    },
};

export default Payload;
