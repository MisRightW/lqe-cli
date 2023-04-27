import inquirer from 'inquirer'
import packageName from "./packageName.js";
import port from "./port.js";
import devtool from "./devtool.js";
import installTool from "./installTool.js";

export default () => inquirer.prompt([
  packageName(),
  port(),
  devtool(),
  installTool(),
])
