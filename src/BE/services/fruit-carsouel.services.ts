import TagService from "./tag.service"
import FruitService from "./fruit.service"
import { Tag } from "../models/tag.model";
import { FruitCarsouel } from "../models/fruitCarsouel.model";

const fruitCarsouelService = {
    getCarsouels: async (limit, carsouel_length) => {
        const carsouels: FruitCarsouel[] = []
        const tag_list: Tag[] = await TagService.getTagWithLimit(limit);
        for (const tag of tag_list) {
            const fruitList = await FruitService.getFruitByFilter([tag.name], limit);
            carsouels.push({ tag, fruitList });
        }

        console.log(carsouels);
        return carsouels;
    } 
}

export default fruitCarsouelService