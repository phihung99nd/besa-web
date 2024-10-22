<template>
  <div>
    <Modal :value="true" width="600" :mask-closable="false" :title="$t('Add address')"
           @on-cancel="handleCancel"
           :styles="{top: '10px'}">
      <Form ref="form" :model="formData" :rules="formRule">
        <FormItem :label="$t('Receiver')" prop="name">
          <Input v-model="formData.name"/>
        </FormItem>
        <FormItem :label="$t('Phone')" prop="mobile">
          <Input v-model="formData.mobile"/>
        </FormItem>
        <FormItem :label="$t('Region')" prop="consigneeAddressPath">
          <region
            :addressId="addressPath"
            @selected="selectedRegion"
          />
        </FormItem>
        <FormItem :label="$t('Detailed address')" prop="detail">
          <Input v-model="formData.detail"/>
        </FormItem>
        <FormItem :label="$t('Location')">
          <div id="mapbox">
          </div>
        </FormItem>
        <FormItem :label="$t('Address type')">
          <div class="radio">
            <div class="radio-item" :class="{active: item == currentAlias}" v-for="(item, index) in aliasList"
                 :key="index" @click="handleChangeAlias(item)">
              {{ $t(item) }}
            </div>
          </div>
        </FormItem>
        <FormItem :label="$t('Default address')">
          <i-switch :disabled="initialDefault" v-model="formData.isDefault"/>
        </FormItem>
      </Form>
      <Spin fix size="large" v-if="loading"/>
      <div slot="footer">
        <Button type="default" @click="handleCancel">{{ $t('Cancel') }}</Button>
        <Button type="primary" @click="handleConfirm">{{ $t('Save') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import region from "@/components/map/region"
import {mapState} from "vuex";
import {defaultLocation} from "@/config";
import mapboxgl from "mapbox-gl";
import {editMemberAddress, getAddrDetail, newMemberAddress} from "../../../api/address";
import * as RegExp from '@/plugins/RegExp.js';


export default {
  name: "AddressModal",
  props: ['address'],
  components: {
    region,
  },
  data() {
    return {
      defaultLocation,
      loading: true,
      formData: {
        name: '',
        mobile: '',
        consigneeAddressPath: '',
        consigneeAddressIdPath: '',
        detail: '',
        alias: '',
        lon: '',
        lat: '',
        isDefault: false
      },
      initialDefault: false,
      formRule: {
        name: [{required: true, message: this.$t('Please enter name'), trigger: 'blur'}],
        mobile: [
          {required: true, message: this.$t('Please enter the phone number')},
          {
            pattern: RegExp.mobile,
            trigger: 'blur',
            message: this.$t('Invalid phone number')
          }
        ],
        detail: [{required: true, message: this.$t('Please enter name'), trigger: 'blur'}],
        consigneeAddressPath: [{required: true, message: this.$t('Please enter name'), trigger: 'change'}],

      },
      aliasList: ['Company', 'Resident'],
      currentAlias: null,
      addressPath: '',
      map: null,
      nav: null,
      marker: null
    }
  },
  computed: {
    ...mapState(['mapAccessToken', 'mapStyle', 'currentLocation']),
  },
  created() {
    if (this.address.id) this.getAddressById(this.address.id)
  },
  mounted() {
    mapboxgl.accessToken = this.mapAccessToken;
    // Add map
    this.map = new mapboxgl.Map({
      container: 'mapbox', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: this.mapStyle, // style URL
      center: this.currentLocation.center || defaultLocation,
      zoom: 17, // starting zoom
      attributionControl: false // turnoff attribution
    })
    this.formData.lon = (this.currentLocation.center || defaultLocation)[0]
    this.formData.lat = (this.currentLocation.center || defaultLocation)[1]
    this.map.on('render', () => {
      this.map.resize()
    })
    this.marker = new mapboxgl.Marker({
      color: "#f82323",
      draggable: false
    }).setLngLat(this.currentLocation.center || defaultLocation)
      .addTo(this.map);
    this.map.on('click', (e) => {
      this.marker.remove()
      this.marker = new mapboxgl.Marker({
        color: "#f82323",
        draggable: false
      }).setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(this.map)
      this.map.flyTo({center: [e.lngLat.lng, e.lngLat.lat], curve: 1.42})
      this.formData.lon = e.lngLat.lng
      this.formData.lat = e.lngLat.lat
    })
    this.nav = new mapboxgl.NavigationControl({visualizePitch: true})
    this.map.addControl(this.nav, 'bottom-right')
    this.map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {enableHighAccuracy: true},
        trackUserLocation: true,
        showUserHeading: true
      }), 'bottom-right'
    );
    // this.map.addControl(new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl,
    //     marker: false,
    //   }), 'top-left'
    // );
    this.loading = false
  },
  methods: {
    selectedRegion(item) {
      this.$set(this.formData, 'consigneeAddressIdPath', item[0].join(","));
      this.$set(this.formData, 'consigneeAddressPath', item[1].join(","));
    },
    handleChangeAlias(item) {
      if (this.currentAlias == item) {
        this.currentAlias = null
        this.formData.alias = ""
      } else {
        this.currentAlias = item
        this.formData.alias = item
      }
    },
    handleCancel() {
      this.$emit('close')
    },
    getAddressById(id) {
      getAddrDetail(id)
        .then((res) => {
          this.formData = res;
          this.initialDefault = res.isDefault
          this.addressPath = res.consigneeAddressIdPath
          this.currentAlias = res.alias
          this.marker.remove()
          this.marker = new mapboxgl.Marker({
            color: "#f82323",
            draggable: false
          }).setLngLat([res.lon, res.lat])
            .addTo(this.map)
          this.map.flyTo({center: [res.lon, res.lat], curve: 1.42})
        })
    },
    handleConfirm() {
      this.loading = true
      if (this.address.id) {
        this.edit()
      } else {
        this.add()
      }
      this.loading = false
    },
    edit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          editMemberAddress(this.address.id, params)
            .then((res) => {
              if (res.success) {
                this.$Message.success('Edit successfully')
                this.$emit('close')
              }
            }).catch((err) => {
            this.$Message.error(err.response.data.message)
          })
        }
      })
    },
    add() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          newMemberAddress(params)
            .then((res) => {
              if (res.success) {
                this.$Message.success(this.$t('Add successfully'))
                this.$emit('close')
              }
            }).catch((err) => {
            this.$Message.error(err.response.data.message)
          })
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
#mapbox {
  width: 568px;
  height: 200px;
}

.radio {
  display: flex;
  gap: 10px;

  .radio-item {
    min-width: 90px;
    text-align: center;
    padding: 4px 8px;
    border: 2px solid $border_color;
    border-radius: 4px;
    cursor: pointer;

    &.active {
      border: 2px solid $accent_color;
    }
  }
}
</style>
