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

app.get('/playerinfo/:pid', (req, res) => {
    const id = req.params.pid

    const sql = `SELECT * FROM players WHERE PID = ?`;

    db.query(sql, id, (err, data) => {
        if(err) return res.json("Error retrieving player info")
        return res.json(data);
    })
})

app.get('/teaminfo/:tid', (req, res) => {
    const id = req.params.tid

    const sql = `SELECT * FROM teams WHERE ID = ?`;

    db.query(sql, id, (err, data) => {
        if(err) return res.json(err)
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

app.post('/addresults', (req, res) => {
    const sql = "INSERT INTO `gait-results`(`Stride_Len`, `Velocity`, `Sway`, `MMSEScore`, `PID`) VALUES (?)";
    const values = [
        req.body.strideLength,
        req.body.velocity,
        req.body.sway,
        req.body.mmse_score,
        req.body.player_id
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.status(500).json(err);
        return res.json(data);
    })
})

app.get('/results/:pid', (req, res) => {
    const pid = req.params.pid;

    const sql = " SELECT * FROM `gait-results` WHERE PID = ? ORDER by Test_Num DESC";

    db.query(sql, pid, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: 'No gait results found for the specified PID' });
        }

        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Server is running")
})

