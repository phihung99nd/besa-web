<template>
  <div class="model-carousel">
    <img
      style="display: block"
      :src="data.options.list[0].img"
      @click="linkTo(data.options.list[0].url)"
      width="1200"
      alt=""
    />
    <ul class="advert-list">
      <template v-for="(item, index) in data.options.list">
        <li
          v-if="index !== 0"
          @click="linkTo(item.url)"
          :key="index"
        >
          <img :src="item.img" width="230" height="190" alt=""/>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AdsCluster",
  props: ['data'],
  methods: {
    linkTo(url) {
      if(url) {
        this.$router.push(url)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.advert-list {
  background: $accent_color;
  height: 200px;
  display: flex;
  justify-content: space-around;
  padding: 3px 10px;

  > li {
    img {
      cursor: pointer;
      border-radius: 10px;
      transition: all 150ms ease-in-out;

      &:hover {
        transform: translateY(-3px);
        box-shadow: rgba(0, 0, 0, 0.4) 0px 5px 20px 0px;
      }
    }
  }
}
</style>
