const fs = require('fs').promises;

async function fetchChampionList() {
    const reponse = await fetch('https://ddragon.leagueoflegends.com/cdn/15.3.1/data/en_US/champion.json');
    const json = await reponse.json();

    return Object.keys(json.data);
}

async function fetchChampionDetails(championNames) {
    const championDataPromises = championNames.map(async (name) => {
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/15.3.1/data/en_US/champion/${name}.json`);
        const json = await response.json();

        return json.data[name];
    });

    return Promise.all(championDataPromises);
}

async function writeDataToFile(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile('champion_skins.json', jsonData, 'utf-8');
        console.log('Data written to champion_skins.json');
    } catch (error) {
        console.error('Error writing data to file', error);
    }
}

async function cleanChampionData(championData) {
    const { id, lore, key, blurb, title, skins } = championData;

    const enrichedSkins = skins.map(skin => {
        const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${skin.num}.jpg`;
        return { ...skin, splashUrl };
    });

    return {
        id,
        lore,
        key,
        blurb,
        title,
        skins: enrichedSkins
    };
}

async function main() {
    try {
        const championNames = await fetchChampionList();
        console.log('Fetched champion names');

        const championDetails = await fetchChampionDetails(championNames);

        const cleanedChampionDetails = await Promise.all(championDetails.map(cleanChampionData));

        await writeDataToFile(cleanedChampionDetails);
    } catch (error) {
        console.error('Error fetching data', error);
    }
}

main();