<template>
  <div class="forget-password" @click='$refs.verify.show = false'>
    <div style="height:50px;"></div>
    <div class="logo-box">
      <img
        :src="$store.state.logoImg"
        alt=""
        width='150'
        @click="$router.push('/')"
      />
      <div>{{ $t('Change Password') }}</div>
    </div>
    <div class="login-container">
      <Form
        v-show="step === 0"
        ref="formFirst"
        :model="formFirst"
        :rules="ruleInline"
        style="width:300px;"
      >
        <FormItem prop="mobile">
          <i-input
            v-model="formFirst.mobile"
            :placeholder="$t('Phone')"
            clearable
            type="text"
          >
            <Icon slot="prepend" type="md-phone-portrait"></Icon>
          </i-input>
        </FormItem>

        <FormItem prop="code">
          <i-input
            v-model="formFirst.code"
            :placeholder="$t('Verification code')"
            clearable
            type="text"
          >
            <Icon
              slot="prepend"
              style="font-weight: bold"
              type="ios-text-outline"
            />
            <Button slot="append" @click="sendCode">{{ codeMsg }}</Button>
          </i-input>
        </FormItem>

        <FormItem>
          <Button :type="verifyStatus?'success':'default'" long @click="verifyBtnClick">
            {{ verifyStatus ? $t('Verification successfully') : $t('Click to complete verification') }}
          </Button>
        </FormItem>

        <FormItem>
          <Button :loading="loading" long type="error" @click="next">{{ $t('Next') }}</Button>
        </FormItem>
      </Form>
      <Form
        v-show="step === 1"
        ref="form"
        :model="form"
        :rules="ruleInline"
        style="width:300px;"
      >
        <FormItem prop="password">
          <i-input
            v-model="form.password"
            :placeholder="$t('The password require minimum 6 characters')"
            clearable
            type="password"
          >
            <Icon slot="prepend" type="md-lock"></Icon>
          </i-input>
        </FormItem>

        <FormItem prop="password">
          <i-input
            v-model="form.oncePasd"
            :placeholder="$t('Please enter password again')"
            clearable
            type="password"
          >
            <Icon slot="prepend" type="md-lock"></Icon>
          </i-input>
        </FormItem>

        <FormItem>
          <Button :loading="loading1" long size="large" type="error" @click="handleSubmit">{{ $t('Submit') }}</Button>
        </FormItem>
      </Form>
      <Verify
        ref="verify"
        :verifyType="verifyType"
        class="verify-con"
        @change="verifyChange"
      >
      </Verify>
      <div class="login-btn"><a @click="$router.push('login')">{{ $t('Go to login') }}</a></div>
    </div>
    <div class="foot">
      <Row class="help" justify="space-around" type="flex">
        <a class="item" href="https://micro-tech.com.vn" target="_blank">{{ $t('Help') }}</a>
        <a class="item" href="https://micro-tech.com.vn" target="_blank">{{ $t('Privacy') }}</a>
        <a class="item" href="https://micro-tech.com.vn" target="_blank">{{ $t('Terms') }}</a>
      </Row>
      <Row class="copyright" justify="center" type="flex">
        Copyright © {{ year }} -
        <a href="https://micro-tech.com.vn" style="margin: 0 5px" target="_blank">{{ config.title }}</a>
        {{ $t('All rights reserved') }}
      </Row>
    </div>
  </div>
</template>

<script>

import * as RegExp from '@/plugins/RegExp.js';
import * as apiLogin from '@/api/login.js';
import Verify from '@/components/verify';
import {md5} from '@/plugins/md5.js';
import {sendSms} from '@/api/common.js';

export default {
  name: 'ForgetPassword',
  components: {Verify},
  data() {
    return {
      config: require('@/config'),
      loading: false,
      loading1: false,
      formFirst: {

        mobile: '',
        code: ''
      },
      form: {
        password: '',
        oncePasd: ''
      },
      year: new Date().getFullYear(),
      step: 0,
      ruleInline: {

        mobile: [
          {required: true, message: this.$t('Please enter the phone number')},
          {
            pattern: RegExp.mobile,
            trigger: 'blur',
            message: this.$t('Invalid phone number')
          }
        ],
        code: [{required: true, message: this.$t('Please enter the verification code')}],
        password: [{required: true, message: this.$t('Password can not be blank')}, {
          pattern: RegExp.password,
          message: this.$t('The password require minimum 6 characters')
        }]
      },
      verifyStatus: false,
      verifyType: 'FIND_USER',
      codeMsg: this.$t('Send the verification code'),
      interval: '',
      time: 60
    };
  },
  mounted() {
    document.querySelector('.forget-password').style.height = window.innerHeight + 'px'
    this.$refs.formFirst.resetFields();
  },
  methods: {
    next() {
      this.$refs.formFirst.validate((valid) => {
        if (valid) {
          this.loading = true;
          let data = JSON.parse(JSON.stringify(this.formFirst));
          apiLogin.validateCode(data).then((res) => {
            this.loading = false;
            if (res.success) {

              this.step = 1;
            } else {
              this.$Message.warning(res.message);
            }
          }).catch(() => {
            this.loading = false;
          });
        } else {
        }
      });
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form));
          if (params.password !== params.oncePasd) {
            this.$Message.warning(this.$t('The passwords not match'));
            return;
          }
          params.mobile = this.formFirst.mobile;
          params.password = md5(params.password);
          delete params.oncePasd;
          this.loading1 = true;

          apiLogin.resetPassword(params)
            .then(res => {
              this.loading1 = false;
              if (res.success) {
                this.$Message.success(this.$t('Change password successfully'));
                this.$router.push('login');
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },

    sendCode() {
      if (this.time === 60) {
        if (this.formFirst.mobile === '') {
          this.$Message.warning(this.$t('Please fill in the phone number'));
          return;
        }
        if (!this.verifyStatus) {
          this.$Message.warning(this.$t('Please complete the security verification'));
          return;
        }
        let params = {
          mobile: this.formFirst.mobile,
          verificationEnums: 'FIND_USER'
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
    }
  },
};
</script>

<style lang="scss" scoped>
.forget-password {
  min-height: 700px;
}

.logo-box {
  width: 600px;
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

.login-container {
  border-top: 2px solid $theme_color;
  position: relative;
  margin: 0 auto;
  width: 600px;
  background-color: #fff;
  padding: 20px 150px;

  .login-btn {
    position: absolute;
    right: 20px;
    top: -45px;
  }
}

.verify-con {
  position: absolute;
  left: 140px;
  top: -30px;
  z-index: 10;
}

.other-login {
  margin: 0 auto;

  .ivu-icon {
    font-size: 24px;
  }
}

.regist {
  display: flex;
  justify-content: flex-end;
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
</style>
