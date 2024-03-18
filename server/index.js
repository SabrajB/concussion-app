const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express()
app.use(express.json());

app.use(cors());

const s3 = new AWS.S3();

const db = mysql.createConnection( {
    host: "localhost",
    user: "root",
    password:"",
    database: "concussion-manager"
})

app.post("/upload/:filename", (req, res) => {
    const fileName = req.params.filename
    const fileContent = fs.readFileSync(fileName);
    const params = {
        Bucket: 'pace-concussion-videos',
        Key: fileName,
        Body: fileContent
    };

    s3.upload(params, (err, data) => {
        if (err) {
          return res.json("Error uploading file:", err);
        } else {
          return res.json(`File uploaded successfully. ${data.Location}`);
        }
      });    
})

app.get("/teams", (req, res) => {
    const sql = "SELECT * FROM teams";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
})

app.get('/players/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM players WHERE TID = ?`;

    db.query(sql, id, (err, data) => {
        if(err) return res.json("Error retrieving players")
        return res.json(data);
    })
})

app.get('playername/:pid', (req, res) => {
    const id = req.params.pid

    const sql = `SELECT Name FROM players WHERE PID = ?`;

    db.query(sql, id, (err, data) => {
        if(err) return res.json("Error retrieving players name")
        return res.json(data);
    })
})

app.post('/create', (req, res) => {
    const sql = "INSERT INTO teams (Name, Gender, Sport) VALUES (?)";
    const values = [
        req.body.name,
        req.body.gender,
        req.body.sport
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.json("Error Creating Team");
        return res.json(data);
    })
})

app.post('/addplayer', (req, res) => {
    const sql = "INSERT INTO players (Name, Gender, Height, Weight, Notes, TID) VALUES (?)";
    const values = [
        req.body.name,
        req.body.gender,
        req.body.height,
        req.body.weight,
        req.body.notes,
        req.body.tid
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.json("Error Adding Player");
        return res.json(data);
    })
})

// app.post('/addMMSE', (req, res) => {
//     const sql = "INSERT INTO mmse (Date, Score, PID) VALUES (?)";
//     const values = [
//         req.body.date,
//         req.body.score,
//         req.body.pid
//     ]
//     db.query(sql, [values], (err, data) => {
//         if(err) return res.json("Error Inputting Score");
//         return res.json(data);
//     })
// })

app.listen(8081, () => {
    console.log("Server is running")
})
