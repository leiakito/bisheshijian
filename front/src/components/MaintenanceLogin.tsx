import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Wrench, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { setMaintenanceSession } from "../utils/sessionManager";

export function MaintenanceLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location } | undefined)?.from?.pathname ??
    "/maintenance/orders/pending";

  const handleLogin = (e: React.FormEvent) => {
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

    // 模拟登录
    setMaintenanceSession({ name: username });
    navigate(from, { replace: true });
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
              >
                登录
              </Button>
            </form>

            {/* 提示信息 */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <span className="block">演示工号：维修001</span>
                <span className="block mt-1">密码：任意6位以上</span>
              </p>
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
