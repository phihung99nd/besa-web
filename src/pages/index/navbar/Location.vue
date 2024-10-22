<template>
  <v-dropdown mode="click">
    <template #trigger>
      <button class="btn location-btn">
        <Iconify icon="teenyicons:pin-outline"/>
        <div>{{ currentLocation ? currentLocation.place_name : 'Nơi gần bạn' }}</div>
      </button>
    </template>
    <template #body>
      <div class="dropdown-menu">
        <div class="dropdown-menu__option" @click="$emit('get-current')">
          <button class="btn">
            <Iconify icon="material-symbols:my-location"/>
            Vị trí hiện tại
          </button>
        </div>
        <div class="dropdown-menu__option" v-for="(item, index) in option" @click.stop="chooseLocation(1, index)">
          <v-dropdown mode="hover">
            <template #trigger>
              <button class="btn">
                <div>{{ item.place_name }}</div>
              </button>
            </template>
            <template #body>
              <div class="dropdown-submenu" v-if="item.children && item.children.length > 0">
                <div class="scroll">
                  <div class="dropdown-menu__option" v-for="(child, index1) in item.children" :key="index1"
                       @click.stop="chooseLocation(2, index, index1)">
                    <v-dropdown mode="hover">
                      <template #trigger>
                        <button class="btn location-btn">
                          <div>{{ child.place_name }}</div>
                        </button>
                      </template>
                      <template #body>
                        <div class="dropdown-submenu" v-if="child.children && child.children.length > 0">
                          <div class="scroll">
                            <div class="dropdown-menu__option" v-for="(subchild, index2) in child.children"
                                 :key="index2"
                                 @click.stop="chooseLocation(3, index, index1, index2)">
                              <button class="btn">{{ subchild.place_name }}</button>
                            </div>
                          </div>
                        </div>
                      </template>
                    </v-dropdown>
                  </div>
                </div>
              </div>
            </template>
          </v-dropdown>
        </div>
      </div>
    </template>
  </v-dropdown>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "Location",
  props: ['option'],
  computed: {
    ...mapState(['currentLocation', 'mapAccessToken']),

  },
  methods: {
    ...mapMutations(['SET_LOCATION']),

    chooseLocation(level, ...index) {
      switch (level) {
        case 1:
          this.SET_LOCATION(this.option[index])
          break;
        case 2:
          let obj1 = {
            ...this.option[index[0]].children[index[1]],
            place_name: `${this.option[index[0]].children[index[1]].place_name}, ${this.option[index[0]].place_name}`
          }
          this.SET_LOCATION(obj1)
          break;
        case 3:
          let obj2 = {
            ...this.option[index[0]].children[index[1]].children[index[2]],
            place_name: `${this.option[index[0]].children[index[1]].children[index[2]].place_name}, ${this.option[index[0]].children[index[1]].place_name}, ${this.option[index[0]].place_name}`
          }
          this.SET_LOCATION(obj2)
          break;
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'navbar';

.location-btn {
  width: 250px;
  padding-left: 0;
  font-size: 12px;

  > div {
    flex: 1 1;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.btn {
  font-size: 12px;
}
</style>
