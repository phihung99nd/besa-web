<template>
  <div class="login" @keyup.enter="handleSubmit('formInline')">
    <div class="top-content" @click='$refs.verify.show = false'>
      <div class="logo-box">
        <img :src="$store.state.logoImg" @click="$router.push('/')"/>
      </div>
    </div>
    <div class="login-container">
      <div class="demo-carousel">
        <img :src="require('@/assets/images/login-bg.png')" width="100%"/>
      </div>
      <div class="form-box">
        <div class="account-number">
          <div class="tab-switch">
            <span>{{ type ? $t('Account login') : $t('Verification code login') }}</span>
            <!--            <span @click="type = !type;scannerCodeLoginFLag=false">{{-->
            <!--                type ? $t('Verification code login') : $t('Account login')-->
            <!--              }}</span>-->
          </div>
          <!--          <div @click="scannerCodeLoginFLag=!scannerCodeLoginFLag">-->
          <!--            {{ !scannerCodeLoginFLag ? $t('Scan code to log in') : $t('Back') }}-->
          <!--          </div>-->
        </div>
        <div v-show="scannerCodeLoginFLag">
          <div class="qr-container">
            <div v-show="qrCodeStatus == 'fail'" class='qr-shadow flex'>
              <span>
                {{ $t('QR code is invalid') }}
              </span>
              <Button size='small' @click="createPCLoginSession">{{ $t('Refresh QR code') }}</Button>
            </div>
            <vue-qr
              :margin="0"
              :size="150"
              :text="qrCode"
              colorDark="#000"
              colorLight="#fff"
            ></vue-qr>
          </div>
          <div class="drag-area">
            <div v-if="scannerCodeLoginStatus === 0" class="pending-scan">
              <p>{{ $t('Open the mobile App and scan the QR code to login') }}</p>
            </div>
            <div v-else-if="scannerCodeLoginStatus === 1" class="scanned">
              <p>{{ $t('The scan code is successful, waiting for confirmation') }}</p>
            </div>

            <div v-if="scannerCodeLoginStatus === 2" class="scanned">
              <p>{{ $t('The login is successful, redirecting...') }}</p>
            </div>

            <div v-else-if="scannerCodeLoginStatus === 3" class="quick-logining">
              <p>{{ $t('Cancel') }}</p>
            </div>
          </div>
        </div>

        <div>
          <div v-show="!scannerCodeLoginFLag">
            <Form v-show="type === true" ref="formInline" :model="formData" :rules="ruleInline">
              <FormItem prop="username">
                <i-input v-model="formData.username" :placeholder="$t('User name')" clearable type="text"/>
              </FormItem>
              <FormItem prop="password">
                <i-input v-model="formData.password" :placeholder="$t('Password')" password type="password"/>
              </FormItem>
              <FormItem>
                <Button long :loading="loading" type="primary" @click.stop="handleSubmit('formInline')">{{
                    $t('Login')
                  }}
                </Button>
              </FormItem>
              <!--              <Verify-->
              <!--                ref="verify"-->
              <!--                :captcha-type="'JIGSAW'" :img-size="{width:'320px',height:'150px'}"-->
              <!--                @success="success"-->
              <!--              ></Verify>-->
            </Form>
            <Form v-show="type === false" ref="formSms" :model="formSms" :rules="ruleInline">
              <FormItem prop="mobile">
                <i-input v-model="formSms.mobile" :placeholder="$t('Phone')" clearable type="text">
                  <Icon slot="prepend" type="md-lock"></Icon>
                </i-input>
              </FormItem>
              <FormItem prop="code">
                <i-input v-model="formSms.code" :placeholder="$t('Verification code')" type="text">
                  <Icon slot="prepend" style="font-weight: bold" type="ios-text-outline"/>
                  <Button slot="append" @click="sendCode">{{ codeMsg }}</Button>
                </i-input>
              </FormItem>
              <FormItem>
                <Button :type="verifyStatus?'success':'default'" long
                        @click.stop="verifyBtnClick">
                  {{ verifyStatus ? $t('Verification successfully') : $t('Click to complete verification') }}
                </Button>
              </FormItem>
              <FormItem>
                <Button long type="primary" :loading="loading" @click="handleSubmit('formSms')">{{
                    $t('Login')
                  }}
                </Button>
              </FormItem>
            </Form>
          </div>
          <div class="other">
                <span style="color:red; cursor: pointer"
                      @click="$router.push('signUp')">{{
                    $t('Don\'t have an account yet? Click to register now')
                  }}</span>
            <span @click="$router.push('forgetPassword')">{{ $t('Forgot password') }}</span>
          </div>
        </div>
      </div>
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>

