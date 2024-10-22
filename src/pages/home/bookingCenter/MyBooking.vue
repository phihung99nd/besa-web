<template>
  <div id="my-booking" class="my-booking">
    <card :_Title="$t('My Booking')" :_Size="16" :_Tabs="changeWay" @_Change="change"></card>
    <div class="mb_20 box">
      <div class="filterDate">
        <div>
          <RadioGroup size="small" v-model="orderBooking" type="button" style="margin-right: 4px">
            <Radio label="DESC">
              <Icon type="md-arrow-round-down"></Icon>
            </Radio>
            <Radio label="ASC">
              <Icon type="md-arrow-round-up"></Icon>
            </Radio>
          </RadioGroup>
          <Select v-model="sortBooking" style="width:160px; margin-right: 6px">
            <Option value="createdTime">{{ $t('Create time') }}</Option>
            <Option value="bookDateTime">{{ $t('Booking date') }}</Option>
          </Select>
          <RadioGroup type="button" button-style="solid" v-model="filterDate" @on-change="getList">
            <Radio label="ALL">{{ $t('All') }}</Radio>
            <Radio label="TODAY">{{ $t('Today') }}</Radio>
            <Radio label="YESTERDAY">{{ $t('Yesterday') }}</Radio>
            <Radio label="LAST_7_DAYS">{{ $t('last week') }}</Radio>
            <Radio label="CUSTOM">{{ $t('customize') }}</Radio>
          </RadioGroup>
          <DatePicker class="ml_10"
                      :disabled="disableTimePicker"
                      :separator="`  `"
                      type="daterange"
                      :clearable="true"
                      :confirm="false"
                      placement="bottom-end"
                      :placeholder="$t('Select booking date')"
                      style="width: 180px"
                      @on-change="changeFilterDate"/>
        </div>

      </div>
    </div>
    <empty v-if="bookingList.length === 0"/>
    <div class="booking-content" v-else>
      <Card
        class="booking-item"
        v-for="(item, index) in bookingList"
        :key="index"
        @click.native="goBookingPage(item.sn)"
      >
        <div class="booking-header">
          <div class="name-store" @click.stop="shopPage(item.storeId)">
            <Iconify icon="mdi:shop-minus"/>
            <p class="storeName">{{ `${item.storeName} - ${item.storeAddressName}` }}</p>
          </div>
          <div class="header-status">
            <div class="time-create">
              <span style="color: #80848f"> {{ $t('Time Booking') }}</span>:
              <span> {{
                  item.bookDateTime | formatDate(item.bookDateTime)
                }} </span>
            </div>
            <div class="status-booking">
              <Tag color="red" v-if="item.orderStatus == 'CANCELLED'">{{ $t('Cancelled') }}</Tag>
              <Tag color="green" v-if="item.orderStatus == 'CONFIRMED'">{{ $t('Confirmed') }}</Tag>
              <Tag color="cyan" v-if="item.orderStatus == 'IN_PROGRESS'">{{ $t('In progress') }}</Tag>
              <Tag color="red" v-if="item.orderStatus == 'REJECTED'">{{ $t('Rejected') }}</Tag>
              <Tag color="blue" v-if="item.orderStatus == 'PENDING'">{{ $t('Pending') }}</Tag>
              <Tag color="success" v-if="item.orderStatus == 'COMPLETED'">{{ $t('Done') }}</Tag>
            </div>
          </div>
        </div>
        <Divider style="margin: 6px 0 "/>
        <div class="booking-body">
          <div class="booking-detail">
            <div class="booking-img">
              <img :title="item.orderItems[0].name" @click.stop="goBookingPage(item.sn)" :src="item.orderItems[0].image"
                   alt="">
            </div>
            <div class="booking-name">
              <p> {{ item.orderItems[0].name }} x {{ item.orderItems.length }}</p>
            </div>
          </div>
        </div>
        <div class="booking-footer">
          <div class="booking-right">
            <Divider style="margin: 10px 0"/>
            <div class="flex" style="justify-content: space-between">
              <div class="booking-time">
                <!--                <p style="color: #80848f">{{ $t('Create time booking') }}:</p>-->
                <!--                <p style="text-align: start; margin-left: 1rem">-->
                <!--                  {{ item.createdTime | formatDate(item.createdTime) }}-->
                <!--                </p>-->
                <div>
                  <div class="global_color" v-if="item.commentStatus=='AVAILABLE'">
                    {{ $t('Chưa đánh giá') }}
                  </div>
                  <div class="global_color" v-if="item.orderStatus=='COMPLETED' && item.commentStatus=='UNAVAILABLE'">
                    {{ $t('Đánh giá không khả dụng') }}
                  </div>
                  <div class="global_color" v-if="item.commentStatus == 'FINISHED'">
                    <Icon type="ios-star"/>
                    {{ $t('Have evaluated') }}
                  </div>
                </div>
              </div>
              <div>
                <div class="flow-price mb_10">
                  <span>{{ $t('Flow price') }}: &nbsp;</span>
                  <p class="global_color">{{ item.flowPrice | unitPrice("₫",  "before") }}</p>
                </div>
                <div class="flex" style="gap: 12px; justify-content: flex-end">
                  <Button type="primary" @click.stop="handleReBooking(item.serviceId)"
                          v-if="item.orderStatus == 'CANCELLED' || item.orderStatus === 'REJECTED' || item.orderStatus == 'COMPLETED'">
                    {{ $t('Rebooking') }}
                  </Button>
                  <Button type="primary" @click.stop="addToCalendar(item)"
                          v-if="item.orderStatus == 'PENDING' || item.orderStatus == 'CONFIRMED'">
                    {{ $t('Add to calendar') }}
                  </Button>
                  <Button ghost type="primary" @click.stop="goDone(item.orderSn)"
                          v-if="(item.orderStatus == 'IN_PROGRESS' || item.orderStatus == 'CONFIRMED') && item.payStatus == 'PAID'">
                    {{ $t('Complete') }}
                  </Button>
                  <Button ghost type="primary" @click.stop="handleCancel(item.orderSn)"
                          v-if="item.orderStatus == 'PENDING'">
                    {{ $t('Booking cancel') }}
                  </Button>
                  <Button v-if="item.orderStatus == 'COMPLETED' && item.commentStatus == 'AVAILABLE'" ghost
                          type="primary"
                          @click.stop="handleShowReview(item)">
                    {{ $t('Review') }}
                  </Button>
                  <!--               TODO -->
                  <!--                  <Button ghost type="primary" @click.stop="goPay(item.orderSn)"-->
                  <!--                          v-if="item.status == 'UNPAID' && item.status != 'CANCELLED' && false">-->
                  <!--                    {{ $t('Booking payment') }}-->
                  <!--                  </Button>-->
                  <Button v-if="item.commentStatus == 'FINISHED' && item.orderStatus=='COMPLETED'" type="primary"
                          @click.stop="handleWatchAgainReview(item.orderSn, item)" ghost>{{ $t('Xem lại đánh giá') }}
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </Card>
      <ReviewModal ref="review" :order="reviewingOrder"/>
      <ReviewDetail ref="reviewDetail" :order-detail="reviewDetail"/>
      <CancelOrder ref="modalCancel" @sureCancel="sureCancel"/>
    </div>

    <div class="page-size">
      <Page :total="total" @on-change="changePageNum"
            @on-page-size-change="changePageSize"
            :page-size="params.size"
            show-total
            show-sizer>
      </Page>
    </div>
  </div>
