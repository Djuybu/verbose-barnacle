import { useLocation } from "react-router-dom";
import { useGetFruitQuery } from "../store/fruitApi.store"

const FruitDisplay: React.FC = () => {
    const location = useLocation()
    const prop = location.state;
    console.log(prop);
    const { data, isFetching } = useGetFruitQuery({id: prop});
    
    return(
    <>
        {!isFetching && data !== undefined && (<>
            <div className="fle">
                <img src={data.image} alt="" />
                <div className="">
                    <div className="text-3xl font-bold">{data.name}</div>
                    <div className="text-2xl font-semibold">{data.price}</div>
                    <div className="text-xl">{data.volume}</div>
                    <div className="">Add to cart</div>
                </div>
            </div>
            <div className="text-2xl">Về sản phẩm</div>
            <div className="text-sm">{data.description}</div>
        </>)}
    </>)
}

export default FruitDisplay