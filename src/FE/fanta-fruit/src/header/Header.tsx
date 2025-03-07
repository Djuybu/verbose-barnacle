import { useState } from "react";
import { useGetTagTypeListQuery } from "../store/tagType.service"
import TagList from "./tagList/TagList";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const [searchParam, setSearchParam] = useState<string>()
    const {data, isFetching} = useGetTagTypeListQuery()
    const navigate = useNavigate()
    
    return(<>
        <div className="flex">
            <div className="">logo</div>
            <div className="flex">
                {!isFetching && data?.map((tagList) => {
                    return(<TagList type={tagList.type} list={tagList.list} />)
                })}
            </div>
            <input onChange={(e) => {
                setSearchParam(e.target.value)
            }} type="text" name="" id="" />
            <button onClick={() => navigate('/search', {state: searchParam})
            }>Search</button>
        </div>
    </>)
}

export default Header