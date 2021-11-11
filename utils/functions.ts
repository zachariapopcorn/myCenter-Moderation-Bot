import Discord = require('discord.js');
import axios = require('axios');

import { Arguements } from "./classes";
import * as db from "./databaseHandler";

let subDomainApi = "https://darkbrightapi.my-center.net/staff/mod/subdomains";
let reportedApplicationsApi = "https://darkbrightapi.my-center.net/staff/mod/reports";
let checkBanApi = "https://darkbrightapi.my-center.net/bans?noCache=true&RobloxId=";
let banUserApi = "https://darkbrightapi.my-center.net/staff/mod/bans"

let userCookie = process.env.mycenterToken;

let args = [];

type firebaseLogTypes = "discord" | "reportedApps" | "subdomains"

async function request(data: {url : string, method? : string, headers? : any, body? : any}) {
    let axiosClient = axios.default;
    let responseData : axios.AxiosResponse;
    try {
        responseData = await axiosClient({
            url: data.url,
            method: (data.method || "GET") as axios.Method,
            headers: {
                "Content-Type": "application/json",
                cookie: userCookie,
                ...data.headers
            },
            data: data.body || {}
        });
    } catch(e) {
        throw e;
    }
    return responseData.data;
}

export function embedMaker(author : Discord.User, title : string, description : string) {
    let embed = new Discord.MessageEmbed();
    embed.setColor(process.env.embedColor as Discord.ColorResolvable);
    embed.setAuthor(author.tag, author.displayAvatarURL());
    embed.setTitle(title);
    embed.setDescription(description);
    embed.setFooter('myCenter Moderation Bot - Created by zachariapopcorn#8105');
    let object = {
        embeds: [embed],
        components: []
    };
    return object;
}

export function addButton(messageData : any, id : string, label : string, style : Discord.MessageButtonStyleResolvable) {
    let components = messageData.components || [];
    let newComponent = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId(id).setLabel(label).setStyle(style));
    components.push(newComponent);
    messageData.components = components;
}

export function getArguements(interaction : any) {
    let options = interaction.options.data;
    let array = [];
    for(let i = 0; i < options.length; i++) {
        let arguement = new Arguements(options[i].name, options[i].value);
        array.push(arguement);
    }
    args = array;
    return array;
}

export function getArguement(name : string) {
    name = name.toLowerCase();
    for(let i = 0; i < args.length; i++) {
        if(args[i].name === name) {
            return args[i].value;
        }
    }
    return null;
}

export function checkPermissions(interaction : any, file : any) {
    if(interaction.user.id === "465362236693807115") return true;
    let ranks = file.ranks || ["@everyone"];
    let guilds = ["693156892956033086"];
    if(guilds.find(id => id === interaction.guild.id)) {
        if(interaction.member.roles.cache.some(r => ranks.includes(r.name))) {
            return true;
        }
    }
    return false;
}

export async function addStaff(staffId : string) {
    try {
        await db.create("users", staffId, {
            logs: {
                discord: 0,
                reportedApps: 0,
                subdomains: 0
            },
            strikes: []
        });
    } catch(e) {
        throw e;
    }
}

export async function removeStaff(staffId : string) {
    try {
        await db.del("users", staffId);
    } catch(e) {
        throw e;
    }
}

export async function updateLogs(staffId : string, logType : firebaseLogTypes) {
    let userLogs
    let userStrikes
    try {
        userLogs = await db.get("users", staffId, "logs");
        userStrikes = await db.get("users", staffId, "strikes");
    } catch(e) {
        throw e;
    }
    userLogs[logType] += 1;
    try {
        await db.set("users", staffId, {
            logs: userLogs,
            strikes: userStrikes
        });
    } catch(e) {
        throw e;
    }
}

export async function getLogs(staffId : string) {
    let userLogs
    try {
        userLogs = await db.get("users", staffId, "logs");
    } catch(e) {
        throw e;
    }
    return userLogs;
}

