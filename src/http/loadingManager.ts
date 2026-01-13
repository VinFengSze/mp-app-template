import { t } from '@/locale'

/**
 * Loading管理器配置
 */
export interface LoadingManagerConfig {
  /** loading文本，默认使用国际化 */
  title?: string
  /** 是否显示遮罩层，默认true */
  mask?: boolean
  /** 是否启用调试日志，默认false */
  debug?: boolean
}

/**
 * 企业级Loading管理器
 *
 * 特性：
 * 1. 使用计数器管理并发请求
 * 2. 自动处理异常情况，确保计数器正确
 * 3. 提供重置和清理方法
 * 4. 支持配置化
 * 5. 类型安全
 */
class LoadingManager {
  private loadingCount = 0
  private isLoadingShown = false
  private config: Required<LoadingManagerConfig>

  constructor(config: LoadingManagerConfig = {}) {
    this.config = {
      title: config.title ?? t('http.loading'),
      mask: config.mask ?? true,
      debug: config.debug ?? false,
    }
  }

  /**
   * 显示loading
   * @returns 返回一个清理函数，用于在请求完成时调用
   */
  show(): () => void {
    this.loadingCount++
    this.log(`[LoadingManager] 请求开始，当前计数: ${this.loadingCount}`)

    if (!this.isLoadingShown) {
      this.isLoadingShown = true
      try {
        uni.showLoading({
          title: this.config.title,
          mask: this.config.mask,
        })
        this.log('[LoadingManager] Loading已显示')
      }
      catch (error) {
        console.error('[LoadingManager] 显示loading失败:', error)
        // 如果显示失败，重置状态
        this.isLoadingShown = false
        this.loadingCount = Math.max(0, this.loadingCount - 1)
      }
    }

    // 返回清理函数，确保在请求完成时调用
    return () => {
      this.hide()
    }
  }

  /**
   * 隐藏loading
   */
  hide(): void {
    if (this.loadingCount <= 0) {
      this.log('[LoadingManager] 警告: hide被调用但计数器已为0，可能存在重复调用')
      return
    }

    this.loadingCount--
    this.log(`[LoadingManager] 请求完成，当前计数: ${this.loadingCount}`)

    if (this.loadingCount <= 0) {
      this.loadingCount = 0 // 防止负数
      if (this.isLoadingShown) {
        try {
          uni.hideLoading()
          this.isLoadingShown = false
          this.log('[LoadingManager] Loading已隐藏')
        }
        catch (error) {
          console.error('[LoadingManager] 隐藏loading失败:', error)
          // 即使隐藏失败，也重置状态
          this.isLoadingShown = false
        }
      }
    }
  }

  /**
   * 强制重置loading状态（用于异常情况恢复）
   */
  reset(): void {
    this.log('[LoadingManager] 强制重置loading状态')
    this.loadingCount = 0
    if (this.isLoadingShown) {
      try {
        uni.hideLoading()
      }
      catch (error) {
        console.error('[LoadingManager] 重置时隐藏loading失败:', error)
      }
      this.isLoadingShown = false
    }
  }

  /**
   * 获取当前loading状态
   */
  getState() {
    return {
      loadingCount: this.loadingCount,
      isLoadingShown: this.isLoadingShown,
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<LoadingManagerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  /**
   * 调试日志
   */
  private log(message: string): void {
    if (this.config.debug) {
      console.log(message)
    }
  }
}

// 导出单例实例（企业级推荐：单例模式）
export const loadingManager = new LoadingManager()

// 也导出类，方便测试和自定义实例
export { LoadingManager }
