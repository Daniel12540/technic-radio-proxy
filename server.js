const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const STATIONS = {
    "eska": "https://stream.open.fm/321",
    "rmf": "https://rs102-krk.rmftv.pl/RMFFM48",
    "lofi": "https://stream.zeno.fm/f3wvbbqmdg8uv",
    "antyradio": "https://n-4-2.dcs.redcdn.pl/sc/o2/Eurozet/live/antyradio.livx?audio=5",
    "zet": "https://stream.radiozet.pl/radiozet.mp3"
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    res.send('⚙️ Technic Network Radio Proxy Server Status: ONLINE');
});

app.get('/radio/:stationId', async (req, res) => {
    const stationId = req.params.stationId.toLowerCase();
    const streamUrl = STATIONS[stationId];

    if (!streamUrl) {
        return res.status(404).json({ error: "The radio station does not exist in the configuration!" });
    }

    try {
        const response = await axios({
            method: 'get',
            url: streamUrl,
            responseType: 'stream'
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        response.data.pipe(res);

    } catch (error) {
        console.error(`Error while downloading [${stationId}]:`, error.message);
        res.status(500).send("Radio station connection error.");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Technic Radio Proxy runs on port ${PORT}`);
});
