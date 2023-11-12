import mongoose from "mongoose";
import Guild from "../models/Guild";
import Login from "../models/Login";
import User from "../models/User";
import Opt from "../models/Opt";
import Backups from "../models/Backups";
import Intervals from "../models/Intervals";
import Errors from "../models/Errors";
import Config from "../models/Config";
import Members from "../models/Members";

class DatabaseClient {
    static users = User;
    static logins = Login;
    static guilds = Guild;
    static opts = Opt;
    static config = Config;
    static backups = Backups;
    static intervals = Intervals;
    static errors = Errors;
    static members = Members;

    static connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            mongoose
                .connect(
                    process.env.MONGODB_URI
                        ? process.env.MONGODB_URI
                        : "mongodb://localhost:27017/letoa",
                    {
                        autoCreate: true,
                        bufferCommands: false,
                        user: process.env.MONGO_USERNAME,
                        pass: process.env.MONGO_PASSWORD,
                        authSource: process.env.MONGO_AUTH,
                    },
                )
                .then(() => {
                    console.log("[Gateway] Database connected successfully");
                    return resolve(true);
                })
                .catch((e) => {
                    console.error(
                        `[Gateway] Failed to connect to database. Error: ${e}`,
                    );
                    return reject(e);
                });
        });
    }

    /**
     *
     * @param {Object} data
     * @description
     * ```js
     * this.getInterval({id: "1234567890", enabled: true})
     * ```
     * @returns
     */
    static async getInterval(data: Object) {
        const t = await this.intervals.findOne(data);
        if (!t) return this.intervals.create(data);
        else return t;
    }

    static async getGuild(data: Object) {
        const t = await this.guilds.findOne(data);
        if (!t) return this.guilds.create(data);
        else return t;
    }

    static async getConfig(data: Object) {
        const t = await this.config.findOne(data);
        if (!t) return this.config.create(data);
        else return t;
    }
}

export default DatabaseClient;
