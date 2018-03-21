const inquirer = require('inquirer');
const { readFile, writeFile } = require('fs-extra');
const { parseModuleWithLocation } = require('shift-parser');
const codegen = require('shift-codegen');
const prettier = require('prettier');

const templateString = (name) => `import { Router } from 'express'
import { RouteError } from '../utils/routeHelpers';

class ${name}Controller {
    constructor(){
        this.router = new Router();
    }

    async index(req, res){
        try {
            res.send('Example!')
        } catch (error) {
            RouteError(res, 'Something went wrong!');
        }
    }

    routes = () => {
        this.router.get('/', this.index);
        return this.router
    }
}

export default new ${name}Controller();`


async function main(){
    const question = [
        {
            message: "Controller Name?",
            type: "input",
            name: "answer"
        }
    ]
    const controllerName = await inquirer.prompt(question);

    if(!controllerName.answer){
        console.log('💩  Controller must have a name!');
        return
    }
    createTemplate(controllerName.answer);
}


async function createTemplate(name) {
    console.log('🤓  Writing template!');
    try {
        await writeFile(`./src/controllers/${name}Controller.js`, templateString(name));
        addRoutes(name);
    } catch (error) {
       console.log('🙃  Error writing controller file', error); 
    }
}

async function addRoutes(routeName) {
    const app = await readFile('./src/app.js');
    const { tree, locations, comments } = parseModuleWithLocation(app.toString('utf-8'));

	let exists = false;
	let lastCtrlIdx = null;
	let lastRouteIdx = null;

	tree.items.forEach((item, i) => {
		if (item.type === 'Import' && item.defaultBinding && item.defaultBinding.name.includes('Controller')) {
			lastCtrlIdx = i;
		}
		if (
			item.type === 'ExpressionStatement' &&
			item.expression.arguments &&
			item.expression.arguments.filter(arg => arg.callee && arg.callee.property === 'routes').length
		) {
			lastRouteIdx = i;
		}
		if (
			item.type === 'ExpressionStatement' &&
			item.expression.arguments &&
			item.expression.arguments.filter(arg => arg.callee && arg.callee.object && arg.callee.object.name === `${routeName}Controller`).length
		) {
			exists = true;
		}
	});

	if (exists) {
		console.log(`☠️ Controller already exists`);
		return;
	}

	tree.items.splice(lastCtrlIdx + 1, 0, {
		type: 'Import',
		defaultBinding: { type: 'BindingIdentifier', name: `${routeName}Controller` },
		namedImports: [],
		moduleSpecifier: `./controllers/${routeName}Controller`
	});

	tree.items.splice(lastRouteIdx + 2, 0, {
		type: 'ExpressionStatement',
		expression: {
			type: 'CallExpression',
			callee: {
				type: 'StaticMemberExpression',
				object: { type: 'IdentifierExpression', name: 'app' },
				property: 'use'
			},
			arguments: [
				{ type: 'LiteralStringExpression', value: `/${routeName.toLowerCase()}` },
				{
					type: 'CallExpression',
					callee: {
						type: 'StaticMemberExpression',
						object: { type: 'IdentifierExpression', name: `${routeName}Controller` },
						property: 'routes'
					},
					arguments: []
				}
			]
		}
    });

    await writeFile(`./src/app.js`, prettier.format(codegen.default(tree)));
    setDone()    
}

function setDone() {
    console.log('🎉  Done!');
}
main();