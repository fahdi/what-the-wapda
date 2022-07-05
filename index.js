const battery = require("battery");
const chalk = require("chalk");
const moment = require('moment'); // require
moment().format();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

setInterval(() => {
  (async () => {
    const { level, charging } = await battery();

    let levelColour = "greenBright"

    if (level > 0.5) {
      levelColour = "greenBright"
    } else if (level > 0.2) {
      levelColour = "yellowBright"
    }

    console.log(`${charging ? chalk.greenBright("Charging") : chalk.redBright("Not charging")}, ${chalk[levelColour](`${Math.round(level * 100)}%`)}`)

    MongoClient.connect(url, function (err, db) {

      if (err) throw err;
      const dbo = db.db("bujhlee");

      dbo.collection('bijlistatus').findOne(
        {},
        { sort: { _id: -1 } },
        (err, data) => {
          // console.log(data.charging);

          if (err) throw err;

          if (data.charging !== charging) {
            let bijliStatus = { level: level, charging: charging, time: new Date() };
            console.log(charging);
            dbo.collection("bijlistatus").insertOne(bijliStatus, function (err, res) {
              if (err) throw err;
              console.log("Record Entered ...");
              db.close();
            });
          }
        },
      );

    });

  })();

}, 60 * 5 * 1000);
