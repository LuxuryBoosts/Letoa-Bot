import {
    ButtonInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import { DoNotBackupOptions } from "../utils/types";
import DatabaseClient from "../clients/DatabaseClient";
import { MemoryCache } from "../clients/MemoryCache";
import { createBackup } from "../utils/Backup";
import {
    fetchPremiumBackupLimit,
    fetchPremiumMessagesCap,
} from "../utils/PremiumUtils";

export async function button(
    interaction: ButtonInteraction,
    cache: MemoryCache,
) {
    if (!interaction.customId.includes("start_backup")) return;

    const availableOptions: DoNotBackupOptions[] = [
        "bans",
        "channels",
        "emojis",
        "messages",
        "roles",
        "members",
    ];

    const guildId = interaction.customId.split("start_backup_")[1];
    const guild = interaction.client.guilds.cache?.get(guildId);
    const options = (await cache.getItem(
        `backup_options_${guildId}`,
    )) as string;

    const parsed = options
        ? JSON.parse(String(options))
        : {
              options: availableOptions,
          };

    const account = await DatabaseClient.logins.findOne({
        discordId: interaction.user.id,
    });

    const backups = await DatabaseClient.backups.find({
        accountID: account.accountID,
    });

    if (backups.length >= fetchPremiumBackupLimit(account.premiumLevel)) {
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setURL("https://desipher.io/premium")
                .setEmoji("⭐")
                .setLabel("Premium")
                .setStyle("LINK"),
        );

        return await interaction.editReply({
            content:
                "You have exceeded your max amount of backups.\nPlease consider purchasing a higher premium tier or **delete** a previous backup.",
            components: [row],
        });
    }

    let doNotBackup: Array<string | null> = availableOptions.map(
        (option: string) => {
            if (!parsed.options.includes(option)) {
                return option;
            } else {
                return null;
            }
        },
    );

    doNotBackup = doNotBackup.filter((el) => el !== null);

    if (!guild || !account) return;

    await interaction.deferReply({
        ephemeral: true,
    });

    createBackup(guild, {
        doNotBackup,
        maxMessagesPerChannel: fetchPremiumMessagesCap(account.premiumLevel),
        backupID: null,
        accountID: account.accountID,
        overrideBackup: parsed.options.includes("overwrite"),
        cache: cache,
    }).then((backup) => {
        return interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Backed Up Server")
                    .setDescription(
                        `We have successfully backed up your server.\nYour backup will be linked to your Desipher account (${account.username})`,
                    )
                    .setFooter({ text: "Desipher" })
                    .setTimestamp(),
            ],
        });
    });
}
