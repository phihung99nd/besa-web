<template>
  <div id="my-order" class="order-wrapper">
    <card v-if="!homePage" :_Size="16" :_Tabs="changeWay" :_Title="$t('My Order')" @_Change="change"></card>
    <card v-else
          :_More="$t('All Orders')"
          :_Size="16"
          :_Tabs="changeWay"
          :_Title="$t('My Order')"
          _Src="/home/MyOrder"
          @_Change="change">
    </card>
    <div v-if="!homePage" class="mb_20 box">
      <div class="mb_20 box">
        <div class="filterDate">
          <div>
            <RadioGroup v-model="orderItems" style="margin-right: 4px" type="button">
              <Radio label="DESC">
                <Icon type="md-arrow-round-down"></Icon>
              </Radio>
              <Radio label="ASC">
                <Icon type="md-arrow-round-up"></Icon>
              </Radio>
            </RadioGroup>
            <Select v-model="sortOrder" style="width:130px; margin-right: 6px">
              <Option v-for="item in sortList" :key="item.value" :value="item.value">{{ item.label }}</Option>
            </Select>
            <RadioGroup v-model="filterDate" button-style="solid" type="button" @on-change="getList">
              <Radio label="ALL">{{ $t('All') }}</Radio>
              <Radio label="TODAY">{{ $t('Today') }}</Radio>
              <Radio label="YESTERDAY">{{ $t('Yesterday') }}</Radio>
              <Radio label="LAST_7_DAYS">{{ $t('Last week') }}</Radio>
              <Radio label="CUSTOM">{{ $t('Customize') }}</Radio>
            </RadioGroup>
            <DatePicker :disabled="disableTimePicker"
                        :placeholder="$t('Select order date')"
                        :separator="`  `"
                        class="ml_10"
                        :clearable="true"
                        :confirm="false"
                        placement="bottom-end"
                        style="width: 170px"
                        type="daterange"
                        @on-change="changeFilterDate"
            />
          </div>

        </div>
      </div>
      <div>
        <Input
          v-model="params.name"
          :placeholder="$t('Enter the goods name')"
          enter-button
          search
          style="width: 100%"
          @on-search="getList"
        />
      </div>
    </div>

    <empty v-if="orderList.length === 0"/>
    <div v-else class="order-content">
      <Card
        v-for="(order, onderIndex) in orderList"
        :key="onderIndex"
        class="order-list"
        @click.native="orderDetail(order.sn)"
      >
        <div class="order-header">

          <!--          <div v-if="order.orderStatus === 'COMPLETED'">-->
          <!--            <Button  @click="delOrder(order.sn)"-->
          <!--                    class="del-btn mr_10 fontsize_16" style="margin-top:-5px;" type="text" icon="ios-trash-outline"-->
          <!--                    size="small"></Button>-->
          <!--          </div>-->
          <div class="storeName hover-pointer" @click.stop="shopPage(order.storeId)">
            <Iconify height="20px" icon="ic:round-store">
            </Iconify>
            &nbsp;
            <span>{{ order.storeName }}</span>
          </div>

          <div class="flex orderStatus">
            <span> {{ $t('Order status') }} </span>
            <div class="ml_10">
              <Tag v-if="order.orderStatus === 'TAKE'" color="volcano">{{ $t('Take') }}</Tag>
              <Tag v-if="order.orderStatus === 'CANCELLED'" color="red">{{ $t('Cancelled') }}</Tag>
              <Tag v-if="order.orderStatus === 'CONFIRMED'" color="green">{{ $t('Confirmed') }}</Tag>
              <Tag v-if="order.orderStatus === 'PENDING'" color="blue">{{ $t('Pending') }}</Tag>
              <Tag v-if="order.orderStatus === 'COMPLETED'" color="green">{{ $t('Completed') }}</Tag>
              <Tag v-if="order.orderStatus === 'REJECTED'" color="red">{{ $t('Rejected') }}</Tag>
            </div>
          </div>
        </div>

        <div class="order-body mb_10">
          <div class="goods-list" style="flex-direction: column">
            <div
              v-for="(goods, goodsIndex) in order.orderItems"
              :key="goodsIndex"
            >
              <img
                :src="goods.image"
                alt=""
                class="hover-color"
                @click.stop="orderDetail(order.sn)"
              />
              <div>
                <div class="goodsName" @click.stop="orderDetail(order.sn)">
                  {{ goods.name }}
                </div>
                <div>
                  <span class="global_color"
                  >{{ goods.productPrice | unitPrice("₫",  "before") }} </span
                  >x {{ goods.num }}
                </div>

              </div>
            </div>
          </div>
        </div>
        <Divider style="margin: 12px 0"/>
        <div class="flex" style="justify-content: space-between">
          <div>
            <div class="global_color" v-if="order.commentStatus=='AVAILABLE'">
              {{ $t('Chưa đánh giá') }}
            </div>
            <div class="global_color" v-if="order.commentStatus == 'FINISHED'">
              <Icon type="ios-star"/>
              {{ $t('Have evaluated') }}
            </div>
          </div>
          <div>
            <div>
              <div class="flow-price mb_10">
                <span>{{ $t('Flow price') }}: &nbsp;</span>
                <p class="global_color">{{ order.flowPrice | unitPrice("₫",  "before") }}</p>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px">
              <Button type="primary" ghost v-show="order.orderStatus =='PENDING'"
                      @click.stop="handleCancelOrder(order.sn)">
                {{ $t('Cancel order') }}
              </Button>
              <!-- TODO -->
              <Button type="primary"
                      v-if="order.orderStatus == 'CANCELLED' || order.orderStatus === 'COMPLETED' || order.orderStatus === 'REJECTED'"
                      @click.stop="goodsDetail('undefined', order.orderItems[0].goodsId)">
                {{ $t('Repurchase') }}
              </Button>

              <Button type="primary" ghost v-show="order.orderStatus == 'CONFIRMED' && order.payStatus === 'PAID'" @click.stop="received(order.sn)">
                {{ $t('Confirm completion') }}
              </Button>
              <!--          TODO-->
              <Button v-if="order.commentStatus == 'AVAILABLE' && order.orderStatus=='COMPLETED'" type="primary"
                      @click.stop="handleShowReview(order)" ghost>{{ $t('Rating') }}
              </Button>
              <Button v-if="order.commentStatus == 'FINISHED' && order.orderStatus=='COMPLETED'" type="primary"
                      @click.stop="handleWatchAgainReview(order.sn, order)" ghost>{{ $t('Xem lại đánh giá') }}
              </Button>
              <Button v-show="order.orderItems[0].complainStatus === 'NO_APPLY'"
                      type="warning"
                      @click.stop="handleShowReview(order)">
                {{ $t('Complaint') }}
              </Button>
              <!--            <Button @click.stop="handleShowReview(order)">-->
              <!--              <Tooltip :content="$t('Review')" placement="top">-->
              <!--                <Iconify width="12px" height="12px" icon="fa6-solid:calendar-xmark"></Iconify>-->
              <!--              </Tooltip>-->
              <!--            </Button>-->
            </div>
          </div>
        </div>

      </Card>
      <Spin v-if="spinShow" fix size="large"></Spin>
    </div>
    <div v-if="!homePage" class="page-size">
      <Page :page-size="params.size"
            :total="+total"
            show-sizer
            show-total
            @on-change="changePageNum"
            @on-page-size-change="changePageSize">
      </Page>
    </div>

    <Modal v-model="afterSaleModal" :title="$t('Please select the product to apply for after sales')">
      <div>
        <Table
          :columns="afterSaleColumns"
          :data="afterSaleArr"
          border
          @on-row-click="afterSaleSelect"
        >
        </Table>
      </div>
      <div slot="footer"></div>
    </Modal>
    <CancelOrder ref="modalCancel" @sureCancel="sureCancel"/>
    <ReviewModal ref="review" :order="reviewingOrder"/>
    <ReviewDetail ref="reviewDetail" @update="getList" :order-detail="reviewDetail"/>
  </div>
