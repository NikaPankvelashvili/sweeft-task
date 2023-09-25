import React, { useState } from "react";
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CurrencyExchange from "./CurrencyExchange";
import Airports from "./Airports";
import { CountryNameType } from "./Types/Types";
import { TabType } from "./App";

const Extras = ({
  currencySymbol,
  currencyName,
  mainlySelectedCoutryName,
  cca2,
  tab,
  handleChangeTab,
}: {
  currencySymbol: string;
  currencyName: string;
  mainlySelectedCoutryName: CountryNameType;
  cca2: string | undefined;
  tab: any;
  handleChangeTab: any;
}) => {
  return (
    <div className="my-6">
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="CURRENCY EXCHANGE" value="Currency" />
            <Tab label="AIRPORTS" value="Airport" />
          </TabList>
        </Box>
        <TabPanel sx={{ padding: 0, marginTop: 3 }} value="Currency">
          <CurrencyExchange
            currencyName={currencyName}
            currencySymbol={currencySymbol}
            mainlySelectedCoutryNameString={
              mainlySelectedCoutryName ? mainlySelectedCoutryName.common : ""
            }
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0, marginTop: 3 }} value="Airport">
          <Airports cca2={cca2 ? cca2 : ""} />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Extras;
