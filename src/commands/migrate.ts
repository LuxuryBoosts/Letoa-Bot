import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import DatabaseClient from "../clients/DatabaseClient";
import { CommandType } from "../utils/CommandType";

const Payload: CommandType = {
    data: new SlashCommandBuilder()
        .setName("migrate")
        .setDescription("Transfer data between bots"),
    dms: false,
    async execute(interaction: CommandInteraction) {
        const account = await DatabaseClient.logins.findOne({
            discordId: interaction.user.id,
        });

        if (!account) {
            return await interaction.reply({
                content:
                    "It appears you do not have your Desipher account linked to your discord account. You may link them here: https://desipher.io/link/discord",
                ephemeral: true,
            });
        }

        if (interaction.guild?.ownerId !== interaction.user.id) {
            return await interaction.reply({
                content:
                    "You do not own this server. This means you can not link this server to your Desipher account.",
                ephemeral: true,
            });
        }

        const guild = await DatabaseClient.getGuild({
            id: interaction.guild?.id,
        });

        if (!guild.premium) {
            return await interaction.reply({
                content:
                    "This server does not have premium, which means we cannot transfer premium to your Desipher account.",
                ephemeral: true,
            });
        }

        const premiumLevel = guild.premiumExpires === 16727954400000 ? 2 : 1;

        await DatabaseClient.logins.findOneAndUpdate(
            {
                discordId: interaction.user.id,
            },
            {
                premiumLevel,
                premiumExpire: guild.premiumExpires,
            },
        );

        return await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Migration Success")
                    .setDescription(
                        `We have successfully transferred your premium to your **Desipher Account.** We applied the premium level **${premiumLevel}** which is the **${
                            premiumLevel === 1 ? "Gold" : "Diamond"
                        } Plan**. This will expire on ${new Date(
                            guild.premiumExpires,
                        ).toUTCString()}`,
                    )
                    .setColor(0x00ff00),
            ],
            ephemeral: true,
        });
    },
};

export default Payload;
