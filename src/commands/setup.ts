import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import DatabaseClient from "../clients/DatabaseClient";
import { CommandType } from "../utils/CommandType";
import http from "http";
import axios from "axios";
import { LetoaChannel } from "../schemas/Channel";
import { hasAdmin } from "../utils/Permissions";

const Payload = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Send a verification message to the selected channel")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel where the message will be sent")
                .setRequired(true),
        ),
    async execute(interaction: CommandInteraction) {
        if (!hasAdmin(interaction)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true,
            });
        }

        const account = await DatabaseClient.logins.findOne({
            discordId: interaction.user.id,
        });

        if (!account) {
            return await interaction.editReply({
                content:
                    "It appears you do not have your Desipher account linked to your discord account. You may link it here: https://desipher.io/link/discord",
            });
        }

        let channel = interaction.options.getChannel("channel", true);
        if (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") {
            return interaction.reply({
                content:
                    "Invalid Channel! Do not choose a category or a voice channel.",
            });
        }

        const c = channel as LetoaChannel;

        const config = await DatabaseClient.getConfig({
            id: interaction.guildId,
        });

        try {
            const link = new MessageActionRow().addComponents(
                new MessageButton()
                    .setURL(
                        `https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https://desipher.io/verification&scope=identify%20guilds%20guilds.join&client_id=1057147856781328455&state=${interaction.guildId}`,
                    ) // add proper url
                    .setEmoji("✅")
                    .setLabel(
                        account.premiumLevel >= 1 && config.inAppButtonText
                            ? config.inAppButtonText
                            : "Verify",
                    )
                    .setStyle("LINK"),
            );
            c.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Desipher Verification")
                        .setDescription(
                            account.premiumLevel >= 1 &&
                                config.inAppCustomMessage
                                ? config.inAppCustomMessage
                                : "Click the verify button and authorize the bot to receive the **Verification Role** and access to the rest of the server.",
                        )
                        .setTimestamp()
                        .setImage(
                            account.premiumLevel >= 1 && config.inAppCustomImage
                                ? config.inAppCustomImage
                                : "https://www.luxuryservices.cc/banner_for_desipher.gif",
                        )
                        .setColor(
                            account.premiumLevel >= 1 && config.inAppEmbedColor
                                ? config.inAppEmbedColor
                                : 3830487,
                        ),
                ],
                components: [link],
            });
        } catch (e) {
            console.error(e);
        }
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Sent Verification Message")
                    .setDescription(
                        `We have successfully sent the verification message to <#${c.id}>.`,
                    )
                    .setTimestamp()
                    .setFooter({ text: "Desipher" }),
            ],
            ephemeral: true,
        });
    },
};

export default Payload;
