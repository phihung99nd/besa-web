<template>
  <div v-if="order">
    <card :_Size="18" :_Title="$t('Booking detail')"></card>
    <div class="order-title">
      <div class="order-title-left">
        <div class="flex">
          <p class="fontsize_14 item-title">{{ $t('Status Payment') }}: &nbsp;</p>
          <div style="font-weight: bolder">
            <p v-if="orderDetail.order.payStatus == 'UNPAID'" class="warning_color">
              {{ $t('Unpaid') }}</p>
            <p v-if="orderDetail.order.payStatus == 'PAID'">
              {{ $t('Paid') }}</p>
          </div>
        </div>
        <div class="flex">
          <p class="fontsize_14 item-title">{{ $t('Booking status') }}: &nbsp;</p>
          <div style="font-weight: bolder">
            <p v-if="order.status === 'CANCELLED'" class="error_color ">
              {{ $t('Cancelled') }}</p>
            <p v-else-if="order.status === 'PENDING'" class="pending_color">
              {{ $t('Pending') }}</p>
            <p v-else-if="order.status === 'CONFIRMED'" class="success_color ">
              {{ $t('Confirmed') }}</p>
            <p v-else-if="order.status === 'DONE'" class="success_color ">
              {{ $t('Done') }}</p>
            <p v-else-if="order.status === 'REJECTED'" class="error_color ">
              {{ $t('Rejected') }}</p>
            <p v-if="order.status === 'IN_PROGRESS'" class="in_progress-color ">
              {{ $t('In progress') }}</p>
          </div>
        </div>
        <div v-if="order.cancelReason" class="flex">
          <p class="fontsize_14 item-title">{{ $t('Cancel reason') }}: &nbsp;</p>
          <p class="fontsize_14">{{ order.cancelReason }}</p>
        </div>
      </div>
      <div class="order-title-right">
        <ButtonGroup vertical>
          <!--          <Button type="warning" @click="goPay(order.orderSn)"-->
          <!--                  v-if="order.payStatus == 'UNPAID' && order.status !='CANCELLED'">-->
          <!--            {{ $t('Pay') }}-->
          <!--          </Button>-->
          <Button v-if="false" type="warning" @click="goPay(order.orderSn)">
            {{ $t('Pay') }}
          </Button>
          <Button
            v-if="(order.status == 'IN_PROGRESS' || order.status == 'CONFIRMED') && order.orderDetail.order.payStatus == 'PAID'"
            type="success" @click="doneBooking(order.orderSn)">
            {{ $t('Complete') }}
          </Button>
          <Button v-if="order.status === 'CANCELLED' || order.status === 'REJECTED' || order.status === 'DONE'"
                  type="success"
                  @click="handleReBooking(order.serviceId)">
            {{ $t('Rebooking') }}
          </Button>
          <Button v-if="order.status === 'PENDING'" type="error"
                  @click="handleCancelOrder(order.orderSn)">
            {{ $t('Cancel booking') }}
          </Button>
        </ButtonGroup>
      </div>
    </div>
    <Divider/>
    <div class="flex booking-container">
      <div class="booking-content">
        <div class="booking-name">
          <img
            :src="orderDetail.orderItems[0].image"
            alt="">
          <div class="booking-desc mr_20">
            <span @click="handleReBooking(order.serviceId)" class="fontsize_16 global_color hover-pointer">
              {{ orderDetail.orderItems[0].name }}
            </span>
            <div @click="shopPage(order.storeId)" class="booking-time hover-pointer">
              <Iconify class="booking-icon" icon="mdi:location"/>
              {{ order.storeAddressName }}
            </div>
            <!--            <div class="booking-time">-->
            <!--              <Iconify class="booking-icon" icon="mdi:calendar"/>-->
            <!--              {{ order.bookDateTime | formatDate(order.bookDateTime) }}-->
            <!--            </div>-->
          </div>
        </div>
        <div class="booking-detail mb_10">
          <h4 class="booking-title">{{ $t('Thông tin đặt lịch') }}</h4>
          <div class="title-item">
            <span>{{ $t('BookingID') }}:</span> {{ this.$route.query.sn }}
            <div @click="handleCopy(order.sn)">
              <Iconify class="hover-pointer"
                       icon="uil:copy"/>
            </div>
          </div>
          <div class="title-item">
            <span>{{ $t('Booking time') }}: </span>
            {{ order.bookDateTime | formatDate(order.bookDateTime) }}
          </div>
          <div class="title-item">
            <span>{{ $t('Created time') }}: </span>
            {{ orderDetail.order.createdTime | formatDate(orderDetail.order.createdTime) }}
          </div>
          <div class="title-item">
            <span>{{ $t('Service sku') }}: </span>
            <Tag>{{ order.serviceSku.name }}</Tag>
          </div>
          <div class="title-item">
            <span>{{ $t('Quantity') }}: </span>
            {{ order.num }}
          </div>
          <div class="title-item">
            <span>{{ $t('Note') }}: </span>
            {{ orderDetail.order.remark ? orderDetail.order.remark : 'Không có' }}
          </div>
          <h4 class="booking-title">{{ $t('Thông tin nhân viên') }}</h4>
          <!--          TODO-->
          <swiper ref="mySwiper" :options="swiperOptions">
            <swiper-slide
              v-for="(item, index) in order.clerkNames"
              :key="index"
            >
              <div class="clerk-detail">
                <Avatar shape="circle">{{ item[0] }}</Avatar>
                <div class="flex flex-column clerk-name">
                  <h5>{{ item }}</h5>
                </div>
              </div>
            </swiper-slide>
          </swiper>
          <h4 class="booking-title">{{ $t('Thông tin thanh toán') }}</h4>
          <div>
            <div class="title-item">
              <span>{{ $t('Price') }}:</span>
              <div class="item-content">
                {{ order.cost | unitPrice("₫",  "before") }}
              </div>
            </div>
            <div class="title-item">
              <span>{{ $t('Vorcher') }}:</span>
              <div class="item-content">
                {{ 0 | unitPrice("₫",  "before") }}
              </div>
            </div>
            <div class="title-item">
              <span>{{ $t('Thành tiền') }}:</span>
              <div class="fontsize_16 global_color fw-bold">
                {{ order.cost | unitPrice("₫",  "before") }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Card dis-hover class="booking-log">
        <h4 class="mb_10">{{ $t('Booking detail') }}</h4>
        <Timeline :pending="order.status !== 'CANCELLED' && order.status !== 'REJECTED'">
          <TimelineItem v-for="(item,index) in bookingLogs" :key="index" color="green">
            <Icon slot="dot" type="ios-checkmark-circle"></Icon>
            <p class="time" style="font-size: 12px; font-weight: 600;margin-bottom: 4px">
              {{ item.createdTime | formatDate(item.createdTime) }}</p>
            <div class="content">
              <Tag v-if="item.operatorType === 'Member'" color="blue">{{ item.createdBy }}</Tag>
              <Tag v-else color="green">{{ item.createdBy }}</Tag>
              {{ item.message }}
            </div>
          </TimelineItem>
        </Timeline>
      </Card>
    </div>
    <CancelOrder ref="modalCancel" @sureCancel="sureCancel"/>
  </div>
</template>
<script>
import {cancelBooking, DoneBooking, getDetailBooking, sureReceived} from "@/api/order.js";
import {getStoreDetailById} from "@/api/shopentry"
import Multiselect from 'vue-multiselect'
import CancelOrder from "@/components/Modal/CancelOrder";
import {swiper, swiperSlide} from "vue-awesome-swiper";


export default {
  name: "BookingDetail",
  components: {
    CancelOrder,
    Multiselect,
    swiper,
    swiperSlide,
  },
  watch: {},
  data() {
    return {
      swiperOptions: {
        grabCursor: true,
        spaceBetween: 10,
        slidesPerView: 3,
        autoplay: true,
        loop: false,
        freeMode: true,
      },
      isShowEdit: false,
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      error: {
        slot: false,
      },
      order: {
        clerkNames: [],
      },
      storeId: '',
      branchName: '',
      selectedBranch: '',
      selectedSlot: '',
      selectedTime: '',
      // storeDetail: {},
      clerkList: [],
      orderDetail: {order: {}, orderItems: [{}]},
      bookingLogs: [],
      cancelParams: {
        orderSn: "",
        reason: "",
      },
      isOtherReason: false,
      otherReason: '',
      cancelAvail: false,
      cancelReason: [],
    };
  },

  methods: {
    async getData() {
      await getDetailBooking(this.$route.query.sn).then((res) => {
        if (res.success) {
          this.order = res.result;
          this.storeId = res.result.storeId;
          this.orderDetail = res.result.orderDetail;
          this.bookingLogs = res.result.bookingLogs.reverse()
          this.selectedBranch = res.result.storeAddressId
          this.selectedTime = res.result.bookDateTime.split('T')[0]
          this.count = res.result.num
          // this.clerkListChoose = res.result.clerkIds
          this.selectedSlot = res.result.bookDateTime.split('T')[1].substring(0, 5)
        }
      });
      this.getStore()
    },

    shopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: {id: id},
      });
      window.open(routeUrl.href, "_blank");
    },
    // getStore() {
    //   if (this.storeId) {
    //     getStoreDetailById(this.storeId).then(res => {
    //       if (res.success) {
    //         this.storeDetail = res.result
    //       }
    //     })
    //   }
    // },
    goPay(sn) {
      this.$router.push({
        path: "/payment",
        query: {orderType: "ORDER", sn},
      });
    },
    doneBooking(sn) {
      sureReceived(sn).then(res => {
        this.$Message.success(this.$t('Done'));
        this.getData()
      })
    },
    handleCopy(text) {
      navigator.clipboard.writeText(text)
      this.$Message.success(this.$t('Copy successfully'))
    },
    handleCancelOrder(sn) {
      this.cancelParams.orderSn = sn;
      this.$refs.modalCancel.isShow = true;
    },
    sureCancel(v) {
      cancelBooking(this.cancelParams.orderSn, {reason: v.reason}).then(res => {
        if (res.success) {
          this.$Message.success(this.$t('Booking canceled successfully'))
          this.getData()
          this.cancelAvail = false
        }
      }).catch(err => {
        this.$Message.error(err.response.data.message)
      })
    },
    handleReBooking(id) {
      this.$router.push({path: "/service", query: {id}})
    },
    handleChangeCancelReason(e) {
      if (e === 'OTHER_REASON') this.isOtherReason = true
      else this.isOtherReason = false
    },
  },
  created() {
    this.getData()
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
.booking-container {
  .booking-content {
    flex: 1;
    width: 580px;

    .booking-name {
      display: flex;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 6px;
        margin-right: 12px;
      }

      .booking-desc {
        flex: 1;
        font-size: 14px;

        .booking-time {
          display: flex;
          align-items: center;
        }

        .booking-icon {
          margin-right: 6px;
        }
      }
    }

    .booking-detail {
      margin-top: 20px;

      .booking-title {
        margin-top: 10px;
        width: fit-content;
        margin-bottom: 10px;
        border-bottom: 2px solid $accent_color;
      }

      .title-item {
        display: flex;
        align-items: center;

        .item-content {
          font-size: 14px;
        }

        span {
          color: $title_color;
          width: 150px;
        }

        p {
          color: $title_color;
        }
      }

      .clerk-detail {
        width: 180px;
        padding: 4px 6px;
        border-radius: 6px;
        border: 2px solid #f5f5f5;
        display: flex;

        .clerk-avatar {
          width: 60px;
          height: 60px;
          object-fit: cover;
        }

        .clerk-name {
          flex: 1;
          margin-top: 4px;
          text-align: start;
          margin-left: 10px;
          line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }

  .booking-log {
    width: 330px;
  }
}

.booking-pay-status {
  width: 150px;
  display: flex;
  flex-direction: column;
  height: 200px;
  align-items: center;
  justify-content: center;

  .booking-action {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 40px;
  }
}


.booking-footer {
  max-width: 900px;
}

.order-title {
  justify-content: space-between
}

.order-title, .order-title-right, .order-title-left {
  display: flex;

  .order-title-left {
    flex-direction: column;
  }

}

.item-title {
  width: 150px;
}
</style>
