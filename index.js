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
        range: 'IMAGE'
    })
    res.send(PlayerData.data);
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

app.post('/', async (req, res) =>{

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
          values: [[req.body.firstname, 
            req.body.middlename, 
            req.body.lastname, 
            req.body.batch, 
            req.body.phonenumber, 
            req.body.gender, 
            req.body.position1, 
            req.body.position2,
            req.body.comments]],
        },
      });

} )

app.listen(3001, (req,res)=>{
    console.log("Running on Port: 3001")
});