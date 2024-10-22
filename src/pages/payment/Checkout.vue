<template>
  <div class="checkout-page">
    <div class="content-container" v-if="bookDetail">
      <div class="page-title">Thông tin thanh toán</div>
      <div class="subtitle">Hoàn thành lịch đặt của bạn bằng cách nhập các thông tin thanh toán</div>
      <div class="main-container">
        <div class="left-container">
          <div class="service-info">
            <h3>Dịch vụ</h3>
            <div class="content">
              <img
                :src="bookDetail.cartProducts[0].product.thumbnail"
                alt=""/>
              <div class="meta-info">
                <div class="name">{{ bookDetail.cartProducts[0].product.name }}</div>
                <div class="sku">Phân loại: <span>{{ JSON.parse(bookDetail.cartProducts[0].product.specs).name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="booking-info">
            <h3>Chi tiết đặt lịch</h3>
            <div class="content">
              <div class="info-item">
                <div class="icon">
                  <Iconify icon="mingcute:location-3-line"/>
                </div>
                <div>
                  <div class="main-text">Địa chỉ</div>
                  <div class="sub-text">{{ bookDetail.address }}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="icon">
                  <Iconify icon="solar:calendar-linear"/>
                </div>
                <div>
                  <div class="main-text">Thời gian</div>
                  <div class="sub-text">{{ bookDetail.bookDateTime.split("T").reverse().join(" ngày ") }}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="icon">
                  <Iconify icon="ph:stack"/>
                </div>
                <div>
                  <div class="main-text">Số lượng</div>
                  <div class="sub-text">{{ bookDetail.cartProducts.length }} người</div>
                </div>
              </div>
              <div class="info-item">
                <div class="icon">
                  <Iconify icon="solar:user-linear"/>
                </div>
                <div>
                  <div class="main-text">Nhân viên</div>
                  <div class="sub-text" v-for="clerk in bookDetail.cartProducts">{{ clerk.clerkName }}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="icon">
                  <Iconify icon="iconoir:message"/>
                </div>
                <div>
                  <div class="main-text">Ghi chú</div>
                  <div v-if="!remarkEdit" class="sub-text remark-text hover-pointer" @click="remarkEdit = true">
                    {{ remark ? remark : 'Bấm để thêm ghi chú' }}
                  </div>
                  <textarea class="remark-input" v-model="remark" rows="2" cols="50" v-else @blur="remarkEdit=false"/>
                </div>
              </div>
            </div>
          </div>
          <div class="payment-method">
            <h3>Phương thức thanh toán</h3>
            <div class="method-list">
              <div class="method-item" :class="{active: paymentMethod == item}"
                   v-for="(item, index) in paymentList.filter(i => i == 'COD')" :key="index" :title="item"
                   @click="paymentMethod = item">
                <img v-if="item == 'COD'" src="@/assets/images/cod.png" alt=""/>
                <img v-if="item == 'MOMO'" src="@/assets/images/momo-logo.png" alt=""/>
                <img v-if="item == 'VIETTELPAY'" src="@/assets/images/viettelpay-logo.svg" alt=""/>
                <img v-if="item == 'WALLET'" src="@/assets/images/Bono-wallet.svg" alt=""/>
                <div class="method-check">
                  <Iconify icon="icon-park-solid:check-one"/>
                </div>
              </div>
            </div>
            <!--            <Button @click="modal = true">Thêm thẻ</Button>-->
          </div>
        </div>
        <div class="right-container">
          <div class="price-form">
            <div class="total-price">
              <span>Tổng</span>
              <span>{{ bookDetail.priceDetailDTO.flowPrice | unitPrice('₫', 'before') }}</span>
            </div>
            <div class="price-detail">
              <div class="title-column flex flex-column gap-2 align-items-start">
                <div>Giá gốc</div>
                <div>Giảm giá</div>
              </div>
              <div class="value-column flex flex-column gap-2 align-items-end">
                <div>{{ bookDetail.priceDetailDTO.originalPrice }}</div>
                <div>-{{ bookDetail.priceDetailDTO.discountPrice }}</div>
              </div>
            </div>
          </div>
          <button @click="book">{{ $t('Book now') }}</button>
          <div class="term-note">
            Bằng việc bấm nút đặt ngay, bạn đã đồng ý với <a href="/article?id=1"
                                                               target="_blank">{{ $t('Term of Service') }}</a>
          </div>
        </div>
      </div>
    </div>
    <BaseFooter/>

    <!--    <Modal v-model="modal" width="530" footer-hide :styles="{top: '10px'}">-->
    <!--      <VisaForm-->
    <!--        class="visa-form"-->
    <!--        @input-card-name=""-->
    <!--        @input-card-number=""-->
    <!--        @input-card-month=""-->
    <!--        @input-card-year=""-->
    <!--        @input-card-cvv=""-->
    <!--      />-->
    <!--    </Modal>-->
  </div>
</template>

<script>
import NavigationBar from "@/pages/index/NavigationBar.vue";
// import {VisaForm} from 'bono-component';
import {checkServiceBook, createTrade, getPaymentMethod} from "@/api/cart";

export default {
  name: "Checkout",
  components: {NavigationBar},
  data() {
    return {
      modal: false,
      remarkEdit: false,
      currentMethod: 0,
      paymentList: [],
      paymentMethod: '',
      bookDetail: {
        bookDateTime: '',
        cartProducts: [{product: {}}],
        priceDetailDTO: {}
      },
      remark: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$Spin.show()
      getPaymentMethod({clientType: 'PC'})
        .then(res => {
          this.paymentList = res.result
          this.paymentMethod = res.result[0]
        })
      checkServiceBook({way: "SERVICE"})
        .then(res => {
          this.bookDetail = res.result
        })
        .finally(() => {
          this.$Spin.hide()
        })
    },
    book() {
      const params = {
        client: "PC",
        remark: [{
          storeId: this.bookDetail.cartProducts[0].storeId,
          remark: this.remark
        }],
        way: 'SERVICE',
        paymentMethod: this.paymentMethod
      };
      this.$Spin.show();
      createTrade(params)
        .then((res) => {
          if (res.success) {
            this.$bus.$notify({
              group: 'calendar',
              data: {
                ...this.bookDetail,
                callback:  this.handleCreateGoogleCalendar
              },
              duration: 10000
            });
            this.$router.push({name: 'PayDone', params: {type: 'SERVICE'}});
          }
        })
        .finally(() => {
          this.$Spin.hide();
        })
    },
    handleCreateGoogleCalendar(){
      let startTime = this.bookDetail.bookDateTime.split('T')[0].split('-').join("")+"T"+this.bookDetail.bookDateTime.split('T')[1].split(':').join("");
      let params = {
        text: this.bookDetail.cartProducts[0].product.name,
        details: `<h2>Bạn có lịch đặt trên BESA</h2><div>Xem các lịch đã đặt của bạn <a href="${window.location.origin}/home/MyBooking">tại đây</a></div>`,
        dates: `${startTime}/${startTime}`,
        location: this.bookDetail.address
      }
      let url = 'https://calendar.google.com/calendar/u/0/r/eventedit?text=' + encodeURIComponent(params.text) + '&details=' + encodeURIComponent(params.details) + '&dates=' + params.dates + '&location=' + params.location;
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
.content-container {
  width: 1200px;
  max-width: 100vw;
  margin: 0 auto;
  padding: 10px 0;

  .page-title {
    width: 100%;
    font-size: 20px;
    font-weight: 600;
  }

  .subtitle {
    width: 100%;
    font-size: 12px;
    color: #888;
  }

  .main-container {
    width: 100%;
    display: flex;
    gap: 20px;
    margin-top: 20px;

    .left-container {
      width: 65%;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .service-info {
        padding: 20px;
        border-radius: 16px;
        background: #fff;

        > h3 {
          margin-bottom: 10px;
          font-size: 16px;
        }

        .content {
          display: flex;
          gap: 10px;

          > img {
            height: 100px;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 6px;
          }

          .meta-info {
            .name {
              overflow: hidden;
              display: -webkit-box;
              text-overflow: ellipsis;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              margin-bottom: 4px;
              font-size: 14px;
              font-weight: 500;
            }

            .sku {
              color: #888;
              font-size: 13px;

              > span {
                color: #000;
              }
            }
          }
        }
      }

      .booking-info {
        padding: 20px;
        border-radius: 16px;
        background: #fff;

        > h3 {
          margin-bottom: 10px;
          font-size: 16px;
        }

        .content {
          display: flex;
          flex-direction: column;

          .info-item {
            display: flex;
            align-items: start;
            height: fit-content;
            gap: 10px;
            padding: 10px 0;
            border-bottom: 1px solid $border_color;

            &:last-child {
              border-bottom: none;
              padding-bottom: 0;
            }

            .icon {
              display: flex;
              justify-content: center;
              align-items: start;
              padding-top: 5px;
              font-size: 20px;
            }

            .main-text {
              font-weight: 600;
            }

            .sub-text {
              color: #888;
            }
          }
        }
      }

      .payment-method {
        padding: 20px;
        border-radius: 16px;
        background: #fff;

        > h3 {
          margin-bottom: 10px;
          font-size: 16px;
        }

        .method-list {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;

          .method-item {
            width: 80px;
            height: 80px;
            border-radius: 10px;
            border: 1px solid $border_color;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all $common_transition_duration ease;
            cursor: pointer;

            > img {
              width: 70px;
              height: 60px;
              object-fit: contain;
            }

            &:hover, &.active {
              border: 1px solid $accent_color;
            }

            .method-check {
              position: absolute;
              top: 2px;
              left: 2px;
              font-size: 16px;
              color: $accent_color;
              opacity: 0;
              transform: scale(0);
              transition: all $common_transition_duration ease;
            }

            &.active .method-check {
              opacity: 1;
              transform: scale(1);
            }
          }
        }
      }
    }

    .right-container {
      flex: 1 1;
      display: flex;
      height: fit-content;
      flex-direction: column;
      gap: 10px;
      position: sticky;
      top: 110px;

      .price-form {
        padding: 20px;
        border-radius: 16px;
        background: #fff;

        .total-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid $border_color;
          padding-bottom: 10px;

          > span:nth-of-type(1) {
            font-size: 18px;
            font-weight: 600;
          }

          > span:nth-of-type(2) {
            font-size: 24px;
            font-weight: 600;
            color: #000;
          }
        }

        .price-detail {
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
        }
      }

      > button {
        height: 40px;
        width: 100%;
        border-radius: 12px;
        border: none;
        outline: none;
        background: $accent_color;
        color: #fff;
        cursor: pointer;
      }

      .term-note {
        font-size: 13px;
      }
    }
  }
}

.remark-text {
  width: 200px;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.remark-input {
  outline: none;
  border: 1px solid $border_color;
  border-radius: 4px;
  padding: 4px;
}

// custom visa form
.visa-form {
  /deep/ .card-input {
    margin-bottom: 10px !important;
  }

  /deep/ .card-input__input {
    height: 40px !important;
  }

  /deep/ .card-form__button {
    height: 40px !important;
  }
}
</style>
