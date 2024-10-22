<template>
  <div id="mapbox">
    <div class="bottom-right-tool">
      <div class="close">
        <Button @click="triggerClose" type="default">{{ $t('Close') }}</Button>
      </div>
      <div class="confirm" v-if="searchable && markable">
        <Button @click="triggerConfirm" type="primary">{{ $t('Confirm') }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {reverseGeocode} from "@/api/map";
import {mapState} from "vuex";

export default {
  name: "Mapbox",
  props: ['starting_point', 'searchable', 'markable'],
  data() {
    return {
      map: '',
      marker: '',
      geocoder: '',
      popup: '',
      currentGeo: null
    }
  },
  computed: {
    ...mapState(['mapAccessToken', 'mapStyle'])
  },
  mounted() {
    mapboxgl.accessToken = this.mapAccessToken;
    // Add map
    this.map = new mapboxgl.Map({
      container: 'mapbox', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: this.mapStyle, // style URL
      center: this.starting_point ? this.starting_point.split(",").reverse() : [105.829472, 21.025928], // starting position [lng, lat]
      zoom: 17 // starting zoom
    })

    // Add default marker
    this.marker = new mapboxgl.Marker({
      color: "#f82323",
      draggable: false
    }).setLngLat(this.starting_point ? this.starting_point.split(",").reverse() : [105.829472, 21.025928])
      .addTo(this.map);
    this.getReverseGeocode(this.starting_point ? this.starting_point.split(",").reverse().join(",") : [105.829472, 21.025928].join(","))
    if (this.markable) {
      this.map.on('click', (e) => {
        this.marker.remove()
        this.marker = new mapboxgl.Marker({
          color: "#f82323",
          draggable: false
        }).setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(this.map)
        this.getReverseGeocode(`${e.lngLat.lng},${e.lngLat.lat}`)
      })
    }

    // Add geocoder control (search)
    if (this.searchable) {
      this.geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
      })
      this.map.addControl(this.geocoder);
      this.geocoder.on('result', (e) => {
        this.marker.remove()
        this.marker = new mapboxgl.Marker({
          color: "#f82323",
          draggable: false
        }).setLngLat(e.result.center)
          .addTo(this.map)
        this.getReverseGeocode(`${e.result.center[0]},${e.result.center[1]}`)
      })
    }
  },
  methods: {
    getReverseGeocode(loc) {
      reverseGeocode(this.mapAccessToken, loc).then(res => {
        if (res.data.features) {
          let poi, place
          poi = res.data.features.find(i => i.place_type[0] == 'poi')
          if (poi == undefined) {
            place = res.data.features.find(i => i.place_type[0] == 'place')
          }
          this.currentGeo = poi || place
          this.popup = new mapboxgl.Popup({offset: 40, closeButton: false, closeOnClick: false})
            .setLngLat(loc.split(','))
            .setText(this.currentGeo.place_name)
            .addTo(this.map)
        }
      })
    },
    triggerClose() {
      this.$emit('on-close')
    },
    triggerConfirm() {
      this.$emit('on-confirm', this.currentGeo)
    }
  }
}
</script>

<style scoped lang="scss">
#mapbox {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;

  .bottom-right-tool {
    position: absolute;
    bottom: 20px;
    right: 10px;
    z-index: 1;
    display: flex;
    gap: 5px;

    .close, .confirm {
      box-shadow: 20px 19px 16px -6px rgba(0, 0, 0, 0.1);
    }

  }
}
</style>
