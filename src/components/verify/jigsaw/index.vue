<template>
  <div style="position: relative;">
    <div
      v-if="type === '2'"
      class="verify-img-out"
      :style="{height: (parseInt(setSize.imgHeight) + vSpace) + 'px'}"
    >
      <div
        class="verify-img-panel"
        :style="{width: setSize.imgWidth,
                 height: setSize.imgHeight,}"
      >
        <img :src="backImgBase?('data:image/png;base64,'+backImgBase):defaultImg" alt=""
             style="width:100%;height:100%;display:block">
        <div v-show="showRefresh" class="verify-refresh" @click="refresh"><i class="iconfont icon-refresh"/>
        </div>
        <transition name="tips">
          <span v-if="tipWords" class="verify-tips" :class="passFlag ?'suc-bg':'err-bg'">{{ tipWords }}</span>
        </transition>
      </div>
    </div>
    <div
      class="verify-bar-area"
      :style="{width: setSize.imgWidth,
               height: barSize.height,
               'line-height':barSize.height}"
    >
      <span class="verify-msg" v-text="text"/>
      <div
        class="verify-left-bar"
        :style="{width: (leftBarWidth!==undefined)?leftBarWidth: barSize.height, height: barSize.height, 'border-color': leftBarBorderColor, transaction: transitionWidth}"
      >
        <span class="verify-msg" v-text="finishText"/>
        <div
          class="verify-move-block"
          :style="{width: barSize.height, height: barSize.height, 'background-color': moveBlockBackgroundColor, left: moveBlockLeft, transition: transitionLeft}"
          @touchstart="start"
          @mousedown="start"
        >
          <i
            :class="['verify-icon iconfont', iconClass]"
            :style="{color: iconColor}"
          />
          <div
            v-if="type === '2'"
            class="verify-sub-block"
            :style="{'width':Math.floor(parseInt(setSize.imgWidth)*47/310)+ 'px',
                     'height': setSize.imgHeight,
                     'top':'-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
                     'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
            }"
          >
            <img :src="'data:image/png;base64,'+blockBackImgBase" alt="" style="width:100%;height:100%;display:block">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">

import {resetSize} from '../utils'
import {getCaptcha, verifyCaptcha} from '@/api/common'
import {getStore} from "@/plugins/storage";

