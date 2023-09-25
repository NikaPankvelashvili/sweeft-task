type DetailedInfoType = {
  name: string;
  value: string;
};

const DetailedInfo = ({ name, value }: DetailedInfoType) => {
  return (
    <div className="flex items-start w-full mb-2">
      <span className=" w-1/4 text-base font-semibold max-md:w-1/2">{`${name}:`}</span>
      <span className=" w-3/4 text-sm max-md:w-1/2">{value}</span>
    </div>
  );
};

export default DetailedInfo;
