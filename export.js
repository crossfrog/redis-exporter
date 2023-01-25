const fs = require('fs');
const redis = require('redis');
const xml2json = require('xml2json');

class ConfigFile {
    readFromFile(filePath) {
        const xmlData = fs.readFileSync(filePath);
        const parsedXml = JSON.parse(xml2json.toJson(xmlData));

        this.subdomains = parsedXml['config']['subdomains']['subdomain'];
        this.cookies = parsedXml['config']['cookies']['cookie'];
    }

    async writeToClient(client) {
        await client.set('subdomains', JSON.stringify(this.subdomains));

        for (let i = 0; i < this.cookies.length; i++) {
            const cookie = this.cookies[i];
            
            const key = getCookieKey(cookie);
            await client.set(key, cookie['$t']);
        }
    }

    getString() {
        let result = `\"subdomains\": ${JSON.stringify(this.subdomains)}\n`;

        for (let i = 0; i < this.cookies.length; i++) {
            let cookie = this.cookies[i];

            if (i > 0) {
                result += '\n';
            }

            result += `\"${getCookieKey(cookie)}\": \"${cookie['$t']}\"`;
        };

        return result;
    }

    constructor(filePath) {
        this.readFromFile(filePath);
    }
}

function getCookieKey(cookie) {
    return `cookie:${cookie['name']}:${cookie['host']}`;
}

function createExportClient() {
    return redis.createClient({
        url: 'redis://default:redispw@localhost:32769'
    });
}

module.exports = { ConfigFile, createExportClient };