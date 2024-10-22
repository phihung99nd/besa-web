<template>
  <div class="service-detail-page">
    <div class="bono-breadcrumb">
      <div class="breadcrumb-container">
        <Breadcrumb>
          <BreadcrumbItem to="/">{{ $t('Home') }}</BreadcrumbItem>
          <BreadcrumbItem
            v-for="(item, index) in serviceDetail.categoryName"
            :key="index"
            target="_blank"
            :to="{name: 'Search result', query: {categoryId: serviceDetail.categoryPath.split(',')[index]}}"
          >
            {{ item }}
          </BreadcrumbItem>
          <BreadcrumbItem>{{ serviceDetail.name }}</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <div class="item-detail-show flex" style="gap: 12px">
      <div style="width: 800px;">
        <ServiceOverView ref="serviceOverview" class="mb_20" :service="serviceDetail"
                         :rating="ratingStat"/>
        <template v-if="serviceDetail && storeInfo && ratingStat">
          <ServiceDescription ref="serviceDescription"
                              :service="serviceDetail" :store="storeInfo" :rating="ratingStat"/>
        </template>
        <template v-else>
          <div class="flex flex-column gap-3">
            <bs-skeleton width="200px" height="40px" border-radius="6px"/>
            <bs-skeleton width="600px" height="40px" border-radius="6px"/>
            <div class="flex gap-2">
              <bs-skeleton width="350px" height="150px" border-radius="6px"/>
              <bs-skeleton width="350px" height="150px" border-radius="6px"/>
            </div>

          </div>
          <div class="flex flex-column gap-3 mt_20">
            <bs-skeleton width="200px" height="40px" border-radius="6px"/>
            <div class="flex gap-2">
              <bs-skeleton width="800px" height="120px" border-radius="6px"/>
            </div>
          </div>
        </template>
      </div>
      <div>
        <div style="position: sticky; top: 90px">
          <template v-if="serviceDetail&&ratingStat">
            <Scroll>
              <Card dis-hover class="booking-form mb_20" style="width: 380px; border-radius: 16px">
                <div slot="title" class="flex justify-content-between align-item-center">
                  <h2>Gói dịch vụ</h2>
                </div>
                <div class="flex flex-column" style="gap: 10px; flex: 1; width: 350px">
                  <div>
                    <span class="fontsize_16 mb_10">{{ $t('Branch') }}</span>
                    <div class="flex align-item-center">
                      <Dropdown v-model="bookForm.branch" :placeholder="$t('Chi nhánh')" :option="branchList"
                                @on-change="handleChangeBranch"/>
                      <Tooltip class="direction ml_10" :content="$t('Chỉ đường')">
                        <Iconify class="fontsize_22" icon="material-symbols:directions" @click.native="handleShowMap"/>
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <span class="fontsize_16 mb_10">{{ $t('Time') }}</span>
                    <div class="calendar">

                      <DatePicker
                        v-model="bookForm.date"
                        :clearable=true
                        :options="dateOption"
                        placeholder="Ngày đặt lịch"
                        format="yyyy-MM-dd"
                        type="date"
                        style="flex: 1 1"
                      />
                      <div style="flex:1 1;" :error="error.includes('slot')">
                        <Dropdown v-if="bookForm.date" v-model="bookForm.slot" placeholder="Giờ hẹn"
                                  :option="slotList"/>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span class="fontsize_16 mb_10">{{ $t('Service sku') }}</span>
                    <br>
                    <div :error="error.includes('sku')">
                      <div @click="handleClickServiceSku(item)"
                           :class="{'chip-checked': bookForm.serviceSku.id == item.id}"
                           class="chip" v-for="(item, index) in serviceDetail.skus" :key="index">
                        <div class="chip-content">
                          {{ item.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="bookForm.serviceSku.id && bookForm.slot" class="book-num flex flex-column"
                       :error="error.includes('num')">
                    <span class="fontsize_16 mb_10">{{ $t('Quantity') }}</span>
                    <InputNumber :max="clerkList.length" @on-change="handleChangeBookingNum" v-model="bookForm.num"
                                 style="width: 50%;" size="large" placeholder="Số lượng"
                                 :min="1"/>
                  </div>
                  <div v-if="bookForm.serviceSku.id && bookForm.slot">
                    <div>
                      <span class="mr_10 fontsize_16 mb_10">{{ $t('Clerk') }}</span>
                      <Poptip trigger="hover" :width="270" placement="right">
                        <div slot="title">
                          <h4> {{ $t('Chọn nhân viên làm dịch vụ') }}</h4>
                        </div>
                        <div class="text-wrap" slot="content">
                          {{
                            $t('Số lượng nhân viên được chọn phải bằng với số lượng đặt lịch')
                          }}
                        </div>
                        <Icon class="mr_10" type="md-alert"/>
                      </Poptip>
                    </div>
                    <div :error="error.includes('clerk')">
                      <SelectClerk @on-change="handleChangeSelectClerk" v-model="bookForm.clerks" :max="bookForm.num"
                                   class="mt_10"
                                   ref="modalSelectClerk" :clerk-list="clerkList"/>
                    </div>
                  </div>
                  <div>
                    <Divider style="margin: 16px 0"/>
                    <div class="flex justify-content-between align-item-center">
                      <div class="fontsize_18 global_color" v-if="tempPrice">
                        <span class="fw-bold flex align-items-center">{{ tempPrice | unitPrice('₫', 'before') }}</span>
                      </div>
                      <div class="fontsize_18 global_color" v-else>
                      <span v-if="serviceDetail.minPrice!=serviceDetail.maxPrice"
                            class="fw-bold flex align-item-center">{{
                          serviceDetail.minPrice | unitPrice('₫', 'before')
                        }}
                        - {{ serviceDetail.maxPrice | unitPrice('₫', 'before') }}
                        </span>
                        <span v-else
                              class="fw-bold flex align-items-center">{{
                            serviceDetail.minPrice | unitPrice("₫",  "before")
                          }}</span>
                      </div>
                      <div>
                        <Button :loading="addToCartLoading" size="large" type="primary" @click="bookNow">Đặt ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card v-if="policyList" dis-hover style="border-radius: 16px">
                <div slot="title" class="align-items-start flex policy-header justify-content-between">
                  <h3>{{ $t('Policy') }}</h3>
                </div>
                <div class="flex flex-column" style="gap: 10px">
                  <!--                <div class="flex align-items-start gap-2" v-for="(policy, index) in policyList" :key="index">-->
                  <!--                  <img v-if="policy.image == 'auth'" class="policy-image" :src="visualList[0].url" alt=""/>-->
                  <!--                  <img v-if="policy.image == '7daysRefund'" class="policy-image" :src="visualList[1].url" alt=""/>-->
                  <!--                  <img v-if="policy.image == 'shield'" class="policy-image" :src="visualList[2].url" alt=""/>-->
                  <!--                  <a target="_blank" :href="`/article/policy?id=${policy.id}`">{{ policy.name }}</a>-->
                  <!--                </div>-->
                  <div class="flex align-items-start" v-for="(item, index ) in policyList" :key="index">
                    <img v-if="item.image == 'auth'" class="policy-image" :src="visualList[0].url" alt=""/>
                    <img v-if="item.image == '7daysRefund'" class="policy-image" :src="visualList[1].url" alt=""/>
                    <img v-if="item.image == 'shield'" class="policy-image" :src="visualList[2].url" alt=""/>
                    <span class="ml_10 fontsize_16" style="flex: 1">{{ item.name }} <a target="_blank"
                                                                                       :href="`/article/policy?id=${item.id}`"
                                                                                       class="fontsize_14">(Xem chi tiết)</a></span>
                  </div>
                </div>
              </Card>
            </Scroll>
          </template>
          <template v-else>
            <bs-skeleton width="380px" height="400px" border-radius="6px"/>
          </template>
        </div>
      </div>
    </div>
    <BaseFooter></BaseFooter>
    <!--    <Mapbox v-if="showMap" :starting_point="bookForm.branch.center" @on-close="showMap = false" :searchable="false"-->
    <!--            :markable="false"/>-->
    <div class="contact-wrapper">
      <div class="button" :class="{hovering: index === currentContactHover}" :style="{'--color': item.color}" @mouseenter="currentContactHover = index"
           @mouseleave="currentContactHover = ''" v-for="(item, index) in contactList" :key="index" @click="handleContact(item.name)">
        <div class="icon">
          <img :src="require(`@/assets/images/${item.name}.png`)"/>
        </div>
        <span class="text">{{ $t('Contact via {0}', [item.name]) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceOverView from "@/components/servicesDetail/ServiceOverView";
import ShopHeader from "@/components/header/ShopHeader";
import ServiceDescription from "@/components/servicesDetail/ServiceDescription";
import Dropdown from "@/components/dropdown/Dropdown";
import SelectClerk from "@/components/SelectClerk/SelectClerk";
import NavigationBar from "@/pages/index/NavigationBar.vue";
import {getServiceDetail, getServicesSlot} from "@/api/services";
import {getReviewStat} from "@/api/review";
import {getBranch, getStoreDetailById} from "@/api/shopentry";
import {getClerkListForSlot} from "@/api/goods";
import {addCartServices} from "@/api/cart";
import {visualList} from "@/components/goodsDetail/visualConfig";
import Mapbox from "@/components/Modal/Mapbox.vue";
import BsSkeleton from "@/components/skeleton";
import {mapState} from "vuex";

export default {
  name: "Service",
  components: {
    Mapbox,
    NavigationBar,
    ServiceDescription,
    ServiceOverView,
    ShopHeader,
    Dropdown,
    SelectClerk,
    BsSkeleton,
  },
  props: ['rebook'],
  data() {
    return {
      visualList,
      policyList: [],
      addToCartLoading: false,
      isShowPolicy: false,
      isShowSelectClerk: false,
      showMap: false,
      contactList: [
        {
          name: 'Zalo',
          color: '#1DA1F2'
        },
        {
          name: 'Viber',
          color: '#b858f1'
        },
      ],
      currentContactHover: '',
      bookForm: {
        branch: "",
        date: new Date(),
        slot: "",
        serviceSku: {},
        num: 1,
        clerks: [],
      },
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      slotList: [],
      branchList: [],
      clerkList: [],
      serviceDetail: '',
      ratingStat: '',
      storeInfo: '',
      tempPrice: 0,
      error: []
    }
  },
  created() {
    this.init()
  },
  watch: {
    "bookForm.branch": {
      handler(val, oldVal) {
        const paramsSlot = {
          serviceId: this.serviceDetail.id,
          storeAddressId: val.id,
          storeId: this.serviceDetail.storeId,
          date: this.formatDate(this.bookForm.date),
        }
        getServicesSlot(paramsSlot).then(res => {
          this.slotList = res
          if (!res.includes(this.bookForm.slot)) this.bookForm.slot = ""
        })
      }
    },
    "bookForm.date": {
      handler(val, oldVal) {
        const paramsSlot = {
          serviceId: this.serviceDetail.id,
          storeAddressId: this.bookForm.branch.id,
          storeId: this.serviceDetail.storeId,
          date: this.formatDate(val),
        }
        getServicesSlot(paramsSlot).then(res => {
          this.slotList = res
          if (!res.includes(this.bookForm.slot)) this.bookForm.slot = ""
        })
      }
    },
    "bookForm.slot": {
      handler(val) {
        if (!val) return
        this.bookForm.serviceSku = this.serviceDetail.skus[0]
        const params = {
          serviceId: this.serviceDetail.id,
          storeId: this.serviceDetail.storeId,
          storeAddressId: this.bookForm.branch.id,
          skuId: this.bookForm.serviceSku.id,
          'time.start': [this.formatDate(this.bookForm.date), val].join('T')
        }
        getClerkListForSlot(params).then(res => {
          if (res.success) {
            this.clerkList = res.result
            if (res.result.length > 0) {
              this.$set(this.bookForm.clerks, 0, this.clerkList[0])
            }
          }
        })
      }
    },
    "bookForm.clerks": {
      handler(val) {
        if (val.length > 0) {
          this.tempPrice = val.map(i => i.price).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        } else {
          this.tempPrice = 0
        }
      },
      deep: true
    },
    "bookForm.serviceSku": {
      handler(val) {
        if (!this.bookForm.slot) return
        const params = {
          serviceId: this.serviceDetail.id,
          storeId: this.serviceDetail.storeId,
          storeAddressId: this.bookForm.branch.id,
          skuId: val.id,
          'time.start': [this.formatDate(this.bookForm.date), this.bookForm.slot].join('T')
        }
        getClerkListForSlot(params).then(res => {
          if (res.success) {
            this.clerkList = res.result
            this.bookForm.num = 1
            if (res.result.length > 0) {
              this.$set(this.bookForm.clerks, 0, this.clerkList[0])
            }
          }
        })
      },
      deep: true
    }
  },
  // computed: {
  //   slotList(){
  //
  //   }
  // },
  computed: {
    ...mapState(['currentLocation'])
  },
  methods: {
    init() {
      if (this.$route.query.id) {
        getServiceDetail(this.$route.query.id).then(res => {
          this.serviceDetail = res.result
          this.policyList = res.result.policies
          if (this.rebook && this.rebook.serviceSku) {
            this.bookForm.serviceSku = res.result.skus.find(i => i.id == this.rebook.serviceSku)
          } else {
            this.bookForm.serviceSku = res.result.skus[0]
          }
          Promise.all([this.getReviewStatHandler(res.result.id), this.getStoreInfoHandler(res.result.storeId), this.setupBookingForm()])
        })
      }
    },

    getReviewStatHandler(id) {
      getReviewStat({subjectType: "SERVICE", subjectId: id}).then(res => {
        this.ratingStat = res || {avgRating: 0, numberOfRatings: 0}
      }).catch(err => {
        this.$Message.error(err.response.statusText)
        this.ratingStat = {avgRating: 0, numberOfRatings: 0}
      })
    },

    getStoreInfoHandler(storeId) {
      getStoreDetailById(storeId).then(res => {
        this.storeInfo = res.result
      })
    },

    setupBookingForm() {
      const params = {
        storeId: this.serviceDetail.storeId,
        serviceId: this.serviceDetail.id
      }
      getBranch(params).then(res => {
        this.branchList = res.result.map(i => ({...i, name: i.addressName}))
        if (this.rebook && this.rebook.branch) {
          this.bookForm.branch = this.branchList.find(i => i.id == this.rebook.branch)
        } else {
          this.bookForm.branch = this.branchList[0]
        }
      })
    },

    formatDate(val) {
      return new Date(new Date(val).getTime() - (new Date(val).getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0]
    },

    handleChangeBranch(e) {
      this.bookForm.branch = e
    },

    // Cập nhật số lượng khi chọn nhiều nhân viên
    handleChangeSelectClerk(val) {
    },
    // xử lý chọn loại dịch vụ
    handleClickServiceSku(val) {
      this.bookForm.serviceSku = val
      this.$refs.serviceOverview.handleSelectImage(val.thumbnail)
    },
    /* Xử lý số lượng nhân được chọn nhiều hơn
  số lượng nhập */
    handleChangeBookingNum(val) {
      if (val < this.bookForm.clerks.length) {
        let tmp = this.bookForm.clerks.length - val
        this.bookForm.clerks.splice(-1, tmp)
      }
      // Tự chọn khi chưa đủ số lượng
      // if ((val - this.bookForm.clerks.length) > 0) {
      //   let diff = val - this.bookForm.clerks.length
      //   for (let i = 0; i < diff; i++) {
      //     let unchecked = this.clerkList.map(c => c.clerkId).filter(f => !this.bookForm.clerks.map(c => c.clerkId).includes(f))
      //     let uncheckedClerk = this.clerkList.filter(e => unchecked.includes(e.clerkId))
      //     if (uncheckedClerk.length > 0) {
      //       this.$set(this.bookForm.clerks, this.bookForm.clerks.length, uncheckedClerk[0])
      //     }
      //   }
      // }
    },
    validate() {
      let valid = true
      if (this.bookForm.slot == "") {
        this.error.push('slot')
      }
      if (!this.bookForm.serviceSku.id) {
        valid = false
        this.error.push('sku')
      }
      if (this.bookForm.clerks.length == 0) {
        valid = false
        this.error.push('clerk')
      }
      if (this.bookForm.clerks.length < this.bookForm.num) {
        valid = false
        this.error.push('clerk')
      }
      if (!this.bookForm.num) {
        valid = false
        this.error.push('num')
      }
      setTimeout(() => {
        this.error = []
      }, 800)
      return valid
    },
    bookNow() {
      if (this.addToCartLoading) return
      if (!this.validate()) {
        this.$Message.info({
          content: 'Vui lòng chọn đầy đủ thông tin đặt lịch',
          duration: 5
        })
        return
      }
      this.addToCartLoading = true;

      // const offset = new Date(this.bookForm.date).getTimezoneOffset()
      // const formattedTime = new Date(new Date(this.bookForm.date).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0]
      const formatDate = this.formatDate(this.bookForm.date)

      const params = {
        num: this.bookForm.num,
        cartType: "SERVICE",
        storeAddressId: this.bookForm.branch.id,
        serviceId: this.serviceDetail.id,
        skuId: this.bookForm.serviceSku.id,
        bookDateTime: [formatDate, [this.bookForm.slot]].join('T'),
        clerkIds: this.bookForm.clerks.map(i => i.clerkId)
      };
      addCartServices(params)
        .then((res) => {
          if (res.success) {
            this.$router.push({
              path: "/checkout",
            });
          } else {
            this.$Message.warning(res.message);
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.addToCartLoading = false;
          }, 500)
        })
    },
    handleShowMap() {
      window.open(`https://www.google.com/maps/dir/${this.currentLocation.center.toReversed().join(',')}/${this.bookForm.branch.addressName}/@${this.bookForm.branch.center}`, "_blank")
    },
    handleContact(type) {
      switch (type) {
        case 'Zalo':
          window.open(`zalo://conversation?phone=${this.storeInfo.linkPhone}`, '_self')
          break;
        case 'Viber':
          window.open(`viber://contact?number=${this.storeInfo.linkPhone}`, '_self')
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

/deep/ .ivu-scroll-container {
  height: 100vh !important;
  padding-bottom: 140px;
}

.service-detail-page {
  @include background_color($dominant_color);
  position: relative;
}

.background-color {
  background-color: #f5f5f5;
}

.calendar {
  display: flex;
  align-items: flex-end;
  gap: 10px;

  /deep/ .ivu-input {
    height: 42px;
  }

  /deep/ .ivu-input-suffix i {
    line-height: 42px;
  }
}

/*css nút chỉ đường*/
.direction {
  /deep/ .ivu-tooltip-rel {
    display: flex;
    cursor: pointer;
    align-items: center;
  }
}

.item-detail-show {
  width: 1200px;
  max-width: 100vw;
  margin: 0 auto;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
}

.chip {
  display: inline-flex;
  flex-direction: row;
  border: 1px solid $border_color;
  height: 36px;
  outline: none;
  font-size: 14px;
  align-items: center;
  border-radius: 14px;
  vertical-align: middle;
  text-decoration: none;
  justify-content: center;
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: $dominant_color_tone;
  }

  .chip-content {
    max-width: 320px;
    align-items: center;
    user-select: none;
    padding: 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;

  }
}

.chip-checked {
  border: 1px solid $accent_color;
  color: $accent_color;
  background-color: $dominant_color_tone;
}

.policy-image {
  width: 24px;
  height: 24px;
}

div {
  [error='true'] {
    animation: error 0.8s
  }
}

@keyframes error {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
    box-shadow: rgba(255, 17, 26, 0.1) 0px 4px 16px, rgba(255, 17, 26, 0.1) 0px 8px 32px;
  }
  100% {
    transform: scale(1);
  }
}

.contact-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 10px;

  &:hover {
    width: 200px;
  }

  .button {
    display: flex;
    height: 56px;
    width: 56px;
    float: left;
    margin: 0 5px;
    overflow: hidden;
    background: #fff;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-out;

    &.hovering {
      width: 200px;

      .icon {
        background: var(--color);

        img {
          color: #fff;
        }
      }
    }

    .icon {
      display: inline-block;
      height: 56px;
      width: 56px;
      padding: 6px;
      text-align: center;
      border-radius: 50%;
      box-sizing: border-box;
      line-height: 56px;
      background: #fff;
      transition: all 0.3s ease-out;

      img {
        width: 44px;
        height: 44px;
        transition: all 0.3s ease-out;
      }
    }

    .text {
      font-size: 20px;
      font-weight: 500;
      line-height: 56px;
      margin-left: 10px;
      transition: all 0.3s ease-out;
      color: var(--color);
    }
  }
}

</style>
