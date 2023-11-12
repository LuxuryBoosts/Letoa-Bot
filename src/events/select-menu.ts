import {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    SelectMenuInteraction,
} from "discord.js";
import DatabaseClient from "../clients/DatabaseClient";
import { fetchPremiumMessagesCap } from "../utils/PremiumUtils";
import { startRestore } from "../utils/Restore";
import { MemoryCache } from "../clients/MemoryCache";
import { generateErrorCode } from "../utils/Utils";

export async function selectMenuHandler(
    interaction: SelectMenuInteraction,
    cache: MemoryCache,
) {
    const isMenu = interaction.customId.includes("backup_options");
    await interaction.deferUpdate();

    switch (isMenu) {
        case true:
            const values = interaction.values;
            if (await cache.getItem(interaction.customId)) {
                await cache.deleteItem(interaction.customId);
                await cache.setItem(
                    interaction.customId,
                    JSON.stringify({
                        options: values,
                    }),
                );
            } else {
                await cache.setItem(
                    interaction.customId,
                    JSON.stringify({
                        options: values,
                    }),
                );
            }

            const prem = await cache.getItem(
                `premium_level_${interaction.guildId}`,
            );

            const premiumLevel = JSON.parse(String(prem)).level;

            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`backup_options_${interaction.guild?.id}`)
                    .setPlaceholder("Select what you want to backup.")
                    .setMinValues(1)
                    .setMaxValues(7)
                    .addOptions([
                        {
                            label: "Channels",
                            description:
                                "This will backup every channel, including voice, categories and text.",
                            value: "channels",
                            default: values.includes("channels"),
                        },
                        {
                            label: "Roles",
                            description: "This will backup every role",
                            value: "roles",
                            default: values.includes("roles"),
                        },
                        {
                            label: "Messages",
                            description:
                                "This will backup messages in every channel",
                            value: "messages",
                            default: values.includes("messages"),
                        },
                        {
                            label: "Emojis",
                            description: "This will backup every emoji",
                            value: "emojis",
                            default: values.includes("emojis"),
                        },
                        {
                            label: "Bans",
                            description: "This will backup every ban",
                            value: "bans",
                            default: values.includes("bans"),
                        },
                        {
                            label: "Overwrite",
                            description:
                                "This will overwrite any previous backups",
                            value: "overwrite",
                            default: values.includes("overwrite"),
                        },
                        {
                            label: "Member Roles + Nicknames",
                            description:
                                "This will backup member roles and nicknames",
                            value: "members",
                            emoji: "⭐",
                            default:
                                premiumLevel !== 0
                                    ? values.includes("members")
                                    : false,
                        },
                    ]),
            );

            const buttons = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`start_backup_${interaction.guild?.id}`)
                    .setLabel("Start Backup")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId(`cancel_backup_${interaction.guild?.id}`)
                    .setLabel("Cancel Backup")
                    .setStyle("DANGER"),
            );

            await interaction.editReply({
                components: [row, buttons],
            });
            break;
        case false:
            if (interaction.customId.includes("restore_server")) {
                const backup_id = interaction.values[0];
                if (!backup_id) return;
                if (!interaction.guild) return;

                const account = await DatabaseClient.logins.findOne({
                    discordId: interaction.user.id,
                });

                if (!account) return;

                console.log(fetchPremiumMessagesCap(account.premiumLevel));

                startRestore(
                    backup_id,
                    interaction.guild,
                    {
                        maxMessagesPerChannel: fetchPremiumMessagesCap(
                            account.premiumLevel,
                        ),
                    },
                    cache,
                )
                    .then(async () => {
                        try {
                            interaction.user.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle("Restoring Your Server!")
                                        .setDescription(
                                            "We are currently restoring your server.\nIf you have a higher premium plan, it may take longer to restore all the messages.",
                                        )

                                        .setTimestamp()
                                        .setFooter({ text: "Desipher" }),
                                ],
                            });
                        } catch (e) {}
                    })
                    .catch(async (e) => {
                        const errorCode = generateErrorCode();
                        await DatabaseClient.errors.create({
                            errorCode: errorCode,
                            data: {
                                guildId: interaction.guildId,
                                authorId: interaction.user.id,
                                command: "restore",
                                error: `${e}`,
                            },
                        });
                        try {
                            interaction.user.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle("We have ran into an error!")
                                        .setDescription(
                                            `Sorry but we ran into an error!\nError Code: \`${errorCode}\`\nPlease join our [support server](https://discord.desipher.io) and go to the support channel and send a screenshot of this message.`,
                                        )

                                        .setTimestamp()
                                        .setFooter({ text: "Desipher" }),
                                ],
                            });
                        } catch (e) {
                            // TODO: Send a message to the first channel pinging the user?
                        }
                    });

                break;
            } else if (interaction.customId.includes("delete_backup")) {
                const backup_id = interaction.values[0];
                if (!backup_id) return;
                if (!interaction.guild) return;

                const account = await DatabaseClient.logins.findOne({
                    discordId: interaction.user.id,
                });

                if (!account) return;

                await DatabaseClient.backups.deleteOne({
                    backup_id,
                });

                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Success!")
                            .setDescription(
                                `We have successfully deleted your backup! This action is irreversible and cannot be undone.`,
                            )
                            .setTimestamp()
                            .setFooter({ text: "Desipher" }),
                    ],
                    ephemeral: true,
                });
            }
            break;
    }
}
