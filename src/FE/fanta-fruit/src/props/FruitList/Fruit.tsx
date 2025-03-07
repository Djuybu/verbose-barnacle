import { useNavigate } from "react-router-dom";
import { FruitDTO } from "../../type/fruitCarsouel.type";

const FruitListDisplay: React.FC<FruitDTO> = (fruit: FruitDTO) => {
    console.log(fruit);
    
    const navigate = useNavigate()
    return(
    <>
        <div className="">
            <div className="text-sm cursor-pointer" onClick={() => navigate("/product", {state: fruit.id})}>{fruit.name}</div>
            <img src={fruit.image} alt="" />
            <div className="flex">
                <div className="">{fruit.price}</div>
                <button type="button">Add to cart</button>
            </div>
        </div>
    </>
    )
}

export default FruitListDisplay