//  "captchaType":"jigsaw",
export default {
  name: 'Jigsaw',
  props: {
    captchaType: {
      type: String,
    },
    type: {
      type: String,
      default: '1'
    },
    mode: {
      type: String,
      default: 'fixed'
    },
    vSpace: {
      type: Number,
      default: 5
    },
    explain: {
      type: String,
      default: 'Drag the slider to unlock'
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '155px'
        }
      }
    },
    blockSize: {
      type: Object,
      default() {
        return {
          width: '50px',
          height: '50px'
        }
      }
    },
    barSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '40px'
        }
      }
    },
    defaultImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      passFlag: '', // whether to pass the mark
      backImgBase: '', // Captcha background image
      blockBackImgBase: '', // background image for validation slider
      startMoveTime: '', // time the move started
      endMovetime: '', // time the move ended
      tipsBackColor: '', // The background color of the prompt word
      tipWords: '',
      text: '',
      finishText: '',
      setSize: {
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0
      },
      top: 0,
      left: 0,
      moveBlockLeft: undefined,
      leftBarWidth: undefined,
      // style on the move
      moveBlockBackgroundColor: undefined,
      leftBarBorderColor: '#ddd',
      iconColor: undefined,
      iconClass: 'icon-right',
      status: false, // mouse state
      isEnd: false,
      showRefresh: true,
      transitionLeft: '',
      transitionWidth: ''
    }
  },
  computed: {
    barArea() {
      return this.$el.querySelector('.verify-bar-area')
    },
    resetSize() {
      return resetSize
    }
  },
  watch: {
    // If the type changes, it will be fully refreshed
    type: {
      immediate: true,
      handler() {
        this.init()
      }
    }
  },
  mounted() {
    // no dragging
    this.$el.onselectstart = function () {
      return false
    }
  },
  methods: {
    init() {
      this.text = this.explain
      this.getPicture()
      this.$nextTick(() => {
        const setSize = this.resetSize(this)	// reset width height
        for (const key in setSize) {
          this.$set(this.setSize, key, setSize[key])
        }
        this.$parent.$emit('ready', this)
      })

      const _this = this

      window.removeEventListener('touchmove', function (e) {
        _this.move(e)
      })
      window.removeEventListener('mousemove', function (e) {
        _this.move(e)
      })

      // mouse release
      window.removeEventListener('touchend', function () {
        _this.end()
      })
      window.removeEventListener('mouseup', function () {
        _this.end()
      })

      window.addEventListener('touchmove', function (e) {
        _this.move(e)
      })
      window.addEventListener('mousemove', function (e) {
        _this.move(e)
      })

      // mouse release
      window.addEventListener('touchend', function () {
        _this.end()
      })
      window.addEventListener('mouseup', function () {
        _this.end()
      })
    },

    start: function (e) {
      let x
      e = e || window.event
      if (!e.touches) { // compatible with pc
        x = e.clientX
      } else { // compatible with mobile
        x = e.touches[0].pageX
      }
      this.startLeft = Math.floor(x - this.barArea.getBoundingClientRect().left)
      this.startMoveTime = +new Date() // time to start sliding
      if (this.isEnd === false) {
        this.text = ''
        this.moveBlockBackgroundColor = '#337ab7'
        this.leftBarBorderColor = '#337AB7'
        this.iconColor = '#fff'
        e.stopPropagation()
        this.status = true
      }
    },
    // mouse movement
    move: function (e) {
      let x
      e = e || window.event
      if (this.status && this.isEnd === false) {
        if (!e.touches) { // compatible with pc
          x = e.clientX
        } else { // compatible with mobile
          x = e.touches[0].pageX
        }
        const bar_area_left = this.barArea.getBoundingClientRect().left
        let move_block_left = x - bar_area_left  // The left value of the small square relative to the parent element
        if (move_block_left >= this.barArea.offsetWidth - parseInt(parseInt(this.blockSize.width) / 2) - 2) {
          move_block_left = this.barArea.offsetWidth - parseInt(parseInt(this.blockSize.width) / 2) - 2
        }
        if (move_block_left <= 0) {
          move_block_left = parseInt(parseInt(this.blockSize.width) / 2)
        }
        // the left value of the small square after dragging
        this.moveBlockLeft = (move_block_left - this.startLeft) + 'px'
        this.leftBarWidth = (move_block_left - this.startLeft) + 'px'
      }
    },

    // mouse release
    end: function () {
      this.endMovetime = +new Date()
      const _this = this
      // judging whether to overlap
      if (this.status && this.isEnd === false) {
        let moveLeftDistance = parseInt((this.moveBlockLeft || '').replace('px', ''));
        moveLeftDistance = moveLeftDistance * 310 / parseInt(this.setSize.imgWidth);
        let uuid = getStore("uuid");
        const data = {
          type: this.captchaType,
          uuid,
          coordinate: {x: moveLeftDistance, y: 5.0}
        }
        verifyCaptcha(data).then(res => {
          if (res.success) {
            this.moveBlockBackgroundColor = '#5cb85c'
            this.leftBarBorderColor = '#5cb85c'
            this.iconColor = '#fff'
            this.iconClass = 'icon-check'
            this.showRefresh = false
            this.isEnd = true
            if (this.mode === 'pop') {
              setTimeout(() => {
                this.$parent.clickShow = false
                this.refresh()
              }, 1500)
            }
            this.passFlag = true
            this.tipWords = `${((this.endMovetime - this.startMoveTime) / 1000).toFixed(2)}s verified successfully`
            setTimeout(() => {
              this.tipWords = ''
              this.$parent.closeBox()
              this.$parent.$emit('success', {})
            }, 1000)
          } else {
            this.moveBlockBackgroundColor = '#d9534f'
            this.leftBarBorderColor = '#d9534f'
            this.iconColor = '#fff'
            this.iconClass = 'icon-close'
            this.passFlag = false
            setTimeout(function () {
              _this.refresh()
            }, 1000)
            this.$parent.$emit('error', this)
            this.tipWords = 'Verification failed'
            setTimeout(() => {
              this.tipWords = ''
            }, 1000)
          }
        }).catch(err => {
          this.moveBlockBackgroundColor = '#d9534f'
          this.leftBarBorderColor = '#d9534f'
          this.iconColor = '#fff'
          this.iconClass = 'icon-close'
          this.passFlag = false
          setTimeout(function () {
            _this.refresh()
          }, 1000)
          this.$parent.$emit('error', this)
          this.tipWords = 'Verification failed'
          setTimeout(() => {
            this.tipWords = ''
          }, 1000)
        })
        this.status = false
      }
    },

    refresh: function () {
      this.showRefresh = true
      this.finishText = ''

      this.transitionLeft = 'left .3s'
      this.moveBlockLeft = 0

      this.leftBarWidth = undefined
      this.transitionWidth = 'width .3s'

      this.leftBarBorderColor = '#ddd'
      this.moveBlockBackgroundColor = '#fff'
      this.iconColor = '#000'
      this.iconClass = 'icon-right'
      this.isEnd = false

      this.getPicture()
      setTimeout(() => {
        this.transitionWidth = ''
        this.transitionLeft = ''
        this.text = this.explain
      }, 300)
    },

    // request a background image and verification image
    getPicture() {
      const data = {
        captchaType: this.captchaType,
      }
      getCaptcha(data).then(res => {
        if (res.success) {
          this.backImgBase = res.result.originalImage
          this.blockBackImgBase = res.result.jigsawImage
        } else {
          this.tipWords = res.message
        }
      })
    },
  },
}
</script>

