import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { MemoryCache } from "../clients/MemoryCache";
import { DiscordClient } from "../schemas/Client";
import DatabaseClient from "../clients/DatabaseClient";
import { CommandType } from "../utils/CommandType";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("opt")
        .setDescription("Opt in or out for end-user-data collection")
        .addSubcommand((sub) =>
            sub
                .setName("in")
                .setDescription(
                    "Opt in on end-user-data collection. (If you have previously opt-out)"
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("out")
                .setDescription("Opt out on end-user collection.")
                .addStringOption((option) =>
                    option
                        .setName("reason")
                        .setRequired(false)
                        .setDescription("Reasoning for opting out.")
                )
        ),
    dms: true,
    async execute(
        interaction: CommandInteraction,
        client: DiscordClient,
        cache: MemoryCache
    ) {
        const sub = interaction.options.getSubcommand();
        switch (sub) {
            case "in":
                const to = await DatabaseClient.opts.findOne({
                    discordId: interaction.user.id,
                });

                if (!to) {
                    return await interaction.reply({
                        content:
                            "You have not opt out! If you want to opt out. Run the command `/opt out`.",
                        ephemeral: true,
                    });
                }

                await DatabaseClient.opts.findOneAndDelete({
                    discordId: interaction.user.id,
                });

                cache.deleteItem(`opt_out_${interaction.user.id}`);

                await interaction.reply({
                    content:
                        "You have successfully opt back in. If you want to opt back out, run the command `/opt out`.",
                    ephemeral: true,
                });

                break;
            case "out":
                const t = await DatabaseClient.opts.findOne({
                    discordId: interaction.user.id,
                });
                if (t) {
                    return await interaction.reply({
                        content:
                            "You have already opt out! If you want to opt back in. Run the command `/opt in`.",
                        ephemeral: true,
                    });
                }

                await DatabaseClient.opts.create({
                    discordId: interaction.user.id,
                    reason: interaction.options.getString("reason", false),
                });

                cache.setItem(
                    `opt_out_${interaction.user.id}`,
                    JSON.stringify({
                        id: interaction.user.id,
                    })
                );

                await interaction.reply({
                    content:
                        "You have successfully opt out. If you want to opt back in, run the command `/opt in`.",
                    ephemeral: true,
                });
                break;
            default:
                break;
        }
    },
};

export default Payload;
