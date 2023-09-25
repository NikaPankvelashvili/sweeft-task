import { AirportType } from "./Types/Types";

const DetailedAirportInfo = ({ iata, name, city }: AirportType) => {
  return (
    <div className=" mb-3 flex items-start text-base">
      <h5 className=" font-medium">{iata.toLocaleUpperCase()}</h5>
      <span className="mx-2">-</span>
      <span>{`${name} (${city})`}</span>
    </div>
  );
};

export default DetailedAirportInfo;
