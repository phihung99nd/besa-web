<template>
  <div class="item-class-show">
    <div class="head-bar">
      <template v-if="$route.query.categoryId">
        <div class="bar">
          {{ tabBar.name }}
          <Icon type="ios-arrow-down"/>
          <ul>
            <li v-for="item in tabBar.children" :key="item.id" @click="cateClick(item,2)">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <Icon v-if="tabBar.first" type="ios-arrow-forward"/>

        <div v-if="tabBar.first" class="bar">
          {{ tabBar.first.name }}
          <Icon type="ios-arrow-down"/>
          <ul>
            <li v-for="item in tabBar.first.children" :key="item.id" @click="cateClick(item,3)">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <Icon v-if="tabBar.first" type="ios-arrow-forward"/>

        <div v-if="tabBar.second" @click="cateClick(tabBar,3)">{{ tabBar.second.name }}</div>

        <Button @click="clearCate">{{$t('Clear category')}}</Button>

      </template>

      <template v-else>
        <div style="font-size:14px">
          {{ $t('Search results') }}
        </div>
        <Icon type="ios-arrow-forward"/>
        <div class="mr_10" style="font-weight:bold;">“{{ params.keyword }}”</div>
      </template>
      <a
        v-for="(item, index) in selectedItem"
        :key="index"
        :title="item.name"
        class="selected-item"
        @click="cancelSelected(item, index)"
      >
        <span>{{ item.type }}：</span><span>{{ item.name }}</span>
        <Icon type="md-close"/>
      </a>
    </div>

    <div class="content">
      <div v-show="tagsContent[0].show && tagsContent[0].values.length" class="brand">
        <div>
          <strong>{{ tagsContent[0].key }}：</strong>
        </div>
        <div>
          <ul :class="{ 'show-more': tagsContent[0].more }">
            <li
              v-for="(item, index) in tagsContent[0].values"
              :key="index"
              :class="{ 'border-color': multSelected.includes(item) }"
              @click="selectBrand(item.name, 0)"
            >
              <img :src="item.url" alt=""/><span>{{ item.name }}</span>
              <div
                v-show="multSelected.includes(item.name)"
                class="corner-icon"
              >
                <div></div>
                <Icon type="md-checkmark"/>
              </div>
            </li>
          </ul>

          <div v-show="multiple !== 0" class="btn">
            <span @click="moreBrand(0)">
              {{ tagsContent[0].more ? this.$t('Close') : this.$t('More') }}
              <Icon :type="tagsContent[0].more ? 'ios-arrow-up' : 'ios-arrow-down'"/>
            </span>
            <span @click="multSelectBrand(0)"><Icon type="md-add"/>{{ $t('Multiple choice') }}</span>
          </div>

          <div v-show="multiple === 0" class="multBtn">
            <Button
              :disabled="!multSelected.length"
              size="small"
              type="primary"
              @click="sure(0)"
            >
              {{ $t('Sure') }}
            </Button>
            <Button size="small" @click="cancel">{{ $t('Cancel') }}</Button>
          </div>
        </div>
      </div>

      <template v-for="(tag, tagIndex) in tagsContent">
        <div v-if="tag.show && tagIndex !== 0" v-show="tagIndex < showTagCount" :key="tagIndex" class="other">
          <div>
            <strong>{{ tag.key }}：</strong>
          </div>
          <div>
            <ul
              v-show="multiple !== tagIndex"
              :class="{ 'show-more': tag.more }"
              class="list"
            >
              <li
                v-for="(item, index) in tag.values"
                :key="index"
                class="item"
                @click="selectBrand(item, tagIndex)"
              >
                {{ item }}
              </li>
            </ul>

            <CheckboxGroup
              v-show="multiple === tagIndex"
              v-model="multSelected"
              :class="{ 'show-more': tag.more }"
              class="list"
            >
              <Checkbox
                v-for="(item, index) in tag.values"
                :key="index"
                :label="item"
                class="item"
              >{{ item }}
              </Checkbox
              >
            </CheckboxGroup>

            <div v-show="multiple !== tagIndex" class="btn">
              <span v-show="tag.values.length > 9" @click="moreBrand(tagIndex)">
                {{ tag.more ? this.$t('Close') : this.$t('More') }}
                <Icon :type="tag.more ? 'ios-arrow-up' : 'ios-arrow-down'"/>
              </span>
              <span @click="multSelectBrand(tagIndex)">
                <Icon type="md-add"/>
                {{ $t('Multiple choice') }}
              </span>
            </div>

            <div v-show="multiple === tagIndex" class="multBtn">
              <Button
                :disabled="!multSelected.length"
                size="small"
                type="primary"
                @click="sure(tagIndex)"
              >{{ $t('Sure') }}
              </Button
              >
              <Button size="small" @click="cancel">{{ $t('Cancel') }}</Button>
            </div>
          </div>
        </div>
      </template>
      <div v-if="tagsContent.length>4" class="more-options" @click="moreOptions">
        {{ showTagCount === 5 ? this.$t('More filter') : this.$t('Collapse') }}
        <Icon :type="showTagCount===5?'ios-arrow-down':'ios-arrow-up'"/>
      </div>
    </div>
  </div>
