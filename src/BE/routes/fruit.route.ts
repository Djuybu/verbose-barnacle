import { Router } from "express";
import FruitService from "../services/fruit.service";

const fruitRouter = Router();

// Route GET /
fruitRouter.get('/', async (req, res) => {
    try {
        const { tags, limit } = req.query;
        console.log("get fruit DTO by tag and limit");
        if (typeof tags === "string") {
            const fruits = await FruitService.getFruitByFilter(tags.split(','), Number(limit));
            res.send(fruits);
        } else {
            throw new Error("Invalid tags");
            
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route GET /:id
fruitRouter.get('/search', async (req, res) => {
    const fruitQuery = String(req.query.query);
    console.log(fruitQuery);
    if (fruitQuery) {
        res.send(await FruitService.getFruitFromQuery(fruitQuery))
    }
}).get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const fruit = await FruitService.getFruitById(id);
        res.send(fruit);
    } catch (error) {
        console.error("Error fetching fruit:", error.message);
        res.status(error.message.includes("no document") ? 404 : 500).json({ error: error.message });
    }
})

export default fruitRouter;
