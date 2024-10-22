<template>
  <div class="pay-done">
    <div class="pay-done-box">
      <img src="../../assets/images/Order-success.svg" style="height: 530px">
    </div>
    <div class="pay-btn">
      <Button type="primary" @click="$router.push('/')">{{ $t('Back to home page') }}</Button>
      <Button type="info" v-if="type=='SERVICE'" @click="$router.push({name: 'MyBooking'})">{{ $t('View booking') }}</Button>
      <Button type="info" v-else @click="$router.push({name: 'MyOrder'})">{{ $t('View order') }}</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayDone',
  props: ['type'],
  mounted () {
    document.querySelector('.pay-done').style.height = window.innerHeight + 'px'
  }
};
</script>

<style scoped lang='scss'>
.pay-done-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pay-btn{
  width: 300px;
  margin: 0 auto;
  >*{
    margin:0 4px;
  }
}
</style>
