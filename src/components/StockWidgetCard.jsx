import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';  // Import the toast function from Sonner

import { Card, CardHeader, CardContent, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Combobox } from './ui/combobox';
import axios from 'axios';

function StockWidgetCard() {
  const [inputValue, setInputValue] = useState(''); // For stock symbol input
  const [comboboxValue, setComboboxValue] = useState(":NASDAQ"); // Default to NASDAQ
  const [currency, setCurrency] = useState("USD"); // Default currency for NASDAQ
  const [stockData, setStockData] = useState(null);  // State to store stock data
  const [error, setError] = useState(null);  // State to store errors

  // Function to fetch stock data
  const fetchStockData = async (symbol) => {
    const options = {
      method: 'GET',
      url: 'https://real-time-finance-data.p.rapidapi.com/stock-quote',
      params: { symbol, language: 'en' },
      headers: {
        'x-rapidapi-key': import.meta.env.REACT_APP_RAPID_API_KEY, // Replace with your actual API key
        'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const stockSymbol = response.data.data.symbol.split(':')[0];
      const resultCurrency = currency;

      setStockData({
        ...response.data,
        symbol: stockSymbol,
        currency: resultCurrency  // Store only "AAPL" in the state
      });  // Store the response data
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const errorMessage = err.response.data.message;
  
        if (errorMessage.includes("exceeded") || errorMessage.includes("Invalid API key")) {
          toast.error("We reached our Monthly API Limit :(");
        } else {
          toast.error("Unauthorized request. Please check your API key.");
        }
      } else {
        setError(err.message);
        console.error('Error fetching stock data:', err);
      }
    }  
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const fullSymbol = `${inputValue}${comboboxValue}`;  // e.g., AAPL:NASDAQ
      fetchStockData(fullSymbol);
      setInputValue(""); // Clear input after fetching
    }
  };

  // New handler to update both value and currency
  const handleMarketChange = (newValue, newCurrency) => {
    setComboboxValue(newValue); // Update the market value
    setCurrency(newCurrency); // Update the currency
  };

  return (
    <Card className="w-full max-w-[400px] mb-20">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-x-6">
          <CardDescription className="text-[15px] dark:text-[rgba(255,255,255,0.6)]">Select Market:</CardDescription>
          <Combobox value={comboboxValue} onChange={handleMarketChange} />  {/* Pass selected value */}
        </div>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Enter Stock Symbol"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}  // Update input value on change
          onKeyDown={handleKeyPress}  // Call handleKeyDown when a key is pressed
        />
        {stockData && (
          <div className="mt-4">
            <div className='flex flex-row justify-between'>
              <CardDescription className="font-semibold text-[20px] text-black dark:text-[rgba(255,255,255)]">{stockData.symbol}</CardDescription>
              <CardDescription className="font-normal text-[16px] text-black dark:text-[rgba(255,255,255)]"> {stockData.currency} {stockData.data.price}</CardDescription>
            </div>

            <div className='flex flex-row justify-between'>
              <CardDescription className="font-semibold text-[16px] text-black dark:text-[rgba(255,255,255)]">{stockData.data.name}</CardDescription>
              <div className="flex flex-row items-center">
                <CardDescription
                  className={`font-normal text-[16px] ${stockData.data.change_percent > 0 ? 'text-green-500 dark:text-green-500' : 'text-red-500 dark:text-red-500'}`}
                >
                  {stockData.data.change} (
                  {Math.abs(stockData.data.change_percent)}%)
                </CardDescription>

                {stockData.data.change_percent > 0 ? (
                  <ArrowUp className="text-green-500" />
                ) : (
                  <ArrowDown className="text-red-500" />
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StockWidgetCard;
