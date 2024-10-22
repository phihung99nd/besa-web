<template>
  <div class="person-msg">
    <Form ref="thirdForm" :model="form" :rules="rules" :label-width="140">
      <h4>{{ $t('Basic information') }}</h4>
      <FormItem prop="storeName" :label="$t('Shop name')">
        <Input
          type="text"
          v-model="form.storeName"
          :placeholder="$t('Please fill in the store name')"
        />
      </FormItem>

      <FormItem prop="storeLogo" :label="$t('store logo')">
        <Upload
          ref="uploadLogo"
          :show-upload-list="false"
          :on-success="handleSuccess"
          accept=".jpg,.jpeg,.png"
          :format="['jpg', 'jpeg', 'png']"
          :max-size="5120"
          :before-upload="beforeUpload"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-error="uploadErr"
          multiple
          :action="action"
          :headers="accessToken"
        >
          <Button type="info" :loading="uploadLoading">{{ $t('Upload logo') }}</Button>
        </Upload>
        <div class="describe">{{ $t('Please compress the picture within 2 M, the format is gif, jpg, png') }}</div>
        <div
          class="img-list"
          v-for="(item, index) in form.storeLogo"
          :key="index"
        >
          <img :src="item" width="100" height="" alt=""/>
          <div class="cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(index, 'storeLogo')"
            ></Icon>
          </div>
        </div>
      </FormItem>
      <FormItem prop="goodsManagementCategory" :label="$t('Store Management Category')">
        <Select
          v-model="form.goodsManagementCategory"
          multiple
          style="width: 300px"
        >
          <Option
            v-for="item in categoryList"
            :value="item.id"
            :key="item.id"
          >{{ item.name }}
          </Option
          >
        </Select>
      </FormItem>
      <FormItem prop="storeCenter" :label="$t('Store Location')">
        <Button
          type="info"
          v-if="!form.storeCenter"
          @click="$refs.bonoMap.showMap = true"
        >{{ $t('click To Get Store Location') }}
        </Button>
        <Button
          type="success"
          v-else
          @click="$refs.bonoMap.showMap = true"
        >{{ $t('located') }}
        </Button>
      </FormItem>
      <FormItem prop="storeAddressIdPath" :label="$t('Store location')">
        <region
          style="width: 250px"
          @selected="selectedRegion"
          :addressId="address"
        />
      </FormItem>
      <FormItem prop="storeAddressDetail" :label="$t('Detailed address of the store')">
        <Input
          type="text"
          v-model="form.storeAddressDetail"
          :placeholder="$t('Please fill in the detailed address of the store')"
        />
      </FormItem>
      <FormItem prop="storeDesc" :label="$t('Store Profile')">
        <Input
          type="textarea"
          v-model="form.storeDesc"
          maxlength="200"
          show-word-limit
          :rows="4"
          :placeholder="$t('Please enter a store profile')"
        />
      </FormItem>

      <FormItem>
        <Button @click="$emit('change', 1)">{{ $t('Back') }}</Button>
        <Button type="primary" :loading="loading" @click="next">{{ $t('Submit for platform review') }}</Button>
      </FormItem>
    </Form>
    <Modal title="View Image" v-model="visible">
      <img :src="previewPicture" v-if="visible" style="width: 100%"/>
    </Modal>
    <bono-map ref="bonoMap" @getAddress="getAddress"></bono-map>
  </div>
</template>
<script>
import Map from '@/components/map/bonoMap';
import storage from '@/plugins/storage';
import region from '@/components/map/region.vue';
import {commonUrl} from '@/plugins/request.js';
import {getCategory} from '@/api/goods';
import {applyThird} from '@/api/shopentry';

