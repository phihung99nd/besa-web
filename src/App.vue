<template>
  <div class="app" id="app">
    <div class="top--sticky" v-if="!whitelistLayout.includes($route.name)">
      <BaseHeader/>
      <NavigationBar/>
    </div>
    <div style="margin-top: 90px" v-if="!whitelistLayout.includes($route.name)"></div>
<!--    <transition name="slide-right" v-if="shouldTransition">-->
      <router-view :key="$route.fullPath"/>
<!--    </transition>-->
<!--    <router-view v-else :key="$route.fullPath"/>-->
    <v-notify group="calendar" position="bottom right" style="width: 400px">
      <template #body="{item, close}">
        <div class="calendar-notify-container">
          <div class="content">
            <div class="title">{{ $t('Create booking successfully') }}</div>
            <div class="description">{{ $t('Do you want to add this event to Google Calendar?') }}</div>
            <div class="footer">
              <Button type="primary" @click="item.data.callback">{{ $t('Add to calendar') }}</Button>
              <Button type="text" @click="close">{{ $t('No need') }}</Button>
            </div>
          </div>
          <div class="close" @click.stop="close">
            <Icon type="ios-close" size="20"/>
          </div>
        </div>
      </template>
    </v-notify>
  </div>
</template>

<script>
import storage from "@/plugins/storage";
import {getBaseSite} from "@/api/common.js";
import NavigationBar from "./pages/index/NavigationBar.vue";
// import { ApmVuePlugin } from '@elastic/apm-rum-vue'

// // Add this to the VERY top of the first file loaded in your app
// var apm = require('elastic-apm-node').start({

// // Override the service name from package.json
// // Allowed characters: a-z, A-Z, 0-9, -, _, and space
// serviceName: 'APM-bono-web',

// // Use if APM Server requires a secret token
// // secretToken: '',

// // Set the custom APM Server URL (default: http://localhost:8200)
// serverUrl: '103.157.218.88:8200',

// // Set the service environment
// environment: 'dev'
// })
export default {
  name: "App",
  components: {NavigationBar},
  data() {
    return {
      whitelistLayout: ['login', 'SignUp', 'forgetPassword'],
    }
  },
  mounted() {
    this.init();
    this.$bus.$on('on-same-route', this.reload)
  },
  destroyed() {
    this.$bus.$off('on-same-route', this.reload)
  },
  computed: {
    shouldTransition(){
      return !this.$route.path.split('/').includes('home')
    }
  },
  methods: {
    init() {
      if (!storage.getItem("siteName") || !storage.getItem("logoImg") || !storage.getItem("sitelogo_expiration_time")) {
        this.getSite();
      } else {
        if (new Date() > storage.getItem("sitelogo_expiration_time")) {
          this.getSite();
          return;
        } else {
          window.document.title = storage.getItem("siteName");
          let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
          link.type = "image/x-icon";
          link.href = storage.getItem("logoImg");
          link.rel = "shortcut icon";
          document.getElementsByTagName("head")[0].appendChild(link);
        }
      }

    },
    getSite() {
      getBaseSite().then((res) => {
        if (res.success && res.result && res.result.settingValue) {
          let data = JSON.parse(res.result.settingValue);
          var expirationTime = new Date().setHours(new Date().getHours() + 1);
          storage.setItem("sitelogo_expiration_time", expirationTime);
          storage.setItem('siteName', data.siteName);
          storage.setItem('logoImg', data.buyerSideLogo);

          if (data.siteName) {
            window.document.title = data.siteName;
          }
          let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
          link.type = "image/x-icon";
          link.href = data.buyerSideLogo;
          link.rel = "shortcut icon";
          document.getElementsByTagName("head")[0].appendChild(link);
        }
      });
    },
    reload() {
      window.location.reload()
    }
  }
};
</script>
<style lang="scss" scoped>

.calendar-notify-container {
  background: #fff;
  padding: 10px;
  margin: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 4px 4px 4px, rgba(17, 17, 26, 0.1) -2px 4px 8px 0px;
  border-radius: 12px;
  position: relative;
  overflow: clip;
  display: flex;
  gap: 8px;
  align-items: start;

  &::before {
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 0;
    background-color: $accent_color_transparent;
    animation: background-progress 10s linear;
    animation-iteration-count: 1;
  }

  @keyframes background-progress {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 1;

    .title {
      font-weight: 600;
    }

    .footer {
      display: flex;
      gap: 4px;
      cursor: pointer;
    }
  }

  .close {
    z-index: 1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all $common_transition_duration ease-in-out;

    &:hover {
      background-color: $border_color;
    }
  }

}

// transition
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-right-enter-active {
  transition: all 0.3s ease;
}

.slide-right-enter-to {
  opacity: 1;
}

.slide-right-leave-from {
  opacity: 1;
}

.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

</style>
