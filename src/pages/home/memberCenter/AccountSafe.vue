<template>
  <div class="account-wrapper">
    <card :_Title="$t('Account Security')"/>
    <div class="safeList">
      <Row class="safeItem">
        <Col :span="2">
          <Icon size="40" type="md-key"/>
        </Col>
        <Col :span="16">
          <div class="setDivItem">{{ $t('Login Password') }}</div>
          <div class="setDivItem theme">
            {{
              $t('Internet accounts are at risk of being stolen. It is recommended that you change your password regularly to protect your account security.')
            }}
          </div>
        </Col>
        <Col :span="4">
          <Button @click="modifyPwd">{{ $t('Change Password') }}</Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import {getPwdStatus} from '@/api/account';

export default {
  name: 'AccountSafe',
  data() {
    return {
      pwdStatus: ''
    }
  },
  mounted() {
    this.getPwdStatus()
  },
  methods: {
    // goModifyPwd() {
    //   this.$router.push({name: 'ModifyPwd', query: {status: 2}})
    // },
    modifyPwd() {
      this.$router.push({name: 'ModifyPwd', query: {status: 1}})
    },
    getPwdStatus() {
      getPwdStatus()
        .then(res => {
          if (res) {
            this.pwdStatus = this.$t('Change Password')
          } else {
            this.pwdStatus = this.$t('Set Password')
          }
        })
        .finally(() => {

        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .ivu-col-span-2, .ivu-col-span-4 {
  text-align: center;
  color: $accent_color;
}

.theme {
  color: $accent_color !important;
}

.setDivItem {
  line-height: 1.75;
}

.safeItem {
  border-bottom: 1px solid $border_color;
  padding: 16px 0;

  /deep/ .ivu-col {
    padding: 8px 0;

  }
}
</style>
