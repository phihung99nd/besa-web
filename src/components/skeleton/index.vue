<template>
  <div class="loading" :class="{smooth: smooth}" :style="wrapperStyles">
  </div>
</template>

<script>
/**
 * BS-skeleton loading component
 * @author: Tran Phi Hung
 * @property {string} width - Chiều dài của khối loading(%, px)
 * @property {string} height - Chiều cao của khối loading(%, px)
 * @property {string} borderRadius - Độ cong của khối loading(%, px)
 * @property {string} duration - Thời gian chạy hết animation(s, ms)
 * @property {string} delay - Animation-delay(s, ms)
 * @property {boolean} smooth - Hiệu ứng mượt/góc cạnh
 */
export default {
  name: "bs-skeleton",
  props: {
    width: {
      type: String,
      default: '1200'
    },
    height: {
      type: String,
      default: '300'
    },
    borderRadius: {
      type: String,
      default: '12'
    },
    duration: {
      type: String,
      default: '2'
    },
    delay: {
      type: String,
      default: '0'
    },
    smooth: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    wrapperStyles() {
      let width = this.width.includes('px') || this.width.includes('%') ? this.width : this.width + 'px'
      let height = this.height.includes('px') || this.height.includes('%') ? this.height : this.height + 'px'
      let borderRadius = this.borderRadius.includes('px') || this.borderRadius.includes('%') ? this.borderRadius : this.borderRadius + 'px'
      let duration = this.duration.includes('s') || this.duration.includes('ms') ? this.duration : this.duration + 's'
      let delay = this.delay.includes('s') || this.delay.includes('ms') ? this.delay : this.delay + 's'
      return {
        width, height, borderRadius, ['--duration']: duration, ['--delay']: delay
      }
    }
  }
}
</script>

<style scoped lang="scss">
.loading {
  position: relative;
  overflow: hidden;

  &::before {
    background-color: #dddddd;
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(226,226,226,1) 50%, rgba(235,235,235,1) 100%);
    animation: skeletonLoading var(--duration) infinite var(--delay);
  }

  &.smooth::after {
    background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(226,226,226,1) 25%, rgba(235,235,235,1) 70%, rgba(237,237,237,1) 85%, rgba(221,221,221,1) 100%);
  }

  @keyframes skeletonLoading {
    0% {
      left: -100%
    }
    100% {
      left: 100%
    }
  }
}
</style>
