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
import { Emojis } from "../utils/Emojis";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Delete a server backup from your account"),
    dms: false,
    async execute(
        interaction: CommandInteraction,
        client: DiscordClient,
        cache: MemoryCache,
    ) {
        await interaction.deferReply({
            ephemeral: true,
        });

        const account = await DatabaseClient.logins.findOne({
            discordId: interaction.user.id,
        });

        if (!account) {
            return await interaction.editReply({
                content: `${Emojis.warn} It appears you do not have your Desipher account linked to your discord account. You may link it here: https://desipher.io/link/discord`,
            });
        }

        const backups = await DatabaseClient.backups.find({
            accountID: account.accountID,
        });

        const filtered = [];

        for (let backup of backups) {
            const { name, accountID, createdTimestamp, backup_id } = backup;
            if (!accountID) continue;

            filtered.push({
                name,
                backup_id,
                createdTimestamp,
            });
        }

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`delete_backup_${interaction.user.id}`)
                .setPlaceholder("Select what backup you want to delete")
                .addOptions(
                    filtered.map((v) => {
                        return {
                            label: v.name,
                            description: `This backup was created at ${new Date(
                                v.createdTimestamp,
                            ).toUTCString()}`,
                            value: v.backup_id,
                        };
                    }),
                ),
        );

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Select a Backup")
                    .setDescription(
                        `Select a backup below you would like to delete.\n There are currently ${filtered.length} backups available to your Desipher account.\n**THESE ACTIONS ARE IRREVERSIBLE**`,
                    )
                    .setFooter({ text: "Desipher" })
                    .setTimestamp(),
            ],
            components: [row],
        });
    },
};

export default Payload;
