<template>
  <div class="container">
    <div class="content">
      <NearbyStore/>
      <NearbyService/>
    </div>
    <BaseFooter/>
  </div>
</template>

<script>
import NavigationBar from "./index/NavigationBar.vue";
import NearbyStore from "./index/modelForm/template/NearbyStore.vue";
import NearbyService from "./index/modelForm/template/NearbyService.vue";

export default {
  name: "Nearby",
  components: {NearbyService, NearbyStore, NavigationBar}
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

  .content {
    width: 1200px;
    margin: auto;
  }
}
</style>