</template>

<script>
import {cancelBooking, getBookingList, sureReceived} from "@/api/order";
import CancelOrder from '@/components/Modal/CancelOrder';
import ReviewModal from "@/pages/home/memberCenter/evaluation/ReviewModal.vue";
import {getReviewDetailByOrder} from "@/api/review";
import ReviewDetail from "@/pages/home/memberCenter/evaluation/ReviewDetail";

export default {
  name: "MyBooking",
  components: {
    ReviewModal,
    CancelOrder,
    ReviewDetail
  },
  data() {
    return {
      reviewDetail: {orderItems: []},
      sortBooking: 'createdTime',
      orderBooking: 'DESC',
      bookingList: [],
      total: 0,
      filterDate: 'ALL',
      isShowModalCancel: false,
      params: {
        tradeSn: '',
        skuId: '',
        client: '',
        clientName: '',
        clientPhone: '',
        startDate: '',
        endDate: '',
        storeAddressId: '',
        storeId: '',
        note: '',
        cost: '',
        bookingStatus: [],
        num: '',
        clerkId: '',
        orderSn: '',
        serviceName: '',
        page: 1,
        size: 10,
        keywords: '',
        sort: [
          'createdTime,DESC'
        ]
      },
      // DateOptions: {
      //   shortcuts: [
      //     {
      //       text: this.$t('last week'),
      //       value() {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //         return [start, end];
      //       }
      //     },
      //     {
      //       text: this.$t('last month'),
      //       value() {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //         return [start, end];
      //       }
      //     },
      //     {
      //       text: this.$t('last 3 months'),
      //       value() {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      //         return [start, end];
      //       }
      //     }
      //   ]
      // },
      changeWay: [this.$t('All Booking'),
        this.$t('Pending'),
        this.$t('Confirmed'),
        this.$t('In progress'),
        this.$t('Done'),
        this.$t('Cancelled'),
        this.$t('Rejected')
      ],
      cancelParams: {
        orderSn: '',
        reason: ''
      },
      reviewingOrder: {},
    }
  },
  computed: {
    disableTimePicker() {
      return this.filterDate != 'CUSTOM'
    }
  },
  watch: {

    orderBooking: {
      handler(newVal, oldVal) {
        this.params.sort = [
          `${this.sortBooking},${newVal}`
        ]
        this.getList()
      }
    },

    sortBooking: {
      handler(newVal, oldVal) {
        this.params.sort = [
          `${newVal},${this.orderBooking}`
        ]
        this.getList()
      }
    }
  },
  methods: {
    getList() {
      let params = {
        ...this.params,
        page: this.params.page - 1,
        sort: `${this.sortBooking},${this.orderBooking}`,
        bookingStatus: this.params.bookingStatus == 0 ? "" : this.params.bookingStatus
      }
      params[`${this.sortBooking}.rangeType`] = this.filterDate == 'ALL' ? '' : this.filterDate
      if (this.filterDate == "CUSTOM") {
        if (this.params.startDate) {
          params[`${this.sortBooking}.start`] = this.params.startDate
          params[`${this.sortBooking}.end`] = this.params.endDate
        } else return
      }
      delete params.startDate
      delete params.endDate
      this.bookingList = []
      getBookingList(params).then(res => {
        if (res.success) {
          this.bookingList = res.result.content;
          this.total = +res.result.totalElements;
        }
      })
    },
    handleReBooking(id) {
      this.$router.push({path: "/service", query: {id}})
    },
    addToCalendar(item) {
      let startTime = item.bookDateTime.split('T')[0].split('-').join("")+"T"+item.bookDateTime.split('T')[1].split(':').join("");
      let params = {
        text: item.orderItems[0].name,
        details: `<h2>Bạn có lịch đặt trên BESA</h2><div>Xem các lịch đã đặt của bạn <a href="${window.location.origin}/home/bookingDetail?sn=${item.sn}">tại đây</a></div>`,
        dates: `${startTime}/${startTime}`,
        location: item.address
      }
      let url = 'https://calendar.google.com/calendar/u/0/r/eventedit?text=' + encodeURIComponent(params.text) + '&details=' + encodeURIComponent(params.details) + '&dates=' + params.dates + '&location=' + params.location;
      window.open(url, '_blank')
    },
    handleChangeFilterDate(e) {
      const start = new Date();
      const end = new Date();
      switch (e) {
        case "ALL":
          this.DisableTimePicker = true
          this.params.startDate = ''
          this.params.endDate = ''
          this.getList()
          break;
        case "TODAY":
          this.DisableTimePicker = true
          this.params.startDate = start.toISOString().split('T')[0]
          this.params.endDate = end.toISOString().split('T')[0]
          this.getList()
          break;
        case "TOMORROW":
          this.DisableTimePicker = true
          start.setTime(end.getTime() + 3600 * 24 * 1000);
          this.params.startDate = start.toISOString().split('T')[0]
          this.params.endDate = start.toISOString().split('T')[0]
          this.getList()
          break;
        case "LAST_WEEK":
          this.DisableTimePicker = true
          start.setTime(end.getTime() - 3600 * 24 * 1000 * 7);
          this.params.startDate = start.toISOString().split('T')[0]
          this.params.endDate = end.toISOString().split('T')[0]
          this.getList()
          break;
        case "CUSTOMIZE":
          this.DisableTimePicker = false
          break;
      }
    },
    change(index) {
      switch (index) {
        case 0:
          this.params.bookingStatus = []
          break;
        case 1:
          this.params.bookingStatus = ['PENDING']
          break;
        case 2:
          this.params.bookingStatus = ['CONFIRMED']
          break;
        case 3:
          this.params.bookingStatus = ['IN_PROGRESS']
          break;
        case 4:
          this.params.bookingStatus = ['DONE']
          break;
        case 5:
          this.params.bookingStatus = ['CANCELLED']
          break;
        case 6:
          this.params.bookingStatus = ['REJECTED']
          break;
      }
      this.getList()
    },
    changeFilterDate(v) {
      if (v[0] !== '' && v[1] !== '') {
        this.params.startDate = `${v[0]}`;
        this.params.endDate = `${v[1]}`;
        this.getList()
      } else {
        this.params.startDate = "";
        this.params.endDate = "";
        this.getList()
      }
    },
    changePageNum(val) {
      this.params.page = val;
      this.getList()
      document.getElementById("my-booking").scrollIntoView({behavior: "smooth"})
    },
    changePageSize(val) {
      this.params.page = 1;
      this.params.size = val;
      this.getList()
    },
    comment(sn, goodsIndex) {
      this.$router.push({path: '/home/addEval', query: {sn, index: goodsIndex}})
    },
    complain(sn, goodsIndex) {
      this.$router.push({name: 'Complain', query: {sn, index: goodsIndex}})
    },
    shopPage(id) {
      let routeUrl = this.$router.resolve({
        path: '/Merchant',
        query: {id: id}
      });
      window.open(routeUrl.href, '_blank');
    },
    handleCancel(sn) {
      this.$refs.modalCancel.isShow = true
      this.cancelParams.orderSn = sn
    },
    handleShowReview(order) {
      this.$refs.review.isShow = true
      this.reviewingOrder = order
      this.isFooterHide = false
    },
    //hàm xử lý form xem lại đánh giá
    handleWatchAgainReview(sn, goodsDetail) {
      // this.reviewDetail= {}
      getReviewDetailByOrder(sn).then(res => {
        this.reviewDetail = {
          orderItems: res.map((e, i) => ({
            ...e,
            image: goodsDetail.orderItems[0].image,
            name: goodsDetail.orderItems[0].name,
            num: goodsDetail.orderItems[0].num
          }))
        }
        this.$refs.reviewDetail.isShowReviewDetail = true
      })
    },
    sureCancel(e) {
      cancelBooking(this.cancelParams.orderSn, {reason: e.reason}).then(res => {
        if (res.success) {
          this.$Message.success(this.$t('Booking canceled successfully'))
          this.getList()
          this.cancelAvail = false
        }
      }).catch((err) => {
        this.$Message.error(this.$t(err.response.data.message))
      }).finally(()=>{
        this.$refs.modalCancel.isShow = false
      })
    },
    goStore(storeId) {
      this.$router.push({name: "Merchant", query: {storeId}})
    },
    goBookingPage(sn) {
      this.$router.push({name: 'bookingDetail', query: {sn}});
    },
    goPay(sn) {
      this.$router.push({path: '/payment', query: {orderType: 'ORDER', sn}});
    },
    // xử lý khi hoàn thành dịch vụ
    goDone(sn) {
      sureReceived(sn).then(res => {
        if (res.success) {
          this.$Message.success(this.$t('Success'))
          this.getList()
        }
      })
    },

  },
  created() {
    this.getList()
  },
}
</script>

