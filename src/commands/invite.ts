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

const Payload: CommandType = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite Desipher to your server"),
    dms: true,
    async execute(interaction: CommandInteraction, client?: DiscordClient) {
        await interaction.deferReply({
            ephemeral: true,
        });

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`${interaction.client.user?.username} Invites`)
                    .addFields([
                        {
                            name: "Bot",
                            value: "https://desipher.io/bot",
                            inline: false,
                        },
                        {
                            name: "Support",
                            value: "https://desipher.io/discord",
                            inline: false,
                        },
                    ])
                    .setFooter({ text: "Desipher" })
                    .setTimestamp(),
            ],
        });
    },
};

export default Payload;
