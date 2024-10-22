<template>
  <div class="container" id="container">
    <model-form ref="modelForm" :data="modelForm"></model-form>
    <Introduce></Introduce>
    <BaseFooter></BaseFooter>
    <div class="scroll-top" :class="{'is-show': windowTop > 400}" @click="scrollToTop">
      <span><Iconify icon="bxs:up-arrow" style="color: #fff"/></span>
    </div>
  </div>
</template>

<script>
import NavigationBar from "@/pages/index/NavigationBar.vue";
import ModelForm from "@/components/indexDecorate/ModelForm.vue";
import Introduce from "@/components/footer/Introduce.vue";
import {indexData} from "@/api";

export default {
  name: "DynamicPage",
  components: {Introduce, ModelForm, NavigationBar},
  data(){
    return {
      modelForm: {},
      windowTop: 0,
    }
  },
  created() {
    this.getIndexData()
  },
  mounted() {
    window.addEventListener("scroll", this.updateWindowScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.updateWindowScroll);
  },
  methods: {
    getIndexData () {
      let params = {
        pageClientType: 'PC',
        pageType: 'INDEX',
        pageShow: 'OPEN',
        url: this.$route.fullPath
      }
      indexData(params).then(res => {
        if (res.success) {
          this.modelForm = JSON.parse(res.result.pageData)
        }
      })
    },
    updateWindowScroll(){
      this.windowTop = window.scrollY;
    },
    scrollToTop(){
      document.getElementById('container').scrollIntoView({behavior: 'smooth'});
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  //@include sub_background_color($dominant_color);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 10px;
}

.scroll-top {
  position: fixed;
  opacity: 1;
  visibility: hidden;
  overflow: hidden;
  text-align: center;
  z-index: 1001;
  background-color: rgba(0,0,0,.4);
  color: #fff;
  width: 40px;
  height: 40px;
  line-height: 40px;
  right: 20px;
  bottom: -50px;
  padding-top: 2px;
  border-radius: 50%;
  border: none;
  -webkit-box-shadow: 0 0 4px 0 rgba(0,0,0,.1);
  box-shadow: 0 0 4px 0 rgba(0,0,0,.1);
  -webkit-transition: all .25s ease-in-out;
  transition: all .25s ease-in-out;

  &.is-show {
    opacity: 0.8;
    visibility: visible;
    cursor: pointer;
    bottom: 20px;
  }
}
</style>
