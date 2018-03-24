const inquirer = require('inquirer');
const path = require('path');
const { readFile, writeFile } = require('fs-extra');
const { parseModuleWithLocation } = require('shift-parser');
const util = require('util');
const codegen = require('shift-codegen');
const prettier = require('prettier');

let answers = {}
let name;

const templateString = (name, model) => `
import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const schema = new Schema(${util.inspect(model)})

export default mongoose.model("${name}", schema)`


async function main() {
	const question = [
		{
			message: "Model Name?",
			type: "input",
			name: "answer"
        }
	]
    const modelName = await inquirer.prompt(question);
    name = modelName.answer;

	if (!modelName.answer) {
		console.log('💩  Model must have a name!');
		return
    }
    const attQuestions = [
        {
            message: "Attribute name",
            type: "input",
            name: "name",
        },
        {
            message: "Attribute type",
            type: "rawlist",
            name: "type",
            choices: [
                "string",
                "number",
                "boolean",
            ]
        }
    ]

    const confirm = [
        {
            message: "Another one?",
            type: "confirm",
            name: "more"
        }
    ]
    getModel(attQuestions, confirm);
}

async function getModel(question, confirm) {
    try {
        const schemaAsk = await inquirer.prompt(question);
        answers[schemaAsk.name] = schemaAsk.type;
        const again = await inquirer.prompt(confirm)

        if(again.more){
            getModel(question, confirm);
        } else {
            writeModel()
        }
    } catch (error) {
        console.log(error)
    }
}

async function writeModel() {
    try {
        console.log(`🤓  Writing Model!`);
        await writeFile(path.join(__dirname, './src/models/', `${name}Model.js`), templateString(name, answers));
        setDone();
    } catch (error) {
        console.log(error);
    }
}

function setDone() {
	console.log('🎉  Done!');
}
main();