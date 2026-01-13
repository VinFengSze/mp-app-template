<script lang="ts" setup>
import { useTokenStore } from '@/store/token'
import { tabbarList } from '@/tabbar/config'
import { isPageTabbar } from '@/tabbar/store'
import { ensureDecodeURIComponent, parseUrlToObj } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const tokenStore = useTokenStore()
const showPassword = ref(false)
const isLoading = ref(false)
const redirectUrl = ref('')

/** 当前聚焦 & 错误字段 */
const activeField = ref<'username' | 'password' | ''>('')
const errorField = ref<'username' | 'password' | ''>('')

const loginForm = reactive({
  username: '',
  password: '',
})

const hasInput = computed(() =>
  loginForm.username.trim() !== ''
  && loginForm.password.trim() !== '',
)

const canSubmit = computed(() =>
  hasInput.value && !isLoading.value,
)

onLoad((options) => {
  redirectUrl.value = options?.redirect
    ? ensureDecodeURIComponent(options.redirect)
    : tabbarList[0].pagePath
})

function setFieldError(field: 'username' | 'password', msg: string) {
  errorField.value = field
  activeField.value = field
}

function passwordModeChange() {
  showPassword.value = !showPassword.value
}

async function handleGetPhoneNumber(e: any) {
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({ icon: 'none', title: '获取手机号失败' })
    return
  }

  try {
    await tokenStore.wxPhoneLogin(e.detail.encryptedData, e.detail.iv)
    loginSuccess()
  }
  catch (err: any) {
    uni.showToast({
      icon: 'none',
      duration: 3000,
      title: err?.msg || '登录失败，请重试',
    })
  }
  finally {
    console.log('微信手机号一键登录')
  }
}

