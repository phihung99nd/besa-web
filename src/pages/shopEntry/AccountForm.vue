<template>
  <div>
    <Form ref="accountForm" :model="form" :rules="rules" :label-width="140" label-position="left">
      <FormItem :label="$t('Fullname')" prop="name">
        <Input
          type="text"
          v-model="form.name"
        />
      </FormItem>
      <FormItem :label="$t('Username')" prop="username">
        <Input
          type="text"
          v-model="form.username"
        />
      </FormItem>
      <FormItem :label="$t('Password')" prop="password">
        <Input
          type="text"
          v-model="form.password"
        />
      </FormItem>
      <FormItem :label="$t('Phone')" prop="linkPhone">
        <Input
          type="text"
          v-model="form.linkPhone"
        />
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loading" @click="next">{{ $t('Create account') }}</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import * as RegExp from '@/plugins/RegExp.js';
import {createStoreAndBuyerAccount} from "../../api/shopentry";
import {AccountLogin} from "../../api/account";

export default {
  name: "AccountForm",
  data() {
    return {
      form: {
        name: '',
        username: '',
        password: '',
        linkPhone: ''
      },
      rules: {
        // name: [
        //   {required: true, message: this.$t('Please enter name'), trigger: 'blur'},
        // ],
        username: [
          {required: true, message: this.$t('Please enter username'), trigger: 'blur'},
          {
            pattern: /^[a-zA-Z0-9_-]*$/,
            message: this.$t('Username only contains letters, digits and character _ or -'),
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]/,
            message: this.$t('Username only start with letter or digit'),
            trigger: 'blur'
          },
          {
            pattern: /[a-zA-Z0-9]$/,
            message: this.$t('Username only end with letter or digit'),
            trigger: 'blur'
          },
          {type: 'string', min: 6, message: this.$t('Username must contains at least 6 characters'), trigger: 'blur'},
          {type: 'string', max: 20, message: this.$t('Username must contains at most 20 characters'), trigger: 'blur'}
        ],
        password: [
          {required: true, message: this.$t('Please enter password'), trigger: 'blur'},
          {type: 'string', min: 6, message: this.$t('The password require minimum 6 characters'), trigger: 'blur'}
        ],
        linkPhone: [
          {required: true, message: this.$t('Please enter the phone number'), trigger: 'blur'},
          {pattern: RegExp.mobile, message: this.$t('Invalid phone number'), trigger: 'blur'}
        ]
      },
      loading: false
    }
  },
  methods: {
    next() {
      if (this.loading) return
      this.$refs.accountForm.validate(valid => {
        if (valid) {
          let form = {
            ...this.form,
          }
          this.loading = true

          createStoreAndBuyerAccount(form).then(res => {
            if (res.success) {
              let fd = new FormData();
              fd.append("username", form.username);
              fd.append("password", form.password);
              fd.append("grant_type", "password");
              fd.append("scope", "buyer");
              AccountLogin(fd)
                .then((res) => {
                  this.$emit('on-submit', res.access_token)
                })
              this.$Notice.success({
                title: this.$t('New account created successfully'),
                desc: this.$t('You can use the account you just created to log in this website')
              })
            }
          }).catch((err) => {
            this.$Message.error(err.response.data.message)
          })
            .finally(() => {
            setTimeout(()=>{
              this.loading = false
            }, 500)
          })
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.ivu-input-wrapper {
  width: 300px;
}
</style>
