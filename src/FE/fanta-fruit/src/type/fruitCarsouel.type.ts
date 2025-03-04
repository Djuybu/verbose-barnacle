import { Tag } from "./tag.type"

export interface FruitDTO {
    id: string,
    name: string,
    price: string,
    image: string
}

export interface FruitCarsouel {
    tag: Tag
    fruitList: FruitDTO[]
}