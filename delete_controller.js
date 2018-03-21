const inquirer = require('inquirer');
const path = require('path');
const { readFile, writeFile, unlink } = require('fs-extra');
const { parseModuleWithLocation } = require('shift-parser');
const emoji = require('node-emoji');
const codegen = require('shift-codegen');
const prettier = require('prettier');

async function askQuestion(questions) {
    return await inquirer.prompt(questions);
}

async function main() {
    const question = [
        {
            message: "Controller Name?",
            type: "input",
            name: "answer"
        }
    ]
    const controllerName = await askQuestion(question);
    const { answer } = controllerName;
    lookForController(answer);
}


async function lookForController(name) {
    try {
        await unlink(path.join(__dirname, './src/controllers/', `${name}Controller.js`));
        console.log(`${emoji.get("skull_and_crossbones")}  Deleted ${name}Controller.js!`);
        deleteRoutes(name);
    } catch (error) {
        console.log(`${emoji.get("skull_and_crossbones")}  Can not find that controller!`);
    }
}

async function deleteRoutes(name) {
    console.log(`${emoji.get("thinking_face")}  Removing imports and routes from app.js!`);
    const app = await readFile('./src/app.js');
    const { tree, locations, comments } = parseModuleWithLocation(app.toString("utf-8"));

    let deleteImportIndex;
    let deleteRouteIndex;

    tree.items.forEach((item, i) => {
        if (item.type === "Import" && item.defaultBinding && item.defaultBinding.name === `${name}Controller`) {
          deleteImportIndex = i;
        }

        if (item.type === "ExpressionStatement" && item.expression.arguments) {
            const length = item.expression.arguments.reduce((sum, arg) => {
                if (arg.type === "CallExpression" && arg.callee.object.type === "IdentifierExpression" && arg.callee.object.name === `${name}Controller`) {
                  sum += 1;
                }
                return sum;
            }, 0)


            if(length){
                // I dont know why this works.
                deleteRouteIndex = i-=1
            }
        }
    })


    tree.items.splice(deleteImportIndex, 1)
    tree.items.splice(deleteRouteIndex, 1)

    await writeFile(`./src/app.js`, prettier.format(codegen.default(tree)));

    setDone();
}

function setDone() {
    console.log(`${emoji.get('wastebasket')}  Deleted!`)
}




main();