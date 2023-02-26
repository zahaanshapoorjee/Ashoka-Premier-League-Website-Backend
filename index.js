const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database={
    players:[
        {
            name: 'Aryan Yadav',
            price: '44M'
        },
        {
            name: 'Zahaan Shapoorjee',
            price: '39M'
        }
    ]
}

app.get('/test', (req,res)=>{
    res.send('lol')
})

app.get('/', async (req,res)=>{

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })

    const client = await auth.getClient();

    const googleSheets = google.sheets({version: 'v4', auth: client});

    const spreadsheetId = '1E6iMfg7OmKf-39mIfpm6oGcGSogJAABad_bjTihh-Qg';

    const MetaData = await googleSheets.spreadsheets.get({

        auth,
        spreadsheetId

    })

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'Test'
    })

    res.send(getRows.data);
})

app.listen(3001, (req,res)=>{
    console.log("Running on Port: 3001")
});