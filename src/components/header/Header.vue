<template>
  <div class="box">
    <div class="nav">
      <ul>
        <li v-if="$route.path.includes('home')" style="margin-left:10px">
          <router-link to="/">{{ $t('Home') }}</router-link>
        </li>
        <li class="location" v-if="$route.name == 'Index'" @click="locationModal = true">
          <Icon type="ios-pin"/>
          <span v-if="!currentLocation">Chọn vị trí</span>
          <span v-else>{{ currentLocation.place_name }}</span>
        </li>
      </ul>
      <ul class="detail">
        <li class="first" v-show="!userInfo.username">
          <router-link :to="`/signUp`">
            <span style="border:none">{{ $t('Sign up') }}</span>
          </router-link>
        </li>
        <li v-show="!userInfo.username">
          <router-link :to="`/login?rePath=${$route.path}&query=${JSON.stringify($route.query)}`">
            <span style="border:none">{{ $t('Sign in') }}</span>
          </router-link>
        </li>
        <li v-show="!!userInfo.username">
          <div class="username-p">
            <div>
              <Avatar class="person-icon" :src="userInfo.face" icon="person" size="small"/>
              <span class="username" @click="goUserCenter('/home')">{{
                  userInfo.nickName ? userInfo.nickName : userInfo.username | secrecyMobile
                }}</span>
            </div>
            <transition name='fade'>
              <ul class="drop-items">
                <li @click="goUserCenter('/home')">{{ $t('Home') }}</li>
                <li @click="goUserCenter('/home/Coupons')">{{ $t('Coupons') }}</li>
                <li @click="goUserCenter('/home/Favorites')">{{ $t('Favorites') }}</li>
                <li @click="signOutFun">{{ $t('Sign out') }}</li>
              </ul>
            </transition>
          </div>
        </li>
        <li @click="goUserCenter('/home/MyOrder')"><span class="nav-item hover-color">{{ $t('Orders') }}</span></li>
        <!--        TODO -->
        <li v-if="false" @click="goUserCenter('/home/MyTracks')"><span
          class="nav-item hover-color">{{ $t('Footprint') }}</span></li>
        <li v-if="false" @click="goUserCenter('/home/MsgList')"><span
          class="nav-item hover-color">{{ $t('Messages') }}</span></li>
        <li v-if="$route.name !== 'Cart'" style="position:relative;margin-right: 22px">
          <i class="cart-badge " v-show="Number(cartNum)">{{ cartNum < 100 ? cartNum : '99' }}</i>
          <Dropdown placement="bottom-start">
            <router-link to="/cart" target="_self">
              <span @mouseenter="getCartList">
                <Icon size="18" type="ios-cart-outline"></Icon>
                {{ $t('Carts') }}
              </span>
            </router-link>
            <DropdownMenu slot="list">
              <div class="shopping-cart-null" style="width:200px" v-show="shoppingCart.length <= 0">
                <Icon type="ios-cart-outline" class="cart-null-icon"></Icon>
                <span>{{ $t('Empty Cart') }}</span>
                <span>{{ $t('Add to Cart') }}</span>
              </div>
              <div class="shopping-cart-list" v-show="shoppingCart.length > 0">
                <div class="shopping-cart-box" v-for="(item, index) in shoppingCart" @click="goToPay" :key="index">
                  <div class="shopping-cart-img">
                    <img :src="item.product.thumbnail" class="hover-pointer"/>
                  </div>
                  <div class="shopping-cart-info">
                    <div class="shopping-cart-title ">
                      <p class="hover-pointer goods-title ellipsis">{{ item.product.name }}</p>
                    </div>
                    <div class="shopping-cart-detail">
                      <p>
                        {{ $t('Quantity') }}:
                        <span class="shopping-cart-text">{{ item.num }}</span>
                        {{ $t('Price') }}:
                        <span class="shopping-cart-text">{{ item.purchasePrice | unitPrice("₫",  "before") }}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="go-to-buy">
                  <Button type="error" size="small" @click="goToPay">{{ $t('Checkout') }}</Button>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown>
        </li>
        <li>
          <span class="nav-item" @click="shopEntry">{{ $t('Shop') }}</span>
        </li>
      </ul>
    </div>
    <Modal v-model="locationModal" width="300" :mask-closable="false" :footer-hide="true">
      <div slot="close">
      </div>
      <div class="flex flex-column align-items-center gap-2 location-modal">
        <div class="img-holder">
          <img src="@/assets/images/location.svg" alt=""/>
        </div>
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
        <div v-else class="flex flex-column align-items-center gap-1 location-confirm">
          <div class="location-text">
            Bạn đang ở <br/><span>{{ tempLocation.place_name }}</span>
          </div>
          <Button long type="primary" @click="confirmLocation">Xác nhận</Button>
          <Divider>Hoặc</Divider>
          <Button long @click="openLocationMap">Địa chỉ khác</Button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Mapbox v-if="otherLocationModal" @on-close="otherLocationModal=false" @on-confirm="handleChooseOtherLocation"/>
  </div>
