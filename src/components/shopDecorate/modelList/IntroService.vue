<template>
  <div class="intro" :id="data.id">
    <h3 class="title-box" v-if="data.options.title">
      {{ data.options.title }}
    </h3>
    <div class="col" :style="{flexDirection: data.options.position=='left'? 'row':'row-reverse'}">
      <div class="left">
        <div class="box">
          <div class="divider"/>
          <div class="box--title">{{ data.options.subtitle }}</div>
          <div class="box--desc">{{ data.options.desc }}</div>
        </div>
      </div>
      <div class="right">
        <div class="intro-wrapper">
          <div class="odd">
            <div class="item" :style="{
                               '--color': '#fff',
                               '--color-hover': i.color
                               }"
                 v-for="(i, idx) in data.options.list.filter((e,ex) => ex%2==0)" :key="idx"
                 @click="linkTo(i.link)"
            >
              <div class="item--icon"><img :src="i.icon"/></div>
              <div class="item--name">{{ i.name }}</div>
              <div class="item--divider"/>
              <div class="item--desc">{{ i.desc }}</div>
            </div>
          </div>
          <div class="even">
            <div class="item" :style="{
                               '--color': '#fff',
                               '--color-hover': i.color
                               }"
                 v-for="(i, idx) in data.options.list.filter((e,ex) => ex%2==1)" :key="idx"
                 @click="linkTo(i.link)"
            >
              <div class="item--icon"><img :src="i.icon"/></div>
              <div class="item--name">{{ i.name }}</div>
              <div class="item--divider"/>
              <div class="item--desc">{{ i.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IntroService",
  props: ['data'],
  methods: {
    linkTo(url) {
      if(url)
      this.$router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.intro {
  background-color: #fff;
  width: 1200px;
  padding: 10px 0px 30px 0px;
}

/deep/ .title-box {
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  text-align: center;
  margin-bottom: 50px;
}

/deep/ .col {
  display: flex;
  flex-wrap: wrap;

  .left {
    flex: 0 0 auto;
    width: 50%;

    .box {
      padding-top: 50px;
      padding-left: 20px;
      width: 100%;
      display: flex;
      flex-direction: column;

      .divider {
        width: 80px;
        height: 4px;
        background-color: #ff2d5b;
      }

      &--title {
        font-size: 36px;
        font-weight: 700;
        width: calc(100% - 10px);
      }

      &--desc {
        font-size: 16px;
        font-weight: 100;
        width: calc(100% - 30px);
      }
    }
  }

  .right {
    flex: 0 0 auto;
    width: 50%;

    .intro-wrapper {
      display: flex;

      .odd, .even {
        flex: 0 0 auto;
        width: 50%;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .item {
          position: relative;
          width: 100%;
          height: fit-content;
          margin-bottom: 20px;
          border-radius: 40px;
          padding: 20px;
          box-shadow: 0px 5px 12px 0 rgba(0, 0, 0, 0.1);
          background-color: var(--color);

          &:hover {
            transition: $common_transition_duration;
            background-color: var(--color-hover);
            color: #fff;
          }

          &--icon {
            position: absolute;
            top: 20px;
            left: 20px;

            img {
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 20px;
            }
          }

          &--name {
            font-size: 18px;
            font-weight: 700;
            margin-top: 85px;
          }

          &--divider {
            margin-top: 20px;
            width: 40px;
            height: 2px;
            background-color: #0c63e4;
          }

          &--desc {
            margin-top: 5px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }

      .even {
        margin-top: 100px;
      }
    }
  }
}
</style>