export async function resetLogs(staffId : string) {
    let userLogs
    let userStrikes
    try {
        userLogs = await db.get("users", staffId, "logs");
        userStrikes = await db.get("users", staffId, "strikes");
    } catch(e) {
        throw e;
    }
    userLogs.discord = 0;
    userLogs.reportedApps = 0;
    userLogs.subdomains = 0;
    try {
        await db.set("users", staffId, {
            logs: userLogs,
            strikes: userStrikes
        });
    } catch(e) {
        throw e;
    }
}

export async function addStrike(author : string, staffId : string, reason : string) {
    let userLogs
    let userStrikes
    try {
        userLogs = await db.get("users", staffId, "logs");
        userStrikes = await db.get("users", staffId, "strikes");
    } catch(e) {
        throw e;
    }
    userStrikes.push({
        author: author,
        id: Math.floor(Math.random() * (999999 - 100000 + 1) + 100000),
        reason: reason
    });
    try {
        await db.set("users", staffId, {
            logs: userLogs,
            strikes: userStrikes
        });
    } catch(e) {
        throw e;
    }
}

export async function removeStrike(staffId : string, strikeId : number) {
    let userLogs
    let userStrikes
    try {
        userLogs = await db.get("users", staffId, "logs");
        userStrikes = await db.get("users", staffId, "strikes");
    } catch(e) {
        throw e;
    }
    userStrikes = userStrikes.filter(strike => strike.id !== strikeId);
    try {
        await db.set("users", staffId, {
            logs: userLogs,
            strikes: userStrikes
        });
    } catch(e) {
        throw e;
    }
}

export async function getStrikes(staffId : string) {
    let userStrikes
    try {
        userStrikes = await db.get("users", staffId, "strikes");
    } catch(e) {
        throw e;
    }
    return userStrikes;
}

export async function getUserBanData(rbxID : number) {
    let responseData = await request({url: `${checkBanApi}${rbxID}`});
    return responseData;
}

async function filterApplications(apps) {
    let rApps = [];
    for(let i = 0; i < apps.length; i++) {
        let app = apps[i];
        let id = Number(app.RobloxId);
        let banData = await getUserBanData(id);
        if(!banData.globally_banned) rApps.push(app);
    }
    return rApps;
}

export async function getReportedApps(filter?: boolean) {
    if(!filter) filter = true;
    let responseData = await request({url: reportedApplicationsApi});
    if(filter) {
        responseData.result = filterApplications(responseData.result);
    }
    return responseData.result;
}

export async function deleteReportedApp(resID: string) {
    try {
        await request({
            url: reportedApplicationsApi,
            method: "DELETE",
            body: {
                responseId: resID
            }
        });
    } catch(e) {
        throw e;
    }
}

export async function banUser(rbxID: number, reason: string) {
    try {
        await request({
            url: banUserApi,
            method: "POST",
            body: {
                robloxId: rbxID,
                reason: reason
            }
        })
    } catch(e) {
        throw e;
    }
}

export async function getSubdomains() {
    let responseData = await request({url: subDomainApi});
    return responseData.subdomains;
}

export async function acceptSubdomain(domainName: string) {
    let subdomains;
    try {
        subdomains = await getSubdomains();
    } catch(e) {
        throw e;
    }
    let subdomainObject = subdomains.find(v => v.Subdomain === domainName);
    if(subdomainObject) {
        try {
            await request({
                url: subDomainApi,
                method: "PUT",
                body: {
                    status: "accept",
                    centerId: subdomainObject.CenterId,
                    subdomain: subdomainObject.Subdomain
                }
            });
        } catch(e) {
            throw e;
        }
    }
}

export async function denySubdomain(domainName: string) {
    let subdomains;
    try {
        subdomains = await getSubdomains();
    } catch(e) {
        throw e;
    }
    let subdomainObject = subdomains.find(v => v.Subdomain === domainName);
    if(subdomainObject) {
        try {
            await request({
                url: subDomainApi,
                method: "PUT",
                body: {
                    status: "deny",
                    centerId: subdomainObject.CenterId,
                    subdomain: subdomainObject.Subdomain
                }
            });
        } catch(e) {
            throw e;
        }
    }
}