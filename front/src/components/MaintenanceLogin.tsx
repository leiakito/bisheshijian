import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Wrench, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { login } from "../services/authService";
import { clearAuth } from "../utils/tokenManager";

export function MaintenanceLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location } | undefined)?.from?.pathname ??
    "/maintenance/orders/pending";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("请输入工号和密码");
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

      // 验证用户是否有维护人员权限（仅允许ENGINEER角色）
      if (!response.roles.includes("ROLE_ENGINEER")) {
        // 角色不匹配，清除已保存的token
        clearAuth();
        setError("您没有维护人员权限，请使用维护人员账号登录");
        setLoading(false);
        return;
      }

      // 登录成功，跳转到维护人员工作台
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "登录失败，请检查工号和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-100">
      {/* 顶部返回按钮 */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Button>
      </div>

      {/* 登录内容 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="p-8">
            {/* Logo和标题 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-gray-900">维护人员工作台</h2>
              <p className="text-gray-500 mt-2">维修师傅专用登录</p>
            </div>

            {/* 登录表单 */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="username">工号</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入工号"
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
                className="w-full bg-orange-600 hover:bg-orange-700"
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
            </div>
          </Card>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="text-center py-6 text-gray-500">
        <p>© 2025 物业维护工作台</p>
      </div>
    </div>
  );
}
