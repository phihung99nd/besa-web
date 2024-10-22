<template>
  <div class="index-navbar">
    <div class="nav-container">
      <div class="left-container">
        <div class="logo">
          <img
            :src="$store.state.logoImg"
            @click="handleRefreshHome"
          />
        </div>
        <Search/>
      </div>
      <div class="right-container">
<!--        <button v-if="currentRoute != 'Goods Index'" class="btn" @click="$router.push({name: 'Goods Index'})">-->
<!--          <div class="badge">hot</div>-->
<!--          <Iconify icon="teenyicons:bag-solid" style="font-size: 20px; margin: 0 4px;"/>-->
<!--          <span>{{$t('Store')}}</span>-->
<!--        </button>-->
<!--        <button v-else class="btn" @click="$router.push({name: 'Index'})">-->
<!--          <div class="badge">hot</div>-->
<!--          <Iconify icon="material-symbols:spa" style="font-size: 20px; margin: 0 4px;"/>-->
<!--          <span>{{$t('Service')}}</span>-->
<!--        </button>-->
        <button class="btn" @click="$router.push({name: 'Nearby'})">
          <Iconify icon="material-symbols:my-location" style="font-size: 20px; margin: 0 4px;"/>
          <span>{{$t('Near you')}}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Location from "@/pages/index/navbar/Location.vue";
import Service from "@/pages/index/navbar/Service.vue";
import Expert from "@/pages/index/navbar/Expert.vue";
import Search from "@/pages/index/search/Search.vue";


export default {
  name: "NavigationBar",
  components: {
    Expert,
    Service,
    Location,
    Search,
  },
  computed: {
    currentRoute(){
      return this.$route.name
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleRefreshHome(){
      if(this.currentRoute == 'Index') {
        this.$router.go()
      } else {
        this.$router.push({name: 'Index'})
      }
    }
  }
}
</script>

<style scoped lang="scss">
$default_header_height: 60px;
.index-navbar {
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
      flex: 1 1;
      gap: 20px;

      .logo {
        display: flex;
        align-items: center;
        height: 100%;
        cursor: pointer;

        > img {
          height: 100%;
        }
      }
    }

    .right-container {
      display: flex;
      justify-content: end;
      align-items: center;
      padding: 10px 0 10px 20px;
      height: 100%;
      //min-width: 200px;
      gap: 10px;

      &::before {
        content: '';
        width: 0.5px;
        height: 20px;
        background: $border_color;
      }
    }
  }
}

.btn {
  height: 36px;
  width: fit-content;
  min-width: 120px;
  border-radius: 100px;
  padding: 0 12px;
  border: none;
  font-size: 14px;
  font-weight: 400;
  color: #555;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
  transition: background 0.2s ease-in-out;

  > span {
    padding-top: 2px;
  }

  &:hover {
    background: #f0f0f0;
  }
}

.btn {
  font-weight: 600;
  .iconify {
    color: $accent_color;
  }

  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    padding: 0 4px;
    border-radius: 4px;
    background: red;
    color: #fff;
    font-size: 8px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);

    &:after {
      content: '';
      position: absolute;
      border: 1px solid rgba(255, 0, 0, .5);
      opacity: 0;
      border-radius: 4px;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }

  .badge {
    animation: pulse 1.8s infinite;

    &:after {
      animation: sonar 1.8s infinite;
    }
  }
}

@keyframes sonar {
  0% {transform: scale(.9); opacity:1;}
  100% {transform: scale(2);opacity: 0;}
}
@keyframes pulse {
  0% {transform: scale(1);}
  20% {transform: scale(1.4); }
  50% {transform: scale(.9);}
  80% {transform: scale(1.2);}
  100% {transform: scale(1);}
}
</style>
