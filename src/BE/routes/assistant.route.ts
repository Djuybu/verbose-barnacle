import { Router } from "express";
import assistantService from "../services/assistant.service";

const assistantRouter = Router()

assistantRouter.get('/', async(req, res) => {
    res.send(await assistantService.createAssistant());
})
.post('/chat', async(req, res) => {
    try {
        const id = req.body.id;
        const request = req.body.content;
        res.send(await assistantService.getAsssistance(id, request))
    } catch (error) {
        res.status(500).send(`error: ${error}`)
    }
})

export default assistantRouter