</template>

<script>
import Storage from '@/plugins/storage.js';
import {cartGoodsAll} from '@/api/cart.js';
import {AccountLogout} from "@/api/account";
import storage from "../../plugins/storage";
import {mapMutations, mapState} from "vuex";
import {reverseGeocode} from "@/api/map";
import Mapbox from "@/components/Modal/Mapbox.vue";

export default {
  name: 'M-Header',
  components: {Mapbox},
  created() {
    if (Storage.getItem('buyer_userInfo')) {
      this.userInfo = JSON.parse(Storage.getItem('buyer_userInfo'));
    }
  },

  data() {
    return {
      userInfo: {},
      shoppingCart: [],
      locationModal: false,
      locationLoading: true,
      tempLocation: '',
      otherLocationModal: false
    };
  },
  mounted() {
    if (!this.currentLocation) {
      this.locationModal = true
    }
  },
  computed: {
    ...mapState(['currentLocation', 'mapAccessToken']),
    cartNum() {
      return this.$store.state.cartNum;
    }
  },
  watch: {
    locationModal: {
      handler(val) {
        if (val) {
          this.navigateLocation()
        }
      }
    }
  },
  methods: {
    ...mapMutations(['SET_LOCATION']),
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
        if (error.code == 1) {
          this.$Message.error('User denied geolocation')
        }
        else {
          this.$Message.error(error.message)
        }
      });
    },
    openLocationMap() {
      this.locationModal = false
      this.otherLocationModal = true
    },
    confirmLocation() {
      this.SET_LOCATION(this.tempLocation)
      this.locationModal = false
    },
    handleChooseOtherLocation(e) {
      let {lat, lng} = e
      const loc = `${lng},${lat}`
      reverseGeocode(this.mapAccessToken, loc).then(res => {
        if (res.data.features) {
          let poi, place
          poi = res.data.features.find(i => i.place_type[0] == 'poi')
          if (poi == undefined) {
            place = res.data.features.find(i => i.place_type[0] == 'place')
          }
          this.tempLocation = poi || place
          this.SET_LOCATION(this.tempLocation)
          this.locationModal = false
          this.otherLocationModal = false
        }
      })
    },
    goToPay() {
      let url = this.$router.resolve({
        path: '/cart'
      });
      window.open(url.href, '_self');
    },
    myInfo() {
      let url = this.$router.resolve({
        path: '/home'
      });
      window.open(url.href, '_self');
    },
    signOutFun() {
      AccountLogout().then(res => {
        storage.removeItem('buyer_accessToken');
        storage.removeItem('buyer_refreshToken');
        storage.removeItem('buyer_userInfo');
        storage.removeItem('cartNum');
        this.$store.commit('SET_CARTNUM', 0)
        this.$router.push('/login');
      });
    },
    goUserCenter(path) {
      if (this.userInfo.username) {
        this.$router.push({path: path});
      } else {
        this.$Modal.confirm({
          title: this.$t('Please sign in'),
          content: this.$t('Please login to perform this action'),
          okText: this.$t('Sign in'),
          cancelText: this.$t('Back'),
          onOk: () => {
            this.$router.push({
              path: '/login',
              query: {
                rePath: this.$router.history.current.path,
                query: JSON.stringify(this.$router.history.current.query)
              }
            });
          }
        });
      }
    },
    shopEntry() {
      if (storage.getItem('buyer_accessToken')) {
        let routeUrl = this.$router.resolve({
          path: '/shopEntry',
          query: {id: 1}
        });
        window.open(routeUrl.href, '_self');
      } else {
        this.$router.push('login');
      }
    },
    getCartList() {
      if (this.userInfo.username) {
        cartGoodsAll().then((res) => {
          this.shoppingCart = res.result.cartProducts;
          this.$store.commit('SET_CARTNUM', this.shoppingCart.length);
          this.Cookies.setItem('cartNum', this.shoppingCart.length);
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/waveText.css";

.username {
  font-weight: 700;
  color: #fff;
}

.box {
  width: 100%;
  font-size: 14px !important;
  // height: 35px;
  @include background_color($accent_color_tint);
}

.nav {
  margin: 0 auto;
  width: 1200px;
  max-width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.nav ul {
  list-style: none;
}

.nav li {
  float: left;
  font-size: 14px;
  line-height: 35px;
  margin-right: 10px;
}

.nav a,
.nav-item {
  text-decoration: none;
  padding-left: 14px;
  border-left: 1px solid #ccc;
  color: #fff;
  cursor: pointer;
}

.location a {
  border-left: none;
}

.nav a:hover {
  color: $secondary_color;
}

.icon {
  color: gray;
  vertical-align: middle;
}

.first a:first-child {
  padding-left: 3px;
  border-left: none;
}

.city {
  padding: 10px 15px;
}

.city-item {
  font-weight: bold;
  cursor: pointer;
  padding: 5px;
}

.city-item:hover {
  color: $secondary_color;
}

.person-icon {
  color: $secondary_color;
  background-color: #f0cdb2;
}

.shopping-cart-list {
  padding: 10px 15px;
  box-sizing: border-box;
  max-height: 300px;
  overflow: scroll;
}

.shopping-cart-box {
  margin: 8px 0px;
  margin-top: 15px;
  padding-bottom: 15px;
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px #ccc dotted;
}

.shopping-cart-box:first-child {
  margin-top: 8px;
}

.shopping-cart-img {
  margin-right: 15px;
  width: 40px;
  height: 40px;
}

.shopping-cart-img img {
  width: 100%;
}

.shopping-cart-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
  width: 200px;
  overflow: hidden;
  font-size: 14px;
  line-height: 20px;
}

.go-to-buy {
  display: flex;
  justify-content: flex-end;
}

.shopping-cart-null {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cart-null-icon {
  font-size: 38px;
  margin-bottom: 15px;
}

.shopping-cart-null span {
  font-size: 14px;
  line-height: 16px;
}

.username-p {
  position: relative;

  div {
    cursor: pointer;

    > span {
      margin-left: 5px;
    }
  }

  .drop-items {
    position: absolute;
    display: none;
    top: 45px;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 5px 10px;
    z-index: 20;
    height: 150px;
    background-color: #fff;
    width: 120px;
    border: 1px solid #eee;
    box-shadow: 2px 2px 7px #999;

    li {
      color: rgb(107, 106, 106);
      width: 100%;
      border-bottom: 1px solid rgb(207, 206, 206);
      font-weight: normal;
      text-align: center;

      &:last-child {
        border: none;
      }

      &:hover {
        cursor: pointer;
        color: $secondary_color;
      }
    }

    &::before {
      position: absolute;
      top: -20px;
      left: 30px;
      content: '';
      width: 0;
      height: 0;
      border: 10px solid #999;
      border-color: transparent transparent #fff transparent;
    }

    &::after {
      content: '';
      position: absolute;
      width: 80px;
      height: 20px;
      top: -20px;
      left: 0;
    }
  }

  &:hover {
    .drop-items {
      display: block;
      z-index: 9999;
    }
  }
}

.my-page {
  padding: 3px 5px;
  width: 180px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-page a {
  margin: 0px;
  padding: 0px;
  border: none;
}

.my-info {
  padding: 5px;
  width: 50%;
  height: 100%;
  text-align: center;
  cursor: pointer;
}

.my-info:hover {
  box-shadow: 0px 0px 5px #ccc;
}

.my-info i {
  font-size: 28px;
}

.my-info p {
  font-size: 14px;
}

.sign-out {
  padding: 5px;
  width: 50%;
  height: 100%;
  text-align: center;
  cursor: pointer;
}

.sign-out:hover {
  box-shadow: 0px 0px 5px $border_color;
}

.sign-out i {
  font-size: 28px;
}

.sign-out p {
  font-size: 14px;
}

.goods-title:hover {
  color: $accent_color;
}

.cart-badge {
  position: absolute;
  right: -20px;
  font-style: normal;
  background-color: #fff;
  color: $accent_color;
  border: 1px solid $accent_color;
  font-size: 14px;
  width: 20px;
  height: 17px;
  border-radius: 10px;
  line-height: 17px;
  text-align: center;
  z-index: 3;
  top: 3px;
}

.location {
  color: #fff;
  text-decoration: underline;
  cursor: pointer;
}

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
    .location-text {
      text-align: center;

      > span {
        font-weight: 600;
      }
    }
  }
}
</style>
