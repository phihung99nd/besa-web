<template>
  <div>
    <AddressModal ref="addModal" v-if="addressModal" :address="currentAddr" @close="handleCloseModal"/>

    <card :_More="$t('Add new address')" :_Title="$t('Address')" @callback="add"></card>
    <div v-for="(item, index) in list" :key="index" class="address-box">
      <div class="address-header">
        <div class="address-name">
          <span>{{ item.name }}</span>
          <Tag v-if="item.isDefault" class="ml_10" color="red">{{ $t('Default address') }}</Tag>
          <Tag v-if="item.alias" class="ml_10" color="#23caa1">{{ $t(item.alias) }}</Tag>
        </div>
      </div>
      <div class="flex justify-content-between">
        <div class="address-content">
          <div class="content-row">
            <div class="content-label">
              <Iconify icon="ph:user-circle" style="font-size: 24px"/>
              <span>{{ $t('Receiver Information') }}:</span>
            </div>
            <div class="content-info">
              <span>{{ item.name }}</span>
              <Divider type="vertical"/>
              <span>{{ item.mobile }}</span>
            </div>
          </div>
          <div class="content-row">
            <div class="content-label">
              <Iconify icon="ph:map-pin" style="font-size: 24px"/>
              <span>{{ $t('Address') }}:</span>
            </div>
            <div class="content-info">
              <span>{{ item.consigneeAddressPath }}</span>
            </div>
          </div>
        </div>
        <div class="address-action">
          <Iconify icon="iconamoon:edit-thin" @click.native="edit(item)" style="font-size: 24px; cursor:pointer;"/>
          <Iconify icon="iconamoon:trash-thin" @click.native="del(item.id)" style="font-size: 24px; cursor:pointer;"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {delMemberAddress, memberAddress} from '@/api/address.js';
import AddressModal from "./AddressModal.vue";

export default {
  name: 'MyAddress',
  components: {AddressModal},

  data() {
    return {
      list: [], // 地址列表
      currentAddr: {},
      addressModal: false
    };
  },
  methods: {
    add() {
      this.currentAddr = {}
      this.addressModal = true
    },
    edit(item) {
      this.currentAddr = item
      this.addressModal = true
    },
    del(id) {
      // 删除地址
      this.$Modal.confirm({
        title: this.$t('Confirm'),
        content: this.$t('Are you sure to delete this address'),
        onOk: () => {
          delMemberAddress(id)
            .then((res) => {
              if (res.success) {
                this.$Message.success(this.$t('Successfully Deleted'));
                this.getAddrList();
              }
            })
        },
        onCancel: () => {
          this.$Message.info(this.$t('Back'));
        }
      });
    },
    getAddrList() {
      memberAddress().then((res) => {
        if (res.success) {
          this.list = res.result.content;
        }
      });
    },
    handleCloseModal() {
      this.addressModal = false
      this.getAddrList()
    }
  },
  mounted() {
    this.getAddrList();
  }
};
</script>

<style lang="scss" scoped>
.address-box {
  padding: 15px;
  margin: 15px;

  border-bottom: 1px solid $border_color;
}

.address-header {
  height: 35px;
  display: flex;
  justify-content: space-between;
  @include title_color($light_title_color);
  font-size: 18px;

  .address-name > span {
    font-weight: 600;
  }
}

.address-content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .content-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .content-label {
      display: flex;
      align-items: center;
      gap: 8px;

      > span {
        font-weight: 600;
      }
    }
  }
}

.address-action {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#map-container {
  width: 500px;
  height: 300px;
}
</style>
