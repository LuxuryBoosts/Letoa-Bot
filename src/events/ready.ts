import { Client } from "discord.js";
import fs from "fs";
import { DiscordClient } from "../schemas/Client";
import { production } from "../start";

export async function ready(this: DiscordClient) {
    console.log("[BOT] Logged into discord as ", this.user?.username);

    // for (let i = 0; i > this.ws.shards.size; i++) {
    //     this.user?.setActivity({
    //         type: "LISTENING",
    //         name: `letoa.me | /help | Shard: ${this.ws.shards.toJSON()[i].id}`,
    //         shardId: this.ws.shards.toJSON()[i].id,
    //     });
    // }

    // this.shard?.broadcastEval((c) => {
    //     c.user?.setActivity({
    //         type: "LISTENING",
    //         name: "letoa.me | /help",
    //     });
    // });

    // this.user?.setActivity({
    //     type: "LISTENING",
    //     name: "letoa.me | /help",
    // });

    const commands = [];

    const commandFiles = fs
        .readdirSync(
            process.env.NODE_ENV === "production"
                ? "./dist/commands"
                : "./src/commands",
        )
        .filter((file) =>
            file.endsWith(
                process.env.NODE_ENV === "production" ? ".js" : ".ts",
            ),
        );

    for (const file of commandFiles) {
        const cmd = require(`../commands/${file}`);
        this.commands.set(cmd.default.data.name, cmd.default);
        commands.push(cmd.default.data.toJSON());
    }

    console.log("[Commands] Loading commands. Production: ", production);

    try {
        if (production) {
            const cc = await this.application?.commands.set(commands);
            console.log(
                `[Commands] Successfully loaded ${commands.length} commands.`,
            );
            // for (let s of cc!.toJSON()) {
            //     if (s.defaultPermission !== true) {
            //         const permissions = this.commands.get(s.name)
            //             .permissions as Array<any> | undefined;
            //         if (!permissions) continue;
            //         // const ccc = await this.application?.commands.fetch(s.id);
            //         // await ccc?.permissions.set({
            //         //     permissions,
            //         //     guild: "882029568406466570",
            //         // });
            //         console.log(`Updated ${s.name} (/) permissions`);
            //     }
            // }
        } else {
            const cc = await this.guilds.cache
                .get("944842625213685761")
                ?.commands.set(commands);
            // for (let s of cc!.toJSON()) {
            //     if (s.defaultPermission !== true) {
            //         const permissions = this.commands.get(s.name)
            //             .permissions as Array<any> | undefined;
            //         if (!permissions) continue;
            //         await this.guilds.cache
            //             .get("882029568406466570")
            //             ?.commands.cache.get(s.id)
            //             ?.permissions.set({ permissions });
            //         console.log(`Updated ${s.name} (/) permissions`);
            //     }
            // }
            console.log(
                `[Commands] Successfully loaded ${commands.length} commands.`,
            );
        }
    } catch (e) {
        console.error(`[Commands] Failed to load ${commands.length} commands.`);
        console.error(e);
    }
}
