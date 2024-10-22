<template>
  <div class="company-msg">
    <Form ref="firstForm" :model="form" :rules="rules" :label-width="140">
      <h4>{{ $t('Basic information') }}</h4>
      <FormItem prop="companyName" :label="$t('company name')">
        <Input
          type="text"
          v-model="form.companyName"
          :placeholder="$t('Please fill in the company information')"
        />
      </FormItem>
      <FormItem prop="companyAddressIdPath" :label="$t('Region')">
        <region
          style="width: 250px"
          @selected="selectedRegion"
          :addressId="address"
        />
      </FormItem>
      <FormItem prop="companyAddress" :label="$t('Company address')">
        <Input
          type="text"
          v-model="form.companyAddress"
          :placeholder="$t('Please fill in company details')"
        />
      </FormItem>
      <FormItem prop="employeeNum" :label="$t('Number of employees')">
        <Input
          type="text"
          v-model="form.employeeNum"
          :placeholder="$t('Please fill in the total number of employees in the company')"
        ><span slot="append">{{ $t('people') }}</span>
        </Input>
      </FormItem>
      <FormItem prop="companyPhone" :label="$t('company phone')">
        <Input
          type="text"
          v-model="form.companyPhone"
          :placeholder="$t('Please fill in the company phone number')"
        ></Input>
      </FormItem>
      <FormItem prop="registeredCapital" :label="$t('registered capital')">
        <Input
          type="text"
          v-model="form.registeredCapital"
          :placeholder="$t('Please fill in the registered capital')"
        ><span slot="append">VNĐ</span></Input>
      </FormItem>
      <FormItem prop="linkName" :label="$t('Contact name')">
        <Input
          type="text"
          v-model="form.linkName"
          :placeholder="$t('Please fill in the contact name')"
        />
      </FormItem>
      <FormItem prop="linkPhone" :label="$t('contact number')">
        <Input
          type="text"
          v-model="form.linkPhone"
          :placeholder="$t('Please fill in the contact number')"
        />
      </FormItem>
      <FormItem prop="companyEmail" :label="$t('E-mail')">
        <Input
          type="text"
          v-model="form.companyEmail"
          :placeholder="$t('Please fill in your email')"
        />
      </FormItem>

      <h4>{{ $t('Business license information') }}</h4>
      <FormItem prop="licenseNum" :label="$t('Business License No')">
        <Input
          type="text"
          v-model="form.licenseNum"
          :placeholder="$t('Please fill in the business license number')"
        />
      </FormItem>
      <FormItem prop="scope" :label="$t('Legal business scope')">
        <Input
          type="textarea"
          v-model="form.scope"
          maxlength="200"
          show-word-limit
          :rows="4"
          :placeholder="$t('Please enter the business scope shown in the business license')"
        />
      </FormItem>
      <FormItem prop="licencePhoto" :label="$t('Electronic version of business license')">
        <Upload
          ref="uploadLicence"
          :show-upload-list="false"
          :on-success="handleSuccess"
          accept=".jpg,.jpeg,.png"
          :format="['jpg', 'jpeg', 'png']"
          :max-size="5120"
          :before-upload="beforeUpload"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-error="uploadErr"
          :data="{isTmp: true}"
          multiple
          :action="action"
          :headers="{ Authorization: `Bearer ${accessToken.accessToken}` }"
        >
          <Button type="info" :loading="uploadLoading">{{ $t('Upload the certificate') }}</Button>
        </Upload>
        <div class="describe">
          {{ $t('Please compress the picture within 2 M, the format is gif, jpg, png, and make sure the text is clear, so as not to fail to upload or review') }}
        </div>
        <div
          class="img-list"
          v-for="(item, index) in form.licencePhoto"
          :key="index"
        >
          <img :src="item" width="100" alt=""/>
          <div class="cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(index, 'licencePhoto')"
            ></Icon>
          </div>
        </div>
      </FormItem>

      <h4>{{ $t('Legal person information') }}</h4>
      <FormItem prop="legalName" :label="$t('Legal person name')">
        <Input
          type="text"
          v-model="form.legalName"
          maxlength="20"
          :placeholder="$t('Please enter the legal person name')"
        />
      </FormItem>
      <FormItem prop="legalId" :label="$t('Legal person ID number')">
        <Input
          type="text"
          v-model="form.legalId"
          :placeholder="$t('Please enter the legal person ID number')"
        />
      </FormItem>
      <FormItem prop="legalPhoto" :label="$t('Electronic version of legal person certificate')">
        <Upload
          ref="uploadLegal"
          :show-upload-list="false"
          :on-success="handleSuccess1"
          :before-upload="beforeUpload1"
          :max-size="5120"
          accept=".jpg,.jpeg,.png"
          :format="['jpg', 'jpeg', 'png']"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-error="uploadErr"
          :data="{isTmp: true}"
          multiple
          :action="action"
          :headers="{ Authorization: `Bearer ${accessToken.accessToken}` }"
        >
          <Button type="info" :loading="uploadLoading1">{{ $t('Certificate upload') }}</Button>
        </Upload>
        <div class="describe">
          {{ $t('Please compress the picture within 2 M, two photos on the front and back of the ID card, to ensure that the picture is clear and free of corners') }}
        </div>
        <div
          class="img-list"
          v-for="(item, index) in form.legalPhoto"
          :key="index"
        >
          <img :src="item" width="100" alt=""/>
          <div class="cover">
            <Icon
              type="ios-eye-outline"
              @click.native="handleView(item)"
            ></Icon>
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(index, 'legalPhoto')"
            ></Icon>
          </div>
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loading" @click="next"
        >{{ $t('Fill in financial qualification information') }}
        </Button
        >
      </FormItem>
    </Form>
    <Modal title="View Image" v-model="visible">
      <img :src="previewPicture" v-if="visible" style="width: 100%"/>
    </Modal>
  </div>
