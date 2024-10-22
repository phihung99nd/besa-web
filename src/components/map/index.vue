<template>
  <div class="lili-map">
    <Modal v-model="showMap" title="选择地址" width="800">
      <div class="address">{{ addrContent.address }}</div>
      <div id="map-container"></div>

      <div class="search-con">
        <Input
          placeholder="输入关键字搜索"
          id="input-map"
          v-model="mapSearch"
        />
        <ul>
          <li
            v-for="(tip, index) in tips"
            :key="index"
            @click="selectAddr(tip.location)"
          >
            <p>{{ tip.name }}</p>
            <p>{{ tip.district + tip.address }}</p>
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="default" @click="showMap = false">{{ $t('Cancel') }}</Button>
        <Button type="primary" :loading="loading" @click="ok">{{ $t('Open') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import { handleRegion } from '@/api/address.js';

export default {
  name: 'map',
  props: {
    useApi: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      config:require('@/config'),
      showMap: false,
      mapSearch: '',
      map: null,
      autoComplete: null,
      geocoder: null,
      positionPicker: null,
      tips: [],
      addrContent: {},
      loading: false
    };
  },
  watch: {

    mapSearch: function (val) {
      this.searchOfMap(val);
    }
  },
  methods: {
    ok () {

      this.loading = true;
      const address = this.addrContent.address;
      const township = this.addrContent.regeocode.addressComponent.township;
      const index = address.indexOf(township) + township.length;
      this.addrContent.detail = address.substring(index);
      const params = {
        cityCode: this.addrContent.regeocode.addressComponent.citycode,
        townName: this.addrContent.regeocode.addressComponent.township
      };
      if (this.useApi) {
        handleRegion(params).then((res) => {
          this.loading = false;
          if (res.success) {
            this.showMap = false;
            this.addrContent.addr = res.result.name.replace(/,/g, ' ');
            this.addrContent.addrId = res.result.id;
            this.$emit('getAddress', this.addrContent);
          }
        });
      } else {
        this.loading = false;
        this.showMap = false;
        this.$emit('getAddress', this.addrContent);
      }
    },
    init () {
      AMapLoader.load({
        key: this.config.aMapKey,
        version: '',
        plugins: [
          'AMap.ToolBar',
          'AMap.Autocomplete',
          'AMap.PlaceSearch',
          'AMap.Geolocation',
          'AMap.Geocoder'
        ],
        AMapUI: {

          version: '1.1',
          plugins: ['misc/PositionPicker']
        }
      })
        .then((AMap) => {
          let that = this;
          this.map = new AMap.Map('map-container', {
            zoom: 12
          });
          that.map.addControl(new AMap.ToolBar());
          that.map.addControl(new AMap.Autocomplete());
          that.map.addControl(new AMap.PlaceSearch());
          that.map.addControl(new AMap.Geocoder());


          let autoOptions = {
            city: '全国'
          };
          that.autoComplete = new AMap.Autocomplete(autoOptions);
          that.geocoder = new AMap.Geocoder(autoOptions);

          that.positionPicker = new AMapUI.PositionPicker({

            mode: 'dragMap',
            map: that.map
          });
          that.positionPicker.start();
          /**
           *
           * 所有回显数据，都在positionResult里面
           * 需要字段可以查找
           *
           */
          that.positionPicker.on('success', function (positionResult) {

            that.addrContent = positionResult;
          });
        })
        .catch((e) => {});
    },
    searchOfMap (val) {

      let that = this;
      this.autoComplete.search(val, function (status, result) {

        if (status === 'complete' && result.info === 'OK') {
          that.tips = result.tips;
        } else {
          that.tips = [];
        }
      });
    },
    selectAddr (location) {

      if (!location) {
        this.$Message.warning(this.$t('Please choose the correct point'));
        return false;
      }
      const lnglat = [location.lng, location.lat];
      this.positionPicker.start(lnglat);
    }
  },
  mounted () {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
#map-container {
  width: 500px;
  height: 400px;
}

.search-con {
  position: absolute;
  right: 20px;
  top: 64px;
  width: 260px;
  ul {
    width: 260px;
    height: 400px;
    overflow: scroll;
    li {
      padding: 5px;
      p:nth-child(2) {
        color: #999;
        font-size: 14px;
      }
      &:hover {
        background-color: #eee;
        cursor: pointer;
      }
    }
  }
}

.address {
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
