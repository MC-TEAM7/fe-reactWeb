const express = require("express");
const app = express();
const mysql = require("mysql");
const fs = require('fs');

const PORT = process.env.port || 5000;

const db = mysql.createPool({
    host:'database-1.clhnj2zwdisk.eu-west-2.rds.amazonaws.com',
    port : '3306',
    user : 'admin',
    password : '12345678',
    database : 'test'
});

app.get("/list", (req, res) => {
  const sqlQuery = `
  
        SELECT DATE_FORMAT(sub.datetime, '%Y-%m-%d %H:%i:%s') as time_str , sub.count
        from(   SELECT datetime, COUNT(*) AS count
        FROM db1
        GROUP BY datetime
        ORDER BY datetime DESC
        LIMIT 5
        ) as sub
        order by sub.datetime asc;
  `;
  db.query(sqlQuery, (err, result) => {
    if (err) {
        console.log('Error : ', err);
        return;
    }
    ///json파일 쓰는 함수
    // const jsonData = JSON.stringify(result);
    // const filePath = './result.json';

    // fs.writeFile(filePath, jsonData, (err) => {
    //     if (err){
    //         console.error('Error : ', err);
    //         return;
    //     }

        console.log('Success');
        res.send(result);  
     });

  });

app.listen(5000, () => {
  console.log(`running on port ${PORT}`);
});

