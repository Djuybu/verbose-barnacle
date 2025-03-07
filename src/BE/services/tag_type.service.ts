import { tagTypeCollection } from "../config/db"
import TagService from "./tag.service";

const tagTypeService = {
    getTagTypeWithList: async () => {
        const typeList = (await tagTypeCollection.get()).docs;
        
        const response = await Promise.all(typeList.map(async (type) => {
            const tagTypeWithList = await TagService.getTagWithFilter(5, type.data().type);
            return {
                type: type.data().type, // Lấy dữ liệu thực thay vì object Firestore
                list: tagTypeWithList
            };
        }));

        console.log("Get tag type");
        return response;
    }
}

export default tagTypeService