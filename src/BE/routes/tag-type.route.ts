import { Router } from "express";
import tagTypeService from "../services/tag_type.service";

const tagTypeRouter = Router()

tagTypeRouter.get('/', async(req, res) => {
    res.send(await tagTypeService.getTagTypeWithList())
})

export default tagTypeRouter