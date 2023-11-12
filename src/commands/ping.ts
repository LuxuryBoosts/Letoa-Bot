import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import DatabaseClient from "../clients/DatabaseClient";
import { CommandType } from "../utils/CommandType";
import http from "http";
import axios from "axios";
import fetch from "node-fetch";

const getDurationInMilliseconds = (start: any) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const Payload = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Displays the ping of the bot and website"),
    dms: true,
    async execute(interaction: CommandInteraction) {
        const start = process.hrtime();
        await fetch("https://desipher.io");
        const finish = getDurationInMilliseconds(start);
        return await interaction.reply({
            embeds: [
                new MessageEmbed().setTitle("Desipher Ping").addFields([
                    {
                        name: "Bot Ping",
                        value: `${Math.round(interaction.client.ws.ping)}ms`,
                        inline: true,
                    },
                    {
                        name: "Website Ping",
                        value: `${Math.floor(finish)} ms`,
                        inline: true,
                    },
                ]),
            ],
        });
    },
};

export default Payload;
