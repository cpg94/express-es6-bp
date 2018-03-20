import { Router } from 'express'

class ExampleController {
    constructor(){
        this.router = new Router();
    }

    async index(req, res){
        try {
            res.send('Example!')
        } catch (error) {
            console.log(error)
        }
    }

    routes = () => {
        this.router.get('/', this.index);
        return this.router
    }
}

export default new ExampleController();