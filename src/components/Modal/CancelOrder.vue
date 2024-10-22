<template>
  <Modal
    v-model="isShow"
    :title="$t('Please select a reason for canceling the order')"
    scrollable
  >
    <Form ref="form" :model="cancelParams" :rules="cancelParamsRules">
      <FormItem prop="reason">
        <RadioGroup v-model="cancelParams.reason" vertical @on-change="handleChangeCancelReason">
          <Radio v-for="item in cancelReason" :key="item.id" :label="item.reason">
            {{ item.reason }}
          </Radio>
          <Radio label="OTHER_REASON">
            {{ $t('Input reason cancel other') }}
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="isOtherReason" prop="customReason">
        <Input v-model="cancelParams.customReason" :placeholder="$t('Enter reason cancel')" type="textarea"/>
      </FormItem>
    </Form>
<!--    <div v-if="isOtherReason" class="reason-input mt_10">-->
<!--      <Input v-model="cancelParams.customReason" :placeholder="$t('Enter reason cancel')" type="textarea"/>-->
<!--    </div>-->
    <div slot="footer">
      <Button @click="isShow = false">{{$t('Cancel')}}</Button>
      <Button @click="sureCancel" type="primary">{{$t('Confirm')}}</Button>
    </div>
  </Modal>
</template>

<script>
import {afterSaleReason} from "@/api/member";

export default {
  name: "CancelOrder",
  watch: {
    otherReason: {
      handler(val) {
        this.cancelParams.customReason = val
      }
    }
  },
  data() {
    return {
      cancelReason: [],
      cancelAvail: false,
      cancelParams: {
        reason: '',
        customReason: '',
      },
      cancelParamsRules: {
        reason: [{required: true, message: this.$t('Please choose a reason'), trigger: 'blur'}],
        customReason: [{required: true, message: this.$t('Please choose a reason'), trigger: 'blur'}],
      },
      isOtherReason: false,
      otherReason: '',
      isShow: false,
    }
  },
  methods: {
    getReasonCancelOrder() {
      afterSaleReason('CANCEL')
        .then(res => {
          if (res.success) {
            this.cancelReason = res.result;
            this.cancelAvail = true
            // this.cancelParams.reason = this.cancelReason[0].reason
          }
        })
        .finally(() => {

        })
    },
    handleChangeCancelReason(e) {
      this.isOtherReason = e === 'OTHER_REASON';
    },
    sureCancel() {
      this.$refs.form.validate(valid => {
        if(valid) {
          if (this.cancelParams.customReason) {
            this.cancelParams.reason = this.cancelParams.customReason
          }
          this.$emit("sureCancel", this.cancelParams)
        }
      })
    },
  },
  mounted() {
    this.getReasonCancelOrder()
  }
}

</script>

<style scoped>

</style>
