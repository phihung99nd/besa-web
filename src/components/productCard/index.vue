<template>
  <div class="goods-show-info" v-on="$listeners">
    <div class="goods-show-img">
      <img :src="item.thumbnail" height="220" width="220"/>
      <div v-if="item.recommend" class="item-img-tag">
        <div class="tag-favorite">
          <span>{{ $t('Favorite') }}</span>
        </div>
      </div>
      <div class="item-img-medal">

      </div>
    </div>
    <div class="goods-show-price">
      <span>
        <span class="seckill-price red_color">
          {{ item.price | unitPrice("₫",  "before") }}
        </span>
      </span>
    </div>
    <div class="goods-show-detail">
      <Tag
        v-if="item.salesModel === 'WHOLESALE'"
        class="goods-show-tag"
        color="purple"
      >
        {{ $t('wholesale') }}
      </Tag>
      <span :title="item.name">{{ item.name }}</span>
    </div>
    <div class="goods-show-bottom">
      <div class="goods-show-num rate">
        <Rate :value="item.grade" allow-half disabled
              icon="md-star"/>
        <span>({{ item.commentNum || 0 }} {{ $t('comments') }})</span>
      </div>
      <div class="price">
        <span>{{ $t('Booked') }} {{ item.buyCount || 0 }}</span>
      </div>
    </div>
    <!--              TODO-->
    <div v-if="false" class="goods-show-seller">
      <span class="text-bottom" style="color: #e4393c">
        {{ item.storeName }}
      </span>
    </div>

    <!--              TODO-->
    <div v-if="false" class="goods-show-right">
      <Tag
        v-if="item.goodsType == 'VIRTUAL_GOODS'"
        class="goods-show-tag"
        color="blue"
      >
        {{ $t('virtual') }}
      </Tag>
      <Tag v-else-if="item.goodsType == 'PHYSICAL_GOODS'"
           class="goods-show-tag"
           color="blue"
      >
        {{ $t('Goods') }}
      </Tag>
      <Tag
        v-else-if="item.goodsType == 'SERVICES'"
        class="goods-show-tag"
        color="blue"
      >
        {{ $t('Services') }}
      </Tag>
      <Tag v-if="item.recommend" class="goods-show-tag" color="orange">
        {{ $t('Featured') }}
      </Tag>
    </div>
  </div>
</template>

<script>
export default {
  name: "productCard",
  props: ['item']
}
</script>

<style lang="scss" scoped>
.goods-show-info {
  width: 235px;
  padding: 6px;
  margin: 10px 0px;
  margin-left: 5px;
  position: relative;
  border: 1px solid #fff;
  cursor: pointer;
  background-color: #fff;
}

.goods-show-info:hover {
  border: 1px solid #ccc;
  box-shadow: 0px 0px 15px #ccc;
}

.goods-show-price {
  margin-top: 6px;
}

.goods-show-detail {
  height: 46px;
  font-size: 14px;
  margin: 4px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-show-num {
  font-size: 12px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  span {
    color: $accent_color_shade;
  }

  .ivu-rate {
    font-size: 13px;
  }

  /deep/ .ivu-rate-star-chart {
    margin-right: 2px;
  }
}

.goods-show-seller {
  font-size: 12px;
  color: $accent_color;
}

.goods-page {
  margin: 10px auto;
  text-align: right;
  width: 1200px;
}

.goods-show-img {
  img {
    object-fit: cover;
  }
}

.item-img-tag {
  position: absolute;
  left: 0;
  top: 0.625rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 1;
  max-width: 70%;

  .tag-favorite {
    color: #fff;
    padding: 0 0.25rem;
    height: auto;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    border-top-right-radius: 0.125rem;
    border-bottom-right-radius: 0.125rem;
    background-color: #E4393C;

    &:before {
      content: "";
      display: inline-block;
      position: absolute;
      left: 0;
      bottom: -4px;
      border-top: 4px solid #E96163;
      border-left: 7px solid transparent;
      filter: brightness(60%);
    }
  }
}
</style>
