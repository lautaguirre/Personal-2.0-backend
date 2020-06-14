const chalk = require('chalk');

const blue = (text) => {
  console.log(chalk.blue.bold(text));
};

const red = (text) => {
  console.log(chalk.red.bold(text));
};

const green = (text) => {
  console.log(chalk.green.bold(text));
};

const yellow = (text) => {
  console.log(chalk.yellow.bold(text));
};

module.exports = {
  blue,
  red,
  green,
  yellow,
};