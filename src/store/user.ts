import type { UserInfo } from '@/api/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserInfo,
} from '@/api/login'

const defaultAvatar = '/static/images/default-avatar.png'
// 初始化状态
const userInfoState: UserInfo = {
  userId: '',
  userName: '',
  deptId: '',
  deptName: '',
  companyId: '',
  companyName: '',
  admin: false,
  sex: '',
  phone: '',
  email: '',
  avatar: defaultAvatar,
  depts: [],
  permissions: [],
  rolesList: [],

}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<UserInfo>({ ...userInfoState })
    // 设置用户信息
    const setUserInfo = (val: UserInfo) => {
      userInfo.value = {
        userId: val.userId,
        userName: val.userName,
        deptId: val.deptId || '',
        deptName: val.deptName || '',
        companyId: val.companyId || '',
        companyName: val.companyName || '',
        admin: val.admin || false,
        sex: val.sex || '',
        phone: val.phone || '',
        email: val.email || '',
        avatar: val.avatar || defaultAvatar,
        depts: val.depts || [],
        permissions: val.permissions || [],
        roles: val.roles || [],
        rolesList: val.rolesList || [],
      }
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
    }
    // 删除用户信息
    const clearUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('user')
    }

    /**
     * 获取用户信息
     */
    const fetchUserInfo = async () => {
      const res = await getUserInfo()
      const { sysUser, permissions, roles, rolesList, depts } = res.data
      setUserInfo({ ...sysUser, permissions, roles, rolesList, depts })
      return res
    }

    return {
      userInfo,
      clearUserInfo,
      fetchUserInfo,
      setUserInfo,
      setUserAvatar,
    }
  },
  {
    persist: true,
  },
)
