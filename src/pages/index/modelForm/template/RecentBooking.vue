<template>
  <div :class="$style['recent-booking']" v-if="serviceList.length > 0">
    <div :class="$style['section-header']">
      <h2>Lịch đặt gần đây</h2>
    </div>
    <div :class="$style['section-body']">
      <div :class="$style['service-card']" v-for="(i, index) in serviceList" :key="index">
        <div :class="$style['card-content']">
          <img :src="parseMinioURL(i.thumbnail)"/>
          <div :class="$style['meta-info']">
            <div :class="$style['top-info']" @click="handleReorder(i)">
              <div :class="$style['name']">{{ i.serviceName }}</div>
              <div :class="$style['store']">{{ i.orderDetail.order.storeName }}</div>
            </div>
            <div :class="$style['price']">{{ i.orderDetail.order.flowPrice | unitPrice('₫', 'before') }}</div>
          </div>
        </div>
        <div :class="$style['card-btn']">
          <Button type="primary" style="width: 150px;" @click="handleReorder(i)" ghost>{{ $t('Rebooking') }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getRecentBooking} from "@/api/order";

export default {
  name: "RecentBooking",
  data() {
    return {
      serviceList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getRecentBooking().then(res => {
        let data = res.result
        this.serviceList = data.map(i => ({
          ...i,
        })).slice(0, 2)
      })
    },
    handleReorder(i) {
      this.$router.push({
        name: 'service',
        query: {
          id: i.serviceId
        },
        params: {
          rebook: {
            branch: i.storeAddressId,
            serviceSku: i.serviceSkuId,
            clerks: i.clerkIds,
          }
        }
      })
    }
  }
}
</script>

<style module lang="scss">
.recent-booking {
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
    --gap: 15px;
    --quantity: 2;

    .service-card {
      width: calc((1200px - var(--gap) * (var(--quantity) - 1)) / var(--quantity));
      height: 120px;
      padding: 12px 16px 12px 12px;
      border-radius: 12px;
      background: #fff;
      display: flex;
      transition: all $common_transition_duration ease-in-out;

      &:hover {
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
      }

      .card-content {
        flex: 1 1;
        display: flex;
        gap: 12px;

        > img {
          width: 96px;
          height: 96px;
          object-fit: cover;
          border-radius: 4px;
        }

        .meta-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 8px;

          .top-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            cursor: pointer;

            .name {
              font-size: 16px;
              font-weight: 600;
              max-height: 40px;
              line-height: 20px;
              white-space: normal;
              overflow: hidden;
              display: -webkit-box;
              text-overflow: ellipsis;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            .store {

            }
          }

          .price {
            font-weight: 600;
            color: $red_color;
            font-size: 18px;
          }
        }
      }

      .card-btn {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

}
</style>
