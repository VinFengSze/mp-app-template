<script lang="ts" setup>
import { useTokenStore } from '@/store/token'
// import { safeAreaInsets } from '@/utils/systemInfo'
import { toLoginPage } from '@/utils/toLoginPage'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
  excludeLoginPath: false,
})

const workStatus = ref(true)

// 退出登录
function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清空用户信息
        useTokenStore().logout()
        // 执行退出登录逻辑
        uni.showToast({
          title: '退出登录成功',
          icon: 'success',
        })
        // 去登录页
        toLoginPage({ mode: 'reLaunch' })
      }
    },
  })
}
</script>

<template>
  <view class="me-page">
    <view class="me-container">
      <view class="avatar-content">
        <image class="avatar-bg" src="/static/images/me/me-avatar-bg.png" mode="scaleToFill" />
        <view class="avatar-circle">
          <image class="avatar" src="/static/images/me/avatar-default.png" mode="scaleToFill" />
        </view>
        <view class="userinfo-container">
          <view class="userinfo-name m-r-12rpx">
            张三
          </view>
          <view class="gap-line" />
          <view class="userinfo-phone">
            调度员
          </view>
        </view>
        <view class="current-team">
          <view class="team-label">
            当前班组：
          </view>
          <view class="team-name">
            调运1组
          </view>
        </view>
      </view>
      <view class="me-operator">
        <view class="operator-item">
          <image class="operator-icon" src="/static/images/me/operator_1.png" mode="scaleToFill" />
          <view class="operator-label__before">
            工作状态
          </view>
          <view class="operator-right">
            <view class="after-content">
              <wd-switch v-model="workStatus" active-color="#165DFF" size="32rpx" />
            </view>
          </view>
        </view>
        <view class="operator-item">
          <image class="operator-icon" src="/static/images/me/operator_2.png" mode="scaleToFill" />
          <view class="operator-label__before">
            账号
          </view>
          <view class="operator-right">
            <view class="after-content">
              <view class="after-label" @click="handleLogout">
                切换账号
              </view>
              <image class="after-arrow" src="/static/images/me/operator_arrow.png" mode="scaleToFill" />
            </view>
          </view>
        </view>
        <view class="operator-item">
          <image class="operator-icon" src="/static/images/me/operator_3.png" mode="scaleToFill" />
          <view class="operator-label__before">
            当前版本
          </view>
          <view class="operator-right">
            <view class="after-content">
              <view class="after-label label-version">
                1.1.0
              </view>
              <!-- <image class="after-arrow" src="/static/images/me/operator_arrow.png" mode="scaleToFill" /> -->
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="logout-btn-container" @click="handleLogout">
      退出登录
    </view>
  </view>
</template>

<style lang="scss" scoped>
.me-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.me-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
}
.avatar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 564rpx;
  width: 100%;
}
.avatar-bg {
  border-radius: 80rpx 80rpx 24rpx 24rpx;
  height: 564rpx;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
.avatar-circle {
  width: 160rpx;
  height: 160rpx;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 200rpx;
}
.userinfo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24rpx;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 32rpx;
  color: #163d5c;
}
.userinfo-name {
}
.current-team {
  display: flex;
  align-items: center;
  margin-top: 8rpx;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #27567c;
}
.gap-line {
  width: 2rpx;
  height: 24rpx;
  background: #5c89ac;
  margin-right: 12rpx;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.logout-btn-container {
  align-items: flex-end;
}
.me-operator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: -64rpx;
}
.operator-item {
  width: 702rpx;
  height: 128rpx;
  background: #ffffff;
  border-radius: 24rpx;
  backdrop-filter: blur(5px);
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
}
.operator-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
}
.operator-label__before {
  height: 40rpx;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #163d5c;
  line-height: 40rpx;
}
.operator-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.after-content {
  display: flex;
  align-items: center;
  height: 40rpx;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #163d5c;
  .after-label {
    margin-right: 16rpx;
  }
  .after-arrow {
    width: 24rpx;
    height: 24rpx;
  }
  .label-version {
    font-size: 28rpx;
    color: #5c89ac;
  }
}
.logout-btn-container {
  margin-top: 80rpx; /* 和上面内容拉开距离 */
  margin-bottom: 60rpx; /* 底部间距，适配安全区域 */
  width: calc(100% - 64rpx); /* 使用calc计算宽度，左右各留32rpx边距 */
  max-width: 702rpx; /* 最大宽度限制 */
  height: 80rpx;
  border-radius: 24rpx;
  border: 2rpx solid #165dff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 32rpx;
  color: #165dff;
  box-sizing: border-box;
  padding: 0 20rpx; /* 内边距，确保文字不贴边 */
}
</style>
