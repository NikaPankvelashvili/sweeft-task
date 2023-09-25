import {
  FormControl,
  Select,
  MenuItem,
  Box,
  InputAdornment,
  Input,
} from "@mui/material";
import countryApi from "./apis/getCountry";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { CountryType } from "./Types/Types";
import { useState, useEffect } from "react";
import getCurrencyRate from "./apis/getCurrencyRate";
import { countries_cache, all_countries_cache } from "./App";

const exchange_cache: any = {};

const CurrencyExchange = ({
  currencySymbol,
  currencyName,
  mainlySelectedCoutryNameString,
}: {
  currencySymbol: string;
  currencyName: string;
  mainlySelectedCoutryNameString: string;
}) => {
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    mainlySelectedCoutryNameString
  );
  const [selectedCountryInfo, setSelectedCountryInfo] =
    useState<CountryType[]>();
  const [currencyExchangeRate, setCurrencyExchangeRate] = useState<number>(1);
  const [exchangeAmount, setExchangeAmount] = useState<number>(0);

  const fetchCountries = async () => {
    try {
      const resp = await countryApi.get("all?fields=name");
      setCountries(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectedCountryCurrencyName =
    selectedCountryInfo && Object.keys(selectedCountryInfo[0]?.currencies)[0];

  const fetchCurrencyRate = async (from: string, to: string | undefined) => {
    try {
      const resp = await getCurrencyRate(`convert?from=${from}&to=${to}`);
      setCurrencyExchangeRate(resp.data.result);
      exchange_cache[`${from}${to}`] = resp.data.result;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCountryInfo = async (name: string) => {
    try {
      const resp = await countryApi.get(`name/${name}`);
      setSelectedCountryInfo(resp.data);
      countries_cache[name] = resp.data[0];
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: any, newValue: any) => {
    setSelectedCountry(event.target.value);
  };

  useEffect(() => {
    if (all_countries_cache["info"]) {
      setCountries(all_countries_cache["info"]);
    } else {
      fetchCountries();
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      if (countries_cache[selectedCountry]) {
        setSelectedCountryInfo([countries_cache[selectedCountry]]);
      } else {
        fetchCountryInfo(selectedCountry);
      }
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (exchange_cache[`${currencyName}${selectedCountryCurrencyName}`]) {
      setCurrencyExchangeRate(
        exchange_cache[`${currencyName}${selectedCountryCurrencyName}`]
      );
    } else {
      fetchCurrencyRate(currencyName, selectedCountryCurrencyName);
    }
  }, [currencyName, selectedCountryCurrencyName]);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;",
      }}
    >
      <h3 className=" text-3xl font-medium mb-4">Currency Exchange</h3>
      <FormControl variant="standard" sx={{ mb: 4, minWidth: 200 }}>
        <Select
          labelId="Currency country"
          id="currency_country"
          label="Currency_Country"
          value={selectedCountry}
          onChange={handleChange}
          MenuProps={{
            style: { maxHeight: "300px", width: "100px" },
          }}
        >
          {countries &&
            countries?.map((country, index) => {
              return (
                <MenuItem key={index} value={country.name.common}>
                  {country.name.common}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
      <div className="flex items-center">
        <FormControl sx={{ width: "50%" }} variant="standard">
          <Input
            className="select-none"
            type="number"
            id="standard-adornment-amount"
            value={exchangeAmount}
            onChange={(e) =>
              setExchangeAmount((prev) => parseInt(e.target.value))
            }
            startAdornment={
              <InputAdornment position="start">{currencySymbol}</InputAdornment>
            }
          />
        </FormControl>
        <DragHandleIcon sx={{ marginX: 2 }} />
        <FormControl sx={{ width: "50%" }} variant="standard">
          <Input
            id="standard-adornment-amount"
            type="number"
            disabled
            value={(exchangeAmount * currencyExchangeRate).toFixed(2)}
            startAdornment={
              <InputAdornment position="start">{`${
                selectedCountryInfo
                  ? Object.values(selectedCountryInfo[0].currencies)[0].symbol
                  : ""
              }`}</InputAdornment>
            }
          />
        </FormControl>
      </div>
    </Box>
  );
};

export default CurrencyExchange;
