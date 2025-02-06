const pool = require('./db');

async function insertChampion(champion) {
    const { id, lore, key, blurb, title, skins } = champion;
    const query = `
        INSERT INTO champions (id, lore, key, blurb, title)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING
    `;
    const values = [id, lore, key, blurb, title];

    try {
        await pool.query(query, values);
        console.log(`Inserted champion ${id}`);
    } catch (error) {
        console.error(`Error inserting champion ${id}`, error);
    }
}

async function insertSkin(championId, skin) {
    const { id: skinId, num, name, chromas, splashUrl } = skin;
    const query = `
        INSERT INTO skins (id, champion_id, num, name, chromas, splash_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
    `;
    const values = [skinId, championId, num, name, chromas, splashUrl];

    try {
        await pool.query(query, values);
        console.log(`Inserted skin ${skinId} for champion ${championId}`);
    } catch (error) {
        console.error(`Error inserting skin ${skinId} for champion ${championId}`, error);
    }
}

async function popuplateDatabase(championDataArray) {
    for (const champion of championDataArray) {
        await insertChampion(champion);
        for (const skin of champion.skins) {
            await insertSkin(champion.id, skin);
        }
    }
}

module.exports = popuplateDatabase;