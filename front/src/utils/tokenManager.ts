/**
 * Token管理工具
 * 负责JWT token的存储、解析、验证和过期管理
 */

const TOKEN_KEY = "property_mgmt_token";
const TOKEN_EXPIRY_KEY = "property_mgmt_token_expiry";
const USER_INFO_KEY = "property_mgmt_user_info";
const REFRESH_THRESHOLD = 15 * 60 * 1000; // 15分钟，提前刷新

export interface TokenPayload {
  sub: string; // username
  roles: string[];
  iat: number; // issued at
  exp: number; // expiration
}

export interface UserInfo {
  username: string;
  displayName: string;
  roles: string[];
}

/**
 * 解码JWT token（不验证签名，仅解析）
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

/**
 * 检查token是否过期
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;

  // exp是秒级时间戳，需要转换为毫秒
  const expiryTime = payload.exp * 1000;
  return Date.now() >= expiryTime;
}

/**
 * 检查token是否即将过期（15分钟内）
 */
export function isTokenExpiringSoon(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;

  const expiryTime = payload.exp * 1000;
  return Date.now() >= expiryTime - REFRESH_THRESHOLD;
}

/**
 * 获取token剩余有效时间（毫秒）
 */
export function getTokenRemainingTime(token: string): number {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return 0;

  const expiryTime = payload.exp * 1000;
  const remaining = expiryTime - Date.now();
  return Math.max(0, remaining);
}

/**
 * 存储token和用户信息
 */
export function saveToken(token: string, userInfo: UserInfo): void {
  try {
    // 存储token
    localStorage.setItem(TOKEN_KEY, token);

    // 解析并存储过期时间
    const payload = decodeToken(token);
    if (payload?.exp) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(payload.exp * 1000));
    }

    // 存储用户信息
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error("Failed to save token:", error);
  }
}

/**
 * 获取存储的token
 */
export function getToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    // 检查是否过期
    if (isTokenExpired(token)) {
      clearAuth();
      return null;
    }

    return token;
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
}

/**
 * 获取用户信息
 */
export function getUserInfo(): UserInfo | null {
  try {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);
    if (!userInfoStr) return null;

    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error("Failed to get user info:", error);
    return null;
  }
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(USER_INFO_KEY);
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return token !== null && !isTokenExpired(token);
}

/**
 * 获取token过期时间戳
 */
export function getTokenExpiry(): number | null {
  try {
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiryStr ? Number(expiryStr) : null;
  } catch (error) {
    return null;
  }
}

/**
 * 格式化剩余时间
 */
export function formatRemainingTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟`;
  } else {
    return `${seconds}秒`;
  }
}

/**
 * Token管理器类
 */
export class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private expiryWarningTimer: NodeJS.Timeout | null = null;
  private onTokenExpired?: () => void;
  private onTokenExpiringSoon?: () => void;

  constructor(config?: {
    onTokenExpired?: () => void;
    onTokenExpiringSoon?: () => void;
  }) {
    this.onTokenExpired = config?.onTokenExpired;
    this.onTokenExpiringSoon = config?.onTokenExpiringSoon;
  }

  /**
   * 启动token监控
   */
  startMonitoring(): void {
    this.stopMonitoring();

    const checkToken = () => {
      const token = getToken();
      if (!token) {
        this.onTokenExpired?.();
        return;
      }

      if (isTokenExpired(token)) {
        clearAuth();
        this.onTokenExpired?.();
        return;
      }

      if (isTokenExpiringSoon(token)) {
        this.onTokenExpiringSoon?.();
      }
    };

    // 每分钟检查一次
    this.refreshTimer = setInterval(checkToken, 60 * 1000);

    // 立即执行一次检查
    checkToken();
  }

  /**
   * 停止token监控
   */
  stopMonitoring(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
    if (this.expiryWarningTimer) {
      clearTimeout(this.expiryWarningTimer);
      this.expiryWarningTimer = null;
    }
  }

  /**
   * 设置token过期回调
   */
  setOnTokenExpired(callback: () => void): void {
    this.onTokenExpired = callback;
  }

  /**
   * 设置token即将过期回调
   */
  setOnTokenExpiringSoon(callback: () => void): void {
    this.onTokenExpiringSoon = callback;
  }
}

export default {
  decodeToken,
  isTokenExpired,
  isTokenExpiringSoon,
  getTokenRemainingTime,
  saveToken,
  getToken,
  getUserInfo,
  clearAuth,
  isAuthenticated,
  getTokenExpiry,
  formatRemainingTime,
  TokenManager,
};
