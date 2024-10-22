<template>
  <div>
    <div style="width: 1200px; margin: auto; padding-top: 20px;" v-html="content"></div>
    <BaseFooter/>
  </div>
</template>

<script>
import {policyDetail} from "@/api/common";
import NavigationBar from "@/pages/index/NavigationBar.vue";

export default {
  name: "PolicyDetail",
  components: {NavigationBar},
  data(){
    return {
      content: ""
    }
  },
  mounted() {
    this.getPolicy()
  },
  methods: {
    getPolicy(){
      policyDetail(this.$route.query.id)
        .then(res => {
          this.content = res.result.content
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
