import {Router} from "express"
import fruitCarsouelService from "../services/fruit-carsouel.services";

const fruitCarsouelRouter = Router();

fruitCarsouelRouter.get('/', async(req, res) => {
    const limit = Number(req.query.limit);
    try {
       const carsouels = await fruitCarsouelService.getCarsouels(limit, 10)
       console.log(carsouels.length);
       res.send(carsouels)
    } catch (error) {
        res.status(500).send("Error:" + error.message)
    }
})

export default fruitCarsouelRouter