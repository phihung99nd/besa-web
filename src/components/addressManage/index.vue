<template>
  <div>
    <Modal v-model="showAddr" width="800" :title="$t('receiver address')">
      <Form
        :model="formData"
        ref="form"
        label-position="left"
        :label-width="100"
        :rules="ruleInline"
      >
        <FormItem :label="$t('Receiver')" prop="name">
          <i-input v-model="formData.name" style="width: 600px"></i-input>
        </FormItem>
        <FormItem :label="$t('Receiving Address')" prop="address">
          <i-input
            v-model="formData.address"
            disabled
            style="width: 600px"
          ></i-input>
          <Button type="primary" size="small" @click="$refs.map.showMap = true">{{ $t('Choose') }}</Button>
        </FormItem>
        <FormItem :label="$t('Address')" prop="detail">
          <i-input v-model="formData.detail" style="width: 600px"></i-input>
        </FormItem>
        <FormItem :label="$t('Phone')" prop="mobile">
          <i-input v-model="formData.mobile" style="width: 600px"></i-input>
        </FormItem>
        <FormItem :label="$t('Address name')">
          <i-input
            v-model="formData.alias"
            length
            :maxlength="4"
            :placeholder="$t('Please enter an address name, e.g. company')"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem :label="$t('Default address')">
          <i-switch v-model="formData.isDefault" />
        </FormItem>
      </Form>
      <div class="mt_20" slot="footer">
        <Button @click="hide">{{$t('Cancel')}}</Button>
        <Button type="primary" class="mr_10" :loading="loading" @click="save">{{ $t('Save') }}</Button>
      </div>
    </Modal>
    <bono-map ref="map" @getAddress="getAddress"></bono-map>
  </div>
</template>

<script>
import bonoMap from '@/components/map/bonoMap';
import {
  newMemberAddress,
  editMemberAddress,
  getAddrDetail
} from '@/api/address';
export default {
  name: 'addressManage',
  props: {
    id: { // 传入的地址id
      default: '',
      type: String
    }
  },
  data () {
    return {
      showAddr: false, // 控制模态框显隐
      formData: { // 表单数据
        isDefault: false
      },
      ruleInline: { // 验证规则
        name: [{ required: true, message: this.$t('Please enter receiver name'), trigger: 'blur' }],
        address: [{ required: true, message: this.$t('Please enter address'), trigger: 'change' }],
        detail: [
          { required: true, message: this.$t('Please enter detailed address'), trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$t('The phone number is not left empty'), trigger: 'blur' },
          {
            type: 'string',
            pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
            message: this.$t('Number Not Correct'),
            trigger: 'blur'
          }
        ]
      },
      loading: false, // 提交的加载状态
      mapMsg: {} // 地图信息
    };
  },
  methods: {
    save () { // 保存地址
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          params.consigneeAddressPath = params.address.replace(/\s/g, ',');
          delete params.address;
          this.loading = true;
          if (this.id) {
            editMemberAddress(this.id, params).then((res) => {
              this.loading = false;
              if (res.success) {
                this.$Message.success(this.$t('Edit address successfully'));
                this.$emit('change', true);
                this.hide();
              }
            })
          } else {
            newMemberAddress(params).then((res) => {
              this.loading = false;
              if (res.success) {
                this.$Message.success(this.$t('Add address successfully'));
                this.$emit('change', true);
                this.hide();
              }
            }).catch(() => { this.loading = false; });
          }
        }
      });
    },
    getAddrById (id) {
      getAddrDetail(id).then((res) => {
        if (res) {
          const data = res.result;
          data.address = res.result.consigneeAddressPath.replace(/,/g, ' ');
          this.formData = data;
        }
      });
    },
    getAddress (item) {
      this.mapMsg = item;
      this.$set(this.formData, 'address', item.name);
      //TODO SỬA LẠI THUỘC TÍNH CẦN
      this.$set(this.formData, 'consigneeAddressIdPath', item.name);
      this.$set(this.formData, 'detail', item.name);
      this.formData.lat = item.center.lat;
      this.formData.lon = item.center.lng;
    },
    // getAddress(item) {
    //   // 获取地图选择信息
    //   console.log(item);
    //   this.mapMsg = item;
    //   this.$set(this.formData, "address", item.addr);
    //   this.$set(this.formData, "consigneeAddressIdPath", item.addrId);
    //   this.$set(this.formData, "detail", item.detail);
    //   this.formData.lat = item.position.lat;
    //   this.formData.lon = item.position.lng;
    // },
    show () { // 地址模态框显示
      this.showAddr = true;
    },
    hide () { // 地址模态框隐藏
      this.showAddr = false;
    }
  },
  watch: {
    id: { // 传入的地址id
      handler: function (v) {
        if (v) {
          this.getAddrById(v);
        } else {
          this.formData = {isDefault: false}
          this.$refs.form.resetFields();
        }
      }
    }
  },
  components: {
    bonoMap
  }
};
</script>

<style scoped lang="scss">
.add-box {
  margin: 40px 0;
}
</style>