</template>

<script>
import * as APIGoods from '@/api/goods';
import {getCategory} from "@/api/goods";

export default {
  name: 'GoodsClassNav',
  data() {
    return {
      tabBar: {
        name: '',
        first: {},
        second: {}
      },
      showTagCount: 5,
      multiple: false,
      tagsContent: [
        {
          key: this.$t('Brand'),
          more: false,
          show: true,
          values: []
        }
      ],
      multSelected: [],
      selectedItem: [],
      brandIds: [],
      params: {}
    };
  },
  computed: {
    cateList() {
      return this.$store.state.category || []
    }
  },
  watch: {
    selectedItem: {
      handler(val) {
        let classification = [];
        this.params.brandId = ''
        this.params.prop = ''
        val.forEach((item) => {
          if (item.type === this.$t('Brand')) {
            this.params.brandId = this.brandIds.join('@');
          } else {
            const nameArr = item.name.split('、');
            nameArr.forEach((name) => {
              classification.push(item.type + '_' + name);
            });
          }
        });
        this.params.prop = classification.join('@');
        this.getFilterList(this.params);
        this.$emit('getParams', this.params);
      },
      deep: true
    },
    '$route': {
      handler(val, oVal) {
        if (this.$route.query.categoryId) {
          let cateId = this.$route.query.categoryId.split(',')
          Object.assign(this.params, this.$route.query)
          this.params.categoryId = cateId[cateId.length - 1]
        } else {
          Object.assign(this.params, this.$route.query)
        }
        this.getFilterList(this.params)
        this.getNav()
      },
      deep: true
    }
  },
  methods: {
    getNav() {
      if (!this.$route.query.categoryId) return

      getCategory(0).then(res => {
        const cateTree = res.result;
        const arr = this.$route.query.categoryId.split(',')
        let mapCate1, mapCate2
        if (arr.length > 0) {
          mapCate1 = cateTree.filter(e => e.id === arr[0])[0];
          this.tabBar = mapCate1;
        }
        if (arr.length > 1) {
          mapCate2 = mapCate1.children.filter(e => e.id === arr[1])[0]
          this.$set(this.tabBar, 'first', mapCate2)
        }
        if (arr.length > 2) {
          const lastCate = mapCate2.children.filter(e => e.id === arr[2])[0]
          this.$set(this.tabBar, 'second', lastCate)
        }
      })
    },

    cateClick(item, index) {
      switch (index) {
        case 1:
          this.$router.push({
            path: '/goodsList',
            query: {categoryId: item.id}
          })
          break;
        case 2:
          this.$router.push({
            path: '/goodsList',
            query: {categoryId: [item.parentId, item.id].toString()}
          })
          break;
        case 3:
          this.$router.push({
            path: '/goodsList',
            query: {categoryId: [this.tabBar.id, item.parentId, item.id].toString()}
          })
          break;
      }
    },

    clearCate() {
      this.$router.push({
        path: '/goodsList',
      })
    },

    selectBrand(item, index) {
      if (this.multiple !== false) {

        let key = this.multSelected.indexOf(item);
        if (key > -1) {
          this.multSelected.splice(key, 1);
        } else {
          this.multSelected.push(item);
        }
      } else {
        this.selectedItem.push({
          type: this.tagsContent[index].key,
          name: item
        });

        this.tagsContent[index].show = false;

        if (index === 0) {

          let brands = this.tagsContent[0].values;

          brands.forEach((val) => {
            if (val.name === item) this.brandIds.push(val.value);
          });
        }
      }
    },

    cancelSelected(item, index) {
      this.selectedItem.splice(index, 1);

      this.tagsContent.forEach((tag, index) => {
        if (tag.key === item.type) {
          tag.show = true;
          tag.more = false;
        }
      });
      if (item.type === this.$t('Brand')) {
        this.brandIds = [];
      }
    },
    moreBrand(index) {
      const flag = !this.tagsContent[index].more
      this.$set(this.tagsContent[index], 'more', flag)
    },

    multSelectBrand(index) {
      this.$set(this.tagsContent[index], 'more', true)
      this.multiple = index;
    },

    sure(index) {
      this.selectedItem.push({
        type: this.tagsContent[index].key,
        name: this.multSelected.join('、')
      });

      if (index === 0) {

        let brands = this.tagsContent[0].values;

        brands.forEach((val) => {
          if (this.multSelected.includes(val.name)) this.brandIds.push(val.value);
        });
      }

      this.tagsContent[index].show = false;
      this.cancel();
    },
    cancel() {
      this.multSelected = [];
      this.tagsContent[0].more = false;
      this.multiple = false;
    },
    getFilterList(params) {
      APIGoods.filterList(params)
        .then((res) => {
          if (res.success) {
            const data = res.result;
            this.tagsContent = [{
              key: this.$t('Brand'),
              more: false,
              show: true,
              values: []
            }]
            this.tagsContent[0].values = data.brands;
            this.tagsContent = this.tagsContent.concat(data.paramOptions);
            this.tagsContent.forEach((item) => {
              this.$set(item, 'show', true)
              this.$set(item, 'more', false)
            });
          }
        })
        .catch((err) => {
          this.$Message.error(this.$t('API get filter list error'))
        })
    },
    moreOptions() {
      this.showTagCount = this.showTagCount === 5 ? 100 : 5
    }
  },
  mounted() {
    if (this.$route.query.categoryId) {
      let cateId = this.$route.query.categoryId.split(',')
      Object.assign(this.params, this.$route.query)
      this.params.categoryId = cateId[cateId.length - 1]
    } else {
      Object.assign(this.params, this.$route.query)
    }
    this.getFilterList(this.params);
    this.getNav();
  }
}
</script>

