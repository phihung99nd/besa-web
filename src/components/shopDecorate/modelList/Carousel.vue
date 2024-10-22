<template>
  <div class="model-carousel">
    <div class="nav-body clearfix">
      <div class="nav-content">
        <Carousel autoplay loop easing="ease" :autoplay-speed="5000">
          <CarouselItem v-for="(item, index) in data.options.list" :key="index">
            <div style="overflow: hidden">
              <img
                style="object-fit: cover"
                :src="item.img"
                @click="linkTo(item.url)"
                class="hover-pointer"
                width="1200"
                height="460"
              />
            </div>
          </CarouselItem>
        </Carousel>
<!--        <img v-for="(item,index) in data.options.list" :key="index" :src="item.img"/>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modelCarousel",
  props: ['data'],
}
</script>

<style lang="scss" scoped>
.model-carousel {
  width: 1200px;
  max-height: 600px;
  overflow: hidden;
}

.nav-body {
  width: 1200px;
  height: fit-content;
  margin: 0px auto;
}

.nav-content {
  width: 1200px;
  height: fit-content;
  overflow: hidden;
  float: left;
  position: relative;
}
</style>
