const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

const spreadsheetId = '1E6iMfg7OmKf-39mIfpm6oGcGSogJAABad_bjTihh-Qg';

app.get('/seasons/apl5/players', async (req,res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    const PlayerData = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'Players'
    })
    res.send(PlayerData.data);
})

app.get('/registration/player', async(req,res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    const RegisteredPlayersEmailData = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'PLAYERTESTSHEET!E2:E200'
    })
    res.send(RegisteredPlayersEmailData.data);
})

app.post('/seasons/apl5/players', async (req,res)=>{

    const auth= new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    await googleSheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "IMAGE",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[
                req.body.image,
                req.body.name
            ]]
        }
    });
    console.log(res)
})



app.post('/registration/player', async (req, res) =>{

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    await googleSheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "PLAYERTESTSHEET",
        valueInputOption: "USER_ENTERED",
        resource: {
            // image, firstname, middlename, lastname, emailid, batch, phone, gender, primarypos, secondpos, comment
            values: [[
                req.body.image,
                req.body.firstname, 
                req.body.middlename, 
                req.body.lastname, 
                req.body.emailid,
                req.body.batch, 
                req.body.phonenumber, 
                req.body.gender, 
                req.body.primarypos,
                req.body.secondpos,
                req.body.comment
            ]],
        },
      });
} )

app.listen(3001, (req,res)=>{
    console.log("Running on Port: 3001")
});