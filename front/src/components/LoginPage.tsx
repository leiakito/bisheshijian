import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Building2 } from "lucide-react";
import { login } from "../services/authService";
import { clearAuth } from "../utils/tokenManager";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location } | undefined)?.from?.pathname ??
    "/admin/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少为6位");
      return;
    }

    setLoading(true);

    try {
      const response = await login({ username, password });

      // 验证用户是否有管理员权限（ADMIN角色）
      if (!response.roles.includes("ROLE_ADMIN")) {
        // 角色不匹配，清除已保存的token
        clearAuth();
        setError("您没有管理员权限，请使用管理员账号登录");
        setLoading(false);
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "登录失败，请检查用户名和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900">物业管理系统</h2>
            <p className="text-gray-500 mt-2">欢迎登录管理后台</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>

          {/* 返回主页按钮 */}
          <div className="mt-6">
            <Button
              type="button"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => {
                window.location.href = "http://localhost:3000/";
              }}
            >
              返回主页
            </Button>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-6 text-gray-500">
          <p>© 2025 小区物业管理系统</p>
        </div>
      </div>
    </div>
  );
}
