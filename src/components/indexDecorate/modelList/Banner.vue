<template>
  <div class="banner">
    <div class="banner-wrapper">
      <Row justify="space-between">
        <router-link v-for="(item, index) in data.options" :key="index" :to="item.url">
          <img class="banner-item"
               :src="item.img" alt="">
        </router-link>
      </Row>

    </div>
  </div>
</template>

<script>

export default {
  name: "banner",
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.banner {
  margin-bottom: 50px;

  .banner-item {
    border-radius: 16px;
    cursor: pointer;
    object-fit: cover;
    width: 390px;
    height: 150px;
    transition: all $common_transition_duration ease-in-out;

    &:hover {
      box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
    }
  }
}
</style>
