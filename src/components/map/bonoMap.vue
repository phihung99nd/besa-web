<template>
  <Modal v-model="showMap" :title="$t('selectAddress')" width="800px" @on-ok="onSaveLocation">
    <form class="search-location" @submit.prevent="searchLocation">
      <Input class="search-input" v-model="locationName" placeholder="Search location..."/>
      <Button class="search-button" type="primary" @click="searchLocation">Search</Button>
      <Button v class="current-location-button" type="primary" @click="getCurrentLocation">
        <Icon type="md-locate" size="20"/>
      </Button>
      <h4 class="mt_6 fontsize_12">{{ locationDisplay }}</h4>
    </form>
    <div style="display: flex">
      <transition name="fade">
        <List v-if="locationList.length" class="location-list" :header="`Find location for '${locationName}'`" border>
          <div v-for="location in locationList" @click="flyToLocation(location)">
            <ListItem :class="{'active': location.place_id === locationId}">
              <p  class="location-display" >{{ location.display_name }}</p>
            </ListItem>
          </div>
        </List>
      </transition>
      <l-map style="height: 500px" :zoom="zoom" :center="center" @click="markPosition" ref="map">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker v-if="markerPosition" :lat-lng="markerPosition" @click="markerPosition=null"></l-marker>
      </l-map>
    </div>
  </Modal>
</template>

<script>
import {LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: 'map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      // isLoading: false,
      showMap: false,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">BonoApp</a>',
      zoom: 12,
      center: [21.0231296, 105.8214109],
      locationId: 0,
      locationName: '',
      markerPosition: null,
      locationList: [],
      locationDisplay: '',
      locationObj: null,
    };
  },

  methods: {
    onSaveLocation(){
      this.$emit("getAddress", this.locationObj);
    },
    async getCurrentLocation() {
      // this.isLoading = true;
      if (navigator.geolocation) {
         await navigator.geolocation.getCurrentPosition(position => {
          let currentPosition = [position.coords.latitude, position.coords.longitude];
          this.markerPosition = {
            'lat': position.coords.latitude,
            'lng': position.coords.longitude
          }
          this.center = currentPosition;
          this.$refs.map.mapObject.flyTo(this.center, this.zoom=16);
          this.getPositionInfo();
          // this.isLoading = false;
        });
      } else {
        this.$Message.error("Geolocation is not supported by this browser.");
      }
    },
    async searchLocation() {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${this.locationName}&format=json`
      )
      const data = await response.json()
      this.locationList = data
      console.log("datata", data)
      const [firstResult] = data
      this.flyToLocation(firstResult)
    },
    flyToLocation(address) {
      this.markerPosition = [address.lat, address.lon]
      this.center = [address.lat, address.lon]
      this.locationId = address.place_id
      this.onClickListItem(address.lat, address.lon)
    },
    markPosition(e) {
      this.markerPosition = e.latlng;
      this.center = e.latlng;
      this.getPositionInfo();
      this.locationList = [];

    },

    async getPositionInfo() {
      const geocoder = L.Control.Geocoder.nominatim();
      await geocoder.reverse(this.markerPosition, 13, (results) => {
        const displayList = this.removePostalCode(results[0])
        this.locationDisplay = displayList;
        this.locationObj = {...results[0], name: displayList};
      });
    },
    removePostalCode(address){
      // List all properties of address but not the postal code, then rejoin these properties into name string
      let displayList = [
        address.properties.address.amenity,
        address.properties.address.house_number,
        address.properties.address.road,
        address.properties.address.neighbourhood,
        address.properties.address.suburb,
        address.properties.address.city_district,
        address.properties.address.city,
        address.properties.address.country,
      ]
      displayList = displayList.filter(i => i != undefined).join(",")
      return displayList
    },
    async onClickListItem(lat,lon){
      const geocoder = L.Control.Geocoder.nominatim();
      this.markerPosition = {
        'lat': lat,
        'lng': lon,
      }
      await geocoder.reverse(this.markerPosition, 15, (results) => {
        const displayList = this.removePostalCode(results[0])
        this.locationDisplay = displayList;
        this.locationObj = {...results[0], name: displayList};
      });
    }
  },
  watch: {
    showMap(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.map.mapObject.invalidateSize()
          this.getCurrentLocation();
        })
      }
    }
  },
  created() {
    this.getCurrentLocation();
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let currentPosition = [position.coords.latitude, position.coords.longitude];
        this.markerPosition = currentPosition;
        this.center = currentPosition;
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
}
</script>


<style>
.active {
  background-color: rgba(0, 94, 255, 0.11);
}

.search-location {
  margin: 10px;
}

.search-input {
  width: 300px;
  margin-right: 20px;
}

.location-list {
  width: 300px;
}

.location-display {
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  text-overflow: ellipsis;
}
.current-location-button{
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 90px;
  z-index: 10000;}
</style>
