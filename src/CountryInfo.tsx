import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import DetailedInfo from "./DetailedInfo";
import { CountryType } from "./Types/Types";
import countryApi from "./apis/getCountry";
import Extras from "./Extras";

const neighbours_cache: any = {};

const CountryInfo = ({
  name,
  capital,
  currencies,
  region,
  subregion,
  continents,
  population,
  borders,
  flags,
  cca2,
  tab,
  handleChangeTab,
}: CountryType) => {
  const [neighboursInfo, setNeighboursInfo] = useState<CountryType[]>();

  const fetchNeighbours = async (borders: string[]) => {
    try {
      const resp = await countryApi.get(`alpha?codes=${borders.join(",")}`);
      setNeighboursInfo(resp.data);
      neighbours_cache[borders.join("")] = resp.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setNeighboursInfo([]);
    if (borders) {
      if (neighbours_cache[borders.join("")]) {
        setNeighboursInfo(neighbours_cache[borders.join("")]);
      } else {
        fetchNeighbours(borders);
      }
    }
  }, [borders]);

  return (
    <>
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          boxShadow:
            "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;",
          marginTop: 3,
        }}
      >
        <div className="flex items-center mb-4 ">
          <h2 className=" font-normal  text-[32px] ">{name?.official}</h2>
          <img className="h-[30px] ml-[10px]" src={flags.svg} alt={flags.alt} />
        </div>
        <div className="flex w-full max-md:flex-col ">
          <div className=" w-1/2 max-md:w-full">
            <DetailedInfo
              name="Capital"
              value={capital ? capital.join(", ") : ""}
            />
            <DetailedInfo
              name="Currency"
              value={`${Object.values(currencies)[0].name} (${
                Object.values(currencies)[0].symbol
              })`}
            />
            <DetailedInfo name="Region" value={`${region}, ${subregion}`} />
          </div>
          <div className=" w-1/2 max-md:w-full">
            <DetailedInfo name="Continent" value={continents.join(", ")} />
            <DetailedInfo
              name="Population"
              value={`${population.toLocaleString("eu-US")}`}
            />
            <DetailedInfo
              name="Borders"
              value={
                neighboursInfo
                  ? neighboursInfo
                      ?.map((neighbour) => neighbour.name.common)
                      .join(", ")
                  : ""
              }
            />
          </div>
        </div>
      </Box>
      <Extras
        currencySymbol={`${Object.values(currencies)[0].symbol}`}
        currencyName={Object.keys(currencies)[0]}
        mainlySelectedCoutryName={name}
        cca2={cca2}
        tab={tab}
        handleChangeTab={handleChangeTab}
      />
    </>
  );
};

export default CountryInfo;
