<template>
  <div class="sign-up"
       @click='handleHideVerify'>
    <div class="top-content" @click='handleHideVerify'>
      <div class="logo-box">
        <img :src="$store.state.logoImg" @click="$router.push('/')"/>
      </div>
    </div>
    <div class="login-container">
      <div class="demo-carousel" @click='handleHideVerify'>
        <img :src="require('@/assets/images/login-bg.png')" width="100%"/>
      </div>
      <div class="form-box" @click='handleHideVerify'>
        <div>
          <Form
            ref="formRegist"
            :model="formRegist"
            :rules="ruleInline"
            style="width:300px; margin: 0 auto;"
            @keydown.enter.native="handleRegist"
          >
            <div style="font-weight: 600; font-size: 22px; margin: 16px 0;">{{ $t('Register') }}</div>
<!--            <FormItem prop="name">-->
<!--              <i-input-->
<!--                type="text"-->
<!--                v-model="formRegist.name"-->
<!--                clearable-->
<!--                :placeholder="$t('Please enter name')"-->
<!--              >-->
<!--                <Icon type="md-person" slot="prepend"></Icon>-->
<!--              </i-input>-->
<!--            </FormItem>-->
            <FormItem prop="mobilePhone">
              <i-input
                type="text"
                v-model="formRegist.mobilePhone"
                clearable
                :placeholder="$t('Phone')"
              />
            </FormItem>
            <FormItem prop="username">
              <i-input
                type="text"
                v-model="formRegist.username"
                clearable
                :placeholder="$t('Please enter username')"
              />
            </FormItem>
            <FormItem prop="password">
              <i-input
                type="password"
                v-model="formRegist.password"
                password
                :placeholder="$t('The password require minimum 6 characters')"
              />
<!--                <Icon type="md-lock" slot="prepend"></Icon>-->
            </FormItem>
<!--            <FormItem prop="code">-->
<!--              <i-input-->
<!--                type="text"-->
<!--                v-model="formRegist.code"-->
<!--                clearable-->
<!--                :placeholder="$t('Verification code')"-->
<!--              >-->
<!--                <Icon-->
<!--                  type="ios-text-outline"-->
<!--                  style="font-weight: bold"-->
<!--                  slot="prepend"-->
<!--                />-->
<!--                <Button slot="append" @click="sendCode">{{ codeMsg }}</Button>-->
<!--              </i-input>-->
<!--            </FormItem>-->
<!--            <FormItem>-->
<!--              <Button @click="verifyBtnClick" long :type="verifyStatus?'success':'default'">-->
<!--                {{ verifyStatus ? $t('Verification successfully') : $t('Click to complete verification') }}-->
<!--              </Button>-->
<!--            </FormItem>-->
            <FormItem>
              <Button type="primary" size="large" @click.stop="handleRegist" long :loading="loading">
                {{ $t('Register') }}
              </Button>
            </FormItem>
          </Form>
        </div>
        <div class="color999 ml_20" style="text-align: center;line-height: 16px; margin-bottom: 20px;">
          {{ $t('Click to register, you agree with') }}
          <br>
          <router-link to="/article?id=1" target="_blank">{{ $t('User Terms') }}</router-link>
        </div>
        <div class="other">
          <div class="login-btn">{{ $t('Already have an account?') }} <a
            @click="$router.push('login')">{{ $t('Sign in') }}</a></div>
        </div>
      </div>

<!--      <Verify-->
<!--        ref="verify"-->
<!--        class="verify-con"-->
<!--        :verifyType="verifyType"-->
<!--        @change="verifyChange"-->
<!--      ></Verify>-->
    </div>

    <BaseFooter></BaseFooter>
  </div>
</template>

<script>

import * as RegExp from '@/plugins/RegExp.js';
import * as apiLogin from '@/api/login.js';
import Verify from '@/components/verify';
import {sendSms} from '@/api/common.js';

