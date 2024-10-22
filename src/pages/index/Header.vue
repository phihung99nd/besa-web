<template>
  <div class="index-header">
    <div class="nav-container">
      <div class="left-container">
        <Language/>
        <Location :option="locationList" @get-current="recheckLocation"/>
      </div>
      <div class="right-container">
        <router-link v-if="!userInfo.username"
                     :to="`/login?rePath=${$route.path}&query=${JSON.stringify($route.query)}`">
          <button class="btn">{{ $t('Sign in') }}</button>
        </router-link>
        <router-link v-if="!userInfo.username" :to="`/signUp`">
          <button class="btn" style="border-right: 1px solid #dddee1;">{{ $t('Sign up') }}</button>
        </router-link>
        <v-dropdown v-if="userInfo.username" mode="hover">
          <template #trigger>
            <Avatar shape="circle" v-if="userInfo.face" :src="userInfo.face" icon="person" size="20" style="margin-left: 15px;"/>
            <Avatar shape="circle" v-else icon="ios-person" size="20" style="margin-left: 15px;"/>
            <span style="font-size: 12px">&nbsp;{{ userInfo.username }}</span>
          </template>
          <template #body>
            <div class="dropdown-menu">
              <div class="dropdown-menu__option" @click="$router.push({name: 'Profile'})">
                <button class="btn">{{ $t('Profile') }}</button>
              </div>
              <div class="dropdown-menu__option" @click="logOut">
                <button class="btn">{{ $t('Sign out') }}</button>
              </div>
            </div>
          </template>
        </v-dropdown>
        <router-link :to="{name: 'MyOrder'}" v-if="userInfo.username">
          <button class="btn" style="border-right: 1px solid #dddee1;">{{ $t('Order') }}</button>
        </router-link>
        <router-link :to="{name: 'MyBooking'}" v-if="userInfo.username">
          <button class="btn" style="border-right: 1px solid #dddee1;">{{ $t('Booking') }}</button>
        </router-link>
        <router-link :to="{name: 'Cart'}" v-if="userInfo.username">
          <button class="btn" style="border-right: 1px solid #dddee1;">{{ $t('Cart') }}</button>
        </router-link>
        <router-link :to="{name: 'shopEntry'}" v-if="$route.name != 'shopEntry'">
          <button class="btn" style="border-right: 1px solid #dddee1;">{{ $t('Seller Channel') }}
          </button>
        </router-link>
        <router-link :to="{name: 'Index'}" v-else>
          <button class="btn" style="border-right: 1px solid #dddee1;">{{ $t('Home') }}
          </button>
        </router-link>
        <HeaderNotification/>
      </div>
    </div>
    <Modal v-model="locationModal" width="300" @on-visible-change="handleCloseLocationModal" :mask-closable="true"
           :footer-hide="true" :styles="{top: '10px'}">
      <div slot="close">
      </div>
      <div class="flex flex-column align-items-center gap-2 location-modal">
        <!--        <div class="img-holder">-->
        <!--          <img src="@/assets/images/location.svg" alt=""/>-->
        <!--        </div>-->
        <h3>Tìm kiếm dịch vụ tốt nhất</h3>
        <div style="text-align: center">Xác nhận vị trí của bạn để tìm kiếm các dịch vụ ở gần</div>
        <div v-if="locationLoading" class="waveTextAnimated">
          <span>Đ</span>
          <span>a</span>
          <span>n</span>
          <span>g</span>
          <span>&nbsp;</span>
          <span>T</span>
          <span>ì</span>
          <span>m</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
        <div v-else-if="!locationLoading" class="flex flex-column align-items-center gap-1 location-confirm">
          <div v-if="tempLocation" class="location-text">
            Bạn đang ở <br/><span>{{ tempLocation.place_name }}</span>
          </div>
          <Button v-if="tempLocation" long type="primary" @click="confirmLocation">Xác nhận</Button>
          <div v-else class="location-text">
            <span>Vui lòng kiểm tra lại quyền truy cập vị trí của trình duyệt</span>
          </div>
        </div>
        <Divider>Hoặc</Divider>
        <template v-if="locationModal">
          <span>Chọn địa điểm khác</span>
          <Select v-model="otherLocation.province" placeholder="Tỉnh">
            <Option v-for="item in locationList" :value="item" :key="item.place_name">{{ item.place_name }}</Option>
          </Select>
          <Select v-model="otherLocation.district" placeholder="Quận/huyện" :disabled="!otherLocation.province">
            <Option v-for="item in currentDistrictList" :value="item" :key="item.place_name">{{
                item.place_name
              }}
            </Option>
          </Select>
          <Select v-model="otherLocation.ward" placeholder="Phường/xã" :disabled="!otherLocation.district">
            <Option v-for="item in currentWardList" :value="item" :key="item.place_name">{{ item.place_name }}</Option>
          </Select>
          <Button long type="primary" :disabled="!otherLocation.province" @click="confirmOtherLocation">Xác nhận
          </Button>
        </template>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import Storage from "@/plugins/storage";
import Location from "@/pages/index/navbar/Location.vue";
import {mapMutations, mapState} from "vuex";
import {reverseGeocode} from "@/api/map";
import Language from "@/pages/index/navbar/Language.vue";
import {AccountLogout} from "@/api/account";
import storage from "@/plugins/storage";
import {getAvailableRegion} from "../../api/common";
import {defaultLocation} from "../../config";
import HeaderNotification from "./navbar/Notification.vue";
import DropdownMenu from "v-dropdown-menu/vue2";

