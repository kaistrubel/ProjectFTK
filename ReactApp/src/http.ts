import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:7066/",
  headers: {
    "Content-type": "application/json"
  },
  withCredentials : true
});