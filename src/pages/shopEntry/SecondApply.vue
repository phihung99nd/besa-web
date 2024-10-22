<template>
  <div class="photo-msg">
    <Form ref="secondForm" :model="form" :rules="rules" :label-width="140">
      <h4>{{$t('Basic information')}}</h4>
        <FormItem prop="settlementBankAccountName" :label="$t('Bank account name')">
        <Input
          type="text"
          v-model="form.settlementBankAccountName"
          :placeholder="$t('Please fill in the bank account name')"
        />
      </FormItem>
      <FormItem prop="settlementBankAccountNum" :label="$t('Bank Account Number')">
        <Input
          type="text"
          v-model="form.settlementBankAccountNum"
          :placeholder="$t('Please fill in the bank account number')"
        />
      </FormItem>
      <FormItem prop="settlementBankBranchName" :label="$t('Bank branch name')">
        <Input
          type="text"
          v-model="form.settlementBankBranchName"
          :placeholder="$t('Please fill in the bank branch name')"
        />
      </FormItem>
      <FormItem prop="settlementBankJointName" :label="$t('Branch number')">
        <Input
          type="text"
          v-model="form.settlementBankJointName"
          :placeholder="$t('Please fill in the branch number')"
        />
      </FormItem>

      <FormItem>
        <Button @click="$emit('change', 0)">{{ $t('Back') }}</Button>
        <Button type="primary" :loading="loading" @click="next">
          {{ $t('Fill in other information') }}
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { applySecond } from '@/api/shopentry';
export default {
  props: {
    content: {
      default: {},
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      form: {},
      rules: {
        settlementBankAccountName: [
          { required: true, message: this.$t('Please fill in the bank account name') }
        ],
        settlementBankAccountNum: [
          { required: true, message: this.$t('Please fill in the bank account number')  }
        ],
        settlementBankBranchName: [
          { required: true, message: this.$t('Please fill in the bank branch name') }
        ],
        settlementBankJointName: [
          { required: true, message: this.$t('Please fill in the branch number') }
        ]
      }
    };
  },
  mounted () {
    if (this.content != {}) {
      this.form = JSON.parse(JSON.stringify(this.content));
      this.$forceUpdate();
    }
    this.$refs.secondForm.resetFields()
  },
  methods: {
    next () {
      this.$refs.secondForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          applySecond(this.form)
            .then((res) => {
              this.loading = false;
              if (res.success) this.$emit('change', 2);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error');
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
h4 {
  margin-bottom: 10px;
  padding: 0 10px;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  font-weight: bold;
  color: #333;
  font-size: 14px;
  line-height: 40px;
  text-align: left;
}
.ivu-input-wrapper {
  width: 300px;
}
</style>