export default {
  name: "Header",
  components: {HeaderNotification, Language, Location},
  data() {
    return {
      userInfo: {},
      locationModal: false,
      locationLoading: true,
      tempLocation: '',
      otherLocation: {
        province: '',
        district: '',
        ward: ''
      },
      locationList: []
    }
  },
  created() {
    this.initAvailableLocation()
    if (!this.currentLocation) {
      // this.locationModal = true
      let obj = {
        place_name: 'Hà Nội',
        center: defaultLocation
      }
      this.SET_LOCATION(obj)
    }
  },
  mounted() {
    if (Storage.getItem('buyer_userInfo')) {
      this.userInfo = JSON.parse(Storage.getItem('buyer_userInfo'))
    }
    this.$bus.$on('update-user-profile', this.handleEditProfile)
  },
  destroyed() {
    this.$bus.$off('update-user-profile', this.handleEditProfile)
  },
  watch: {
    locationModal: {
      handler(val) {
        if (val) {
          this.navigateLocation()
        }
      }
    },
  },
  computed: {
    ...mapState(['currentLocation', 'mapAccessToken']),
    currentDistrictList() {
      let list = this.locationList.filter(i => i.place_name == this.otherLocation.province.place_name)[0]
      return list ? list.children : []
    },
    currentWardList() {
      let list = this.currentDistrictList.filter(i => i.place_name == this.otherLocation.district.place_name)[0]
      return list ? list.children : []
    },
  },
  methods: {
    ...mapMutations(['SET_LOCATION']),
    initAvailableLocation() {
      getAvailableRegion(0).then(res => {
        let data = res.result
        data = data.map(i => ({
          ...i,
          center: i.center ? i.center.split(",") : defaultLocation,
          place_name: i.name,
          children: i.children.map(c => ({
            ...c,
            center: c.center ? c.center.split(",") : defaultLocation,
            place_name: c.name,
            children: c.children.map(gc => ({
              ...gc,
              center: gc.center ? gc.center.split(",") : defaultLocation,
              place_name: gc.name,
              children: gc.children
            }))
          }))
        }))
        this.locationList = data
      })
    },

    navigateLocation() {
      this.tempLocation = ''
      this.locationLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const long = position.coords.longitude
        let loc = `${long},${lat}`
        reverseGeocode(this.mapAccessToken, loc).then(res => {
          if (res.data.features) {
            let poi, place
            poi = res.data.features.find(i => i.place_type[0] == 'poi')
            if (poi == undefined) {
              place = res.data.features.find(i => i.place_type[0] == 'place')
            }
            this.tempLocation = poi || place
            setTimeout(() => {
              this.locationLoading = false
            }, 1000)

          }
        })
      }, error => {
        this.tempLocation = ''
        setTimeout(() => {
          this.locationLoading = false
        }, 1000)
      });
    },

    confirmLocation() {
      this.SET_LOCATION(this.tempLocation)
      this.locationModal = false
    },

    confirmOtherLocation() {
      if (this.otherLocation.ward) {
        let obj = {
          ...this.otherLocation.ward,
          place_name: `${this.otherLocation.ward.place_name}, ${this.otherLocation.district.place_name}, ${this.otherLocation.province.place_name}`
        }
        this.SET_LOCATION(obj)
      } else if (this.otherLocation.district) {
        let obj = {
          ...this.otherLocation.district,
          place_name: `${this.otherLocation.district.place_name}, ${this.otherLocation.province.place_name}`
        }
        this.SET_LOCATION(obj)
      } else if (this.otherLocation.province) {
        let obj = {
          ...this.otherLocation.province,
          place_name: `${this.otherLocation.province.place_name}`
        }
        this.SET_LOCATION(obj)
      }
      this.locationModal = false
    },

    recheckLocation() {
      this.otherLocation.province = ''
      this.otherLocation.district = ''
      this.otherLocation.ward = ''
      this.locationModal = true
    },

    handleCloseLocationModal(e) {
      if (!e) {
        if (!this.currentLocation) {
          let obj = {
            place_name: 'Hà Nội',
            center: defaultLocation
          }
          this.SET_LOCATION(obj)
        }
      }
    },
    handleEditProfile(info) {
      this.userInfo = {...info}
    },
    logOut() {
      AccountLogout().then(res => {
        this.$cookies.remove('buyer_accessToken');
        this.$cookies.remove('buyer_refreshToken');
        this.$cookies.remove('buyer_userInfo');
        this.$cookies.remove('cartNum');
        this.$store.commit('SET_CARTNUM', 0)
        this.$store.commit('SET_FAVORITE_SERVICE_LIST', [])
        this.$store.commit('SET_FAVORITE_STORE_LIST', [])
        this.$router.push('/login');
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import 'navbar/navbar';

$default_header_height: 30px;
.index-header {
  height: $default_header_height;
  width: 100%;
  background: #fff;

  .nav-container {
    margin: 0 auto;
    height: 100%;
    width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-container {
      display: flex;
      justify-content: start;
      align-items: center;
      padding: 10px 0;
      height: 100%;
      gap: 20px;
    }

    .right-container {
      display: flex;
      flex-direction: row-reverse;
      justify-content: end;
      align-items: center;
      padding: 10px 0;
      height: 100%;
    }
  }
}

// Location modal --------------------------------------
.location-modal {

  .img-holder {
    position: relative;

    > img {
      width: 250px;
      height: 150px;
      object-fit: contain;
    }
  }

  .location-confirm {
    width: 100%;

    .location-text {
      text-align: center;

      > span {
        font-weight: 600;
      }
    }
  }
}
</style>
