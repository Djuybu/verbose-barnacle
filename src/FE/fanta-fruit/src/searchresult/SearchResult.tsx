import { useLocation } from "react-router-dom";
import { FruitCarsouel, FruitDTO } from "../type/fruitCarsouel.type";
import { useGetFruitFromSearchQueryQuery } from "../store/fruitApi.store";
import Carsouel from "../props/Carsouel/Carsouel";

const SearchResult: React.FC = () => {
    const location = useLocation()
    const param = location.state
    console.log(param);
    const {data, isFetching} = useGetFruitFromSearchQueryQuery({query: param})
    return(
    <>
        {!isFetching && data !== undefined && <Carsouel tag={{
            id: "",
            name: param,
            description: "Kết quả",
            type: ""
        }} fruitList={data} />}
    </>
    )
}

export default SearchResult