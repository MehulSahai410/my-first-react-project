import {useEffect,useState} from "react";
import {fetchCryptos}  from "../api/CoinGecko";
import { CryptoCard } from "../components/CryptoCard";

export const Home=() =>{
    const [cryptoList, setCryptoList]=useState([]);
    const [filteredList, setFilteredList]=useState([]);
    const[isLoading, setToLoading]=useState(true);
    const[viewType,setView]=useState("grid","list");
    const[sortBy,setSortBy]=useState("market_cap_rank","name","price","price_desc","change","market_cap");
    const[searchQuery,setSearchQuery]=useState("");

      useEffect(() => {
        filterAndSort();
      },[sortBy,cryptoList,searchQuery]);
    const fetchCryptoData = async()=>{
       try{ const data= await fetchCryptos(); // data is being fetched here
        setCryptoList(data);}
        catch(err)
        {
            console.error("Error fetching crypto:",err);
        }
        finally{
            setToLoading(false);
        }
    };
    useEffect(()=>{
 fetchCryptoData();
}, []);
 const filterAndSort = () => {
    let filtered=cryptoList.filter((crypto)=> crypto.name.toLowerCase().includes(searchQuery.toLowerCase())||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
    filtered.sort((a,b) =>{
    switch(sortBy){
        case"name":
         return a.name.localeCompare(b.name); 
        case "price":
         return a.current_price - b.current_price;
        case "price_desc":
         return b.current_price - a.current_price;
        case "change":
         return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
         return a.market_cap-b.market_cap;
        default:
         return a.market_cap_rank-b.market_cap_rank;
        
    }
    });
    setFilteredList(filtered);
 };


    return(
         <div className="app">
            <header className="header">
            <div className="header-content">
            <div className="logo-section">
                <h1>Crypto simulator 🚀</h1>
                <p>Real time cryptocurrency prices and market data</p>
             </div>
             <div className="search-selection">
                <input type="text" 
                placeholder="search cryptos.." 
                className="search-input"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                />
             </div>
            </div>

            </header>
            <div className ="controls"> 
                <div className="filter-group"> 
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="market_cap_rank">Rank by market cap</option>
                         <option value="name">Name</option>
                         <option value="price">Price(Low to High)</option>
                          <option value="price_desc">Price(High to Low)</option>
                           <option value="change">24 hr change</option>
                           <option value="market_cap">Market Cap</option>
                    </select>

                </div>
                <div className="view-toggle">
                    <button className={viewType==="grid"?"active":"" }onClick={()=> setView("grid")}>Grid View</button>
                    <button className={viewType==="list"?"active":""}onClick={()=> setView("list")}>List View</button>
                </div>
            </div>

        {isLoading ?(
              <div className="Loading">
              <div className="spinner"/>
              <p>Loading the crypto...</p>
              </div>
    ):(
    <div className={`crypto-container ${viewType}`}>
        {filteredList.map((crypto,key) =>(
            <CryptoCard crypto={crypto} key={key} />
        ))}
        </div>
    )}
    </div>
  );
};