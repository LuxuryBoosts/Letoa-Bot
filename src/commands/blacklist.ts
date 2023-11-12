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
import { Emojis } from "../utils/Emojis";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklist")
        .setDefaultPermission(false)
        .addSubcommand((sub) =>
            sub
                .setName("desiper_account")
                .setDescription("Blacklist a Desipher Account")
                .addUserOption((o) =>
                    o
                        .setName("user")
                        .setDescription(
                            "The user linked to the Desipher Account.",
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
    dms: false,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
        });

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

        const sub = interaction.options.getSubcommand();
        if (sub === "desipher_account") {
            const s = interaction.options.getUser("user", true);
            const account = await DatabaseClient.logins.findOne({
                discordId: s.id,
            });
            if (!account) {
                return await interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("No Account Found")
                            .setDescription(
                                "We could not find a Desipher Account for the user you have provided.",
                            ),
                    ],
                });
            }

            await DatabaseClient.logins.findOneAndUpdate(
                { discordId: s.id },
                {
                    banned: true,
                },
            );
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Desipher Account Bannned")
                        .setDescription(
                            `We have successfully banned the user you have provided.`,
                        )
                        .addFields([
                            {
                                name: "Account ID",
                                value: `${account.accountID}`,
                            },
                            {
                                name: "Desipher Username",
                                value: `${account.username}`,
                            },
                            {
                                name: "Premium Level",
                                value: `${account.premiumLevel}`,
                            },
                            {
                                name: "Email",
                                value: `${account.email}`,
                            },
                        ]),
                ],
            });
        }
    },
};

export default Payload;
