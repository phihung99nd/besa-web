<template>
  <div :class="$style['index-horizontal-navbar']">
    <div :class="$style['nav-container']">
      <div :class="$style['nav-item']" v-for="(parent, index) in cateList" :key="parent.id">
        <v-dropdown mode="hover">
          <template #trigger>
            <div :class="$style['nav-btn']">
              {{parent.name}}
              <Icon type="ios-arrow-down"></Icon>
            </div>
          </template>
          <template #body v-if="parent.children">
            <div :class="$style['dropdown-menu']">
              <div :class="$style['dropdown-option']" v-for="(child) in parent.children" :key="child.id">
                {{child.name}}
              </div>
            </div>
          </template>
        </v-dropdown>
      </div>
    </div>
  </div>
</template>

<script>

import {getCategory} from "../../api/goods";

export default {
  name: "HorizontalNavbar",
  data() {
    return {
      cateList: []
    }
  },
  methods: {
    init() {
      getCategory(0).then(res => {
        this.cateList = res.result
      })
    }
  },
  created() {
    this.init()
  }
}
</script>

<style module lang="scss">
.v-dropdown-menu__container {
  position: absolute;

  &:has(.dropdown-menu:not(.dropdown-submenu)) {
    animation: slideaway 0.3s;
  }

  &:has(.dropdown-submenu) {
    animation: pushin 0.3s;
  }
}

.v-dropdown-menu__body {
  position: relative;
}

@keyframes slideaway {
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  50% {
    transform: translateY(40px);
    opacity: 0;
  }
  100% {
    display: block;
  }
}

@keyframes pushin {
  0% {
    transform: translateX(-40px);
    opacity: 0;
  }
  50% {
    transform: translateX(40px);
    opacity: 0;
  }
  100% {
    display: block;
  }
}

.index-horizontal-navbar {
  width: 100%;
  height: 44px;
  background-color: #fff;

  .nav-container {
    margin: 0 auto;
    width: 1200px;
    height: 100%;
    display: flex;
    align-items: center;

    .nav-item {
      flex: 1 0 0;
      .nav-btn {
        display: flex;
        padding: 0px 10px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        height: 36px;
        min-width: 150px;
        width: max-content;
        border-radius: 12px;
        transition: all $common_transition_duration ease-in-out;

        &:hover {
          background-color: $accent_color_hover;
        }
      }

      .dropdown-menu {
        border-radius: 10px;
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        background: #fff;
        box-shadow: 0 2px 20px rgba(0, 0, 0, .15);
        margin-top: 10px;
        padding: 10px;
        position: relative;

        .dropdown-option {
          min-width: 150px;
          width: 100%;
          height: 36px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          cursor: pointer;
          border-radius: 5px;
          padding: 0 10px;
          transition: all $common_transition_duration ease-in-out;

          &:hover {
            background: #f5f5f5;
            color: $accent_color;
          }
        }
      }
    }
  }
}
</style>
