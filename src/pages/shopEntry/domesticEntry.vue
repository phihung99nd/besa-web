<template>
  <div>
    <div class="content">
      <div class="content-left"></div>
      <div class="content-right">
        <!--region Form đăng kí SĐT-->
        <div class="form-box" v-if="!otpSent">
          <div class="title">{{ $t('Signup as Domestic seller') }}</div>
          <div class="subtitle">Đăng kí đơn giản, miễn phí hoa hồng</div>
          <div class="phone-input" :class="{'error-phone': errorPhone}">
            <span class="input-field">
              <input type="text" @input="errorPhone = false" placeholder="0xx-xxxxxxx" v-mask="'###-#######'"
                     v-model="phone"/>
            </span>
            <span class="country">
              <span class="country-icon">
                <img src="@/assets/images/vn_flag.png" alt=""/>
              </span>
              <span class="country-text">+84</span>
            </span>
          </div>
          <div class="helper-text" :class="{'error': errorPhone, 'hide': !errorPhone}">
            {{ $t('Phone format invalid') }}
          </div>
          <div style="height: 20px"/>
          <div class="send-otp verify-btn" @click="handleSendPhone">
            <span>{{ $t('Send OTP via SMS') }}</span>
          </div>
          <div class="privacy">
            Bằng việc đăng ký, bạn đã đọc và đồng ý với các <a href="/article" target="_blank">Điều khoản, điều kiện</a>
            và <a
            href="/article" target="_blank">Chính sách bào mật của BESA</a>
          </div>
          <div class="other-register">
            <div class="divider">{{ $t('OR') }}</div>
            <div class="seller-type" @click="routeTo('shopEntryBono')">
              <div class="seller-type-image">
                <img src="@/assets/images/bono_mall.png" alt=""/>
              </div>
              <a>{{ $t('Signup as Besa Seller') }}</a>
              <div class="arrow right"/>
            </div>
            <div class="seller-type">
              <div class="seller-type-image">
                <img src="@/assets/images/worldwide.png" alt=""/>
              </div>
              <a>{{ $t('Signup as Global Seller') }}</a>
              <div class="arrow right"/>
            </div>
          </div>
        </div>
        <!--endregion-->
        <!--region Form nhập OTP-->
        <div class="form-box" v-else-if="otpSent && !otpCheck">
          <div class="title">{{ $t('Enter OTP') }}</div>
          <div class="subtitle" v-html="$t('Enter the OTP code sent to <strong>{0}</strong> via SMS',[phone])"/>
          <div class="otp-input">
            <span class="hidden-input">
              <input ref="otp" maxlength="6" @keydown="handleInputOTP($event)" v-model="otp" @blur="$refs.otp.focus()"/>
            </span>
            <div class="code-block" :class="{'error': errorOtp}">
              <div class="single-code" :class="{'code-inputted': otp.length >= i}" v-for="i in 6" :key="i">
                {{ otp.length == i - 1 ? "|" : otpSplit[i - 1] }}
              </div>
            </div>
          </div>
          <div class="helper-text" :class="{'error': errorOtp, 'hide': !errorOtp}">
            {{ $t('Invalid OTP code') }}
          </div>
          <div class="helper-text">{{ $t('Haven\'t got the code?') }} <a @click="resendCode">{{ $t('Resend') }}</a>
          </div>
          <div style="height: 20px"/>
          <div class="confirm-otp verify-btn" @click="handleSendOtp">
            <span>{{ $t('Confirm') }}</span>
          </div>
          <div class="back-form" @click="handleBack">
            <span>{{ $t('Back') }}</span>
          </div>
        </div>
        <!--endregion-->
        <!--region Form nhập password-->
        <div class="form-box" v-else-if="otpCheck">
          <div class="title">{{ $t('Enter password') }}</div>

          <div style="height: 20px"/>
          <div class="confirm-otp verify-btn" @click="handleSendOtp">
            <span>{{ $t('Confirm') }}</span>
          </div>
          <div class="back-form" @click="handleBack">
            <span>{{ $t('Back') }}</span>
          </div>
        </div>
        <!--endregion-->
      </div>
    </div>
    <BaseFooter/>
  </div>
</template>

<script>
import NavigationBar from "@/pages/index/NavigationBar.vue";

