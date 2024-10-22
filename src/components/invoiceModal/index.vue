<template>
  <div class="invoice-modal">
    <Modal v-model="invoiceAvailable" width="600" footer-hide>
      <p slot="header">
        <span>{{ $t('Invoice Information') }}</span>
      </p>
      <div class="nav-content">
        <Form :model="invoiceForm" ref="form" label-position="left" :rules="ruleInline" :label-width="110">
          <FormItem :label="$t('Invoice type')">
            <RadioGroup v-model="invoice" type="button" button-style="solid">
              <Radio @on-change="changeInvoice" :label="1">{{$t('EInvoice')}}</Radio>
              <Radio :label="2" :disabled="true">{{$t('VAT invoice')}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="$t('Invoice')">
            <RadioGroup v-model="type" @on-change="changeInvoice" type="button" button-style="solid">
              <Radio :label="1">{{$t('Personal')}}</Radio>
              <Radio :label="2">{{$t('Organization')}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="$t('Personal Name')" v-if="type === 1" prop="receiptTitle">
            <i-input v-model="invoiceForm.receiptTitle"></i-input>
          </FormItem>
          <FormItem :label="$t('Company Name')" v-if="type === 2" prop="receiptTitle">
            <i-input v-model="invoiceForm.receiptTitle"></i-input>
          </FormItem>
          <FormItem :label="$t('Tax Number')" v-if="type === 2" prop="taxpayerId">
            <i-input v-model="invoiceForm.taxpayerId"></i-input>
          </FormItem>
          <FormItem :label="$t('Invoice content')">
            <RadioGroup v-model="invoiceForm.receiptContent" type="button" button-style="solid">
              <Radio :label="$t('Item detail')">{{$t('Item detail')}}</Radio>
              <Radio :label="$t('Item category')">{{$t('Item category')}}</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div style="text-align: center">
          <Button type="primary" :loading="loading" @click="submit">{{$t('Save')}}</Button>
          <Button type="default" @click="invoiceAvailable = false">{{ $t('Cancel') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { receiptSelect } from '@/api/cart.js';
import { TINumber } from '@/plugins/RegExp.js';
export default {
  name: 'invoiceModal',
  data () {
    return {
      invoice: 1,
      invoiceAvailable: false,
      loading: false,
      invoiceForm: {

        receiptTitle: '',
        taxpayerId: '',
        receiptContent: this.$t('Commodity details')
      },
      type: 1,
      ruleInline: {
        taxpayerId: [
          { required: true, message: this.$t('Please fill in the taxcode') },
          { pattern: TINumber, message: this.$t('Taxcode format incorrect') }
        ]
      }
    };
  },
  props: ['invoiceData'],
  watch: {

    invoiceData: {
      handler (val) {
        this.invoiceForm = { ...val };

        if (val.taxpayerId) {
          this.type = 2;
        } else {
          this.type = 1;
        }
      },
      deep: true,
      immeadite: true
    }
  },
  methods: {
    /**
     *  选择发票抬头
     */
    changeInvoice (val) {
      this.$nextTick(() => {
        this.type = val;
      });
    },

    /**
     *  保存判断
     */
    save () {
      let flage = true;


      const { receiptTitle } = JSON.parse(
        JSON.stringify(this.invoiceForm)
      );

      if (!receiptTitle) {
        this.$Message.error(this.$t('Please fill in the invoice title!'));
        flage = false;
        return false;
      }

      if (this.type === 2) {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            flage = false;
          }
        });
      } else {
        delete this.invoiceForm.taxpayerId;
      }

      return flage;
    },

    async submit () {
      if (this.save()) {
        this.loading = true;
        let submit = {
          way: this.$route.query.way,
          ...this.invoiceForm
        };
        try {
          let receipt = await receiptSelect(submit);
          if (receipt.success) {
            this.$emit('change', true);
          }
        }
        catch (e) {
          this.$Message.error(this.$t('API get receipt error'))
        }
        finally {
          this.loading = false;
        }

      }
    }
  }
};
</script>
<style lang="scss" scoped>
/** 普票 */
.inv-type {
  text-align: center;
}
.add-inv {
  font-size: 14px;
  color: #438cde;
  cursor: pointer;
  &:hover {
    color: $theme_color;
  }
}

.nav-content {
  width: 500px;
  margin: 10px auto;
}
</style>
