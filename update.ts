import utils = require('util');
import axios = require('axios');
import * as fs from 'fs/promises'

const axiosClient = axios.default;

const exclusions = [];

const API_URL = "https://api.github.com/repos/zachariapopcorn/myCenter-Moderation-Bot/contents";

async function getFiles(folder: string) {
    console.log(`\nGetting files for ${folder}`);
    let files;
    try {
        let res = await axiosClient({
            url: `${API_URL}/${folder}`,
            method: "GET"
        });
        files = JSON.parse(JSON.stringify(res.data));
    } catch(e) {
        throw e;
    }
    for(let i = 0; i < files.length; i++) {
        if(isFolder(files[i])) {
            try {
                await fs.mkdir(files[i].path, {recursive: true});
                await getFiles(files[i].path);
            } catch(e) {
                throw e;
            }
        } else {
            let name = files[i].name;
            if(!exclusions.find(v => v === name)) {
                try {
                    console.log(`Writing file ${files[i].path}`);
                    let res = await axiosClient({
                        url: files[i].download_url,
                        method: "GET"
                    });
                    let fileContent = res.data;
                    await fs.writeFile(files[i].path, fileContent);
                } catch(e) {
                    throw e;
                }
            } else {
                console.log(`Skipped file ${files[i].path}`);
            }
        }
    }
}

function isFolder(data: any) {
    if(data.download_url) {
        return false;
    } else {
        return true;
    }
}



getFiles("/").then(val => {
    console.log("Successfully updated bot files");
}).catch(e => {
    console.log(`Oops! There was an error while attempting to update the bot files: ${e}`);
});
