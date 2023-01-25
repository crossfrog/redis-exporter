const { ConfigFile, createExportClient } = require('./export.js');

async function main() {
    const client = createExportClient();
    await client.connect();

    client.on('error', (err) => {
        console.log('Error: ' + err);
    });

    client.on('connect', () => {
        console.log('Connected!');
    });

    const args = process.argv;

    let printKeys = false;

    if (process.argv.includes('-v')) {
        printKeys = true;

        const argIndex = args.indexOf('-v');
        
        if (argIndex != -1) {
            args.splice(argIndex, 1);
        }
    }

    try {
        const configFile = new ConfigFile(args[args.length - 1]);
        await configFile.writeToClient(client);

        if (printKeys) {
            console.log(configFile.getString());
        }
    }
    catch (err) {
        console.log(err);
    }
    
    client.disconnect();
}

main();