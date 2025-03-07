import { useGetCarsouelsQuery } from "../store/fruitCarsouel.service";
import { FruitCarsouel } from "../type/fruitCarsouel.type";
import Carsouel from "../props/Carsouel/Carsouel";

const HomePage: React.FC = () => {
    const {data, isFetching} = useGetCarsouelsQuery({limit: 5})
    return(
    <>
        {!isFetching && data !== undefined && data.map((carsouel: FruitCarsouel) => {
            return (<div className="mb-10">
                <Carsouel key={carsouel.tag.id} tag={carsouel.tag} fruitList={carsouel.fruitList}/>
            </div>)
        })}
    </>
    )
    
}

export default HomePage