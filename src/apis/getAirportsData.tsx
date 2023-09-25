import axios from "axios";

export default axios.create({
  baseURL: "https://api.api-ninjas.com/v1/",
  headers: {
    "X-Api-Key": `${import.meta.env.VITE_AIRPORT_API_KEY}`,
  },
});
