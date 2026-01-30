import { useParams } from "react-router";
import {fetchCoinData,fetchChartData} from "../api/CoinGecko";
import {useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { formatPrice } from "../utils/formatter";
import {LineChart, ResponsiveContainer} from "recharts";
export const CoinDetail=() => {
    const {id} = useParams();
    const navigate= useNavigate();
    const [coin,setCoin]=useState(null);
      const [chartData, setChartData] = useState([]);
     const[isLoading, setToLoading]=useState(true);
      useEffect(() =>{
      loadCoinData();
      
      },[id]);
    const loadCoinData= async() =>{
        try{ const data= await fetchCoinData(id); // data is being fetched here
                setCoin(data);}
                catch(err)
                {
                    console.error("Error fetching crypto:",err);
                }
                finally{
                    setToLoading(false);
                }
    }

     
if (isLoading) {
  return (
    <div className="app">
      <div className="Loading">
        <div className="spinner" />
        <p>Loading the crypto...</p>
      </div>
    </div>
  );
}
   

    if(!coin){
    return (<div className="app">
        <div className="no-results">
            <p>Coin not found</p>
            <button onClick={()=>navigate("/")}>Go back</button>

        </div>
    </div> 
    );   
    };
    return (   <div className="app">
            <header className="header">
            <div className="header-content">
            <div className="logo-section">
                <h1>Crypto simulator 🚀</h1>
                <p>Real time cryptocurrency prices and market data</p>
             </div>
             <button onClick={() => navigate("/")}className="back-button">Back to List</button>
             </div>
             </header>
             <div className="coin-detail">
                <div className="coin-header">
                    <div className="coin-title">
                        <img src={coin.image.large} alt={coin.name}/>
                        <h1>{coin.name}</h1>
                        <p className="symbol">{coin.symbol.toUpperCase()}</p>
                    </div>
                </div>
                <span className="rank">Rank #{coin?.market_data?.market_cap_rank}</span>
             </div>
    <div className="coin-price-section">
      <div className="current-price">
      <h2>{formatPrice(coin?.market_data?.current_price?.usd)}</h2>
      <p className={`change ${coin.market_data.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>
        {coin.market_data.price_change_percentage_24h >= 0 ? "↑" : "↓"}{" "}
        {Math.abs(coin?.market_data?.price_change_percentage_24h).toFixed(2)}%
      </p>
    </div>
    </div>
    <div className="chart-section"><h3>Price chart(7 days)</h3>
    <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>

        </LineChart>
    </ResponsiveContainer>
    </div>
    </div> 
   
       
    );
};