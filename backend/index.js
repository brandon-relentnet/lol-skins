const fs = require('fs').promises;
const pool = require('./db');
const popuplateDatabase = require('./dbQueries');

const API_VERSION = '15.3.1';
const BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}`;
const CHAMPION_LIST_URL = `${BASE_URL}/data/en_US/champion.json`;
const CHAMPION_DETAILS_URL = (championName) => `${BASE_URL}/data/en_US/champion/${championName}.json`;
const SPLASH_BASE_URL = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash`;

async function fetchChampionList() {
    try {
        const response = await fetch(CHAMPION_LIST_URL);
        const json = await response.json();
        return Object.keys(json.data);
    } catch (error) {
        console.error('Error fetching champion list', error);
        throw error;
    }
}

async function fetchChampionDetails(championNames) {
    const championDataPromises = championNames.map(async (name) => {
        try {
            const response = await fetch(CHAMPION_DETAILS_URL(name));
            const json = await response.json();
            return json.data[name];
        } catch (error) {
            console.error(`Error fetching champion details for ${name}`, error);
            return null;
        }
    });
    const results = await Promise.all(championDataPromises);
    return results.filter(champ => champ !== null);
}

async function cleanChampionData(championData) {
    const { id, lore, key, blurb, title, skins } = championData;
    const enrichedSkins = skins.map(skin => {
        const splashUrl = `${SPLASH_BASE_URL}/${id}_${skin.num}.jpg`;
        return { ...skin, splashUrl };
    });
    return { id, lore, key, blurb, title, skins: enrichedSkins };
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

async function main() {
    try {
        const championNames = await fetchChampionList();
        console.log('Fetched champion names');

        const championDetails = await fetchChampionDetails(championNames);
        const cleanedChampionDetails = await Promise.all(championDetails.map(cleanChampionData));

        await popuplateDatabase(cleanedChampionDetails);

        await pool.end();

        //await writeDataToFile(cleanedChampionDetails);
    } catch (error) {
        console.error('Error fetching data', error);
    }
}

main();