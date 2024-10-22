<template>
  <div class="dropdown" style="position:relative; width: 100%" ref="dropdown">
    <div v-if="!multiple" class="select-input" @click="isOpen=!isOpen">
      <div class="text-holder">{{ content }}</div>
      <Icon class="close" v-show="content.length" type="md-close-circle" @click.stop="clearSelection"/>
      <Icon class="arrow" v-if="!isOpen" type="ios-arrow-down"/>
      <Icon class="arrow" v-else type="ios-arrow-up"/>
    </div>
    <div v-if="multiple" class="select-input" @click="isOpen=!isOpen">
      <div class="text-holder" v-if="!content.length"></div>
      <div v-else class="chip-holder">
        <InputChip v-for="(item, index) in content" :key="index" :label="item.name" @on-close="closeSelection(index)"/>
      </div>
      <Icon class="arrow" v-if="!isOpen" type="ios-arrow-down"/>
      <Icon class="arrow" v-else type="ios-arrow-up"/>
    </div>
    <div class="label" :class="{active: isOpen, hide: multiple ? content.length > 0 : content}">{{ placeholder }}</div>
    <div class="select-dropdown" :class="{open: isOpen}">
      <template v-if="option.length > 0">
        <div class="flex dropdown-item"
             :class="{selected: multiple ? selectedIndex.includes(index) : selectedIndex == index}"
             v-for="(item, index) in option"
             :key="index" @click="selectOption(item, index)">
          <img v-if="item.thumbnail" :src="item.thumbnail" alt=""/>
          <span>{{ item.name || item }}</span>
        </div>
      </template>
      <template v-else>
        <div class="dropdown-item" @click="isOpen = false">
          <span>{{ $t('No data')}}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import InputChip from "@/components/dropdown/InputChip.vue";
/**
 * A Dropdown option
 * @typedef {{id: string, name: string, thumbnail: string} | String} Option
 * @property {string} id - Id duy nhất phân biệt các option ở dạng object
 * @property {string} name - Tên của option
 * @property {string} thumbnail - URL ảnh của option (nếu có)
 */
/**
 * Custom Dropdown component
 * @param {Array | String} [value=[] | value=''] - value của selectbox. Dùng v-model để ràng buộc 2 chiều
 * @param {String} [placeholder=''] - Placeholder cho input của selectbox
 * @param {Array[Option]} [option=[]] - Danh sách các option của dropdown.
 * @param {Boolean} [multiple=false] - Cho phép lựa chọn nhiều option
 * @event on-change - Trigger sự kiện khi thay đổi lựa chọn
 */
