import { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import getAirportsData from "./apis/getAirportsData";
import { AirportType } from "./Types/Types";
import DetailedAirportInfo from "./DetailedAirportInfo";

const airports_cache: any = {};

const Airports = ({ cca2 }: { cca2: string }) => {
  const [fetchedAirpots, setFetchedAirports] = useState<AirportType[]>();
  const [filteredAirports, setFilteredAirports] = useState<AirportType[]>();
  const [filterInput, setFilterInput] = useState<string>("");

  const fetchAirports = async (cca2: string) => {
    try {
      const resp = await getAirportsData.get(`/airports?country=${cca2}`);
      setFetchedAirports(resp.data);
      airports_cache[cca2] = resp.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delayedFilter = setTimeout(() => {
      if (fetchedAirpots) {
        setFilteredAirports(
          fetchedAirpots
            .filter((airport) => airport.iata)
            .filter((airport) =>
              airport.name
                .toLocaleUpperCase()
                .includes(filterInput.toLocaleUpperCase())
            )
        );
      }
    }, 500);

    return () => clearTimeout(delayedFilter);
  }, [filterInput, fetchedAirpots]);

  useEffect(() => {
    if (airports_cache[cca2]) {
      setFetchedAirports(airports_cache[cca2]);
    } else {
      fetchAirports(cca2);
    }
  }, [cca2]);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;",
      }}
    >
      <h3 className=" text-3xl font-medium mb-4">Airports</h3>
      <TextField
        id="standard-basic"
        label="Search for airport"
        variant="standard"
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
        sx={{ marginBottom: 3 }}
      />
      <div className=" col-auto columns-2 max-md:columns-1">
        {filterInput
          ? filteredAirports &&
            filteredAirports.map((airport) => {
              return (
                <DetailedAirportInfo
                  city={airport.city}
                  key={airport.iata}
                  name={airport.name}
                  iata={airport.iata}
                />
              );
            })
          : fetchedAirpots &&
            fetchedAirpots
              .filter((airport) => airport.iata)
              .filter((airport) =>
                airport.name
                  .toLocaleUpperCase()
                  .includes(filterInput.toLocaleUpperCase())
              )
              .map((airport) => {
                return (
                  <DetailedAirportInfo
                    city={airport.city}
                    key={airport.iata}
                    name={airport.name}
                    iata={airport.iata}
                  />
                );
              })}
      </div>
    </Box>
  );
};

export default Airports;
