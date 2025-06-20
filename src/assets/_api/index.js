import axios from "axios"; 

const url = "https://gudangku.api.martinharahap.software"
export const API = axios.create({
  baseURL: `${url}/api`,
});

