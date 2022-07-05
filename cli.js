#!/usr/bin/env node

"use strict"

const chalk = require("chalk")
const moment = require('moment')
moment().format()
const meow = require("meow")
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/"

meow(`
    Usage
      $ bujhlee

    Examples
      $ bujhlee
      ${chalk.greenBright("Power cut in last 24 hours: 3 hours")}, ${chalk.greenBright("Power cut in last 24 hours: 5 hours")}
`)

module.exports = (async () => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    const dbo = db.db("bujhlee");
    let query = { time: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }

    dbo.collection('bijlistatus').find(query, {})
      .toArray(function (err, data) {
          var ms = 0;

          for (let i = 0; i < data.length; i++) {
            if (i > 0 && (data[i].charging === true && data[i - 1].charging === false)) {
              ms = ms + moment(data[i].time, "DD/MM/YYYY HH:mm:ss").diff(moment(data[i - 1].time, "DD/MM/YYYY HH:mm:ss"))
            }
          }

          console.log("Power outage in the last 24 hours: " + (ms / (1000 * 60 * 60)).toFixed(2) + " hours")

          if (err) throw err;
          db.close();
        }
      )
  })
})()
