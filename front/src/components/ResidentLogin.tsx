import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { setResidentSession } from "../utils/sessionManager";

export function ResidentLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location } | undefined)?.from?.pathname ??
    "/resident/home";

  const handleSendCode = () => {
    if (!phone) {
      setError("请输入手机号");
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("请输入正确的手机号");
      return;
    }

    setError("");
    setCodeSent(true);
    setCountdown(60);

    // 模拟发送验证码
    console.log("发送验证码到:", phone);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone) {
      setError("请输入手机号");
      return;
    }

    if (!code) {
      setError("请输入验证码");
      return;
    }

    // 模拟验证码验证（演示用）
    if (code.length === 6) {
      setResidentSession({ name: "智慧业主", phone });
      navigate(from, { replace: true });
    } else {
      setError("验证码格式错误");
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
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2"
                  maxLength={11}
                />
              </div>

              <div>
                <Label htmlFor="code">验证码</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="w-28"
                  >
                    {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                登录
              </Button>
            </form>

            {/* 提示信息 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="block">演示手机号：138****1234</span>
                <span className="block mt-1">验证码：任意6位数字</span>
              </p>
            </div>

            {/* 帮助信息 */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>首次登录将自动注册账号</p>
              <p className="mt-1">如有问题请联系物业：400-123-4567</p>
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