</template>
<script>
import * as RegExp from '@/plugins/RegExp.js';
import region from '@/components/map/region.vue';
import storage from '@/plugins/storage';
import {commonUrl} from '@/plugins/request.js';
import {applyFirst} from '@/api/shopentry';

export default {
  components: {region},
  props: {
    content: {
      default: {},
      type: Object
    }
  },
  data() {
    return {
      action: commonUrl + '/buyer/common/file',
      accessToken: {},
      visible: false,
      loading: false,
      address: '',
      previewPicture: '',
      form: {
        legalPhoto: [],
        licencePhoto: []
      },
      rules: {
        companyName: [{required: true, message: this.$t('Please fill in the company information')}],
        companyAddressIdPath: [{required: true, message: this.$t('Please select the company location')}],
        companyAddress: [{required: true, message: this.$t('Please fill in the company determined address')}],
        employeeNum: [
          {pattern: RegExp.integer, message: this.$t('Only positive integers can be filled in')}
        ],
        registeredCapital: [
          {pattern: RegExp.integer, message: this.$t('Only positive integers can be filled in')}
        ],
        linkName: [{required: true, message: this.$t('Please fill in the contact name')}],
        linkPhone: [
          {required: true, message: this.$t('Please fill in the contact number')},
          {pattern: RegExp.mobile, message: this.$t('Please fill in the correct number')}
        ],
        companyPhone: [
          {required: true, message: this.$t('Please fill in the company phone number')},
          {pattern: RegExp.mobile, message: this.$t('Please fill in the correct number')}
        ],
        companyEmail: [
          {required: true, message: this.$t('Please fill in your email')},
          {type: 'email', message: this.$t('please enter your vaild email')}
        ],
        licenseNum: [
          {required: true, message: this.$t('Please fill in the business license number')},
        ],
        scope: [{
          required: true,
          message: this.$t('Please fill in the business scope indicated in the business license')
        }],
        legalPhoto: [{required: true, message: this.$t('Please upload a legal person ID photo')}],
        licencePhoto: [{required: true, message: this.$t('Please upload business license')}],
        legalName: [{required: true, message: this.$t('Please enter the legal person name')}],
        legalId: [
          {required: true, message: this.$t('Please enter the legal person ID number')},
        ]
      },
      uploadLoading1: false,
      uploadLoading: false
    };
  },
  mounted() {
    this.accessToken = {
      accessToken: storage.getItem('buyer_accessToken')
    }
    if (Object.keys(this.content).length) {
      this.form = JSON.parse(JSON.stringify(this.content));
      if (this.form.licencePhoto) {
        this.form.legalPhoto = this.content.legalPhoto.split(',');
        this.form.licencePhoto = this.content.licencePhoto.split(',');
        this.address = this.form.companyAddressIdPath;
      }
    }
  },
  methods: {
    next() {
      this.$refs.firstForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = JSON.parse(JSON.stringify(this.form));
          params.legalPhoto = this.form.legalPhoto.toString();
          params.licencePhoto = this.form.licencePhoto.toString();
          applyFirst(params)
            .then((res) => {
              this.loading = false;
              if (res.success) this.$emit('change', 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error');
        }
      });
    },

    selectedRegion(item) {
      console.log(item)
      this.$set(this.form, 'companyAddressIdPath', item[0].toString());
      this.$set(this.form, 'companyAddressPath', item[1].toString());
    },

    beforeUpload() {
      this.uploadLoading = true;
      if (this.form.licencePhoto.length >= 3) {
        this.$Message.warning(this.$t('Up to three pictures can be uploaded'))
        return false;
      }
    },

    beforeUpload1() {
      this.uploadLoading1 = true;
      if (this.form.legalPhoto.length >= 2) {
        this.$Message.warning(this.$t('Upload up to two pictures'))
        return false;
      }
    },

    handleSuccess(res, file) {
      this.uploadLoading = false;
      this.form.licencePhoto.push(res.result);
    },

    handleSuccess1(res, file) {
      this.uploadLoading1 = false;
      this.form.legalPhoto.push(res.result);
    },

    uploadErr() {
      this.uploadLoading = false;
      this.uploadLoading1 = false;
    },

    handleFormatError(file) {
      this.uploadLoading = false;
      this.uploadLoading1 = false;
      this.$Notice.warning({
        title: this.$t('The file format is incorrect'),
        desc: this.$t('The upload file format is incorrect')
      });
    },

    handleMaxSize(file) {
      this.uploadLoading = false;
      this.uploadLoading1 = false;
      this.$Notice.warning({
        title: this.$t('Exceeding file size limit'),
        desc: this.$t('The file size cannot exceed 2M')
      });
    },

    handleView(item) {
      this.previewPicture = item;
      this.visible = true;
    },

    handleRemove(index, listName) {
      this.form[listName].splice(index, 1);
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
