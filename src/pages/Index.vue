<template>
  <div class="container" id="container">
    <model-form v-if="dataLoaded" ref="modelForm" :data="modelForm"></model-form>
    <div v-else class="flex justify-content-center align-items-center" style="width: 100%; height: 90vh">
      <span class="index-loader">BESA</span>
    </div>

    <Discovery v-if="favoriteLoaded"/>
    <Introduce></Introduce>
    <BaseFooter></BaseFooter>
    <div class="scroll-top" :class="{'is-show': windowTop > 400}" @click="scrollToTop">
      <span><Iconify icon="bxs:up-arrow" style="color: #fff"/></span>
    </div>
  </div>
</template>

<script>
import ModelForm from "@/components/indexDecorate/ModelForm.vue";
import Introduce from "@/components/footer/Introduce.vue";
import HorizontalNavbar from "@/components/nav/HorizontalNavbar.vue";
import WebSocket from "@/components/socket/WebSocket.vue";
import Header from "./index/Header.vue"
import NavigationBar from "@/pages/index/NavigationBar.vue";
import {indexData} from "@/api";
import Discovery from "./index/Discovery.vue";
import {collectRecentStoreList, collectServiceList} from "../api/member";
import {mapMutations, mapState} from "vuex";

export default {
  name: "Index",
  components: {Discovery, NavigationBar, HorizontalNavbar, Introduce, ModelForm, Header, WebSocket},
  data() {
    return {
      modelForm: {},
      windowTop: 0,
      dataLoaded: false,
      favoriteLoaded: false
    }
  },
  created() {
    this.getIndexData()
  },
  async mounted() {
    window.addEventListener("scroll", this.updateWindowScroll);
    // let loggedIn = !!(this.$cookies.get('buyer_accessToken') && this.$cookies.get('buyer_userInfo'))
    let loggedIn = !!(this.$cookies.get('buyer_accessToken'))
    if (loggedIn) {
      try {
        let serviceRes = await collectServiceList()
        let storeRes = await collectRecentStoreList()
        if (serviceRes.success) {
          this.SET_FAVORITE_SERVICE_LIST(serviceRes.result.content.map(i => i.serviceId))
        }
        if (storeRes.success) {
          this.SET_FAVORITE_STORE_LIST(storeRes.result.map(i => i.storeId))
        }
        this.favoriteLoaded = true
      } catch (e) {
        this.favoriteLoaded = false
      }
    } else {
      this.favoriteLoaded = true
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.updateWindowScroll);
  },
  methods: {
    ...mapMutations(['SET_FAVORITE_SERVICE_LIST', 'SET_FAVORITE_STORE_LIST']),
    getIndexData() {
      let params = {
        pageClientType: 'PC',
        pageType: 'INDEX',
        pageShow: 'OPEN',
        url: this.$route.fullPath
      }
      indexData(params).then(res => {
        if (res.success) {
          this.modelForm = JSON.parse(res.result.pageData)
        }
      }).finally(() => {
        this.dataLoaded = true
      })
    },
    updateWindowScroll() {
      this.windowTop = window.scrollY;
    },
    scrollToTop() {
      document.getElementById('container').scrollIntoView({behavior: 'smooth'});
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  //@include sub_background_color($dominant_color);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 10px;
}

.scroll-top {
  position: fixed;
  opacity: 1;
  visibility: hidden;
  overflow: hidden;
  text-align: center;
  z-index: 1001;
  background-color: rgba(0, 0, 0, .4);
  color: #fff;
  width: 40px;
  height: 40px;
  line-height: 40px;
  right: 20px;
  bottom: -50px;
  padding-top: 2px;
  border-radius: 50%;
  border: none;
  -webkit-box-shadow: 0 0 4px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, .1);
  -webkit-transition: all .25s ease-in-out;
  transition: all .25s ease-in-out;

  &.is-show {
    opacity: 0.8;
    visibility: visible;
    cursor: pointer;
    bottom: 20px;
  }
}

// Loader
.index-loader {
  font-size: 48px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  display: inline-block;
  color: $accent_color;
  letter-spacing: 2px;
  position: relative;
  box-sizing: border-box;
}

.index-loader::after {
  content: 'BESA';
  position: absolute;
  left: 0;
  top: 0;
  color: #FFF;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  animation: animloader 3s linear infinite;
}

@keyframes animloader {
  0% {
    height: 100%;
  }
  100% {
    height: 0%;
  }
}
</style>
