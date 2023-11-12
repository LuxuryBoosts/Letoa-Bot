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

const Payload: CommandType = {
    data: new SlashCommandBuilder()
        .setName("restore")
        .setDescription("Gain the ability to restore your server"),
    dms: false,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
        });

        if (!hasAdmin(interaction)) {
            return interaction.editReply({
                content: "You do not have permission to use this command.",
            });
        }

        const account = await DatabaseClient.logins.findOne({
            discordId: interaction.user.id,
        });
        if (!account) {
            return await interaction.reply({
                content:
                    "It appears you do not have your Desipher account linked to your discord account. You may link it here: https://desipher.io/link/discord",
                ephemeral: true,
            });
        }

        const backups = await DatabaseClient.backups.find({
            accountID: account.accountID,
        });

        const filtered = [];

        for (let backup of backups) {
            const { name, createdTimestamp, accountID, backup_id } = backup;
            if (!accountID) {
                continue;
            }
            filtered.push({
                backup_id,
                name,
                createdTimestamp,
            });
        }

        const row = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`restore_server_${interaction.guild?.id}`)
                    .setPlaceholder("Select what server you want to restore")
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
            ),
        ];

        await interaction.editReply({
            embeds:
                filtered.length !== 0
                    ? [
                          new MessageEmbed()
                              .setTitle("Select a Backup")
                              .setDescription(
                                  `Select a backup below you would like to restore.\n There are currently ${filtered.length} backups available to your Desipher account.`,
                              )
                              .setFooter({ text: "Desipher" })
                              .setTimestamp(),
                      ]
                    : [
                          new MessageEmbed()
                              .setTitle("Select a Backup")
                              .setDescription(
                                  `It appears you have no backups linked to your Desipher Account.\nStart by using the command \`/backup\` to create one!`,
                              )
                              .setFooter({ text: "Desipher" })
                              .setTimestamp(),
                      ],
            components: filtered.length === 0 ? undefined : row,
        });
    },
};

export default Payload;
