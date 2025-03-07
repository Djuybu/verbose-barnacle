import { useLocation } from "react-router-dom";
import { useGetFruitListQuery } from "../store/fruitApi.store";
import { Tag } from "../type/tag.type"
import Carsouel from "../props/Carsouel/Carsouel";


const ProductPage: React.FC = () => {
    const location = useLocation();
    const prop = location.state as Tag; // Ép kiểu dữ liệu nhận vào

    console.log("Received prop:", prop);

    const { data, isFetching } = useGetFruitListQuery({ tag: prop?.name, limit: 100 });

    !isFetching && console.log(data);

    return (
        <>
            {!isFetching && data !== undefined && <Carsouel tag={prop} fruitList={data} />}
        </>
    );
};

export default ProductPage