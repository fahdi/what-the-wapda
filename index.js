const battery = require("battery");
const chalk = require("chalk");

(async () => {
  const { level, charging } = await battery();

  if (level > 0.5) {
    levelColour = "greenBright"
  } else if (level > 0.2) {
    levelColour = "yellowBright"
  }

  console.log(`${charging ? chalk.greenBright("Charging") : chalk.redBright("Not charging")}, ${chalk[levelColour](`${Math.round(level * 100)}%`)}`)
  //=> true
})();
