<template>
  <div class="pwd-wrapper">
    <card :_Title="$t('Account Safe')"/>
    <!--  手机号验证  -->
    <Form ref="formData" :model="formData" label-position="left" :label-width="100" :rules="ruleInLines"
          v-if="(status == 2 || status == 3) && !showPwd">
      <FormItem :label="$t('Phone')">
        <div class="phone">1234567890</div>
      </FormItem>
      <FormItem :label="$t('Captcha')" prop="picture" style="width: 350px">
        <i-input v-model="formData.picture" size="large" maxlength="4"></i-input>
      </FormItem>
      <FormItem :label="$t('OTP code')" prop="msg">
        <i-input v-model="formData.msg" size="large" maxlength="6" style="width: 250px">
          <span slot="append">{{ $t('Enter confirmation code') }}</span>
        </i-input>
      </FormItem>
    </Form>
    <div slot="footer" v-if="(status == 2 || status == 3) && !showPwd" style="text-align: center;width: 50%">
      <Button type="primary" class="ml_10" @click="submitRegister">{{ $t('Next') }}</Button>
    </div>

    <!--  修改  -->
    <Form ref="formRegister" :model="formRegister" :rules="ruleInline" :label-width="80" v-if="status == 1 && !showPwd">
      <FormItem :label="$t('Old Password')" prop="password">
        <i-input type="password" v-model="formRegister.password" clearable size="large" :placeholder="$t('Please enter old password')"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem :label="$t('New password')" prop="newPassword">
        <i-input type="password" v-model="formRegister.newPassword" clearable size="large" :placeholder="$t('Please enter a new password')"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem :label="$t('Confirm password')" prop="againPassword">
        <i-input type="password" v-model="formRegister.againPassword" clearable size="large" :placeholder="$t('Please enter the confirmation password')"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>

    </Form>
    <div slot="footer" v-if="status == 1 && !showPwd" style="width: 50%;text-align: center">
      <Button type="primary" class="ml_10" @click="handleRegist">{{ $t('Edit') }}</Button>
    </div>
    <!-- 设置&修改的第二种情况   -->
    <Form ref="formDataUpdate" :model="formDataUpdate" label-position="left" :label-width="100" :rules="ruleIn"
          v-if="showPwd">
      <FormItem :label="$t('New password')" prop="newPassword">
        <i-input type="password" v-model="formDataUpdate.newPassword" clearable size="large" :placeholder="$t('Please enter a new password')"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem :label="$t('Confirm password')" prop="againPassword">
        <i-input type="password" v-model="formDataUpdate.againPassword" clearable size="large" :placeholder="$t('Please enter the confirmation password')"
                 style="width: 300px"
                 maxlength="12">
          <Icon type="md-lock" slot="prepend"></Icon>
        </i-input>
      </FormItem>
    </Form>
    <div slot="footer" v-if="showPwd" style="text-align: center;width: 50%">
      <Button type="primary" class="ml_10" @click="setPassword">{{ $t('Change') }}</Button>
    </div>
  </div>
</template>

<script>
import {
  setPwd,
  editPwd
} from '@/api/account';
import {md5} from '@/plugins/md5.js'

export default {
  name: 'modifyPwd',
  data () {
    return {
      // 1 is modification, 2 is setting, 3 is the next step of submitting verification.
      status: '',
      showPwd: false, // 显示密码
      formData: { // 验证表单
        picture: '',
        msg: ''
      },
      formDataUpdate: { // 直接输入新密码表单
        newPassword: '',
        againPassword: ''
      },
      formRegister: { // 第三步 新密码表单
        password: '',
        againPassword: '',
        newPassword: ''
      },
      ruleInLines: { // 验证规则
        picture: [
          {required: true, message: this.$t('Please enter the captcha verification code'), trigger: 'blur'}
        ],
        msg: [
          {required: true, message: this.$t('Please enter OTP code'), trigger: 'blur'}
        ]
      },
      ruleIn: { // 验证规则
        newPassword: [
          {required: true, message: this.$t('Please enter a new password'), trigger: 'blur'},
          {type: 'string', min: 6, message: this.$t('The password require minimum 6 characters')}
        ],
        againPassword: [
          {required: true, message: this.$t('Please enter a new password'), trigger: 'blur'},
          {type: 'string', min: 6, message: this.$t('The password require minimum 6 characters')}
        ]
      },
      ruleInline: { // 验证规则
        password: [
          {required: true, message: this.$t('Please enter old password'), trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: this.$t('Please enter a new password'), trigger: 'blur'},
          {type: 'string', min: 6, message: this.$t('The password require minimum 6 characters')}
        ],
        againPassword: [
          {required: true, message: this.$t('Please confirm new password'), trigger: 'blur'},
          {type: 'string', min: 6, message: this.$t('The password require minimum 6 characters')}
        ]
      }
    }
  },
  mounted () {
    this.status = this.$route.query.status
  },
  methods: {
    // 修改
    handleRegist () {
      this.$refs['formRegister'].validate((valid) => {
        if (valid) {
          const {newPassword, againPassword, password} = this.formRegister
          if (newPassword !== againPassword) {
            this.$Message.error({
              content: this.$t('The new and confirm passwords do not match')
            });
            return
          }
          const params = {newPassword, password}
          // params.newPassword = md5(newPassword)
          // params.password = md5(password)
          editPwd(params).then(res => {
            if (res.success) {
              this.$Message.success(this.$t('Change password successfully'));
              this.$router.push('/home')
            }
          });
        }
      })
    },
    // 提交验证
    submitRegister () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.showPwd = true
        }
      })
    },
    // 设置密码
    setPassword () {
      this.$refs['formDataUpdate'].validate((valid) => {
        if (valid) {
          const {newPassword, againPassword} = this.formDataUpdate
          if (newPassword === '') {
            this.$Message.error({
              content: this.$t('Please enter password')
            });
            return
          }
          if (newPassword !== againPassword) {
            this.$Message.error({
              content: this.$t('The new and verify passwords do not match')
            });
            return
          }
          const params = {password: newPassword}
          params.password = md5(newPassword)
          setPwd(params).then(res => {
            if (res.message === 'success' && res.result) {
              this.$Message.success(this.$t('The payment password is set successfully'));
              this.$router.push('/home')
            }
          });
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .pwd-wrapper {
    text-align: center;
  }
  .phone {
    text-align: left;
  }
</style>
