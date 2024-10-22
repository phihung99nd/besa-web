<template>
  <div class="hot-place">
    <div class="section-header">
      <h2>Điểm đến trải nghiệm tuyệt vời</h2>
    </div>
    <div class="section-body">
      <div class="place-card" :class="{active: active == index}"
           :style="{ 'background-image': `url('${parseMinioURL(item.storeLogo)}')`}" v-for="(item, index) in placeList" :key="index"
           @click="$router.push({name: 'Merchant', query: {id: item.id}})"
           @mouseenter="active = index">
        <div class="meta-info">
          <div class="name">{{ item.storeName }}</div>
          <ul class="flex review">
            <li class="rating">
              <span>{{ item.grade.toFixed(1) }}</span>
              <Rate allow-half disabled :value="item.grade"/>
            </li>
            <li class="rating-num">
              <span>20</span>
              đánh giá
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getRecommendedStore} from "@/api/recommended";

export default {
  name: "HotPlace",
  data() {
    return {
      placeList: [
        {
          grade: 0
        }
      ],
      active: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getRecommendedStore().then(res => {
        this.placeList = res.result.slice(0, 5)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.hot-place {
  margin-bottom: 50px;

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

  .section-body {
    display: flex;
    justify-content: space-between;
    --gap: 10px;
    --quantity: 5;
    .place-card {
      width: calc((1200px - var(--gap)*(var(--quantity) - 1))/(var(--quantity) + 2));
      height: 270px;
      background-size: cover;
      background-position: 50%;
      transition: all 0.2s ease-in-out;
      transition-delay: 0.15s;
      border-radius: 12px;
      position: relative;
      overflow: clip;
      cursor: pointer;

      &.active {
        width: calc((1200px - var(--gap)*(var(--quantity) - 1))/(var(--quantity) + 2) * 3);

        .meta-info {
          bottom: 0;
        }
      }

      .meta-info {
        background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .4), rgba(0, 0, 0, .6));
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100px;
        bottom: -150px;
        left: 0;
        transition: all 0.2s ease-in-out;
        transition-delay: 0.15s;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: end;

        > .name {
          font-size: 20px;
          color: #fff;
          font-weight: 600;
          width: 300px;
        }

        > .review {
          list-style: none;

          .rating {
            padding-right: 10px;
            margin-right: 10px;
            border-right: 1px solid $border_color;

            span {
              margin-right: 4px;
              text-decoration: underline;
              color: $accent_color;
            }

            .ivu-rate {
              font-size: 14px;
            }

            /deep/ .ivu-rate-star {
              margin-right: 2px;
            }
          }

          .rating-num {
            color: #fff;

            > span {
              margin-right: 4px;
              text-decoration: underline;
              color: $accent_color;
            }
          }
        }
      }
    }
  }
}
</style>
