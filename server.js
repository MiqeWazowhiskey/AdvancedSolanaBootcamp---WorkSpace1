const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cors());

app.post('/write-json', (req, res) => {
    const data = req.body;
    fs.writeFileSync('wallet.json', JSON.stringify(data));
    res.send('Data written to JSON file.');
});

app.get('/get-wallet-data', (req, res) => {
    try {
        const walletData = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'));
        res.json(walletData);
    } catch (error) {
        console.error('Error reading wallet data:', error);
        res.status(500).send('Error reading wallet data.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
