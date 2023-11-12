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

const Payload = {
    data: new SlashCommandBuilder()
        .setName("unauthorize")
        .setDescription("Remove permissions from restoring to a server")
        .addStringOption((option) =>
            option
                .setName("guild_id")
                .setDescription(
                    "The guild id of where you would like to unauthorize",
                )
                .setRequired(true),
        ),
    dms: true,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
        });

        const guild = interaction.options.getString("guild_id")
            ? interaction.options.getString("guild_id")
            : interaction.guild?.id;

        if (!guild) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Invalid Guild")
                        .setDescription(
                            "The guild you have provided was invalid. Please make sure you input the right `Guild ID`.",
                        )
                        .setFooter({ text: "Desipher" })
                        .setTimestamp(),
                ],
            });
        }

        const g = await DatabaseClient.members.findOne({
            guild: guild,
            discordId: interaction.user.id,
        });

        if (!g) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Not Authorized")
                        .setDescription(
                            "It appears you have not verified in that guild you specified. Please try again, but with a different `Guild ID`",
                        )
                        .setFooter({ text: "Desipher" })
                        .setTimestamp(),
                ],
            });
        }

        await DatabaseClient.members.deleteOne({
            guild: guild,
            discordId: interaction.user.id,
        });

        return await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Successfully UnAuthorized!")
                    .setDescription(
                        "We have successfully unauthorized you from being joined to any of these servers.",
                    )
                    .setFooter({ text: "Desipher" })
                    .setTimestamp(),
            ],
        });
    },
};

export default Payload;