export default {
  name: "Dropdown",
  components: {InputChip},
  props: {
    value: {
      type: [Array, String, Object],
      default: ''
    },
    placeholder: {
      type: String
    },
    option: {
      type: Array
    },
    multiple: {
      type: Boolean,
    }
  },
  data() {
    return {
      content: this.value.name || this.value,
      isOpen: false,
      selectedIndex: this.multiple ? [] : null
    }
  },
  mounted() {
    window.addEventListener('click', this.clickOutside)
  },
  updated() {

  },
  destroyed() {
    window.removeEventListener('click', this.clickOutside)
  },
  watch: {
    value: {
      handler(val) {
        this.content = val.name || val
        if (!this.multiple) {
          this.selectedIndex = typeof this.option[0] == 'object' ? this.option.map(i => i.name).indexOf(val.name) : this.option.indexOf(val)
        } else if (this.multiple && val.length) {
          let arr = []
          val.forEach(i => {
            arr.push(typeof this.option[0] == 'object' ? this.option.map(e => e.name).indexOf(i.name) : this.option.indexOf(i))
          })
          this.selectedIndex = [...arr]
        }
      },
      deep: true
    }
  },
  methods: {
    clickOutside(e) {
      if (!this.$refs.dropdown.contains(e.target)) {
        this.isOpen = false
      }
    },
    selectOption(item, index) {
      if (!this.multiple) {
        this.content = item.name || item
        this.$emit('input', item)
        this.selectedIndex = index
        this.isOpen = false
        this.$emit('on-change', item)
      } else {
        if (JSON.stringify(this.content).includes(JSON.stringify(item))) {
          if (typeof item == 'object') {
            this.content.splice(this.content.map(i => i.id).indexOf(item.id), 1)
            this.selectedIndex.splice(this.selectedIndex.indexOf(this.option.map(i => i.id).indexOf(item.id)), 1)
          } else if (typeof item == 'string') {
            this.content.splice(this.content.indexOf(item), 1)
            this.selectedIndex.splice(this.selectedIndex.indexOf(this.option.indexOf(item)), 1)
          }
        } else {
          this.content.push(item)
          this.selectedIndex.push(index)
        }
        this.isOpen = true
        this.$emit('on-change', JSON.parse(JSON.stringify(item)))
      }
    },
    closeSelection(index) {
      this.content.splice(index, 1)
      this.selectedIndex.splice(index, 1)
      this.$emit('on-change', JSON.parse(JSON.stringify(this.content)))
    },
    clearSelection() {
      this.content = '';
      this.$emit('input', '');
      this.selectedIndex = null;
      this.isOpen = false;
      this.$emit('on-change', '')
    }
  }
}
</script>

<style scoped lang="scss">
.label {
  position: absolute;
  top: 10px;
  left: 4px;
  padding: 0 4px;
  z-index: 1;
  background: transparent;
  font-size: 14px;
  border-radius: 10px;
  color: #c7c8ce;
  pointer-events: none;
  transition: all $common_transition_duration ease-in-out;

  &.active {
    top: -9px;
    left: 10px;
    font-size: 12px;
    color: $accent_color;
    background: white;
    transition: all $common_transition_duration ease-in-out;
  }

  &.hide {
    display: none !important;
  }
}

.select-input {
  min-height: 40px;
  max-height: 80px;
  overflow: hidden;
  //padding: 5px 10px;
  border: 1px solid $border_color;
  border-radius: 4px;
  cursor: pointer;
  transition: border 0.5s ease;
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;

  i.close {
    margin-right: 20px;
    opacity: 0;
    z-index: 1;
  }

  &:hover, &:focus, &:active {
    border: 1px solid $accent_color;
    transition: border 0.5s ease;

    i.close {
      opacity: 1;
      transition: opacity $common_transition_duration ease;
    }
  }

  //input {
  //  outline: none;
  //  border: none;
  //  width: calc(100% - 32px);
  //  height: 30px;
  //  background: transparent;
  //  cursor: pointer;
  //  text-overflow: ellipsis
  //}

  .text-holder {
    position: absolute;
    width: calc(100% - 40px);
    top: 10px;
    left: 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .chip-holder {
    width: calc(100% - 12px);
    max-width: 100%;
    height: fit-content;
    max-height: 61px;
    overflow: auto;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
  }

  i.arrow {
    position: absolute;
    top: 12px;
    right: 5px;
  }
}

.select-dropdown {
  width: 100%;
  max-height: 300px;
  border: 0 solid $border_color;
  background: white;
  position: absolute;
  overflow: auto;
  top: 40px;
  height: 0;
  opacity: 0;
  transition: opacity $common_transition_duration ease;
  z-index: 2;

  &.open {
    height: fit-content;
    max-height: 300px;
    opacity: 1;
    border: 1px solid $border_color;
  }

  .dropdown-item {
    width: 100%;
    max-height: 80px;
    padding: 5px;
    gap: 10px;
    transition: background $common_transition_duration ease;

    &:hover, &.selected {
      background: #eee;
    }

    > img {
      aspect-ratio: 7 / 5;
      height: 70px;
      object-fit: cover;
    }

    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 23px;
    }
  }
}
</style>
