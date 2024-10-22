<template>
  <div>
    <Form ref="shopForm" :model="form" :rules="rules" :label-width="140" label-position="left">
      <FormItem :label="$t('Store name')" prop="storeName">
        <Input
          type="text"
          v-model="form.storeName"
        />
      </FormItem>
      <FormItem :label="$t('Store logo')" prop="storeLogo">
        <Upload
          ref="uploadLogo"
          v-if="!form.storeLogo"
          :show-upload-list="false"
          :data="{isTmp: true}"
          accept=".jpg,.jpeg,.png"
          :format="['jpg', 'jpeg', 'png']"
          :max-size="5120"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-error="handleUploadError"
          multiple
          :action="action"
          :headers="{ Authorization: `Bearer ${token}` }"
          style="width: 148px; height: 148px;"
          type="drag"
        >
          <div style="width: 148px; height: 148px; line-height: 148px">
            <Icon size="36" type="md-add"></Icon>
          </div>
        </Upload>
        <div class="img-list" v-else>
          <img :src="form.storeLogo" alt=""/>
          <div class="cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleViewLogo"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemoveLogo"
            ></Icon>
          </div>
        </div>
        <!--        <div class="describe">{{ $t('Please compress the picture within 10MB, the format is .jpg, .jpeg or .png') }}</div>-->
      </FormItem>
      <FormItem :label="$t('Phone')" prop="linkPhone">
        <Input
          type="text"
          v-model="form.linkPhone"
        />
      </FormItem>
      <FormItem :label="$t('Store address')" prop="storeAddressDetail">
        <Input
          type="text"
          v-model="form.storeAddressDetail"
        />
      </FormItem>
      <FormItem prop="lat">
        <div id="storeAddressMap">
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loading" @click="next">{{ $t('Sign up') }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {commonUrl} from "../../plugins/request";
import storage from "../../plugins/storage";
import {mapState} from "vuex";
import mapboxgl from "mapbox-gl";
import {defaultLocation} from "../../config";
import {applyShopInfo} from "../../api/shopentry";

export default {
  name: "ShopInfoForm",
  props: ['token'],
  data() {
    return {
      form: {
        storeName: '',
        storeLogo: '',
        storeAddressDetail: '',
        linkPhone: '',
        lon: '',
        lat: ''
      },
      rules: {
        storeName: [{required: true, message: this.$t('Please fill in the store name'), trigger: 'blur'}],
        storeLogo: [{required: true, message: this.$t('Please upload the store logo')}],
        linkPhone: [
          {required: true, message: this.$t('Please enter the phone number'), trigger: 'blur'},
          {pattern: RegExp.mobile, message: this.$t('Invalid phone number'), trigger: 'blur'}
        ],
        storeAddressDetail: [{required: true, message: this.$t('Please enter detailed address'), trigger: 'blur'}],
        lat: [{type: 'number', required: true, message: this.$t('Please select location on map'), trigger: 'blur'}]
      },
      action: commonUrl + "/buyer/common/file",
      defaultLocation,
      map: null,
      nav: null,
      marker: null,
      loading: false
    }
  },
  mounted() {
    mapboxgl.accessToken = this.mapAccessToken;
    // Add map
    this.map = new mapboxgl.Map({
      container: 'storeAddressMap', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: this.mapStyle, // style URL
      center: this.currentLocation.center || defaultLocation,
      zoom: 17, // starting zoom
      attributionControl: false // turnoff attribution
    })
    // this.form.lon = (this.currentLocation.center || defaultLocation)[0]
    // this.form.lat = (this.currentLocation.center || defaultLocation)[1]
    this.map.on('render', () => {
      this.map.resize()
    })
    // this.marker = new mapboxgl.Marker({
    //   color: "#f82323",
    //   draggable: false
    // }).setLngLat(this.currentLocation.center || defaultLocation)
    //   .addTo(this.map);
    this.map.on('click', (e) => {
      if (this.marker) {
        this.marker.remove()
      }
      this.marker = new mapboxgl.Marker({
        color: "#f82323",
        draggable: false
      }).setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(this.map)
      this.map.flyTo({center: [e.lngLat.lng, e.lngLat.lat], curve: 1.42})
      this.form.lon = e.lngLat.lng
      this.form.lat = e.lngLat.lat
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
  },
  computed: {
    ...mapState(['mapAccessToken', 'mapStyle', 'currentLocation']),
  },
  methods: {
    beforeUpload() {
    },
    handleSuccess(res) {
      this.form.storeLogo = res.result;
    },
    handleFormatError() {
      this.$Message.error(this.$t('The file format must be .jpg, .jpeg or .png'))
    },
    handleMaxSize() {
      this.$Message.error(this.$t('The file size cannot exceed 10MB'))
    },
    handleUploadError() {
    },
    handleViewLogo() {
      this.$viewerApi({
        images: [this.form.storeLogo],
      })
    },
    handleRemoveLogo() {
      this.form.storeLogo = ''
    },
    next() {
      if(this.loading) return
      this.$refs.shopForm.validate(valid => {
        if (valid) {
          let form = {
            ...this.form,
            storeAddressCenter: `${this.form.lat},${this.form.lon}`
          }
          delete form.lat
          delete form.lon
          this.loading = true
          applyShopInfo(form, this.token).then(res => {
            if(res.success) {
              this.$parent.currentIndex++
              this.$parent.registerStatus = 'PENDING'
            }
          }).catch((err) => {
            this.$Message.error(err.response.data.message)
          })
            .finally(()=>{
            setTimeout(()=>{
              this.loading = false
            }, 500)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ivu-input-wrapper {
  width: 300px;
}

.img-list {
  display: inline-block;
  width: 148px;
  height: 148px;
  position: relative;

  > img {
    width: 148px;
    height: 148px;
    object-fit: cover;
  }

  .cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    width: inherit;
    height: inherit;
    align-items: center;
    justify-content: space-around;

    i {
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
  }

  &:hover .cover {
    display: flex;
  }
}

.describe {
  font-size: 14px;
  color: #999;
}

#storeAddressMap {
  width: 568px;
  height: 200px;
}
</style>