</template>

<script>
import {cancelOrder, delOrder, getOrderList, sureReceived} from '@/api/order';
import {orderStatusList} from '../enumeration.js'
import CancelOrder from '@/components/Modal/CancelOrder'
import ReviewModal from "@/pages/home/memberCenter/evaluation/ReviewModal.vue";
import {getReviewDetailByOrder} from "@/api/review";
import ReviewDetail from "@/pages/home/memberCenter/evaluation/ReviewDetail";

export default {
  name: 'MyOrder',
  components: {
    ReviewModal,
    CancelOrder,
    ReviewDetail
  },
  props: {
    homePage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowReviewDetail: false,
      filterDate: 'ALL',
      orderItems: 'DESC',
      sortOrder: 'createdTime',
      sortList: [
        {
          value: "createdTime",
          label: this.$t('Order date')
        },
        {
          value: "flowPrice",
          label: this.$t('Flow price')
        },
      ],
      orderList: [],
      params: {
        name: '',
        orderSn: '',
        orderStatus: '',
        payStatus: '',
        keywords: '',
        paymentType: '',
        orderType: 'NORMAL',
        paymentMethod: '',
        paymentTime: '',
        startDate: '',
        endDate: '',
        clientType: '',
        flowPrice: '',
        page: 1,
        size: 10,
        sort: 'createdTime,DESC'
      },
      isShowCancel: false,
      cancelParams: {
        orderSn: '',
        reason: ''
      },
      orderStatusList,
      changeWay: [this.$t('All Orders'),
        this.$t('Pending'), this.$t('Confirmed'), this.$t('Completed'), this.$t('Canceled'), this.$t('Rejected')
      ],
      total: 0,
      spinShow: false,
      afterSaleModal: false,
      afterSaleColumns: [
        {title: this.$t('Product name'), key: 'name'},
        {title: this.$t('Price'), key: 'goodsPrice'}
      ],
      afterSaleArr: [],
      reviewingOrder: {},
      reviewDetail: {}
    };
  },

  watch: {

    orderItems: {
      handler(newVal, oldVal) {
        this.params.sort = [
          `${this.sortOrder},${newVal}`
        ]
        this.getList()
      }
    },

    sortOrder: {
      handler(newVal, oldVal) {
        this.params.sort = [
          `${newVal},${this.orderItems}`
        ]
        this.getList()
      }
    }
  },
  computed: {
    disableTimePicker() {
      return this.filterDate != 'CUSTOM'
    }
  },
  mounted() {
    if (this.homePage) this.params.size = 5;
    this.getList();
  },
  methods: {
    getList() {
      if (this.params.name.length === 28) {
        this.params.keywords = this.params.name
        delete this.params.name
      }
      let params = {
        ...this.params,
        'orderTime.rangeType': this.filterDate == 'ALL' ? '' : this.filterDate,
        page: this.params.page - 1,
        sort: `${this.sortOrder},${this.orderItems}`,
        orderStatus: this.params.orderStatus == 0 ? "" : this.params.orderStatus
      }
      if (this.filterDate == "CUSTOM") {
        if (this.params.startDate) {
          params['orderTime.start'] = this.params.startDate
          params['orderTime.end'] = this.params.endDate
        } else return
      }
      delete params.startDate
      delete params.endDate
      getOrderList(params).then(res => {
        // this.spinShow = false
        if (res.success) {
          this.orderList = res.result.content;
          this.total = +res.result.totalElements;
        }
      });
    },
    goodsDetail(skuId, goodsId) {
      let routeUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: {skuId: `${skuId}`, goodsId: `${goodsId}`}
      });
      window.open(routeUrl.href, '_blank');
    },

    change(index) {
      switch (index) {
        case 0:
          this.params.orderStatus = ''
          break;
        case 1:
          this.params.orderStatus = 'PENDING'
          break;
        case 2:
          this.params.orderStatus = 'CONFIRMED'
          break;
        case 3:
          this.params.orderStatus = 'COMPLETED'
          break;
        case 4:
          this.params.orderStatus = 'CANCELLED'
          break;
        case 5:
          this.params.orderStatus = 'REJECTED'
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
    shopPage(id) {
      let routeUrl = this.$router.resolve({
        path: '/Merchant',
        query: {id: id}
      });
      window.open(routeUrl.href, '_self');
    },
    orderDetail(sn) {

      this.$router.push({name: 'OrderDetail', query: {sn}});
    },
    received(sn) {
      this.$Modal.confirm({
        title: this.$t('Confirm completion'),
        content: this.$t('Are you sure to Confirm completion this order?'),
        onOk: () => {
          sureReceived(sn).then(res => {
            if (res.success) {
              this.$Message.success(this.$t('Success'))
              this.getList()
            }
          })
        },
        onCancel: () => {
        }
      });

    },
    goPay(sn) {
      this.$router.push({path: '/payment', query: {orderType: 'ORDER', sn}});
    },
    handleShowReview(order) {
      this.$refs.review.isShow = true
      this.isFooterHide = false
      this.reviewingOrder = order
    },
    applyAfterSale(goodsItem) {
      let arr = []
      goodsItem.forEach(e => {
        if (e.afterSaleStatus === 'NOT_APPLIED') {
          arr.push(e)
        }
      });
      if (arr.length === 1) {
        this.$router.push({name: 'ApplyAfterSale', query: {sn: arr[0].sn}})
      } else {
        this.afterSaleArr = arr;
        this.afterSaleModal = true
      }
    },

    //hàm xử lý form xem lại đánh giá
    handleWatchAgainReview(sn, goodsDetail) {
      // this.reviewDetail= {}
      getReviewDetailByOrder(sn).then(res => {
        this.reviewDetail = {
          orderItems: res.map((e, i) => ({
            ...e,
            image: goodsDetail.orderItems[i].image,
            name: goodsDetail.orderItems[i].name,
            num: goodsDetail.orderItems[i].num
          }))
        }
        this.$refs.reviewDetail.isShowReviewDetail = true
      })
    },
    afterSaleSelect(item) {
      this.$router.push({name: 'ApplyAfterSale', query: {sn: item.sn}})
    },
    comment(sn, goodsIndex) {
      this.$router.push({path: '/home/addEval', query: {sn, index: goodsIndex}})
    },
    complain(sn, goodsIndex) {
      this.$router.push({name: 'Complain', query: {sn, index: goodsIndex}})
    },
    delOrder(sn) {
      this.$Modal.confirm({
        title: 'Delete order',
        content: this.$t('Are you sure to delete this order?'),
        onOk: () => {
          delOrder(sn).then(res => {
            if (res.success) {
              this.$Message.success(this.$t('Successfully Deleted'));
              this.getList()
            }
          })
        },
        onCancel: () => {
        }
      });
    },
    changePageNum(val) {
      this.params.page = val;
      this.getList()
      document.getElementById("my-order").scrollIntoView({behavior: "smooth"})
    },
    changePageSize(val) {
      this.params.page = 1;
      this.params.size = val;
      this.getList()
    },
    handleCancelOrder(sn) {
      this.cancelParams.orderSn = sn;
      this.$refs.modalCancel.isShow = true;
    },
    sureCancel(e) {
      cancelOrder(this.cancelParams.orderSn, {reason: e.reason}).then(res => {
        if (res.success) {
          this.$Message.success(this.$t('Order canceled successfully'))
          this.getList()
          this.cancelAvail = false
        }
      }).catch((err) => {
        this.$Message.error(this.$t(err.response.data.message))
      }).finally(()=>{
        this.$refs.modalCancel.isShow = false
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.order-wrapper {
  margin-bottom: 40px;
}

.box {
  overflow: hidden;
}

.page-size {
  margin: 15px 0px;
  text-align: right;
}

.order-list {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 10px;

  &:hover {
    .del-btn {
      visibility: visible;
    }
  }

  .del-btn {
    visibility: hidden;
  }

  .order-header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;

    > div:nth-child(1) > div:nth-child(1) {
      font-size: 14px;
      color: $title_color;
      margin-top: 3px;
    }
  }

  .order-body {
    display: flex;
    justify-content: space-between;
    color: $title_color;
    padding-top: 10px;

    .goods-list > div {
      display: flex;
      margin-bottom: 10px;

      img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
      }

      > div {
        flex: 1;
      }
    }

    .goodsName {
      color: $light_title_color;
    }

    > div:nth-child(2) {
      width: 100px;
      text-align: center;

      span {
        color: $title_color;
        cursor: pointer;

        &:hover {
          color: $accent_color_tint;
        }
      }

      .ivu-icon {
        color: #ff8f23;
        cursor: pointer;

        &:hover {
          color: $accent_color_tint;
        }
      }
    }

    > div:nth-child(3) {
      width: 50px;
    }
  }
}

.storeName {
  display: flex;
  height: 26px;
  align-items: center;

  span {
    color: $dark_background_color;
    font-weight: bold;
    font-size: 15px;

  }
}

.orderStatus {
  align-items: center;
  color: $light_sub_color;
}

.createdAt {
  color: $light_content_color;
}

.flow-price {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > p {
    font-weight: bold;
  }

  > span {
    color: $title_color;
  }

  > p {
    font-size: 16px;
  }
}
</style>