<style lang="scss" scoped>
.head-bar {
  width: 100%;
  background: #fff;
  margin-top: -13px;
  display: flex;
  height: 40px;
  align-items: center;

  > div:first-child {
    padding: 0 8px;
    font-size: 18px;
    font-weight: bold;

    &:hover {
      color: $primary_color;
      cursor: pointer;
    }
  }

  .bar {
    font-size: 14px;
    position: relative;
    background: #fff;
    border: 1px solid #999;
    padding: 0 8px;
    min-width: 85px;
    text-align: center;
    margin: 0 3px;

    &:hover {
      color: $primary_color;
      border-color: $primary_color;
      border-bottom-color: #fff;
      cursor: pointer;

      ul {
        display: flex;
        flex-direction: column;
      }

      .ivu-icon {
        transform: rotate(180deg);
      }
    }

    ul {
      display: none;
      position: absolute;
      top: 28px;
      left: -1px;
      width: 200px;
      padding: 5px 10px;
      background: #fff;
      border: 1px solid $primary_color;
      z-index: 1;
      font-size: 14px;

      &::before {
        content: "";
        position: absolute;
        width: 83px;
        left: 0;
        top: -1px;
        z-index: 2;
        border-top: 1px solid #fff;
      }

      &:hover {
        display: flex;
      }

      clear: left;

      li {
        color: #999;
        float: left;
        width: 100%;
        margin: 3px 0;
        text-align: left;

        &:hover {
          color: $primary_color;
          cursor: pointer;
        }
      }
    }
  }

  //所选分类
  .selected-item {
    font-size: 14px;
    color: #000;
    padding: 2px 22px 2px 8px;
    margin-right: 5px;
    max-width: 250px;
    height: 24px;
    overflow: hidden;
    position: relative;
    background-color: #f3f3f3;
    border: 1px solid #ddd;

    &:hover {
      border-color: $primary_color;
      background-color: #fff;

      .ivu-icon {
        color: #fff;
        background-color: $primary_color;
      }
    }

    span:nth-child(2) {
      color: $primary_color;
    }

    .ivu-icon {
      position: absolute;
      right: 0;
      top: 0;
      color: $primary_color;
      line-height: 22px;
      width: 21px;
      height: 22px;
      font-size: 14px;
    }
  }
}

