<template>
  <div class="width_1200" v-if="data.length > 0">
    <div class="section-header">
      <h2>Sản phẩm mới</h2>
      <span v-if="data.length > 4">Xem thêm ></span>
    </div>
    <div class="content">
      <div class="flex1 start1 top-row">
        <div class="item" :title="item.name" v-for="(item, index) in data.slice(0,6)" :key="index"
             @click="linkTo(`/goodsDetail?goodsId=${item.id}&skuId=undefined`)">
          <div class="flex1 start1 column">
            <img class="thumbnail" :src="item.thumbnail" width="170" height="170" alt=""/>
            <div class="flex1 between column item-detail">
              <div class="flex1 start1 column">
                <p class="name">{{ item.name }}</p>
                <div class="flex1 start1 row1 rate">
                  <!--                  <Icon type="md-star" color="#f5a623" v-for="i in Math.ceil(item.grade / 20)" :key="i"/>-->
                  <!--                  <Icon type="md-star" color="#e9e9e9" v-for="i in 5-Math.ceil(item.grade / 20)" :key="i"/>-->
                  <Rate style="font-size: 14px" :value="Number(item.grade)"/>
                </div>
              </div>
              <div class="price">
                <span>{{ item.price | unitPrice("₫",  "before") }}</span>
                <span>{{ $t('Booked') }} {{ item.buyCount || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex1 start1 bot-row" v-if="data.length > 6">
        <div class="item" v-for="(item, index) in data.slice(6)" :key="index"
             @click="linkTo(`/goodsDetail?goodsId=${item.id}&skuId=undefined`)">
          <div class="flex1 start1 column">
            <img class="thumbnail" :src="item.thumbnail" width="170" height="170" alt=""/>
            <div class="flex1 between column item-detail">
              <div class="flex1 start1 column">
                <p class="name" :title="item.name">{{ item.name }}</p>
                <div class="flex1 start1 row1 rate">
                  <!--                  <Icon type="md-star" color="#f5a623" v-for="i in Math.ceil(item.grade / 20)" :key="i"/>-->
                  <!--                  <Icon type="md-star" color="#e9e9e9" v-for="i in 5-Math.ceil(item.grade / 20)" :key="i"/>-->
                  <Rate style="font-size: 14px" :value="Number(item.grade)"/>
                </div>
              </div>
              <div class="price">
                <span>{{ item.price | unitPrice("₫",  "before") }}</span>
                <span>{{ $t('Booked') }} {{ item.buyCount || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getServicesList} from "@/api/services";
import {getGoodsList} from "@/api/goods";

export default {
  name: "HotServices",
  data() {
    return {
      searchForm: {
        page: 0,
        size: 12,
        sort: "createdTime,DESC",
        marketEnable: "UPPER",
        // authFlag: "PASS"
      },
      data: []
    }
  },
  created() {
    getGoodsList(this.searchForm)
      .then(res => {
        if (res.success) {
          this.data = res.result.content
        }
      })
  },
}
</script>

<style lang="scss" scoped>
.section-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: end;

  > h2 {
    font-size: 22px;
    font-weight: 600;
    color: #333;
  }

  > span {
    cursor: pointer;

    &:hover {
      color: $accent_color;
    }
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;

  .top-row {
    margin-top: 10px;
  }

  .start1 {
    justify-content: flex-start;
  }

  .between {
    justify-content: space-between;
  }

  .column {
    flex-direction: column;
  }

  .row1 {
    flex-direction: row;
  }

  .rate {
    height: 20px;
  }

  .flex1 {
    display: flex;

    .item {
      position: relative;
      padding: 10px;
      margin-right: 10px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin-bottom: 10px;
      background: #fff;
      border-radius: 14px;
      transition: all $common_transition_duration ease-in-out;

      &:hover {
        cursor: pointer;
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
      }

      .thumbnail {
        border-radius: 4px;
        object-fit: cover;
      }

      .name {
        display: inline-block;
        word-wrap: break-word;
        font-size: 14px;
        white-space: normal;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        min-height: 42px;
        width: 170px;
        margin: 10px 0 5px 0;
      }

      .price {
        span:nth-of-type(1) {
          color: $accent_color;
        }

        span:nth-of-type(2) {
          color: rgba(0, 0, 0, .54);
          font-size: .75rem;
        }

        font-size: 16px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }
    }
  }

  .item-detail {
    height: 95px;
  }
}

</style>
