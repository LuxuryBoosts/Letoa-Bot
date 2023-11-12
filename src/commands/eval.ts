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
import { inspect } from "util";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Eval a script of code.")
        .setDefaultPermission(false)
        .addStringOption((option) =>
            option
                .setName("code")
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

        const code = interaction.options.getString("code", true);

        try {
            const result = await eval(code);
            let output = result;

            if (typeof result !== "string") {
                output = inspect(result);
            }

            return interaction.editReply({
                content: `\`\`\`xl\n${output}\n\`\`\``,
            });
        } catch (err) {
            return interaction.editReply({
                content: `\`\`\`xl\nERROR!\n${err}\n\`\`\``,
            });
        }
    },
};

export default Payload;