async function doLogin() {
  if (tokenStore.hasLogin)
    return

  if (!loginForm.username.trim()) {
    setFieldError('username', '请输入用户名')
    return
  }

  if (!loginForm.password.trim()) {
    setFieldError('password', '请输入密码')
    return
  }

  if (!canSubmit.value)
    return

  try {
    isLoading.value = true
    await tokenStore.login({ ...loginForm })
    loginSuccess()
  }
  catch (err: any) {
    uni.showToast({
      icon: 'none',
      duration: 3000,
      title: err?.msg || '登录失败，请重试',
    })
    setFieldError('password', '用户名或密码错误')
    return
  }
  finally {
    isLoading.value = false
  }
}
function loginSuccess() {
  let targetUrl = redirectUrl.value || tabbarList[0].pagePath

  // 1️⃣ 防止重定向回登录页
  if (targetUrl.includes('/login')) {
    targetUrl = tabbarList[0].pagePath
  }

  const path = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`
  const { path: pagePath } = parseUrlToObj(path)

  // 2️⃣ tabbar 页面只能 switchTab
  if (isPageTabbar(pagePath)) {
    uni.switchTab({ url: path })
    return
  }

  // 3️⃣ 非 tabbar 用 reLaunch，避免栈污染
  uni.reLaunch({ url: path })
}
</script>

<template>
  <view class="page-login">
    <image class="login-bg" src="/static/images/login/login_bg.png" mode="aspectFill" />

    <view class="page-content">
      <!-- Logo -->
      <view class="logo-container">
        <image class="logo-img" src="/static/images/login/logo.png" />
        <view class="logo-text">
          徐工汉云app小程序模版
        </view>
      </view>

      <!-- 表单 -->
      <wd-form :model="loginForm" class="logo-form">
        <!-- 用户名 -->
        <view
          class="form-item"
          :class="{ active: activeField === 'username', error: errorField === 'username' }"
        >
          <image
            class="item-img"
            :src="
              errorField === 'username'
                ? '/static/images/login/user-error.png'
                : activeField === 'username'
                  ? '/static/images/login/user-active.png'
                  : '/static/images/login/user.png'
            "
          />
          <wd-input
            v-model="loginForm.username"
            no-border
            :clearable="false"
            placeholder="请输入用户名"
            @focus="activeField = 'username'"
            @blur="activeField = ''"
            @input="errorField === 'username' && (errorField = '')"
          />
        </view>

        <!-- 密码 -->
        <view
          class="form-item"
          :class="{ active: activeField === 'password', error: errorField === 'password' }"
        >
          <image
            class="item-img"
            :src="
              errorField === 'password'
                ? '/static/images/login/password-error.png'
                : activeField === 'password'
                  ? '/static/images/login/password-active.png'
                  : '/static/images/login/password.png'
            "
          />
          <wd-input
            v-model="loginForm.password"
            no-border
            :clearable="false"
            placeholder="请输入密码"
            :show-password="!showPassword"
            @focus="activeField = 'password'"
            @blur="activeField = ''"
            @input="errorField === 'password' && (errorField = '')"
          >
            <template #suffix>
              <view class="show-password-icon" @tap.stop="passwordModeChange">
                <image
                  :src="showPassword
                    ? '/static/images/login/show-password.png'
                    : '/static/images/login/hide-password.png'"
                  style="width:32rpx;height:32rpx"
                />
              </view>
            </template>
          </wd-input>
        </view>
      </wd-form>

      <!-- 登录按钮 -->
      <wd-button
        class="login-btn"
        :loading="isLoading"
        :disabled="!canSubmit"
        :class="{ disabled: !canSubmit }"
        @click="doLogin"
      >
        登录
      </wd-button>
      <!-- #ifdef MP-WEIXIN -->
      <!-- 微信登录 -->
      <view class="wx-login">
        <view class="wx-login-text">
          第三方登录
        </view>
        <button
          class="wx-phone-login-btn"
          open-type="getPhoneNumber"
          @getphonenumber="handleGetPhoneNumber"
        >
          <image class="wx-login-img" src="/static/images/login/weixin-login-logo.png" />
        </button>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

  <style lang="scss" scoped>
  :deep(.wd-input__icon) {
  display: none !important;
}
:deep(.wd-input) {
  width: 100%;
  text-align: left !important;
}

:deep(.wd-input::after) {
  height: 0 !important;
}

.page-login {
  position: relative;
  width: 100%;
  height: 100vh;

  .login-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .page-content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 176rpx;
    width: 702rpx;
    padding: 64rpx 48rpx;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 24rpx;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.logo-container {
  margin-bottom: 90rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo-img {
    width: 184rpx;
    height: 122rpx;
  }

  .logo-text {
    font-size: 56rpx;
    color: #163d5c;
  }
}

.logo-form {
  width: 100%;

  .form-item {
    display: flex;
    align-items: center;
    height: 96rpx;
    margin-bottom: 48rpx;
    padding: 0 24rpx;
    border-radius: 48rpx;
    background: #fff;
    border: 2rpx solid #d9e3f0;

    &.error {
      border-color: #ff4d4f;
    }

    &.active:not(.error) {
      border-color: #165dff;
    }

    .item-img {
      width: 32rpx;
      height: 32rpx;
      margin-right: 40rpx;
    }
  }
}

.login-btn {
  width: 606rpx;
  height: 96rpx !important;
  background: #165dff !important;
  border-radius: 48rpx;

  &.disabled {
    background: rgba(23, 119, 255, 0.7) !important;
  }
}

.wx-login {
  margin-top: 96rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .wx-login-text {
    margin-bottom: 32rpx;
    font-size: 28rpx;
    color: #5c89ac;
  }

  .wx-phone-login-btn {
    width: 116rpx;
    height: 116rpx;
    padding: 0;
    background: none;
    border: none;
  }

  .wx-phone-login-btn::after {
    border: none;
  }

  .wx-login-img {
    width: 96rpx;
    height: 96rpx;
  }
}
</style>
