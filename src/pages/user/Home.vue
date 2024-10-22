<template>
  <div style="padding-top: 10px;">
    <div class="container width_1200">
      <Layout class="layoutAll">
        <Sider class="side-bar" ref="side" :collapsed-width="78">
          <Menu
            class="side-menu"
            theme="light"
            width="auto"
            :active-name="$route.name"
            :open-names="openMenus"
            @on-select="onSelect"
          >
            <div class="user-icon">
              <div class="user-img">
                <img
                  :src="userInfo.face"
                  style="width: 100%; height: 100%"
                  v-if="userInfo.face"
                  alt
                />
                <Avatar icon="ios-person" class="mb_10" v-else size="96" />
              </div>
              <p>{{ userInfo.name }}</p>
            </div>

            <Submenu
              v-for="(menu, index) in menuList"
              :key="index"
              :name="menu.title"
            >
              <template #title v-if="menu.display">
                <div class="flex align-items-center gap-2">
                  <Iconify :icon="menu.icon" :style="{color: menu.iconColor, fontSize: '18px'}"></Iconify>
                  <span>{{ $t(menu.title) }}</span>
                </div>
              </template>
              <MenuItem
                v-for="(children, i) in menu.menus"
                :key="i"
                :name="children.path"
                >{{ $t(children.title) }}</MenuItem
              >
            </Submenu>
          </Menu>
        </Sider>
        <Layout class="layout ml_10">
          <Content class="content">
            <transition name="fade">
              <router-view :key="$route.fullPath+'nested'"></router-view>
            </transition>
          </Content>
        </Layout>
      </Layout>
    </div>
  </div>
</template>

<script>
import menuList from "./menu";
import Search from "../../components/Search";
import Storage from "@/plugins/storage.js";
import NavigationBar from "@/pages/index/NavigationBar.vue";

export default {
  name: "Home",
  components: {
    NavigationBar,
    Search
  },
  data() {
    return {
      menuList,
      userInfo: {}
    };
  },
  mounted(){
    this.userInfo = this.$cookies.get("buyer_userInfo") || {};
    this.$bus.$on('update-user-profile', this.handleEditProfile)
  },
  destroyed() {
    this.$bus.$off('update-user-profile', this.handleEditProfile)
  },
  computed: {
    openMenus() {
      let menu = [...this.menuList]
      menu = menu.find(i => {
        return i.menus.map(e => e.path).some(x => x == this.$route.name)
      })
      return menu ? [menu.title] : []
    }
  },
  methods: {
    onSelect(name) {
      this.$router.push({ name: name });
    },
    handleEditProfile(info){
      this.userInfo = {...info}
    }
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 15px 50px;
}

.header {
  @include background_color($light_background_color);
}

.side-menu,
.side-bar,
.content {
  @include white_background_color();
  @include title_color($light_title_color);
}

.side-bar {
  min-height: 600px;
  height: auto;
}

.layoutAll {
  min-height: 1200px;
  @include background_color($light_background_color);
}

.container {
  margin: 0 auto;
  padding: 20px 0;
}

.side-bar a {
  @include title_color($light_title_color);
}

.user-icon {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    font-size: 16px;
    font-weight: 700;
  }
}

.user-img {
  margin-bottom: 15px;
  width: 96px;
  height: 96px;
  border-radius: 48px;
  overflow: hidden;
}

.layout-footer-center {
  padding: 0px 15px;

  padding-bottom: 15px;
  text-align: center;
}

/deep/ .ivu-menu-submenu-title-icon {
  right: 8px;
}
/** logo start */
.logo {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto 0;

  div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 150px;
      height: auto;
      cursor: pointer;
    }

    div:nth-child(2) {
      width: 200px;
      color: #999;
      font-size: 16px;
      margin: 0 20px;

      span {
        color: $secondary_color;
      }
    }
  }
}

// transition
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
