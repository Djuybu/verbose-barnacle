import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./homepage/HomePage";
import Header from "./header/Header";
import ProductPage from "./productpage/ProductPage";
import FruitDisplay from "./fruit/FruitDisplay";
import SearchResult from "./searchresult/SearchResult";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/list" element={<ProductPage/>}/>
        <Route path="/product" element={<FruitDisplay/>}/>
        <Route path="/search" element={<SearchResult/>}/>
      </Routes>
    </>
  );
}

export default App;
