<template>
  <div class="filter">
    <div class="flex align-items-center gap-2 filter-header">
      <Icon type="ios-funnel-outline" size="24"/>
      <span>Bộ lọc tìm kiếm</span>
    </div>
    <div class="filter-group filter-group--type">
      <div class="filter-group__header">
        Tìm kiếm theo
      </div>
      <div class="filter-group__body">
        <RadioGroup v-model="filter.type" vertical>
          <Radio label="ALL">
            <span>Tất cả</span>
          </Radio>
          <Radio v-for="(item, index) in typeList" :key="index" :label="item">
            <span>{{ $t(item) }}</span>
          </Radio>
        </RadioGroup>
      </div>
    </div>
    <!--region Category-->
    <div class="filter-group filter-group--category">
      <div class="filter-group__header">
        Theo danh mục
      </div>
      <div class="filter-group__body">
        <CheckboxGroup v-model="filter.category">
          <template v-for="(cate, index) in categoryList">
            <div v-if="index < 4" class="filter-checkbox" :key="index">
              <Checkbox :label="cate.id">
                <span>{{ cate.name }}</span>
              </Checkbox>
            </div>
          </template>
          <div class="filter-group__body--hiding" :class="{ show: isExpand[0]}"
               :style="{'--calcHeight': `${(categoryList.length-4)*35}px`}">
            <template v-for="(cate, index) in categoryList">
              <div v-if="index >= 4" class="filter-checkbox" :key="index">
                <Checkbox :label="cate.id">
                  <span>{{ cate.name }}</span>
                </Checkbox>
              </div>
            </template>
          </div>
          <div class="flex gap-2 justify-content-center align-items-center expand-btn" @click="controlExpand(0)">
            <Icon :type="isExpand[0] ? 'md-remove' : 'md-add'"/>
            <span>{{ isExpand[0] ? 'Thu gọn' : 'Xem thêm' }}</span>
          </div>
        </CheckboxGroup>
      </div>
    </div>
    <!--endregion-->
    <!--region Rating-->
    <div class="filter-group filter-group--rating">
      <div class="filter-group__header">
        Đánh giá
      </div>
      <div class="filter-group__body">
        <template v-for="(rate, index) in ratingList">
          <div v-if="index < 4" class="filter-rate" :class="{ active: filter.grade == rate}"
               @click="handleChooseRating(rate)">
            <Rate :value="rate" :key="index" disabled/> trở lên
          </div>
        </template>
        <div class="filter-group__body--hiding" :class="{ show: isExpand[1]}"
             :style="{'--calcHeight': `${(ratingList.length-4)*40}px`}">
          <template v-for="(rate, index) in ratingList">
            <div v-if="index >= 4" class="filter-rate" :key="index" :class="{ active: filter.grade == rate}"
                 @click="handleChooseRating(rate)">
              <Rate :value="rate" :key="index" disabled/> trở lên
            </div>
          </template>
        </div>
        <div class="flex gap-2 justify-content-center align-items-center expand-btn" @click="controlExpand(1)">
          <Icon :type="isExpand[1] ? 'md-remove' : 'md-add'"/>
          <span>{{ isExpand[1] ? 'Thu gọn' : 'Xem thêm' }}</span>
        </div>
      </div>
    </div>
    <!--endregion-->
    <!--region Distance-->
    <div class="filter-group filter-group--distance">
      <div class="filter-group__header">
        Khoảng cách
      </div>
      <div class="filter-group__body">
        <RadioGroup v-model="filter.distance" vertical>
          <Radio label="ALL">
            <span>Tất cả</span>
          </Radio>
          <Radio v-for="(item, index) in distanceList" :key="index" :label="item">
            <span>Từ {{ item }}km trở xuống</span>
          </Radio>
        </RadioGroup>
      </div>
    </div>
    <!--endregion-->
    <!--region Price-->
    <div class="filter-group filter-group--price" v-if="filter.type == 'service' || filter.type == 'goods'">
      <div class="filter-group__header">
        Khoảng giá
      </div>
      <div class="filter-group__body">
<!--        <Slider :tip-format="priceConfig.tipFormat" v-model="filter.price" :min="priceConfig.min"-->
<!--                :max="priceConfig.max"-->
<!--                :step="priceConfig.step" range></Slider>-->
        <div class="flex align-item-center" style="gap: 8px">
          <InputNumber placeholder="₫Từ" v-model="price[0]"
                       :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                       :parser="value => value.replace(/\\s?|(,*)/g, '')"
          />
          <div>-</div>
          <InputNumber placeholder="₫Đến" v-model="price[1]"
                 :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                 :parser="value => value.replace(/\\s?|(,*)/g, '')"
          />
        </div>
        <Button type="primary" long class="mt-2" @click="applyPriceFilter">{{$t('Apply')}}</Button>
      </div>
    </div>
    <!--endregion-->
    <Button long type="error" class="mt-4" @click="resetFilter">Xóa bộ lọc</Button>
  </div>
</template>

<script>
import {getCategory} from "@/api/goods";
import {mapState} from "vuex";

export default {
  name: "ColumnFilter",
  props: ['filter'],
  data() {
    return {
      typeList: ['store', 'clerk', 'service', 'goods'],
      categoryList: [],
      ratingList: [5, 4, 3, 2, 1],
      distanceList: [1, 3, 5],
      priceConfig: {
        min: 0,
        max: 50000000,
        step: 1000000,
        tipFormat: (val) => {
          return `${val} VNĐ`
        }
      },
      price: ['',''],
      isExpand: [false, false]
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.initCategoryList()
    },
    initCategoryList() {
      getCategory(0).then(res => {
        this.categoryList = res.result
      })
    },
    controlExpand(index) {
      this.$set(this.isExpand, index, !this.isExpand[index])
    },
    handleChooseRating(rate) {
      this.filter.grade = this.filter.grade == rate ? '' : rate
    },
    applyPriceFilter(){
      this.filter.price = this.price
    },
    resetFilter(){
      this.$emit('reset')
    }
  }
}
</script>

<style scoped lang="scss">
.filter {
  padding: 30px 16px;

  &-header {
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    color: $text_color_black;
  }

  &-group {
    padding: 20px 0;
    border-bottom: 1px solid $border_color;

    &__header {
      margin-bottom: 10px;
      font-size: 14px;
      color: $text_color_black;
      font-weight: 600;
      text-transform: capitalize;
    }

    &__body {
      .filter-checkbox {
        padding: 6px 0;
      }

      .filter-rate {
        padding: 2px 10px;
        border-radius: 30px;
        width: fit-content;
        font-size: 12px;
        cursor: pointer;

        /deep/ .ivu-rate-star {
          margin-right: 0;
        }

        &:hover {
          background: #f0f0f0;
        }

        &.active {
          background: #f0f0f0;
        }
      }

      .expand-btn {
        margin-top: 8px;
        cursor: pointer;
      }

      &--hiding {
        max-height: 0;
        overflow: clip;
        transition: max-height 0.5s ease;

        &.show {
          max-height: var(--calcHeight);
          transition: max-height $common_transition_duration ease-in;
        }
      }
    }
  }
}
</style>
