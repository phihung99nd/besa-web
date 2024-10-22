<template>
  <div class="flex flex-column" id="professor">
    <div class="width_1200" style="padding-top: 10px">
      <Breadcrumb>
        <BreadcrumbItem to="/">{{ $t('Home') }}</BreadcrumbItem>
        <BreadcrumbItem>{{ $t('Professor') }}</BreadcrumbItem>
      </Breadcrumb>
      <div class="flex flex-column mt-2 mb-2 professor-page" style="gap: 10px">
        <div class="flex search" style="gap: 10px">
<!--          <Select prefix="ios-pin" placeholder="Nhập tỉnh thành" style="width: 20%"/>-->
          <Input v-model="searchParams.keyword" clearable placeholder="Tìm kiếm theo tên" @keydown.enter.native="getList" style="width: 40%"/>
          <Button @click="getList">{{$t('Search')}}</Button>
        </div>
        <div class="flex">
          <div class="flex flex-column list">
            <div class="total mt-2 mb-2"><span>{{total}}</span> kết quả</div>
            <div class="title mt-2 mb-2 flex justify-content-between">
              <div>Chuyên gia hàng đầu</div>
              <div class="flex gap-2">
                <RadioGroup v-model="isGridList" type="button">
                  <Radio :label="false">
                    <Icon type="md-list"/>
                  </Radio>
                  <Radio :label="true">
                    <Icon type="md-grid"/>
                  </Radio>
                </RadioGroup>
<!--                <Select v-model="searchParams.sort" placeholder="Sắp xếp" clearable style="width: 150px">-->
<!--                  <Option value="keyword">Theo tên</Option>-->
<!--                  <Option value="2">Theo đánh giá</Option>-->
<!--                  <Option value="3">Theo số lượng đặt</Option>-->
<!--                </Select>-->
              </div>
            </div>
            <div class="flex prof-list-wrapper" :class="{'grid-layout': isGridList}" style="gap: 24px">
              <div class="flex prof-card" v-for="(item, index) in clerkList" :key="item.id">
                <img
                  :src="item.avatar || require('@/assets/images/default_avatar.jpg')"/>
                <div class="meta-info">
                  <div class="name">{{item.name}}</div>
                  <div class="position">{{item.position || 'Không có mô tả'}}</div>
                  <ul class="flex review">
                    <li class="rating">
                      <span>{{item.rating || 5}}</span>
                      <Rate allow-half disabled :value="item.rating || 5"/>
                    </li>
                    <li class="rating-num">
                      <span>{{item.commentNum || 0}}</span>
                      đánh giá
                    </li>
                  </ul>
                  <div class="store">
                    <div>
                      <Icon type="md-home"/>
                      {{item.storeName}}
                    </div>
                  </div>
<!--                  <div class="range">-->
<!--                    <Icon type="ios-pin"/>-->
<!--                    <span>1.2km</span>-->
<!--                  </div>-->
                </div>
                <div class="desc">
                  <div class="intro" v-if="item.intro" v-html="item.intro"/>
                  <Button type="primary" long :to="`expert/detail?id=${item.id}`">Xem chi tiết >></Button>
                </div>
              </div>
            </div>
            <div style="height: 20px"></div>
            <Page
              :total="total"
              :page-size="9"
              @on-change="changePageNum"
            />
          </div>
          <div class="flex flex-column filter-box">
            <div class="flex flex-column filter">
              <!--              <div class="filter-group" v-for="(group, index) in filterConfig" :key="index">-->
              <!--                <div class="title">{{ group.title }}</div>-->
              <!--                <template v-if="group.type == 'radio-list'">-->
              <!--                  <RadioGroup v-model="form[group.key]" vertical>-->
              <!--                    <Radio v-for="option in group.option" :key="option.label" :label="option.value">{{ option.label }}-->
              <!--                    </Radio>-->
              <!--                  </RadioGroup>-->
              <!--                </template>-->
              <!--                <template v-if="group.type == 'checkbox-list'">-->
              <!--                  <CheckboxGroup v-model="form[group.key]">-->
              <!--                    <Checkbox v-for="option in group.option" :key="option.label" :label="option.value">-->
              <!--                      {{ option.label }}-->
              <!--                    </Checkbox>-->
              <!--                  </CheckboxGroup>-->
              <!--                </template>-->
              <!--                <template v-if="group.type == 'slider'">-->
              <!--                  <Slider :tip-format="group.option.tipFormat" v-model="form[group.key]" :min="group.option.min"-->
              <!--                          :max="group.option.max"-->
              <!--                          :step="group.option.step" range></Slider>-->
              <!--                  <div class="flex align-item-center" style="gap: 8px">-->
              <!--                    <Input v-model="form[group.key][0]"/>-->
              <!--                    <div> -</div>-->
              <!--                    <Input v-model="form[group.key][1]"/>-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--                <template v-if="group.type == 'rate'">-->
              <!--                  <Rate v-model="form[group.key]" :allow-half="group.option.allowHalf"-->
              <!--                        :style="{fontSize: group.option.size}"/>-->
              <!--                </template>-->
              <!--              </div>-->
              <div class="filter-group">
                <div class="title">{{ $t('Category') }}</div>
                <div class="flex flex-column category-group">
                  <div class="flex align-item-center gap-2 category-item" :class="{selected: currentCate === index}" v-for="(item, index) in cateList"
                       :key="index" @click="handleSearchCategory(item,index)">
                    <img :src="parseMinioURL(item.image)" alt=""/>
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Introduce></Introduce>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import HorizontalNavbar from "@/components/nav/HorizontalNavbar.vue";
import Introduce from "@/components/footer/Introduce.vue";
import {filterConfig} from "@/pages/professor/filterConfig";
import PayDone from "@/pages/payment/PayDone.vue";
import {getCategory} from "@/api/goods";
import NavigationBar from "@/pages/index/NavigationBar.vue";
import {searchClerk} from "../../api/search";

export default {
  name: "Professor",
  components: {NavigationBar, PayDone, Introduce, HorizontalNavbar},
  data() {
    return {
      filterConfig,
      isGridList: false,
      searchParams: {
        keyword: '',
        categoryId: '',
        sort: 'name,DESC',
        page: 1,
        size: 9
      },
      currentCate: '',
      total: 0,
      cateList: [],
      clerkList: []
    }
  },
  created() {
    // this.filterConfig.forEach(group => {
    //   this.$set(this.form, group.key, group.default || '')
    // })
    this.initCategory()
    this.getList()
  },
  methods: {
    initCategory() {
      getCategory(0).then(res => {
        this.cateList = res.result
      })
    },
    getList() {
      let params = {
        ...this.searchParams,
        page: this.searchParams.page - 1
      }
      searchClerk(params).then(res => {
        this.clerkList = [...res.content]
        this.total = +res.totalElements
      })
    },
    changePageNum(val){
      this.searchParams.page = val;
      this.getList()
      document.getElementById("professor").scrollIntoView({behavior: "smooth"})
    },
    handleSearchCategory(item, index){
      if(this.currentCate === index) {
        this.searchParams.categoryId = ''
        this.currentCate = ''
      } else {
        this.searchParams.categoryId = item.id
        this.currentCate = index
      }
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
@import "professor";
</style>