/** 筛选主体 */
.content {
  background: #fff;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin: 10px 0;
}

/** 品牌 start */
.brand {
  border-bottom: 1px solid #ddd;
  display: flex;
  // min-height: 120px;
  font-size: 14px;

  > div:first-child {
    width: 100px;
    background: #eee;
    padding: 10px 0 0 10px;
  }

  > div:last-child {
    width: 1100px;
    padding: 10px;
    position: relative;

    ul {
      width: 900px;
      max-height: 100px;
      overflow: hidden;
      padding-top: 1px;
      clear: left;

      li {
        width: 100px;
        height: 50px;
        float: left;
        line-height: 45px;
        border: 1px solid #ddd;
        margin: -1px -1px 0 0;
        overflow: hidden;
        position: relative;
        padding: 2px;

        img {
          width: 100%;
          height: 100%;
        }

        &:hover {
          border-color: $primary_color;
          border: 2px solid $primary_color;
          top: 0;
          left: 0;
          position: relative;
          z-index: 1;

          img {
            display: none;
          }
        }

        span {
          display: inline-block;
          width: 100%;
          height: 100%;
          color: $primary_color;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }

        .corner-icon {
          position: absolute;
          right: -1px;
          bottom: -1px;

          div {
            width: 0;
            border-top: 20px solid transparent;
            border-right: 20px solid $primary_color;
          }

          .ivu-icon {
            font-size: 14px;
            position: absolute;
            bottom: 0;
            right: 1px;
            transform: rotate(-15deg);
            color: #fff;
          }
        }
      }

      .border-color {
        border-color: $primary_color;
        z-index: 1;
      }
    }

    .show-more {
      height: auto;
      max-height: 200px;
      overflow: scroll;
    }

    .btn {
      position: absolute;
      right: 10px;
      top: 10px;

      span {
        border: 1px solid #ddd;
        margin-left: 10px;
        color: #999;
        display: inline-block;
        padding: 1px 3px;
        font-size: 14px;

        &:hover {
          cursor: pointer;
          color: $primary_color;
          border-color: $primary_color;
        }
      }
    }

    .multBtn {
      text-align: center;
      margin-top: 10px;

      .ivu-btn {
        font-size: 14px !important;
      }

      .ivu-btn:last-child {
        margin-left: 10px;
      }
    }
  }
}

/** 品牌 end */
/** 其他筛选项  start */
.other {
  border-bottom: 1px solid #ddd;
  display: flex;
  min-height: 30px;
  font-size: 14px;

  &:last-child {
    border: none;
  }

  > div:first-child {
    width: 100px;
    background: #eee;
    padding-left: 10px;
    line-height: 30px;
  }

  > div:last-child {
    width: 1100px;
    padding: 0 10px;
    position: relative;

    .list {
      width: 900px;
      height: 30px;
      overflow: hidden;
      clear: left;

      .item {
        width: 100px;
        height: 30px;
        float: left;
        line-height: 30px;
        color: #4d9cf1;
        overflow: hidden;
        position: relative;
        font-size: 14px;
        padding: 2px;
        cursor: pointer;

        &:hover {
          color: $primary_color;
        }
      }
    }

    .show-more {
      height: auto;
    }

    .btn {
      position: absolute;
      right: 10px;
      top: 5px;

      span {
        border: 1px solid #ddd;
        margin-left: 10px;
        color: #999;
        display: inline-block;
        padding: 1px 3px;
        font-size: 14px;

        &:hover {
          cursor: pointer;
          color: $primary_color;
          border-color: $primary_color;
        }
      }
    }

    .multBtn {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;

      .ivu-btn {
        font-size: 14px !important;
      }

      .ivu-btn:last-child {
        margin-left: 10px;
      }
    }
  }
}

.more-options {
  margin: 5px;
  color: #4d9cf1;
  font-size: 14px;
  cursor: pointer;
  text-align: right;
}

.more-options:hover {
  color: #0165d1;
}

/** 其他筛选项  end */
</style>
