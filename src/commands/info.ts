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
        .setName("info")
        .setDescription("Information about Desipher"),
    dms: true,
    async execute(interaction: CommandInteraction, client?: DiscordClient) {
        let totalSeconds = interaction.client.uptime! / 1000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Desipher Bot Information")
                    .setDescription(
                        "Here you will find detailed statistics of Desipher.",
                    )
                    .addFields([
                        {
                            name: "Guilds",
                            value: `${interaction.client.guilds.cache.size} guilds`,
                        },
                        {
                            name: "Uptime",
                            value: `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`,
                        },
                        {
                            name: "Version",
                            value: "2.0.6",
                        },
                        {
                            name: "Bot Latency",
                            value: `${Math.round(
                                interaction.client.ws.ping,
                            )}ms`,
                        },
                        {
                            name: "Shards",
                            value: `${interaction.guild?.shardId}/${interaction.client.ws.shards.size}`,
                        },
                    ]),
            ],
        });
    },
};

export default Payload;
