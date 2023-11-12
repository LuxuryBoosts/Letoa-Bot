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
        .setName("help")
        .setDescription("View all the commands"),
    dms: true,
    async execute(interaction: CommandInteraction, client?: DiscordClient) {
        await interaction.deferReply({
            ephemeral: true,
        });

        const data: string[] = [];
        const commands = client?.commands.filter((e) => !e.hidden);

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Website")
                .setStyle("LINK")
                .setURL("https://desipher.io"),
            new MessageButton()
                .setLabel("Support")
                .setStyle("LINK")
                .setURL("https://discord.desipher.io"),
        );

        commands?.map((cmd) => {
            data.push(`**/${cmd.data.name}** : ${cmd.data.description}`);
        });

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle(
                        `${interaction.client.user?.username} Command List`,
                    )
                    .setDescription(data.join("\n\n"))
                    .setFooter({ text: "Desipher" })
                    .setTimestamp(),
            ],
            components: [row],
        });
    },
};

export default Payload;