export default {
  name: "domesticEntry",
  components: {NavigationBar},
  data() {
    return {
      otpSent: false,
      otpCheck: false,
      phone: "",
      otp: "",
      errorPhone: false,
      errorOtp: false
    }
  },
  watch: {
    otpSent: {
      handler(newV, oldV) {
        if (newV == true) {
          this.$nextTick(() => {
            this.otp = ""
            this.$refs.otp.focus()
          })
        }
      }
    },
    otp: {
      handler() {
        this.errorOtp = false
      }
    }
  },
  computed: {
    otpSplit() {
      return this.otp.split('')
    }
  },
  methods: {
    // Validate nhập số điện thoại và switch sang trang nhập code
    handleSendPhone() {
      if (this.phone.length != 11) {
        this.errorPhone = true
        return
      }
      this.otpSent = true
    },
    /**
     * Tạo array dãy số
     * @param start: số bắt đầu
     * @param stop: số kết thúc
     * @param step: khoảng cách các số
     * @returns array[]
     */
    arrayRange(start, stop, step) {
      return Array.from(
        {length: (stop - start) / step + 1},
        (value, index) => start + index * step
      );
    },
    // Chỉ cho nhập số và xóa, chặn các kí tự và hành động khác
    handleInputOTP(e) {
      if (![...this.arrayRange(48, 57, 1), 8].includes(e.keyCode)) {
        e.preventDefault()
      }
    },
    handleSendOtp() {
      // TODO: gọi API xác thực OTP
      // API_shopEntry.checkOtp(this.otp).then(res => {
      //   if(res.success){
      // chuyển sang màn hình đăng kí mật khẩu
      // } else {
      if (this.otp.length < 6) {
        this.errorOtp = true
        return
      }
      this.otpCheck = true
      // }
      // })
    },
    // Xử lý yêu cầu gửi lại mã
    resendCode() {
      this.otp = ""
      this.$Message.info(this.$t('New code is sent to your mobile phone. Please check again!'))
    },

    // Xử lý yêu cầu quay lai form trước
    handleBack() {
      this.otpSent = false
      this.otp = ""
      this.errorPhone = false
      this.errorOtp = false
      this.otpCheck = false
    },

    // Xử lý yêu cầu chuyển hướng trang web
    routeTo(name) {
      this.$router.push({name})
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  $error_color: #ff1515;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 0 auto;
  padding-top: 10px;
  position: relative;
  height: calc(100vh - 96px);
  background-color: #9e99ff;
  background-size: cover;
  background-image: url('https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1165&q=80');

  /deep/ &-left {
    width: 720px;
    flex: 0 0 auto;
  }

  /deep/ &-right {
    position: relative;
    align-self: flex-start;

    .form-box {
      width: 500px;
      height: fit-content;
      //min-height: 400px;
      background-color: #fff;
      border-radius: 25px;
      margin-bottom: 20px;
      padding: 30px 30px 20px 30px;
      display: flex;
      flex-flow: column nowrap;

      .title {
        font-size: 24px;
        font-weight: 700;
      }

      .subtitle {
        color: #9a9a9a;
        min-height: 50px;

        strong {
          color: #515a6e;
        }
      }

      .phone-input {
        width: 100%;
        height: 50px;
        border: 1px solid #c6c6c6;
        border-radius: 10px;
        padding: 5px 10px;
        display: flex;

        .input-field {
          flex: 1 1 auto;
          height: 40px;
          border-right: 1px solid #ddd;
          margin-right: 10px;

          input {
            height: 40px;
            width: 100%;
            border: none;
            outline: none;
            font-size: 18px;
          }
        }

        .country {
          flex: 0 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          font-size: 16px;
          color: #9a9a9a;

          &-icon {
            height: 20px;
            margin-right: 2px;

            img {
              border-radius: 50%;
              width: 20px;
              height: 20px;
              object-fit: cover;
            }
          }
        }

        &.error-phone {
          border: 1px solid $error_color;

          /deep/ .input-field {
            border-right: 1px solid $error_color;
          }
        }
      }

      .helper-text {
        line-height: 24px;
        opacity: 1;
        color: #9a9a9a;

        &.hide {
          opacity: 0 !important;
        }

        &.error {
          color: $error_color;
          opacity: 1;
        }
      }

      .verify-btn {
        margin-top: 10px;
        width: 100%;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(119deg, rgba(230, 72, 221, 1) 13%, rgba(179, 0, 255, 1) 100%);
        font-size: 16px;
        text-align: center;
        color: #fff;
        line-height: 40px;
        position: relative;
        cursor: pointer;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          background-image: linear-gradient(270deg, rgba(230, 72, 221, 1) 13%, rgba(201, 0, 255, 1) 100%);
          opacity: 0;
          transition: opacity 0.7s;
        }

        &:hover::before {
          opacity: 1;
        }

        & > * {
          position: relative;
        }

        &.send-otp {
          margin-bottom: 30px;
        }
      }

      .privacy {
        color: #9a9a9a;
      }

      .other-register {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 20px;

        .divider {
          color: #9a9a9a;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-bottom: 20px;

          &::before,
          &::after {
            content: '';
            display: block;
            height: 0.09em;
            flex: 1 1 auto;
          }

          &::before {
            background: linear-gradient(to right, rgba(166, 148, 148, 0), #9a9a9a);
            margin-right: 10px;
          }

          &::after {
            background: linear-gradient(to left, rgba(240, 240, 240, 0), #9a9a9a);
            margin-left: 10px;
          }
        }

        .seller-type {
          display: flex;
          flex-flow: row nowrap;
          line-height: 24px;
          align-items: center;
          margin-bottom: 10px;

          &-image {
            width: 24px;
            height: 24px;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            }
          }

          a {
            margin: 0px 5px;
            width: 240px;
          }

          .arrow {
            border: solid #9a9a9a;
            border-width: 0 2px 2px 0;
            display: inline-block;
            padding: 2px;
          }

          .right {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
          }
        }
      }

      .otp-input {
        .hidden-input {
          opacity: 0;
          position: absolute;
          z-index: -1;
        }

        .code-block {
          display: flex;
          flex-flow: row nowrap;
          width: 100%;
          justify-content: space-between;

          .single-code {
            width: 50px;
            height: 50px;
            border-radius: 15px;
            border: 1px solid #c6c6c6;
            line-height: 50px;
            text-align: center;
            font-size: 18px;
            font-weight: 700;

            &.code-inputted {
              border: 1px solid #C900FF;
            }
          }

          &.error .single-code {
            border: 1px solid #ff0033;
          }
        }
      }

      .back-form {
        margin-top: 10px;
        width: 100%;
        height: 40px;
        font-size: 16px;
        text-align: center;
        color: #C900FF;
        line-height: 40px;
        cursor: pointer;

        &:hover {
          color: #E648DD;
          border: 1px solid #E648DD;
          border-radius: 10px;
        }
      }
    }
  }
}


</style>
