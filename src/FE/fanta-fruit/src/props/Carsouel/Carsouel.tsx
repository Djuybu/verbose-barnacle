import FruitListDisplay from "../FruitList/Fruit";
import { FruitCarsouel } from "../../type/fruitCarsouel.type";

const Carsouel: React.FC<FruitCarsouel> = (carsouel: FruitCarsouel) => {
    return(
    <>
        <div className="text-2xl font-bold">{carsouel.tag.name}</div>
        <div className="text-sm text-semibold">{carsouel.tag.description}</div>
        <div className="flex">
            {carsouel.fruitList.map((fruit) => {
                return(<div className="mb-10">
                    <FruitListDisplay id={fruit.id} name={fruit.name} price={fruit.price} image={fruit.image} />
                </div>)
            })}
        </div>
    </>
    )
}

export default Carsouel