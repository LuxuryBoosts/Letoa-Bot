import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} from "discord.js";
import DatabaseClient from "../clients/DatabaseClient";
import { fetchPremiumMessagesCap } from "../utils/PremiumUtils";
import { CommandType } from "../utils/CommandType";
import { hasAdmin } from "../utils/Permissions";
import { DiscordClient } from "../schemas/Client";
import { generateEmbed } from "../utils/Utils";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("account_info")
        .setDescription("Get information about a Desipher account")
        .setDefaultPermission(false)
        .addSubcommand((sub) =>
            sub
                .setName("account_id")
                .setDescription("Account ID")
                .addStringOption((option) =>
                    option
                        .setName("account_id")
                        .setDescription(
                            "The Account ID of the Desipher Account",
                        )
                        .setRequired(true),
                ),
        )
        .addSubcommand((sub) =>
            sub
                .setName("account_username")
                .setDescription("Username")
                .addStringOption((option) =>
                    option
                        .setName("username")
                        .setDescription("The Username of the Desipher Account")
                        .setRequired(true),
                ),
        )
        .addSubcommand((sub) =>
            sub
                .setName("discord_account")
                .setDescription("Discord Account")
                .addUserOption((option) =>
                    option
                        .setName("discord_account")
                        .setDescription(
                            "The Discord Account of the Desipher Account",
                        )
                        .setRequired(true),
                ),
        ),
    hidden: true,
    permissions: [
        {
            id: "891311138082549810",
            type: "USER",
            permission: true,
        },
    ],
    dm: false,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
        });

        if (interaction.user.id !== "891311138082549810")
            return await interaction.editReply({
                embeds: [
                    generateEmbed(
                        {
                            title: "Error",
                            description:
                                "You do not have permissions to run this command",
                        },
                        "error",
                    ),
                ],
            });

        const sub = interaction.options.getSubcommand();

        if (sub === "account_id") {
            const accountID = interaction.options.getString("account_id");

            const a = await DatabaseClient.logins.findOne({
                accountID,
            });

            if (!a) {
                return await interaction.editReply({
                    embeds: [
                        generateEmbed(
                            {
                                title: "No Account Found",
                                description:
                                    "We could not find a Desipher Account for the account id you have provided.",
                            },
                            "error",
                        ),
                    ],
                });
            }

            return await interaction.editReply({
                embeds: [
                    generateEmbed(
                        {
                            title: `${a.username}`,
                            fields: [
                                {
                                    name: "Registered",
                                    value: `${new Date(a.createdAt)}`,
                                },
                                {
                                    name: "Premium Level",
                                    value: `${a.premiumLevel}`,
                                },
                                {
                                    name: "Email",
                                    value: `${a.email}`,
                                },
                                {
                                    name: "Linked Discord",
                                    value: `${a.discordId}`,
                                },
                                {
                                    name: "Last Login IP",
                                    value: `${a.lastLoginIP}`,
                                },
                                {
                                    name: "Account ID",
                                    value: `${a.accountID}`,
                                },
                            ],
                        },
                        "success",
                    ),
                ],
            });
        } else if (sub === "account_username") {
            const username = interaction.options.getString("username");

            const a = await DatabaseClient.logins.findOne({
                username,
            });

            if (!a) {
                return await interaction.editReply({
                    embeds: [
                        generateEmbed(
                            {
                                title: "No Account Found",
                                description:
                                    "We could not find a Desipher Account for the username you have provided.",
                            },
                            "error",
                        ),
                    ],
                });
            }

            return await interaction.editReply({
                embeds: [
                    generateEmbed(
                        {
                            title: `${a.username}`,
                            fields: [
                                {
                                    name: "Registered",
                                    value: `${new Date(a.createdAt)}`,
                                },
                                {
                                    name: "Premium Level",
                                    value: `${a.premiumLevel}`,
                                },
                                {
                                    name: "Email",
                                    value: `${a.email}`,
                                },
                                {
                                    name: "Linked Discord",
                                    value: `${a.discordId}`,
                                },
                                {
                                    name: "Last Login IP",
                                    value: `${a.lastLoginIP}`,
                                },
                                {
                                    name: "Account ID",
                                    value: `${a.accountID}`,
                                },
                            ],
                        },
                        "success",
                    ),
                ],
            });
        } else if (sub === "discord_account") {
            const acc = interaction.options.getUser("discord_account", true);

            const a = await DatabaseClient.logins.findOne({
                discordId: acc?.id,
            });

            if (!a) {
                return await interaction.editReply({
                    embeds: [
                        generateEmbed(
                            {
                                title: "No Account Found",
                                description:
                                    "We could not find a Desipher Account for the discord account you have provided.",
                            },
                            "error",
                        ),
                    ],
                });
            }

            return await interaction.editReply({
                embeds: [
                    generateEmbed(
                        {
                            title: `${a.username}`,
                            fields: [
                                {
                                    name: "Registered",
                                    value: `${new Date(a.createdAt)}`,
                                },
                                {
                                    name: "Premium Level",
                                    value: `${a.premiumLevel}`,
                                },
                                {
                                    name: "Email",
                                    value: `${a.email}`,
                                },
                                {
                                    name: "Linked Discord",
                                    value: `${a.discordId}`,
                                },
                                {
                                    name: "Last Login IP",
                                    value: `${a.lastLoginIP}`,
                                },
                                {
                                    name: "Account ID",
                                    value: `${a.accountID}`,
                                },
                            ],
                        },
                        "success",
                    ),
                ],
            });
        }
    },
};

export default Payload;
