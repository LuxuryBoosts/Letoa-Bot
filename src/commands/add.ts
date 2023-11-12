import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import DatabaseClient from "../clients/DatabaseClient";
import { isStaff } from "../utils/Utils";

function premLevel(num: number) {
    switch (num) {
        case 0:
            return "Free";
        case 1:
            return "Gold";
        case 2:
            return "Diamond";
        case 3:
            return "Platinum";
        default:
            return ":shrug:";
    }
}

const Payload = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add premium to a user")
        .setDefaultPermission(false)
        .addStringOption((option) =>
            option
                .setName("account_id")
                .setDescription("The Account ID of the user.")
                .setRequired(true),
        )
        .addNumberOption((option) =>
            option
                .setName("premium_level")
                .setDescription("The premium level (0,1,2,3).")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(3),
        )
        .addStringOption((option) =>
            option
                .setName("expires_timestamp")
                .setRequired(true)
                .setDescription(
                    "View epochconverter.com to get the timestamp.",
                ),
        ),
    hidden: true,
    dm: true,
    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
        });

        const staff = await isStaff(interaction.client, interaction.user.id);

        if (!staff)
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Error")
                        .setDescription(
                            "You do not have permissions to run this command",
                        ),
                ],
            });

        const account_id = interaction.options.getString("account_id", true);
        const premium_level = interaction.options.getNumber(
            "premium_level",
            true,
        );
        const expires_timestamp = interaction.options.getString(
            "expires_timestamp",
            true,
        );

        const user = await DatabaseClient.logins.findOne({
            accountID: account_id,
        });

        if (!user) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Invalid Account")
                        .setDescription(
                            `We were unable to find an account with the account id: \`${account_id}\`.\nPlease try it again with a correct account id.`,
                        ),
                ],
            });
        }

        await DatabaseClient.logins.findOneAndUpdate(
            {
                accountID: account_id,
            },
            {
                premiumLevel: premium_level,
                premiumExpire: Number(expires_timestamp),
            },
        );

        return interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Success")
                    .setDescription(
                        `We have successfully added ${premLevel(
                            premium_level,
                        )} to \`${account_id}\` and it will expire <t:${Math.floor(
                            Number(expires_timestamp) / 1000,
                        )}>.`,
                    ),
            ],
        });
    },
};

export default Payload;
