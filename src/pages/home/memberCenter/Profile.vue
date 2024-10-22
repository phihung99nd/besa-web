<template>
  <div class="profile-wrapper">
    <card :_Title="$t('User Information')"/>
    <Form :model="formItem" :rules="rules" ref="form" label-position="top">
      <FormItem :label="$t('Avatar')">
        <div class="avatar-wrapper">
          <Avatar v-if="formItem.face" :src="formItem.face" size="80"/>
          <Avatar v-else icon="ios-person" size="80"/>
          <Upload
            :show-upload-list="false"
            :on-success="handleSuccess"
            :data="{isTmp: true}"
            accept=".jpg,.jpeg,.png"
            :format="['jpg','jpeg','png']"
            :action="action"
            :headers="{ Authorization: `Bearer ${accessToken.accessToken}` }"
          >
            <Button class="mt_10">{{ $t('Upload avatar') }}</Button>
          </Upload>
        </div>
      </FormItem>
      <FormItem :label="$t('Username')" prop="username">
        <Input style="width:203px" disabled v-model="formItem.username" placeholder=""/>
      </FormItem>
      <FormItem :label="$t('Phone')" prop="mobile">
        <Input style="width:203px" v-model="formItem.mobile" placeholder=""/>
      </FormItem>
      <FormItem :label="$t('Name')" prop="name">
        <Input style="width:203px" v-model="formItem.name" placeholder=""/>
      </FormItem>

      <FormItem :label="$t('Birthday')">
        <DatePicker :options="validateDate" type="date" :placeholder="$t('Choose your birthday')" v-model="formItem.birthday"></DatePicker>
      </FormItem>
      <FormItem :label="$t('Gender')">
        <RadioGroup v-model="formItem.sex" button-style="solid">
          <Radio :label="1">{{ $t('Male') }}</Radio>
          <Radio :label="0">{{ $t('Female') }}</Radio>
          <Radio :label="2">{{ $t('Other') }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loading" @click="save">{{ $t('Save') }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import storage from '@/plugins/storage.js';
import {editMemberInfo} from '@/api/account.js';
import {commonUrl} from '@/plugins/request.js';
import {minioAPI} from "@/config";
import * as apiLogin from "../../../api/login";
import * as RegExp from "@/plugins/RegExp.js";
import {getExpiresTime} from "../../../plugins/request";

export default {
  name: 'Profile',
  data() {
    return {
      validateDate: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      rules: { // 验证规则
        name: [{required: true, message: this.$t('Name cannot be empty')}, {
          max: 40,
          message: this.$t('Name cannot exceed 40 characters')
        }],
        mobile: [{required: true, message: this.$t('Please enter the phone number')},
          {
            pattern: RegExp.mobile,
            message: this.$t('Invalid phone number'),
          },]
      },
      formItem: {},
      action: commonUrl + "/buyer/common/file", // 上传接口
      accessToken: {}, // 验证token
      loading: false
    }
  },
  created() {
    this.getInfo()
  },
  mounted() {
    this.accessToken.accessToken = storage.getItem('buyer_accessToken');
  },
  methods: {
    getInfo(){
      apiLogin.getMemberMsg().then(res => {
        if(res.success){
          this.formItem = res.result
        }
      })
    },

    save() { // 保存
      if(this.loading) return
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            birthday: this.$options.filters.unixToDate(this.formItem.birthday / 1000, 'yyyy-MM-dd'),
            face: this.formItem.face,
            name: this.formItem.name,
            sex: this.formItem.sex,
            mobilePhone: this.formItem.mobile
          }
          this.loading = true
          editMemberInfo(params).then(res => {
            if (res.success) {
              this.$Message.success(this.$t('Update information successfully'))
              let newInfo = {
                ...JSON.parse(storage.getItem('buyer_userInfo')),
                ...params
              }
              storage.setItem("buyer_userInfo", newInfo, {expires: getExpiresTime(2147483647)})
              this.$bus.$emit('update-user-profile', newInfo)
            }
          }).catch((err) => {
            this.$Message.error(err.response.data.message)
          })
            .finally(()=>{
            setTimeout(()=>{
              this.loading = false
            }, 500)
          })
        }
      })
    },
    handleSuccess(res, file) { // 上传成功
      this.$set(this.formItem, 'face', (process.env.VUE_APP_MINIO_API || minioAPI) + new URL(res.result).pathname)
    },
  }

}
</script>

<style scoped lang="scss">
.avatar-wrapper {
  display: flex;
  gap: 20px;
}
</style>
