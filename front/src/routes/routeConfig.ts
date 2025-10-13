import {
  LayoutDashboard,
  Users,
  DollarSign,
  Wrench,
  Building2,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface RouteConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  requiresAuth: boolean;
  roles?: string[];
}

/**
 * 管理后台路由配置
 */
export const adminRoutes: RouteConfig[] = [
  {
    id: "dashboard",
    label: "仪表盘",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    requiresAuth: true,
    roles: ["ADMIN"],
  },
  {
    id: "residents",
    label: "住户管理",
    icon: Users,
    path: "/admin/residents",
    requiresAuth: true,
    roles: ["ADMIN", "USER"],
  },
  {
    id: "fees",
    label: "收费管理",
    icon: DollarSign,
    path: "/admin/fees",
    requiresAuth: true,
    roles: ["ADMIN", "USER"],
  },
  {
    id: "service",
    label: "客户服务",
    icon: Wrench,
    path: "/admin/service",
    requiresAuth: true,
    roles: ["ADMIN", "USER"],
  },
  {
    id: "community",
    label: "小区管理",
    icon: Building2,
    path: "/admin/community",
    requiresAuth: true,
    roles: ["ADMIN"],
  },
  {
    id: "system",
    label: "系统管理",
    icon: Settings,
    path: "/admin/system",
    requiresAuth: true,
    roles: ["ADMIN"],
  },
];

/**
 * 页面标题映射
 */
export const pageTitleMap: Record<string, string> = {
  "/admin/dashboard": "仪表盘",
  "/admin/residents": "住户管理",
  "/admin/fees": "收费管理",
  "/admin/service": "客户服务",
  "/admin/community": "小区管理",
  "/admin/system": "系统管理",
  "/admin/notifications": "通知中心",
  "/admin/profile": "个人中心",
  "/admin/financial-report": "财务报表",
};

/**
 * 根据路径获取页面标题
 */
export function getPageTitle(pathname: string): string {
  return pageTitleMap[pathname] || "物业管理系统";
}
