<route lang="json5">
{
  style: { navigationBarTitleText: '我的' },
}
</route>
<template>
  <view class="main-top m-4">
    <wd-img :width="73" :height="73" round src="https://www.layui-vue.com/assets/logo-C6qhPaYZ.jpg" />
    <view class="user-info">
      <view class="nickname" @click="handleLogin">{{ isLoggedIn ? nickname : '点击登录' }}</view>
      <view class="welcome" v-if="isLoggedIn">欢迎您使用小程序</view>
    </view>
  </view>
  <view class="main-zjk">
    <wd-card title="常用功能">
      <wd-grid bg-color="" :column="4">
        <wd-grid-item v-for="(item, index) in commonFunctions" :key="index" :icon="item.icon" :text="item.text" />
      </wd-grid>
    </wd-card>
    <wd-card title="经营分析">
      <wd-grid bg-color="" :column="4">
        <wd-grid-item v-for="(item, index) in businessAnalysis" :key="index" :icon="item.icon" :text="item.text" />
      </wd-grid>
    </wd-card>
  </view>
  <view class="m-4"> 
    <wd-swiper :list="swiperList" autoplay v-model:current="current" :indicator="{ type: 'dots-bar' }" @click="handleClick" @change="onChange"></wd-swiper>
  </view>
  <view class="m-4">
    <wd-cell-group border @click="checkLogin">
      <wd-cell size="large" title="标题文字" icon="setting" is-link to="/pages/index/index">
        <view class="custom-text"></view>
      </wd-cell>
      <wd-cell title="标题文字" icon="setting" is-link to="/pages/index/index">
        <view class="custom-text"></view>
      </wd-cell>
      <wd-cell title="标题文字" icon="setting" is-link to="/pages/index/index">
        <view class="custom-text"></view>
      </wd-cell>
      <wd-cell title="标题文字" icon="setting" is-link to="/pages/index/index">
        <view class="custom-text"></view>
      </wd-cell>
      <wd-cell title="标题文字" icon="setting" is-link to="/pages/index/index">
        <view class="custom-text"></view>
      </wd-cell>
    </wd-cell-group>
  </view>
  <button class="bt-loginout" v-if="isLoggedIn" @click="loginout">退出登录</button>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
import { http } from '@/utils/http'
import WxLogin from './components/wx-login.vue'

const userStore = useUserStore()
const openId = ref('')
const nickname = ref('用户昵称')
const isLoggedIn = ref(false)
const commonFunctions = ref([])
const businessAnalysis = ref([])

// 模拟数据
const mockData = {
  commonFunctions: [
    { icon: 'picture', text: '在线简历' },
    { icon: 'picture', text: '附件简历' },
    { icon: 'picture', text: '求职意向' },
    { icon: 'picture', text: '我的道具' }
  ],
  businessAnalysis: [
    { icon: 'picture', text: '面试刷题' },
    { icon: 'picture', text: '简历刷新' },
    { icon: 'picture', text: '简历制作' },
    { icon: 'picture', text: '求职工具' },
    { icon: 'picture', text: '我的订单' },
    { icon: 'picture', text: '实名认证' },
    { icon: 'picture', text: '账号安全' },
    { icon: 'picture', text: '基本信息' },
    { icon: 'picture', text: '联系我们' },
    { icon: 'picture', text: '退出登录' }
  ]
}

// 模拟数据加载
commonFunctions.value = mockData.commonFunctions
businessAnalysis.value = mockData.businessAnalysis

const current = ref<number>(0)

const swiperList = ref([
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/redpanda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg'
])
function handleClick(e) {
  console.log(e)
}
function onChange(e) {
  console.log(e)
}

function handleLogin() {
  if (!isLoggedIn.value) {
    // 模拟登录
    nickname.value = '用户昵称' // 设置用户昵称
    isLoggedIn.value = true // 设置登录状态
  }
}
function loginout() {
  isLoggedIn.value = false
  nickname.value = '点击登录'
  // commonFunctions.value = []
  // businessAnalysis.value = []
}
function checkLogin() {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
  }
}
// 用户登录，获取openId
uni.login({
  provider: 'weixin',
  success: async ({ code }) => {
    const res = await http<{ session_key: string; openid: string }>({
      method: 'GET',
      url: '/weixin/jscode2session',
      data: {
        code,
      },
    })
    console.log('微信登录-1：', res)
    // {code: 0, msg: "success", data: {session_key: "JTzhLVK+oM3X58uJ/heDcQ==", openid: "oSYa06xPVqjsK-eFYzt0kSPYu1q4"}}
    openId.value = res.data.openid
    userStore.setUserInfo({ openid: res.data.openid })
  },
})
</script>
<style>
body {
  background-color: #f5f5f6;
}

.main-top {
  display: flex;
  align-items: center;
  padding: 20px;
}

.user-info {
  margin-left: 37px;
}

.nickname {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.welcome {
  font-size: 14px;
  color: #888;
}

.main-zjk {
  :deep(.wd-card__title) {
    /* color: red !important; */
    font-weight: bold;
  }
}

.bt-loginout {
  background-color: #f5f5f6;
  color: black;
  border: 1px solid rgb(218, 218, 218);
  margin: 0 15px;
}
</style>
