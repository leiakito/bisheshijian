import { Building2, LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

export function Sidebar({ menuItems }: SidebarProps) {
  const location = useLocation();

  const handleMenuClick = (item: MenuItem) => {
    console.log("菜单点击:", item.label, "路径:", item.path);
    console.log("当前路径:", location.pathname);
    // Link 组件会自动处理导航，无需手动调用 navigate
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo区域 */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white">物业管理</h3>
            <p className="text-gray-400 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer relative z-10 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
              style={{ textDecoration: 'none' }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400 text-center">
          v1.0.0 | 2025
        </div>
      </div>
    </div>
  );
}
