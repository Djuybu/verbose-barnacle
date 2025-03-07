import db from "../config/db";
import { Tag } from "../models/tag.model";

const tagCollection = db.collection('tags')

const TagService = {
    getTag: async () => {
        const response: any[] = []
        const data = (await tagCollection.get()).docs;
        data.forEach((tag) => {
            response.push(tag.data())
        })
        return response;
    },

    getTagWithLimit: async (limit: number) => {
        const response: any[] = []
        const data = await tagCollection.limit(limit).get();
        data.forEach((tag) => {
            const id = tag.id;
            const data = tag.data();
            const newTag: Tag = {
                id: id,
                name: data.name,
                description: data.description,
                type: data.type
            }
            response.push(newTag)
        })
        return response;
    },

    getTagWithFilter: async (limit: number, type: string) => {
        const response: any[] = []
        const data = await tagCollection.where("type", "==", type).limit(limit).get()
        data.forEach((tag) => {
            const id = tag.id;
            const data = tag.data();
            const newTag: Tag = {
                id: id,
                name: data.name,
                description: data.description,
                type: data.type
            }
            response.push(newTag)
        })
        console.log("get tag with filter");
        return response;
    }
}

export default TagService