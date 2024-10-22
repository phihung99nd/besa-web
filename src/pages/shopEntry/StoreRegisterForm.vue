<template>
  <div class="shop-entry">
    <div class="content">
      <h1>{{ currentIndex == 2 ? $t('Your store registration has been successfully created') : $t('Signup as BESA seller') }}</h1>
      <Steps :current="currentIndex" class="margin">
        <Step :title="$t('Store owner account')"></Step>
        <Step :title="$t('Store information')"></Step>
        <Step :title="$t('Complete registration')"></Step>
      </Steps>
      <account-form v-if="currentIndex==0 && (!isLogin || !currentUser)" @on-submit="handleSuccessSubmitAccount"/>
      <shop-info-form v-if="currentIndex==1" :token="token"/>
      <div class="step-3" v-if="currentIndex==2 && registerStatus == 'PENDING'">
        <img src="@/assets/images/waiting-list.png"/>
        <div class="status">{{ $t('It will take some time for us to review and accept your request') }}</div>
        <div class="redirect">
          {{$t('Take a look at these instructions for becoming a provider')}} <a :href="`https://seller.${domain}`" target="_blank">{{ $t('here') }}</a>
        </div>
      </div>
      <div class="step-3" v-if="currentIndex==2 && registerStatus == 'CONFIRMED'">
        <img src="@/assets/images/ready.png"/>
        <div class="status">{{ $t('The application has been approved') }}</div>
        <div class="redirect">
          <a :href="`https://seller.${domain}`" target="_blank">{{ $t('Redirect to Seller platform') }}</a>
        </div>
      </div>
      <div class="step-3" v-if="currentIndex==2 && registerStatus == 'REFUSED'">
        <img src="@/assets/images/reject.png"/>
        <div class="status">{{ $t('The application has been rejected') }}</div>
        <Button type="primary" @click="handleReApply">{{ $t('Re-apply') }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "../../plugins/storage";
import AccountForm from "./AccountForm.vue";
import ShopInfoForm from "./ShopInfoForm.vue";
import {checkUserStore} from "../../api/shopentry";

export default {
  name: "StoreRegisterForm",
  components: {ShopInfoForm, AccountForm},
  data() {
    return {
      currentIndex: 0,
      registerStatus: '',
      token: null
    }
  },
  created() {
    if (this.isLogin && this.currentUser) {
      this.token = storage.getItem('buyer_accessToken');
      this.checkUserStoreExist()
    } else this.currentIndex = 0
  },
  computed: {
    isLogin() {
      return storage.getItem('buyer_accessToken')
    },
    currentUser() {
      let user = storage.getItem('buyer_userInfo')
      if (user) {
        user = JSON.parse(user)
        if (user.username && user.mobile) {
          return user
        }
      } else return false
    },
    domain() {
      return process.env.VUE_APP_DOMAIN
    }
  },
  methods: {
    //TODO
    checkUserStoreExist() {
      checkUserStore().then(res => {
        if (res.success) {
          if (res.result == 'APPLY') {
            // Đã đăng kí và đang chờ
            this.currentIndex = 2
            this.registerStatus = 'PENDING'
          } else if (['OPEN', 'CLOSED'].includes(res.result)) {
            // Đã đăng kí và được xác nhận
            this.currentIndex = 2
            this.registerStatus = 'CONFIRMED'
          } else if (res.result == 'REFUSED') {
            // Đã đăng kí nhưng bị từ chối
            this.currentIndex = 2
            this.registerStatus = 'REFUSED'
          } else if (res.result == 'UNREGISTERED') {
            // Chưa đăng kí
            this.currentIndex = 1
            this.registerStatus = 'UNREGISTERED'
          }
        }
      })
    },
    handleReApply() {
      this.currentIndex = 1
      this.registerStatus = ''
    },
    handleSuccessSubmitAccount(e) {
      this.token = e
      this.currentIndex++
    }
  }
}
</script>

<style scoped lang="scss">
.shop-entry {
  min-height: 100vh;
  padding-top: 10px;

  .content {
    width: 1200px;
    margin: 0 auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    min-height: 500px;
    border-radius: 20px;
    background: #fff;
    padding: 10px 20px;

    h1 {
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }

  .margin {
    margin-bottom: 30px;
  }
}

.step-3 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: 400px;

  > img {
    width: 100px;
  }

  > .status {
    font-size: 40px;
    font-weight: 600;
    text-align: center;
    width: 70%;
  }

  > .redirect {
    font-size: 20px;
    a {
      font-size: 20px;
      color: $accent_color;
      cursor: pointer;
    }
  }
}
</style>