<style lang="scss" scoped>
.my-booking {
  margin-bottom: 40px;
}

.booking-content {
  width: 100%;

  .booking-item {
    margin-top: 2em;
    display: flex;
    flex-direction: column;

    .booking-header {
      margin-top: -8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;

      .name-store {
        flex: 0.3;
        display: flex;
        flex-direction: row;
        align-items: center;

        :first-child {
          margin-right: 4px;
        }

        &:hover {
          color: $accent_color;
          cursor: pointer;
        }
      }

      .header-status {
        flex: 0.7;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .time-create {
          span:last-child {
            font-size: 14px;
            color: $accent_color;
            margin-right: 8px;
            width: 50%;
            text-align: end;
          }
        }

        .status-booking {
          min-width: 100px;
          text-align: end;
        }
      }
    }

    .booking-body {
      .time-booking {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: $light_sub_color;
      }

      .booking-detail {
        margin: 1em 0;
        display: flex;
        flex-direction: row;
        align-items: center;

        .booking-img {
          height: 80px;
          width: 80px;
          display: flex;
          justify-content: space-around;

          img {
            height: 100%;
            width: 100%;

            &:hover {
              cursor: pointer;
            }
          }
        }

        .booking-name {
          width: 100%;

          p {
            color: black;
            font-size: 14px;
            margin-left: 2em;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;

            &:hover {
              color: $accent_color;
              cursor: pointer;
            }
          }
        }

        .booking-price {
          margin-left: 16px;
          color: $accent_color;
          font-size: 16px;
          display: flex;
          width: 100px;
          align-items: center;
        }
      }
    }
  }

  .booking-time {
    align-items: center;
    text-align: end;
    display: flex;
  }

  .booking-center {
    flex: 1;
    display: flex;
    flex-direction: column;

    .booking-center-top {
      display: flex;
      height: 60px;
      align-items: center;
    }

    .booking-center-bottom {
      text-align: end;
      display: flex;
      justify-content: flex-start;
      margin-left: 14px;
      color: $light_sub_color;

      > p {
        &:hover {
          cursor: pointer;
          color: $accent_color;
        }
      }
    }
  }
}

.box {
  overflow: hidden;
}

.page-size {
  margin: 15px 0px;
  text-align: right;
}

.reason-input {
  display: flex;
  flex-direction: column;
  margin-top: 16px;

  p {
    font-size: 1em;
    font-weight: bold;
    margin-bottom: 6px;
  }
}

.storeName {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 350px;
  font-weight: 600;
}

.flow-price {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > p {
    font-weight: bold;
    font-size: 16px;
  }

  > span {
    color: $title_color;
  }
}
</style>
