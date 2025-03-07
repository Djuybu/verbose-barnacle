import { useNavigate } from "react-router-dom";
import TagType from "../../type/tagtype.type";

const TagList: React.FC<TagType> = (prop) => {
    const navigate = useNavigate()
    return (
        <div className="relative inline-block">
            {/* Dropdown Button */}
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {prop.type}
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
                {prop.list.map((item, index) => (
                    <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"// Chuyển trang
                        onClick={() => navigate("/list", {state: item})}
                        >
                        {item.name}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagList