import { Router } from 'express'
import { RouteError } from '../utils/routeHelpers';

class test5Controller {
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

export default new test5Controller();