import { Router } from "express";
import assistantService from "../services/assistant.service";

const assistantRouter = Router()

assistantRouter.get('/', async(req, res) => {
    res.send(await assistantService.createAssistant());
})
.get('/chat', async(req, res) => {
    try {
        const id = req.body.id;
        const request = req.body.request;
    res.send(await assistantService.getAsssistance(id, request))
    } catch (error) {
        res.status(500).send(`error: ${error.message}`)
    }
})

export default assistantRouter