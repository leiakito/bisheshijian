import { useNavigate } from "react-router-dom";
import { Building2, Settings, Home, Wrench, ChevronRight } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-gray-900 mb-3">物业管理系统</h1>
          <p className="text-gray-600">请选择登录方式</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/admin/login")}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <Settings className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-gray-900 mb-3">管理后台</h2>
            <p className="text-gray-600 mb-6">
              物业工作人员登录，管理小区运营
            </p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
              <span>立即登录</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate("/resident/login")}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
              <Home className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-gray-900 mb-3">业主服务</h2>
            <p className="text-gray-600 mb-6">
              业主登录，享受便捷社区服务
            </p>
            <div className="flex items-center text-green-600 group-hover:text-green-700">
              <span>立即登录</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate("/maintenance/login")}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
              <Wrench className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-gray-900 mb-3">维护人员</h2>
            <p className="text-gray-600 mb-6">
              维修师傅登录，处理报修工单
            </p>
            <div className="flex items-center text-orange-600 group-hover:text-orange-700">
              <span>立即登录</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div className="text-center mt-12 text-gray-500">
          <p>© 2025 小区物业管理系统 v1.0</p>
        </div>
      </div>
    </div>
  );
}
