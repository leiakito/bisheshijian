import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { login } from "../services/authService";
import { clearAuth } from "../utils/tokenManager";

export function ResidentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location } | undefined)?.from?.pathname ??
    "/resident/home";

  const handleLogin = async (e: React.FormEvent) => {
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
      // 调用后端登录API
      const response = await login({ username, password });

      // 验证用户是否有普通用户权限（仅允许USER角色）
      if (!response.roles.includes("ROLE_USER")) {
        // 角色不匹配，清除已保存的token
        clearAuth();
        setError("您没有业主权限，请使用业主账号登录");
        setLoading(false);
        return;
      }

      // 登录成功，跳转到业主服务平台
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "登录失败，请检查用户名和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部返回按钮 */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回管理端
        </Button>
      </div>

      {/* 登录内容 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="p-8">
            {/* Logo和标题 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-gray-900">业主服务平台</h2>
              <p className="text-gray-500 mt-2">欢迎使用智慧社区服务</p>
            </div>

            {/* 登录表单 */}
            <form onSubmit={handleLogin} className="space-y-6">
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
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>

          {/* 返回主页按钮 */}
          <div>
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

            {/* 帮助信息 */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>如忘记密码，请联系物业管理员</p>
              <p className="mt-1">服务热线：400-123-4567</p>
            </div>
          </Card>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="text-center py-6 text-gray-500">
        <p>© 2025 智慧社区服务平台</p>
      </div>
    </div>
  );
}
