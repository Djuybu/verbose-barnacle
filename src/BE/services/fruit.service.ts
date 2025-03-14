import { response } from "express";
import db from "../config/db";
import {FruitCollectionDTO, Fruit} from "../models/fruit.model"

const fruitCollection = db.collection('fruit')
const FruitService = {
    getFruitByFilter: async (tags, limit) => {
        try {
            console.log("Tags:", tags);
            const list: any[] = [];
            const doc = await fruitCollection.where("tags", "array-contains-any", tags).limit(limit).get()
            doc.docs.forEach((fruit) => {
                const id = fruit.id;
                const data = fruit.data();
                const fruitCollectionDTO: FruitCollectionDTO = {
                    name: data.name,
                    id: id,
                    price: data.price,
                    image: data.image
                }
                list.push(fruitCollectionDTO);
            })
            console.log("get fruit DTO by filter");
            
            return list;
        } catch (error) {
            throw new Error("Unable to fetch document:", error.message)
        }
    },
    getFruitById: async (id: string) => {
        try {
            console.log("Fetching document:", id);
            const docRef = await fruitCollection.doc(id).get();
            console.log("get fruit by id");
            if (docRef.exists) {
                return docRef.data();
            } else {
                throw new Error(`There is no document with such id: ${id}`);
            }
        } catch (error) {
            throw new Error(`Failed to fetch document: ${error.message}`);
        }
    },
    getFruitFromQuery: async (query: string) => {
        const response: any[] = [];
        const docsFromQuery = await fruitCollection.where("name", ">=", query)
        .where("name", "<=", query + "\uf8ff")
        .get();
        console.log(docsFromQuery.size);
        
        if (!docsFromQuery.empty) {
            docsFromQuery.docs.forEach((fruit) => {
                const data = fruit.data();
                response.push(data)
            })
        }
        console.log(response);
        return response;
    },
    getFruitDetails:  async () => {
        const snapshot = await fruitCollection.get();
        const fruitList = snapshot.docs.map((fruitDoc) => {
            const data = fruitDoc.data();
            
            return {
                id: fruitDoc.id,
                name: data?.name ?? "",
                description: data?.description ?? "",
                isInStock: data?.isInStock ?? false,
                price: data?.price ?? 0,
                volume: data?.volume ?? 0,
                tags: data?.tags ?? [],
                image: data?.image ?? ""
            } as Fruit;
        });
    
        return fruitList.map(fruit => 
            `ID: ${fruit.id}, Name: ${fruit.name}, Description: ${fruit.description}, ` +
            `In Stock: ${fruit.isInStock}, Price: ${fruit.price}, Volume: ${fruit.volume}, ` +
            `Tags: [${fruit.tags.join(', ')}], Image: ${fruit.image}`
        ).join(' | ');
    }
}

export default FruitService