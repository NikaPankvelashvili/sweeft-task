import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useEffect, useState } from "react";
import countryApi from "./apis/getCountry";
import CountryInfo from "./CountryInfo";
import { CountryType } from "./Types/Types";
import "./index.css";
import getGeolocation from "./apis/getGeolocation";

export const countries_cache: any = {};
export const all_countries_cache: any = {};
export type TabType = "Currency" | "Airport";

function App() {
  const [currLocation, setCurrLocation] = useState<GeolocationCoordinates>();
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCountryInfo, setSelectedCountryInfo] =
    useState<CountryType[]>();

  const [tab, setTab] = useState<TabType>("Currency");

  const handleChangeTab = (event: React.SyntheticEvent, newValue: TabType) => {
    setTab(newValue);
    const queryString = `?country=${selectedCountry}&tab=${newValue}`;
    window.history.pushState(null, "", queryString);
  };

  const fetchCurrentLocation = async () => {
    try {
      const resp = await getGeolocation.get(
        `json?latlng=${currLocation?.latitude},${currLocation?.longitude}&key=${
          import.meta.env.VITE_GEOLOCATION_API_KEY
        }`
      );
      const address_components_array = resp.data.results[5].address_components;
      const country =
        address_components_array[address_components_array.length - 1].long_name;
      setSelectedCountry(country);
      const queryString = `?country=${selectedCountry}&tab=${tab}`;
      window.history.pushState(null, "", queryString);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currLocation) fetchCurrentLocation();
  }, [currLocation]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const countryValue: any = urlParams.get("country");
    const tabValue: any = urlParams.get("tab");
    if (countryValue === "" || countryValue === null) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => setCurrLocation(position.coords),
        (err) => console.log(err.message)
      );
      setTab(tab);
    } else {
      setSelectedCountry(countryValue);
      setTab(tabValue);
    }
  }, []);

  const fetchCountries = async () => {
    try {
      const resp = await countryApi.get("all?fields=name");
      setCountries(resp.data);
      all_countries_cache["info"] = resp.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCountryInfo = async (name: string) => {
    try {
      const resp = await countryApi.get(`name/${name}`);
      setSelectedCountryInfo(resp.data);
      countries_cache[selectedCountry] = resp.data[0];
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
        const queryString = `?country=${selectedCountry}&tab=${tab}`;
        window.history.pushState(null, "", queryString);
      }
    }
  }, [selectedCountry]);

  return (
    <>
      <div className=" mt-2">
        <Box
          maxWidth={1024}
          sx={{ p: 3, border: "1px solid rgb(204, 204, 204)" }}
          marginX={"auto"}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Country"
              value={selectedCountry}
              onChange={handleChange}
              MenuProps={{
                style: { maxHeight: "300px" },
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
          {selectedCountryInfo && (
            <CountryInfo
              name={selectedCountryInfo[0].name}
              capital={selectedCountryInfo[0].capital}
              currencies={selectedCountryInfo[0].currencies}
              region={selectedCountryInfo[0].region}
              subregion={selectedCountryInfo[0].subregion}
              continents={selectedCountryInfo[0].continents}
              population={selectedCountryInfo[0].population}
              borders={selectedCountryInfo[0].borders}
              flags={selectedCountryInfo[0].flags}
              cca2={selectedCountryInfo[0].cca2}
              tab={tab}
              handleChangeTab={handleChangeTab}
            />
          )}
        </Box>
      </div>
    </>
  );
}

export default App;
