<template>
  <div>
    <card :_Title="$t('Address')"/>
    <div class="add-box">
      <Form ref="form" :label-width="100" :model="formData" :rules="ruleInline" label-position="left">
        <FormItem :label="$t('Receiver')" prop="name">
          <i-input v-model="formData.name" :placeholder="$t('Please enter receiver name') "
                   style="width: 600px"></i-input>
        </FormItem>
        <FormItem :label="$t('Location')" prop="center">
          <i-input v-model="formData.center" :placeholder="$t('Please select location')" disabled
                   style="width: 600px"></i-input>
          <Button class="btn_choose ml_10" size="small" type="primary" @click="$refs.Bonomap.showMap = true">
            {{ $t('Choose') }}
          </Button>
        </FormItem>
        <FormItem :label="$t('Region')">
          <region
            :addressId="address"
            @selected="selectedRegion"
          />
        </FormItem>
        <FormItem :label="$t('Detailed address')" prop="detail">
          <i-input v-model="formData.detail" :placeholder="$t('Please enter detailed address')"
                   style="width: 600px"></i-input>
        </FormItem>
        <FormItem :label="$t('Phone')" prop="mobile">
          <i-input v-model="formData.mobile" :placeholder="$t('Please enter the receiver\'s phone number')"
                   style="width: 600px"></i-input>
        </FormItem>
        <FormItem :label="$t('Address name')">
          <i-input v-model="formData.alias" :maxlength="20"
                   :placeholder="$t('Please enter an address name, e.g. company')"
                   length style="width: 600px">
          </i-input>
        </FormItem>
        <FormItem :label="$t('Default address')">
          <i-switch v-model="formData.isDefault"/>
        </FormItem>
      </Form>
    </div>
    <div class="mt_20">
      <Button :loading="loading" class="mr_10" type="primary" @click="save">{{ $t('Save') }}</Button>
      <Button @click="$router.back()">{{ $t('Back') }}</Button>
    </div>
    <bono-map ref="Bonomap" @getAddress="getAddress"></bono-map>
  </div>
</template>

<script>
import card from "@/components/card";
import bonoMap from "@/components/map/bonoMap";
import region from "@/components/map/region"

import * as RegExp from "@/plugins/RegExp.js";
import {editMemberAddress, getAddrDetail, newMemberAddress,} from "@/api/address";

export default {
  name: "AddAddress",
  data() {
    return {
      formData: {
        isDefault: false,
      },
      ruleInline: {
        name: [{required: true, message: this.$t('Please enter your full name'), trigger: "blur"}],
        center: [{required: true, message: this.$t('Please enter address'), trigger: "change"}],
        detail: [
          {required: true, message: this.$t('Please enter detailed address'), trigger: "blur"},
        ],
        mobile: [
          {required: true, message: this.$t('Please enter the phone number')},
          {
            pattern: RegExp.mobile,
            trigger: "blur",
            message: this.$t('Invalid phone number'),
          },
        ],
      },
      loading: false,
      mapMsg: {},
      address: ''
    };
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          delete params.center;
          this.loading = true;
          if (this.$route.query.id) {
            editMemberAddress(params)
              .then((res) => {
                if (res.success) {
                  this.loading = false;
                  this.$Message.success(res.message)
                  this.$router.push("/home/MyAddress");
                }
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            newMemberAddress(params)
              .then((res) => {
                if (res.success) {
                  this.loading = false;
                  this.$Message.success(res.message)
                  this.$router.push("/home/MyAddress");
                }
              })
              .catch(() => {
                this.loading = false;
              });
          }
        }
      });
    },
    selectedRegion(item) {
      this.$set(this.formData, 'consigneeAddressIdPath', item[0].toString());
      this.$set(this.formData, 'consigneeAddressPath', item[1].toString());
    },
    getAddrById(id) {
      getAddrDetail(id)
        .then((res) => {
          this.formData = res;
          this.address = res.consigneeAddressIdPath

        })
        .finally(() => {

        })
    },
    getAddress(item) {
      this.mapMsg = item;
      this.$set(this.formData, "center", item.name);
      this.formData.lat = item.center.lat;
      this.formData.lon = item.center.lng;
    },
  },
  mounted() {
    const id = this.$route.query.id;
    if (id) this.getAddrById(id);
  },
  components: {
    card,
    bonoMap,
    region
  },
};
</script>

<style lang="scss" scoped>
.add-box {
  margin: 40px 0;

  .btn_choose {
    height: 28px;
  }
}

</style>
