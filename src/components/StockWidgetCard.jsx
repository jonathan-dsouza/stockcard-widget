import React, { useState } from 'react';
import { ArrowUp, ArrowDown, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';  // Import the toast function from Sonner
import UseAnimations from 'react-useanimations';
import alertCircle from 'react-useanimations/lib/alertCircle';
import radioButton from 'react-useanimations/lib/radioButton';

import { Card, CardHeader, CardContent, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Combobox } from './ui/combobox';
import { Skeleton } from './ui/skeleton';
import axios from 'axios';

function StockWidgetCard() {
  const [inputValue, setInputValue] = useState('');
  const [comboboxValue, setComboboxValue] = useState(":NASDAQ");
  const [currency, setCurrency] = useState("USD");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [hasValidData, setHasValidData] = useState(false);
  const [refreshInput, setRefreshInputValue] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch stock data
  const fetchStockData = async (symbol) => {
    setIsLoading(true);
    const options = {
      method: 'GET',
      url: 'https://real-time-finance-data.p.rapidapi.com/stock-quote',
      params: { symbol, language: 'en' },
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_APP_RAPID_API_KEY, // Replace with your actual API key
        'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const stockSymbol = response.data.data.symbol.split(':')[0]; // Split by `:`
      const resultCurrency = currency;

      setStockData({
        ...response.data,
        symbol: stockSymbol,
        currency: resultCurrency  // Store only the first part of the symbol
      });
      setHasValidData(true); // Set valid data state to true
    } catch (err) {
      setStockData(null);
      setHasValidData(false); // Reset valid data state on error
      if (err.response && err.response.status === 401) {
        const errorMessage = err.response.data.message;
        if (errorMessage.includes("exceeded") || errorMessage.includes("Invalid API key")) {
          toast.error(
            <div className="flex items-center space-x-2">
              <UseAnimations animation={alertCircle} size={24} strokeColor="red" />
              <span>We reached our Monthly API Limit :(</span>
            </div>
          );
        } else {
          toast.error(
            <div className="flex items-center space-x-2">
              <UseAnimations animation={alertCircle} size={24} strokeColor="red" />
              <span>Unauthorized request. Please check your API key.</span>
            </div>
          );
        }
      } else {
        toast.error(
          <div className="flex items-center space-x-2">
            <UseAnimations animation={alertCircle} size={24} strokeColor="red" />
            <span>Error fetching stock data. Please try again later.</span>
          </div>
        );
        setError(err.message);
        console.error('Error fetching stock data:', err);
      }
    } finally {
      setIsLoading(false);  // Stop loading regardless of outcome
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const fullSymbol = `${inputValue}${comboboxValue}`;  // e.g., AAPL:NASDAQ
      fetchStockData(fullSymbol);
      setRefreshInputValue(fullSymbol);
      setInputValue(""); // Clear input after fetching
      event.target.blur(); // Remove focus from the input field to hide the keyboard
    }
  };

  // New handler to update both value and currency
  const handleMarketChange = (newValue, newCurrency) => {
    setComboboxValue(newValue); // Update the market value
    setCurrency(newCurrency); // Update the currency
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchStockData(`${refreshInput}`);
      toast.success(
        <div className="flex items-center space-x-2">
          <UseAnimations
            animation={radioButton}
            size={24}
            strokeColor="green"
            autoplay={true}
            loop={false}
            speed={1} // Adjust the speed as needed (1 is normal speed)
          />
          <span>Stock data refreshed successfully!</span>
        </div>
      );
    } catch (error) {
      // Error handling is already done in fetchStockData
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
    }
  };

  return (
    <Card className="w-full max-w-[400px] mb-20">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-x-6">
          <CardDescription className="text-[15px] dark:text-[rgba(255,255,255,0.6)]">Select Market:</CardDescription>
          <Combobox value={comboboxValue} onChange={handleMarketChange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Input
            placeholder="Enter Stock Symbol"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className={hasValidData ? "w-[85%]" : "w-full"}
          />
          {hasValidData && (
            <button
              onClick={handleRefresh}
              className="ml-2 flex items-center justify-center rounded-md text-black dark:text-white h-10 w-10 focus:outline-none"
              aria-label="Refresh stock data"
            >
              <RefreshCcw
                className={`w-5 h-5 transition-transform duration-300 ease-in-out ${isRefreshing ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
        <div className="mt-4 mx-1">
          {isLoading ? (
            <>
              <div className='flex flex-row justify-between mb-2'>
                <Skeleton className="h-6 w-20 bg-gray-300 dark:bg-[#121212]" />
                <Skeleton className="h-6 w-24 bg-gray-300 dark:bg-[#121212]" />
              </div>
              <div className='flex flex-row justify-between'>
                <Skeleton className="h-5 w-32 bg-gray-300 dark:bg-[#121212]" />
                <Skeleton className="h-5 w-28 bg-gray-300 dark:bg-[#121212]" />
              </div>
            </>
          ) : stockData ? (
            <>
              <div className='flex flex-row justify-between'>
                <CardDescription className="font-semibold text-[20px] text-black dark:text-[rgba(255,255,255)]">{stockData.symbol}</CardDescription>
                <CardDescription className="font-normal text-[16px] text-black dark:text-[rgba(255,255,255)]">{stockData.currency} {stockData.data.price}</CardDescription>
              </div>
              <div className='flex flex-row justify-between'>
                <CardDescription className="font-semibold text-[16px] text-black dark:text-[rgba(255,255,255)]">{stockData.data.name}</CardDescription>
                <div className="flex flex-row items-center">
                  <CardDescription
                    className={`font-normal text-[16px] ${stockData.data.change_percent > 0 ? 'text-green-500 dark:text-green-500' : 'text-red-500 dark:text-red-500'}`}
                  >
                    {/* Formatting change and change_percent */}
                    {stockData.data.change === 0 ? '0.00' : stockData.data.change.toFixed(2)} (
                    {stockData.data.change_percent === 0 ? '0.00' : Math.abs(stockData.data.change_percent).toFixed(2)}%)
                  </CardDescription>
                  {stockData.data.change_percent > 0 ? (
                    <ArrowUp className="text-green-500" />
                  ) : (
                    <ArrowDown className="text-red-500" />
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default StockWidgetCard;
