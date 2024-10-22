import request, {Method} from "@/plugins/request";
import axios from "axios";

export function reverseGeocode (access_token, loc, types) {
  return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${loc}.json`, {
    params: {
      types,
      access_token
    }
  })
}
