import { Router } from "express";
import orderService from "../services/order.service";
const orderRouter = Router()

orderRouter.post('/', async(req, res) => {
    const order = req.body;
    try {
        await orderService.addOrder(order)
        res.status(200).send("New order added")
    } catch (error) {
        res.status(500).send("Error:" + error.message)
    }
})

export default orderRouter