export default {
  name: 'SignUp',
  components: {Verify},
  data() {
    return {
      config: require('@/config'),
      year: new Date().getFullYear(),
      formRegist: {
        mobilePhone: '',
        code: '',
        username: '',
        password: '',
        // name: ''
      },
      ruleInline: {
        // name: [
        //   {required: true, message: this.$t('Please enter name'), trigger: 'blur'},
        // ],
        username: [
          {required: true, message: this.$t('Please enter username'), trigger: 'blur'},
          {
            pattern: /^[a-zA-Z0-9_-]*$/,
            message: this.$t('Username only contains letters, digits and character _ or -'),
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]/,
            message: this.$t('Username only start with letter or digit'),
            trigger: 'blur'
          },
          {
            pattern: /[a-zA-Z0-9]$/,
            message: this.$t('Username only end with letter or digit'),
            trigger: 'blur'
          },
          {type: 'string', min: 6, message: this.$t('Username must contains at least 6 characters'), trigger: 'blur'},
          {type: 'string', max: 20, message: this.$t('Username must contains at most 20 characters'), trigger: 'blur'}
        ],
        password: [
          {required: true, message: this.$t('Please enter password'), trigger: 'blur'},
          {type: 'string', min: 6, message: this.$t('The password require minimum 6 characters'), trigger: 'blur'}
        ],
        mobilePhone: [
          {required: true, message: this.$t('Please enter the phone number')},
          {
            pattern: RegExp.mobile,
            trigger: 'blur',
            message: this.$t('Invalid phone number')
          }
        ],
        // code: [{required: true, message: this.$t('Please enter the verification code')}]
      },
      verifyStatus: false,
      verifyType: 'REGISTER',
      codeMsg: this.$t('Send the verification code'),
      interval: '',
      time: 60,
      loading: false,
    };
  },
  methods: {
    handleRegist() {
      if(this.loading) return
      this.loading = true
      this.$refs.formRegist.validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.formRegist));
          // data.password = md5(data.password);
          apiLogin.regist(data).then((res) => {
            if (res.success) {
              this.$Message.success(this.$t('Registration success'));
              this.$router.push('login');}
          }).catch(err => {
            this.$Message.error(err.response.data.message || 'Signup failed');
          })
        }
        setTimeout(()=>{
          this.loading = false
        },500)
      });
    },
    sendCode() {
      if (this.time === 60) {
        if (this.formRegist.mobilePhone === '') {
          this.$Message.warning(this.$t('Please fill in the phone number'));
          return;
        }
        if (!this.verifyStatus) {
          this.$Message.warning(this.$t('Please complete the security verification'));
          return;
        }
        let params = {
          mobile: this.formRegist.mobilePhone,
          verificationEnums: 'REGISTER'
        };
        sendSms(params).then(res => {
          if (res.success) {
            this.$Message.success(this.$t('Verification code sent successfully'));
            let that = this;
            this.interval = setInterval(() => {
              that.time--;
              if (that.time === 0) {
                that.time = 60;
                that.codeMsg = this.$t('Resend');
                that.verifyStatus = false;
                clearInterval(that.interval);
              } else {
                that.codeMsg = that.time;
              }
            }, 1000);
          } else {
            this.$Message.warning(res.message);
          }
        });
      }
    },
    verifyChange(con) {
      if (!con.status) return;
      this.$refs.verify.show = false;
      this.verifyStatus = true;
    },
    verifyBtnClick() {
      if (!this.verifyStatus) {
        this.$refs.verify.init();
      }
    },
    handleHideVerify(){
      // this.$refs.verify.show = false
    }
  },
  mounted() {
    this.$refs.formRegist.resetFields();
    document.querySelector('.sign-up').style.height = window.innerHeight + 'px'
  }
};
</script>
<style scoped lang="scss">
.drag-area {
  margin: 10px 0;
}

.login {
  height: 100%;
  background-color: #f0f2f5;
}

.other {
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-container {
  text-align: center;
  margin: 20px 0;
  position: relative;

  > .qr-shadow {
    background: rgba(0, 0, 0, 0.45);
    position: absolute;
    left: 50%;
    margin-left: -75px;
    top: 0;
    z-index: 99;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;

    > span {
      margin-bottom: 20px;
      font-size: 13px;
      letter-spacing: 2px;
    }
  }
}

.top-content {
  width: 100%;
  height: 80px;
  position: relative;
  z-index: 1;

  box-shadow: 0 1px 1px #ddd;
  @include background_color($dominant_color);

  .logo-box {
    width: 80%;
    max-width: 1200px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    img {
      width: 150px;
      cursor: pointer;
    }

    div {
      font-size: 20px;
      margin-top: 10px;
    }
  }
}

.pending-scan {
  text-align: center;
  color: black;
}

.scanned {
  text-align: center;
  color: green;
}

.quick-logining {
  text-align: center;
  color: red;
}

.demo-carousel {
  height: 550px;
  width: inherit;
  display: flex;
  justify-content: center;
  img {
    object-fit: cover;
    object-position: left;
  }
}

.login-container {
  position: relative;
  width: 100%;
  height: 550px;
  min-width: 1360px;
}

.form-box {
  width: 350px;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 15%;
  padding: 20px;
  border-radius: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
  background: rgba(255, 255, 255, 1);

  .account-number {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: bold;

    > div:nth-child(2) {
      color: $theme_color;
      cursor: pointer;
    }

    .tab-switch {
      height: 40px;
      font-size: 14px;

      span:nth-child(1) {
        font-size: 16px;
        border-right: 1px solid #ddd;
        padding-right: 10px;
      }

      span:nth-child(2) {
        cursor: pointer;
        padding-left: 10px;

        &:hover {
          color: $theme_color;
        }
      }
    }
  }
}

.verify-con {
  position: absolute;
  right: 16%;
  top: 90px;
  z-index: 10;
}

.other-login {

  > svg {
    cursor: pointer;
    width: 24px;
    margin-right: 10px;
    height: 24px;
  }
}

.register {
  display: flex;

  margin-top: -10px;

  span {
    margin-left: 10px;

    &:hover {
      cursor: pointer;
      color: $theme_color;
    }
  }
}

.foot {
  position: fixed;
  bottom: 4vh;
  width: 368px;
  left: calc(50% - 184px);
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;

  .help {
    margin: 0 auto;
    margin-bottom: 1vh;
    width: 60%;

    .item {
      color: rgba(0, 0, 0, 0.45);
    }

    :hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}

.icon-hover {
  cursor: pointer;
}

</style>
