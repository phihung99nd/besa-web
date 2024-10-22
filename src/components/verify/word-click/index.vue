<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div
        class="verify-img-panel"
        :style="{'width': setSize.imgWidth,
                 'height': setSize.imgHeight,
                 'background-size' : setSize.imgWidth + ' '+ setSize.imgHeight,
                 'margin-bottom': vSpace + 'px'}"
      >
        <div v-show="showRefresh" class="verify-refresh" style="z-index:3" @click="refresh">
          <i class="iconfont icon-refresh"/>
        </div>
        <img
          ref="canvas"
          :src="pointBackImgBase?('data:image/png;base64,'+pointBackImgBase):defaultImg"
          alt=""
          style="width:100%;height:100%;display:block"
          @click="bindingClick?canvasClick($event):undefined"
        >

        <div
          v-for="(tempPoint, index) in tempPoints"
          :key="index"
          class="point-area"
          :style="{
            'background-color':'#1abd6c',
            color:'#fff',
            'z-index':9999,
            width:'20px',
            height:'20px',
            'text-align':'center',
            'line-height':'20px',
            'border-radius': '50%',
            position:'absolute',
            top:parseInt(tempPoint.y-10) + 'px',
            left:parseInt(tempPoint.x-10) + 'px'
          }"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <!-- 'height': this.barSize.height, -->
    <div
      class="verify-bar-area"
      :style="{'width': setSize.imgWidth,
               'color': this.barAreaColor,
               'border-color': this.barAreaBorderColor,
               'line-height':this.barSize.height}"
    >
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>
<script type="text/babel">

import {resetSize} from '../utils'
import {getCaptcha, verifyCaptcha} from "@/api/common";
import {getStore} from "@/plugins/storage";

export default {
  name: 'WordClick',
  props: {
    // pop-up: pop, fixed: fixed
    mode: {
      type: String,
      default: 'fixed'
    },
    captchaType: {
      type: String,
    },
    // spacing
    vSpace: {
      type: Number,
      default: 5
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
      checkNum: 3, // The number of words that need to be clicked by default
      fontPos: [], // selected coordinate information
      checkPosArr: [], // The coordinates of the user's click
      num: 1, // click count
      pointBackImgBase: '', // the background image obtained by the backend
      poinTextList: [], // the click font order returned by the backend
      setSize: {
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0
      },
      tempPoints: [],
      text: '',
      barAreaColor: undefined,
      barAreaBorderColor: undefined,
      showRefresh: true,
      bindingClick: true
    }
  },
  computed: {
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
      // load page
      this.fontPos.splice(0, this.fontPos.length)
      this.checkPosArr.splice(0, this.checkPosArr.length)
      this.num = 1
      this.getPicture()
      this.$nextTick(() => {
        this.setSize = this.resetSize(this)	// reset width height
        this.$parent.$emit('ready', this)
      })
    },
    canvasClick(e) {
      this.checkPosArr.push(this.getMousePos(this.$refs.canvas, e))
      if (this.num === this.checkNum) {
        this.num = this.createPoint(this.getMousePos(this.$refs.canvas, e))
        // transform coordinate values proportionally
        this.checkPosArr = this.pointTransfrom(this.checkPosArr, this.setSize)
        // Wait until the creation of coordinates is completed
        setTimeout(() => {
          // var flag = this.comparePos(this.fontPos, this.checkPosArr);
          let uuid = getStore("uuid");
          const data = {
            type: this.captchaType,
            coordinates: this.checkPosArr,
            uuid
          }
          verifyCaptcha(data).then(res => {
            if (res.success) {
              this.barAreaColor = '#4cae4c'
              this.barAreaBorderColor = '#5cb85c'
              this.text = 'Verification successful'
              this.bindingClick = false
              if (this.mode === 'pop') {
                setTimeout(() => {
                  this.$parent.clickShow = false
                  this.refresh()
                }, 1500)
              }
              this.$parent.$emit('success', {})
            } else {
              this.$parent.$emit('error', this)
              this.barAreaColor = '#d9534f'
              this.barAreaBorderColor = '#d9534f'
              this.text = 'Verification failed'
              setTimeout(() => {
                this.refresh()
              }, 700)
            }
          })
        }, 400)
      }
      if (this.num < this.checkNum) {
        this.num = this.createPoint(this.getMousePos(this.$refs.canvas, e))
      }
    },

    // get coordinates
    getMousePos: function (obj, e) {
      const x = e.offsetX
      const y = e.offsetY
      return {x, y}
    },
    // Create coordinate points
    createPoint: function (pos) {
      this.tempPoints.push(Object.assign({}, pos))
      return ++this.num
    },
    refresh: function () {
      this.tempPoints.splice(0, this.tempPoints.length)
      this.barAreaColor = '#000'
      this.barAreaBorderColor = '#ddd'
      this.bindingClick = true
      this.fontPos.splice(0, this.fontPos.length)
      this.checkPosArr.splice(0, this.checkPosArr.length)
      this.num = 1
      this.getPicture()
      this.showRefresh = true
    },

    // request a background image and verification image
    getPicture() {
      const data = {
        captchaType: this.captchaType,
      }
      getCaptcha(data).then(res => {
        if (res.success) {
          this.pointBackImgBase = res.result.wordClickImage;
          this.poinTextList = res.result.words;
          this.checkNum = res.result.wordsCount;
          this.text = 'Please click [' + this.poinTextList.join(',') + ']'
        } else {
          this.text = res.message
        }
      })
    },
    // coordinate conversion function
    pointTransfrom(pointArr, imgSize) {
      const newPointArr = pointArr.map(p => {
        const x = Math.round(310 * p.x / parseInt(imgSize.imgWidth))
        const y = Math.round(155 * p.y / parseInt(imgSize.imgHeight))
        return {x, y}
      })
      // console.log(newPointArr,"newPointArr");
      return newPointArr
    }
  },
}
</script>
