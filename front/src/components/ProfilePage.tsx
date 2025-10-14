import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  User,
  Mail,
  Phone,
  Key,
  Shield,
  Clock,
  Monitor,
  Edit,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ProfilePageProps {
  userInfo: { name: string; role: string };
}

export function ProfilePage({ userInfo }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loginHistory, setLoginHistory] = useState<Array<{
    id: string;
    time: string;
    ip: string;
    location: string;
    device: string;
    status: string;
  }>>([]);

  // 获取设备信息
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";

    // 检测浏览器
    if (ua.includes("Chrome") && !ua.includes("Edg")) {
      browser = "Chrome";
    } else if (ua.includes("Edg")) {
      browser = "Edge";
    } else if (ua.includes("Firefox")) {
      browser = "Firefox";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser = "Safari";
    }

    // 检测操作系统
    if (ua.includes("Windows NT 10.0")) {
      os = "Windows 10";
    } else if (ua.includes("Windows NT 11.0")) {
      os = "Windows 11";
    } else if (ua.includes("Mac OS X")) {
      os = "macOS";
    } else if (ua.includes("Linux")) {
      os = "Linux";
    } else if (ua.includes("Android")) {
      os = "Android";
    } else if (ua.includes("iPhone") || ua.includes("iPad")) {
      os = "iOS";
    }

    return `${browser} / ${os}`;
  };

  // 生成随机IP地址
  const generateRandomIP = () => {
    const segment1 = 192;
    const segment2 = 168;
    const segment3 = Math.floor(Math.random() * 256);
    const segment4 = Math.floor(Math.random() * 256);
    return `${segment1}.${segment2}.${segment3}.${segment4}`;
  };

  // 随机地点列表
  const locations = [
    "北京市朝阳区",
    "北京市海淀区",
    "北京市东城区",
    "上海市浦东新区",
    "上海市黄浦区",
    "广州市天河区",
    "深圳市南山区",
    "杭州市西湖区",
  ];

  // 生成随机登录历史
  const generateLoginHistory = () => {
    const history = [];
    const count = Math.floor(Math.random() * 6) + 5; // 5-10条记录
    const deviceInfo = getDeviceInfo();
    const currentTime = new Date();

    for (let i = 0; i < count; i++) {
      // 生成过去的随机时间（最近30天内）
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursOffset = Math.floor(Math.random() * 24);
      const minutesOffset = Math.floor(Math.random() * 60);
      const secondsOffset = Math.floor(Math.random() * 60);

      const loginTime = new Date(currentTime);
      loginTime.setDate(loginTime.getDate() - daysAgo);
      loginTime.setHours(hoursOffset, minutesOffset, secondsOffset);

      const timeString = loginTime.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(/\//g, '-');

      history.push({
        id: String(i + 1),
        time: timeString,
        ip: generateRandomIP(),
        location: locations[Math.floor(Math.random() * locations.length)],
        device: deviceInfo,
        status: Math.random() > 0.1 ? "成功" : "失败", // 90%成功率
      });
    }

    // 按时间降序排序
    history.sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    return history;
  };

  // 在组件挂载时生成登录历史
  useEffect(() => {
    const history = generateLoginHistory();
    setLoginHistory(history);

    // 更新最后登录时间为最新的一条记录
    if (history.length > 0) {
      setUserDetails(prev => ({
        ...prev,
        lastLogin: history[0].time,
        loginIP: history[0].ip,
      }));
    }
  }, []);

  const [userDetails, setUserDetails] = useState({
    username: "admin",
    realName: userInfo.name || "系统管理员",
    role: userInfo.role || "管理员",
    phone: "138****0001",
    email: "admin@property.com",
    department: "技术部",
    joinDate: "2024-01-01",
    lastLogin: "加载中...",
    loginIP: "加载中...",
  });

  const permissions = [
    { module: "仪表盘", view: true, add: false, edit: false, delete: false },
    { module: "住户管理", view: true, add: true, edit: true, delete: true },
    { module: "收费管理", view: true, add: true, edit: true, delete: false },
    { module: "客户服务", view: true, add: true, edit: true, delete: true },
    { module: "小区管理", view: true, add: true, edit: true, delete: true },
    { module: "系统管理", view: true, add: true, edit: true, delete: true },
  ];

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <Card className="p-8">
        <div className="flex items-start gap-8">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-2xl bg-blue-600 text-white">
              {userDetails.realName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-gray-900">{userDetails.realName}</h2>
              <Badge variant="default">{userDetails.role}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>用户名：{userDetails.username}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>邮箱：{userDetails.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>手机：{userDetails.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-4 h-4" />
                <span>部门：{userDetails.department}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>加入时间：{userDetails.joinDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Monitor className="w-4 h-4" />
                <span>最后登录：{userDetails.lastLogin}</span>
              </div>
            </div>
          </div>
          
        </div>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="permissions">权限查看</TabsTrigger>
          <TabsTrigger value="history">登录历史</TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value="info">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">个人信息</h3>
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>真实姓名</Label>
                  <Input
                    defaultValue={userDetails.realName}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>用户名</Label>
                  <Input defaultValue={userDetails.username} disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>手机号</Label>
                  <Input
                    defaultValue={userDetails.phone}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>邮箱</Label>
                  <Input
                    defaultValue={userDetails.email}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>所属部门</Label>
                  <Input
                    defaultValue={userDetails.department}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>角色</Label>
                  <Input defaultValue={userDetails.role} disabled />
                </div>
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    保存修改
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    取消
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Key className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-gray-900">修改密码</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>当前密码</Label>
                  <Input type="password" placeholder="请输入当前密码" />
                </div>
                <div className="space-y-2">
                  <Label>新密码</Label>
                  <Input type="password" placeholder="请输入新密码" />
                </div>
                <div className="space-y-2">
                  <Label>确认密码</Label>
                  <Input type="password" placeholder="请再次输入新密码" />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  修改密码
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-gray-900">账号安全</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-gray-900 mb-1">登录密码</h4>
                    <p className="text-sm text-gray-500">
                      定期修改密码可以提高账号安全性
                    </p>
                  </div>
                  <Badge variant="default">已设置</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-gray-900 mb-1">绑定手机</h4>
                    <p className="text-sm text-gray-500">
                      {userDetails.phone}
                    </p>
                  </div>
                  <Badge variant="default">已绑定</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-gray-900 mb-1">绑定邮箱</h4>
                    <p className="text-sm text-gray-500">
                      {userDetails.email}
                    </p>
                  </div>
                  <Badge variant="default">已绑定</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 权限查看 */}
        <TabsContent value="permissions">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">我的权限</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>功能模块</TableHead>
                  <TableHead>查看</TableHead>
                  <TableHead>新增</TableHead>
                  <TableHead>编辑</TableHead>
                  <TableHead>删除</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm) => (
                  <TableRow key={perm.module}>
                    <TableCell>{perm.module}</TableCell>
                    <TableCell>
                      {perm.view ? (
                        <Badge variant="default">√</Badge>
                      ) : (
                        <Badge variant="secondary">×</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {perm.add ? (
                        <Badge variant="default">√</Badge>
                      ) : (
                        <Badge variant="secondary">×</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {perm.edit ? (
                        <Badge variant="default">√</Badge>
                      ) : (
                        <Badge variant="secondary">×</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {perm.delete ? (
                        <Badge variant="default">√</Badge>
                      ) : (
                        <Badge variant="secondary">×</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 登录历史 */}
        <TabsContent value="history">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">登录历史</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>登录时间</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead>登录地点</TableHead>
                  <TableHead>设备信息</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{log.time}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {log.ip}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {log.location}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {log.device}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.status === "成功" ? "default" : "destructive"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
