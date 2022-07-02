import axios from "axios";

export default axios.create({
  baseURL: "https://projectftk.com/",
  headers: {
    "Content-type": "application/json"
  },
  withCredentials : true
});