export default {
  props: {
    content: {
      default: {},
      type: Object
    }
  },
  components: {bonoMap: Map, region},
  data() {
    return {
      loading: false, // loading status
      uploadLoading: false, // upload loading status
      action: commonUrl + '/common/common/upload/file', // upload URL
      accessToken: {}, // verification token
      previewPicture: '', // preview picture
      address: '', // echo address
      visible: false, // image preview
      form: { // form data
        storeLogo: []
      },
      rules: {
        goodsManagementCategory: [{required: true, message: this.$t('Please select the store business category')}],
        storeName: [{required: true, message: this.$t('Please fill in the store name')}],
        storeLogo: [{required: true, message: this.$t('Please upload the store logo')}],
        storeDesc: [{required: true, message: this.$t('Please fill in the store profile')}],
        storeCenter: [{required: true, message: this.$t('Please select a store location')}],
        storeAddressIdPath: [{required: true, message: this.$t('Please select a store location')}],
        storeAddressDetail: [{required: true, message: this.$t('Please enter the detailed address of the store')}]
      },
      categoryList: [] // categoricalData
    };
  },
  mounted() {
    this.accessToken.accessToken = storage.getItem('buyer_accessToken');
    this.getCategoryList();
    if (this.content != {}) {
      this.form = JSON.parse(JSON.stringify(this.content));
      if (this.form.storeLogo) {
        this.form.storeLogo = this.content.storeLogo.split(',');
        this.form.goodsManagementCategory = this.content.goodsManagementCategory.split(',');
      } else {
        this.form.storeLogo = [];
      }
      this.address = this.form.storeAddressIdPath;
      this.$forceUpdate();
    }
    this.$refs.thirdForm.resetFields()
  },
  methods: {
    // nextStep
    next() {
      this.$refs.thirdForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = JSON.parse(JSON.stringify(this.form));
          params.storeLogo = this.form.storeLogo.toString();
          params.goodsManagementCategory = this.form.goodsManagementCategory.toString();
          applyThird(params)
            .then((res) => {
              this.loading = false;
              if (res.success) this.$emit('change', 3);
              this.$parent.getData()
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    // before upload
    beforeUpload() {
      this.uploadLoading = true;
      if (this.form.storeLogo.length >= 3) {
        this.$Message.warning(this.$t('Up to three pictures can be uploaded'))
        return false;
      }
    },
    // upload success callback
    handleSuccess(res, file) {
      this.uploadLoading = false;
      this.form.storeLogo.push(res.result);
    },
    // Upload format error
    handleFormatError(file) {
      this.uploadLoading = false;
      this.$Notice.warning({
        title: this.$t('The file format is incorrect'),
        desc: this.$t('The upload file format is incorrect')
      });
    },
    handleMaxSize(file) {
      this.uploadLoading = false;
      this.$Notice.warning({
        title: this.$t('Exceeding file size limit'),
        desc: this.$t('The file size cannot exceed 2M')
      })
    },
    // upload failed
    uploadErr() {
      this.uploadLoading = false;
    },
    // view image
    handleView(item) {
      this.previewPicture = item;
      this.visible = true;
    },
    // delete image
    handleRemove(index, listName) {
      this.form[listName].splice(index, 1);
    },
    // select coordinates callback
    getAddress(item) {
      this.$set(
        this.form,
        'storeCenter',
        item.center.lng + ',' + item.center.lat
      );
    },
    // Get product category
    getCategoryList() {
      getCategory(0).then((res) => {
        if (res.success) this.categoryList = res.result;
      });
    },
    // address selection echo
    selectedRegion(item) {
      this.$set(this.form, 'storeAddressIdPath', item[0].toString());
      this.$set(this.form, 'storeAddressPath', item[1].toString());
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

.img-list {
  display: inline-block;
  margin: 10px;
  width: 100px;
  height: auto;
  position: relative;

  .cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    width: inherit;
    height: inherit;
    align-items: center;
    justify-content: space-around;

    i {
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
  }

  &:hover .cover {
    display: flex;
  }
}

.describe {
  font-size: 14px;
  color: #999;
}
</style>
