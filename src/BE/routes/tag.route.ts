import { Router } from "express";
import TagService from "../services/tag.service";

const tagRouter = Router()

tagRouter.get('/', async(req, res) => {
    res.send(await TagService.getTag());
})

export default tagRouter