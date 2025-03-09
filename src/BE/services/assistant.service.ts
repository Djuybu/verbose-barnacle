import { Assistant } from "../models/assistant.model";
import FruitService from "./fruit.service";
import ShortUniqueId from "short-unique-id"
const { randomUUID } = new ShortUniqueId({ length: 10 });

const assistants: Assistant[] = []
const fruitList = await FruitService.getFruitDetails()

const assistantService = {
    createAssistant: async() => {
        const id = randomUUID();
        assistants.push(new Assistant(id))
        return {id: id};
    },
    getAsssistance: async(id: string, userRequest: string) => {
        const result = await assistants.filter((assistant) => assistant.getId() === id)[0].Chat(userRequest, fruitList)
        return result;
    }
}

export default assistantService
