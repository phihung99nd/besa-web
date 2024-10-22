<template>
  <div class="shop-entry">
    <div class="content">
      <h1>{{$t('Signup as BESA seller')}}</h1>
      <Steps :current="currentIndex" class="margin">
        <Step :title="$t('Enterprise information')"></Step>
        <Step :title="$t('Financial information')"></Step>
        <Step :title="$t('Store information')"></Step>
        <Step :title="$t('Submit review')"></Step>
      </Steps>
      <first-apply v-if="currentIndex === 0 && dataReview" :content="firstData" @change="nextPage"></first-apply>

      <second-apply v-if="currentIndex === 1 && dataReview" :content="secondData" @change="nextPage"></second-apply>

      <third-apply v-if="currentIndex === 2 && dataReview" :content="thirdData" @change="nextPage"></third-apply>

      <div class="success-page" v-if="currentIndex === 3">
        <span v-if="storeDisable === '' || storeDisable === 'APPLYING'">{{$t('The entry application has been submitted successfully, waiting for the platform to review')}}</span>
        <span v-if="storeDisable === 'OPEN'">{{$t('The application has been approved, please contact the administrator')}}</span>
        <span v-if="storeDisable === 'CLOSED'">{{$t('The store has been closed, re-apply to contact the administrator')}}</span>
        <span v-if="storeDisable === 'REFUSED'">{{$t('The review failed, please modify the qualification information, if you have any questions, please contact the administrator')}}</span>
      </div>
      <Button v-if="currentIndex === 3" @click="$router.push('/')">{{ $t('Back') }}</Button>
      <Button type="primary" @click='currentIndex = 0'
        v-if="storeDisable === 'REFUSED' && currentIndex === 3">{{$t('Re-apply')}}</Button>
    </div>

    <Modal :title="$t('Store entry agreement')" v-model="showAgreement" width="1200" :closable="false" :mask-closable="false">
      <div class="agreeent-con" v-html="agreementCon"></div>

      <div slot="footer" style="text-align: center">
        <p>
          <Checkbox v-model="checked">{{$t('I have agreed to the above agreement')}}</Checkbox>
        </p>
        <Button type="primary" :disabled="!checked" class="margin" @click="showAgreement = false">{{$t('Agree to the agreement to fill in the qualification information')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import firstApply from "./FirstApply";
import secondApply from "./SecondApply";
import thirdApply from "./ThirdApply";
import { agreement, applyStatus } from "@/api/shopentry";
export default {
  components: {
    firstApply,
    secondApply,
    thirdApply,
  },
  data() {
    return {
      currentIndex: 0,
      showAgreement: false,
      agreementCon: "",
      checked: false,
      firstData: {},
      secondData: {},
      thirdData: {},
      storeDisable: "",
      dataReview: true,
    };
  },
  mounted() {
    this.getData("init");
  },
  methods: {
    getData(status) {
      applyStatus()
        .then((res) => {
        if (res.success) {
          if (!res.result) {
            // this.showAgreement = true;
          } else {
            this.dataReview = false;
            let data = res.result;
            let first = [
              "companyAddressPath",
              "companyAddress",
              "companyAddressIdPath",
              "companyEmail",
              "companyName",
              "employeeNum",
              "companyPhone",
              "legalId",
              "legalName",
              "licencePhoto",
              "legalPhoto",
              "licenseNum",
              "linkName",
              "linkPhone",
              "registeredCapital",
              "scope",
            ];
            let second = [
              "settlementBankAccountName",
              "settlementBankAccountNum",
              "settlementBankBranchName",
              "settlementBankJointName",
            ];
            let third = [
              "goodsManagementCategory",
              "storeCenter",
              "storeDesc",
              "storeLogo",
              "storeName",
              "storeAddressIdPath",
              "storeAddressPath",
              "storeAddressDetail",
            ];

            this.storeDisable = data.storeDisable;

            first.forEach((e) => {
              this.firstData[e] = data[e];
            });
            second.forEach((e) => {
              this.secondData[e] = data[e];
            });
            third.forEach((e) => {
              this.thirdData[e] = data[e];
            });
            if (status === "init") {
              if (this.storeDisable === "APPLY") {
                this.currentIndex = 0;
              } else {
                this.currentIndex = 3;
              }
            }
            this.$nextTick(() => {
              this.dataReview = true;
              this.$forceUpdate();
            });
          }
        }
      });
    },

    nextPage(step) {
      this.currentIndex = step;
      this.getData("next");
    },
  },
};
</script>
<style lang="scss" scoped>
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
  }
}

.margin {
  margin: 30px 0;
}
.agreeent-con {
  max-height: 500px;
}
.success-page {
  height: 500px;
  width: 100%;
  line-height: 500px;
  text-align: center;
  font-size: 20px;
}
.shop-entry {
  min-height: 100vh;
  padding-top: 10px;
}
</style>
