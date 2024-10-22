<template>
  <div class="product-slider">
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <div class="slider-wrapper">
      <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="goods-show-info" @click="linkTo(`/goodsDetail?goodsId=${item.goodsId}&skuId=${item.id}`)">
            <div class="goods-show-img">
              <img width="220" height="220" :src="item.thumbnail"/>
              <div class="item-img-tag" v-if="item.recommend">
                <div class="tag-favorite">
                  <span>{{ $t('Favorite') }}</span>
                </div>
              </div>
              <div class="item-img-medal">

              </div>
            </div>
            <div class="goods-show-price">
                  <span>
                    <span class="seckill-price red_color">{{
                        item.price | unitPrice("₫",  "before")
                      }}</span>
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
              <span>{{ item.name }}</span>
            </div>
            <div class="goods-show-bottom">
              <div class="goods-show-num rate">
                <Icon type="md-star" color="#f5a623" v-for="i in Math.ceil(item.grade / 20)" :key="i"/>
                <Icon type="md-star" color="#e9e9e9" v-for="i in 5-Math.ceil(item.grade / 20)" :key="i"/>
                ({{ item.commentNum || 0 }} {{ $t('comments') }})
              </div>
              <div class="price">
                <span>{{ $t('Booked') }} {{ item.buyCount || 0}}</span>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import {swiper, swiperSlide} from "vue-awesome-swiper";

export default {
  name: "GoodsSlider",
  props: ['data'],
  components: {
    swiper,
    swiperSlide,
  },
  data(){
    return {
      title: this.data.options.title,
      swiperOptions: {
        slidesPerView: 5,
        autoplay: false,
        loop: false,
        freeMode: true
      },
      list: this.data.options.list,
    }
  }
}
</script>

<style lang="scss" scoped>

.product-slider {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  .title {
    color: #888;
    font-size: 18px;
    font-weight: 700;
    width: 100%;
    padding-top: 10px;
  }

  .slider-wrapper {
    width: 100%;
  }
}

// Product Item css
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
  color: #1C2438;
}

.goods-show-detail :hover {
  color: #E23A3A;
}

.goods-show-num {
  font-size: 14px;
  margin-bottom: 6px;
  color: $accent_color_shade;
}

.goods-show-num span {
  color: $accent_color_shade;
}

.goods-show-seller {
  font-size: 14px;
  color: $theme_color;
}

.goods-page {
  margin: 10px auto;
  text-align: right;
  width: 1200px;
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

// Edit Modal css
.edit-product-slider {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  div:nth-of-type(1) {
    margin-right: 10px;
  }

  div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .product-name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      width: 100%;
      font-size: 16px;
      font-weight: 600;
    }

    .product-price {

    }
  }
}
</style>