import * as RegExp from "@/plugins/RegExp.js";
import * as apiLogin from "@/api/login.js";
import {getSCLoginCode, sCLogin} from "@/api/login.js";
import storage from "@/plugins/storage.js";
import Verify from "../components/verify";
import vueQr from "vue-qr";
import {sendSms} from "@/api/common.js";
import {AccountLogin} from "../api/account";
import Storage from "../plugins/storage";
import {getMemberMsg} from "../api/login";
import {getExpiresTime} from "../plugins/request";

export default {
  name: "Login",
  components: {
    Verify,
    vueQr
  },
  data() {
    return {
      qrCodeStatus: "success",
      qrCode: '',
      qrSessionToken: '',
      loading: false,
      scannerCodeLoginFLag: false,
      scannerCodeLoginStatus: 0,
      qrCodeTimer: null,
      config: require('@/config'),
      type: true,
      formData: {
        username: "",
        password: "",
        grant_type: 'password',
        scope: 'server',
      },
      formSms: {

        code: "",
        mobile: "",
      },
      verifyStatus: false,
      ruleInline: {

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
        mobile: [
          {required: true, message: this.$t('Please enter the phone number')},
          {
            pattern: RegExp.mobile,
            message: this.$t('Invalid phone number'),
          },
        ],
        code: [{required: true, message: this.$t('Please enter the verification code')}],
      },
      codeMsg: this.$t('Send the verification code'),
      interval: null,
      time: 60,
      year: new Date().getFullYear(),
    };
  },

  watch: {
    scannerCodeLoginFLag(v) {
      if (v) {
        this.createPCLoginSession();
        console.log("log in by scanning code");
      } else {
        console.log("Cancel QR code login");
        this.clearQRLoginInfo();
      }
    },
    type(v) {
      if (v) {
        this.$refs.formInline.resetFields();
      } else {
        this.$refs.formSms.resetFields();
      }
      this.verifyStatus = false;
      this.$refs.verify.show = false;
      clearInterval(this.interval);
      this.codeMsg = this.$t('Send the verification code');
      this.time = 60;
    },
  },

  mounted() {
    console.log(Math.round(new Date() / 1000))
    let uuid = this.$route.query.state;
    if (uuid) {
      storage.setItem("uuid", uuid);
      // loginCallback(uuid).then((res) => {
      //   if (res.success) {
      //     this.loginSuccess(res.result.accessToken, res.result.refreshToken);
      //   }
      // });
    }
  },
  destroyed() {
    this.clearQRLoginInfo();
  },

  methods: {
    handleSubmit(name) {
      if (this.loading) return
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.type) {
            // this.$refs.verify.show();
            this.success()
          } else {
            let data = JSON.parse(JSON.stringify(this.formSms));
            apiLogin.smsLogin(data).then((res) => {
              this.$refs.verify.show = false;
              if (res.success) {
                this.$Message.success(this.$t('Login successful'));
                storage.setItem("buyer_accessToken", res.result.accessToken);
                storage.setItem("buyer_refreshToken", res.result.refreshToken);
                apiLogin.getMemberMsg().then((res) => {
                  if (res.success) {
                    storage.setItem("buyer_userInfo", res.result, {expires: getExpiresTime(2147483647)});
                    let query = this.$route.query;
                    if (query.rePath) {
                      this.$router.push({
                        path: query.rePath,
                        query: JSON.parse(query.query),
                      });
                    } else {
                      this.$router.push("/");
                    }
                  }
                });
              } else {
                this.$Message.error(res.message);
              }
            });
          }
        } else {
          this.loading = false
        }
      });
    },

    sendCode() {
      if (this.time === 60) {
        if (this.formSms.mobile === "") {
          this.$Message.warning(this.$t('Please fill in the phone number'));
          return;
        }
        if (!this.verifyStatus) {
          this.$Message.warning(this.$t('Please complete the security verification'));
          return;
        }
        let params = {
          mobile: this.formSms.mobile,
          verificationEnums: "LOGIN",
        };
        sendSms(params).then((res) => {
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
    // verifyChange(con) {
    //   if (!con.status) return;
    //   if (this.type === true) {
    //     let data = JSON.parse(JSON.stringify(this.formData));
    //     // data.password = md5(data.password);
    //     this.$refs.verify.show = false;
    //     this.$Spin.show();
    //     apiLogin
    //       .login(data)
    //       .then((res) => {
    //         if (res.success) {
    //           this.loginSuccess(res.result.accessToken, res.result.refreshToken);
    //         } else {
    //           this.$Spin.hide();
    //           this.$Message.error(res.message);
    //         }
    //       })
    //       .catch(() => {
    //         this.$Message.error(this.$t('API login error'))
    //         this.$Spin.hide();
    //       });
    //   } else {
    //     this.verifyStatus = true;
    //     this.$refs.verify.show = false;
    //   }
    // },

    verifyBtnClick() {
      if (!this.verifyStatus) {
        this.$refs.verify.init();
      }
    },
    loginSuccess(accessToken, refreshToken) {
      this.$Message.success(this.$t('Login successful'));
      storage.setItem("buyer_accessToken", accessToken);
      storage.setItem("buyer_refreshToken", refreshToken);
      getMemberMsg()
        .then((res) => {
          this.$Spin.hide();
          debugger
          if (res.success) {
            storage.setItem("buyer_userInfo", res.result, {expires: getExpiresTime(2147483647)});
            let query = this.$route.query;
            if (query.rePath) {
              this.$router.push({
                path: query.rePath,
                query: JSON.parse(query.query),
              });
            } else {
              this.$router.push("/");
            }
          }
        })
    },
    success(params) {
      this.closeModel(params);
    },
    closeModel(params) {
      this.isShow = false;
      // noinspection JSVoidFunctionReturnValueUsed
      let fd = new FormData();
      fd.append("username", this.formData.username);
      fd.append("password", this.formData.password);
      fd.append("grant_type", "password");
      fd.append("scope", "buyer");
      AccountLogin(fd)
        .then((res) => {
          let data = res;
          let expires = getExpiresTime(data.exp);
          Storage.setItem('buyer_accessToken', data.access_token, {expires});
          Storage.setItem('buyer_refreshToken', data.refresh_token, {expires: getExpiresTime(2147483647)});
          apiLogin.getMemberMsg()
            .then(res => {
              let params = {
                page: 0,
                size: 100,
                sort: [
                  'id,DESC'
                ],
              }
              Storage.setItem("buyer_userInfo", res.result, {expires: getExpiresTime(2147483647)})
              let query = this.$route.query;
              if (query.rePath) {
                this.$router.push({
                  path: query.rePath,
                  query: JSON.parse(query.query),
                });
              } else {
                this.$router.push("/");
              }
            })
            .finally(() => this.loading = false)
        })
        .catch((err) => {
          // this.$Message.destroy()
          this.$Message.error(err.response.data.message || 'Login failed');
          this.loading = false;
        });
    },

    createPCLoginSession() {
      getSCLoginCode({}).then(response => {
        this.clearQRLoginInfo();
        if (response.code == 200) {
          this.qrCodeStatus = 'success'
          let session = response.result;
          this.qrSessionToken = session.token;
          if (session.status === 0) {
            this.qrCode = session.token;
            this.refreshQrCode();
          }
          this.qrLogin();

        }
      });
    },

    refreshQrCode() {
      if (!this.qrCodeTimer) {
        this.qrCodeTimer = setInterval(() => {

          this.qrCodeStatus = 'fail'
        }, 10 * 1000);
      }
    },

    clearQRLoginInfo() {
      this.scannerCodeLoginStatus = 0;
      this.qrSessionToken = '';
      if (this.qrCodeTimer) {
        clearInterval(this.qrCodeTimer)
      }
      this.qrCodeTimer = null;
    },

    qrLogin() {
      if (!this.qrSessionToken) return;
      sCLogin(this.qrSessionToken, {beforeSessionStatus: this.scannerCodeLoginStatus}).then(response => {
        if (response.success) {
          this.scannerCodeLoginStatus = response.result.status;
          switch (response.result.status) {
            case 0:
            case 1:
              this.qrLogin();
              break;
            case 2:
              this.loginSuccess(response.result.token.accessToken, response.result.token.refreshToken);
              break;
            case 3:
              this.createPCLoginSession();
              break;
            default:
              this.clearQRLoginInfo();
              break
          }
        } else {
          this.clearQRLoginInfo();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
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
  justify-content: space-between;
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
  background: rgba(255, 255, 255, 1);
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;

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
