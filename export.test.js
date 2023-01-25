const { ConfigFile, createExportClient } = require('./export');

const client = createExportClient();
const configFile = new ConfigFile('./config.xml');

async function startTestClient() {
    await client.connect();
    await configFile.writeToClient(client);
}

async function getRemoteSubdomains() {
    return JSON.parse(await client.get('subdomains'));
}

test('First subdomain is \"http://secureline.tools.avast.com\"', async() => {
    await startTestClient();

    const remoteSubdomains = await getRemoteSubdomains();
    expect(remoteSubdomains[0]).toBe('http://secureline.tools.avast.com');

    await client.disconnect();
});

test('Second subdomain is \"http://gf.tools.avast.com\"', async() => {
    await startTestClient();

    const remoteSubdomains = await getRemoteSubdomains();
    expect(remoteSubdomains[1]).toBe('http://gf.tools.avast.com');

    await client.disconnect();
});

test('Third subdomain is \"http://files.avast.com\"', async() => {
    await startTestClient();

    const remoteSubdomains = await getRemoteSubdomains();
    expect(remoteSubdomains[2]).toBe('http://files.avast.com');

    await client.disconnect();
});

test('The cookie value at \"cookie:dlp-avast:amazon\" was \"mmm_amz_dlp_777_ppc_m\"', async() => {
    await startTestClient();

    const remoteCookieValue = await client.get('cookie:dlp-avast:amazon');
    expect(remoteCookieValue).toBe('mmm_amz_dlp_777_ppc_m');

    await client.disconnect();
});

test('The cookie value at \"cookie:dlp-avast:baixaki\" was \"mmm_bxk_dlp_777_ppc_m\"', async() => {
    await startTestClient();

    const remoteCookieValue = await client.get('cookie:dlp-avast:baixaki');
    expect(remoteCookieValue).toBe('mmm_bxk_dlp_777_ppc_m');

    await client.disconnect();
});

test('The cookie value at \"cookie:dlp-avast:computerbuild\" was \"mmm_cbd_dlp_777_ppc_m\"', async() => {
    await startTestClient();

    const remoteCookieValue = await client.get('cookie:dlp-avast:computerbuild');
    expect(remoteCookieValue).toBe('mmm_cbd_dlp_777_ppc_m');

    await client.disconnect();
});