<template>
  <router-link :to="data.options.url" style="width: 100%; text-align: center;">
    <img
      width="1200"
      class="hover-pointer long-img"
      v-lazy="data.options.img"
      alt=""
    />
  </router-link>
</template>

<script>
export default {
  name: "LongBanner",
  props: ['data']
}
</script>

<style scoped lang="scss">
.long-img {
  border-radius: 12px;
  overflow: hidden;
  max-height: 300px;
  object-fit: cover;
}
</style>
