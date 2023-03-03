const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser');
const Multer = require('multer');
const fs = require("fs");
const stream =  require('stream');
const buffer = require('buffer');
const stripe = require('stripe')('sk_test_51MhVf7SFoXWjWvBr1ia2qVtL4hr60mayxD0ByLNKRiczZpe8qbLxFAOParlY0eZtyKCXcRU3xco1nZElAx33WPXE00Rf1ZjM5Q');




const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

const spreadsheetId = '1E6iMfg7OmKf-39mIfpm6oGcGSogJAABad_bjTihh-Qg';
const playersfoldergoogledriveID = '1usR6T1GvBMdKHL9i4pxzoX_bYnwsQOtT';
const teamfoldergoogledriveID = '1QyDqYL1Q9JpaOPbdGhGfEaz1Cf-BKiuu';

// GET request to get APL 5 players data
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


// GET request to get APL 6 registered players emailIDs data
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



// POST request to store APL 6 player data in database
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

const multer = Multer({
    storage: Multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, `${__dirname}/audio-files`);
      },
      filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }); 


//POST request to upload player image to google drive folder
// app.post('/registration/playerimage',multer.single('file') ,async (req, res) => {
//     console.log(req.body)
//     const auth = new google.auth.GoogleAuth({
//         keyFile: 'credentials.json',
//         scopes: 'https://www.googleapis.com/auth/drive'
//     })
//     const googleDrive = google.drive({ version: "v3", auth });
//     const fileMetadata = {
//         name: req.file.originalname,
//         parents: [playersfoldergoogledriveID]
//     };
//     const bufferStream = new stream.PassThrough()
//     bufferStream.end(req.body.file.buffer);
//     const media = {
//         mimeType: req.file.mimetype,
//         body: bufferStream
//     };
//     const response = await googleDrive.files.create({
//         requestBody: fileMetadata,
//         media: media,
//         fields: "id",
//       });
//     console.log(response);
// })



// FOR TESTING! POST request when we were testing image upload
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


app.get('/registration/player/payment', async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 200,
        currency: 'inr',
        automatic_payment_methods: {enabled: true},
      });
    res.json({client_secret: paymentIntent.client_secret});
});


app.listen(3001, (req,res)=>{
    console.log("Running on Port: 3001")
});