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
        .setName("linked-guilds")
        .setDescription(
            "Display all the guilds your account is authorized to.",
        ),
    dms: true,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
        });

        const guilds: any = await DatabaseClient.members.find({
            discordId: interaction.user.id,
        });

        const final = [];

        for (let guild of guilds) {
            const o = await DatabaseClient.guilds.findOne({ id: guild.guild });
            final.push(
                `${o ? o.name : "Unknown Server Name"} - ${guild.guild}`,
            );
        }

        const embed = new MessageEmbed()
            .setTitle("Linked Guilds")
            .setDescription(final.join("\n"))
            .setFooter({
                text: "Desipher - To unauthorize from a server, run the command /unauthorize",
            })
            .setTimestamp();

        return await interaction.editReply({
            embeds: [embed],
        });
    },
};

export default Payload;
