// StockWidgetCard.jsx
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

import { Card, CardHeader, CardContent, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Combobox } from './ui/combobox';
import { useDebounce } from '../hooks/useDebounce';
import axios from 'axios';

function StockWidgetCard() {
  const [inputValue, setInputValue] = useState(''); // For stock symbol input
  const [comboboxValue, setComboboxValue] = useState(":NASDAQ"); // Default to NASDAQ
  const [stockData, setStockData] = useState(null);  // State to store stock data
  const [error, setError] = useState(null);  // State to store errors
  const debouncedInputValue = useDebounce(inputValue, 500);  // Debounce input with a delay of 500ms

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

      setStockData({
        ...response.data,
        symbol: stockSymbol  // Store only "AAPL" in the state
      });  // Store the response data
    } catch (err) {
      setError(err.message);  // Handle any errors
      console.error('Error fetching stock data:', err);
    }
  };

  // Fetch stock data when debounced input or market value changes
  useEffect(() => {
    if (debouncedInputValue) {
      const fullSymbol = `${debouncedInputValue}${comboboxValue}`;  // e.g., AAPL:NASDAQ
      fetchStockData(fullSymbol);  // Call the API function with the combined symbol
    }
  }, [debouncedInputValue, comboboxValue]);  // Re-run effect when either changes

  return (
    <Card className="w-full max-w-[400px] mb-20">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-x-6">
          <CardDescription className="text-[15px] dark:text-[rgba(255,255,255,0.6)]">Select Market:</CardDescription>
          <Combobox value={comboboxValue} onChange={setComboboxValue} />  {/* Pass selected value */}
        </div>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Enter Stock Symbol"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}  // Update input value on change
        />
        {stockData && (
          <div className="mt-4">
            <div className='flex flex-row justify-between'>
              <CardDescription className="font-semibold text-[20px] text-black dark:text-[rgba(255,255,255)]">{stockData.symbol}</CardDescription>
              <CardDescription className="font-normal text-[16px] text-black dark:text-[rgba(255,255,255)]">{stockData.data.price}</CardDescription>
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
        {/* {error && (
          <div className="mt-4 text-red-500">
            <p>Error: {error}</p>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}

export default StockWidgetCard;
