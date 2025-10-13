import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Search, Plus, Edit, Key, Shield, FileText } from "lucide-react";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";

export function SystemManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  const users = [
    {
      id: "1",
      username: "admin",
      realName: "系统管理员",
      role: "系统管理员",
      phone: "138****0001",
      email: "admin@property.com",
      status: "启用",
      lastLogin: "2025-01-11 09:30",
      createTime: "2024-01-01",
    },
    {
      id: "4",
      username: "engineer",
      realName: "工程小王",
      role: "工程人员",
      phone: "138****0004",
      email: "engineer@property.com",
      status: "停用",
      lastLogin: "2025-01-05 15:20",
      createTime: "2024-05-10",
    },
  ];

  const roles = [
    {
      id: "1",
      name: "系统管理员",
      code: "admin",
      description: "拥有系统所有权限",
      userCount: 1,
      status: "启用",
      createTime: "2024-01-01",
    },
    {
      id: "4",
      name: "工程人员",
      code: "engineer",
      description: "负责设施维护和报修处理",
      userCount: 2,
      status: "启用",
      createTime: "2024-01-01",
    },
  ];

  const operationLogs = [
    {
      id: "1",
      user: "admin",
      realName: "系统管理员",
      module: "用户管理",
      operation: "新增用户",
      detail: "新增用户 [客服小李]",
      ip: "192.168.1.100",
      time: "2025-01-11 09:30:15",
      status: "成功",
    },
    {
      id: "4",
      user: "admin",
      realName: "系统管理员",
      module: "系统管理",
      operation: "修改角色权限",
      detail: "修改角色 [客服人员] 的权限配置",
      ip: "192.168.1.100",
      time: "2025-01-10 11:10:00",
      status: "成功",
    },
  ];

  const permissions = [
    {
      module: "仪表盘",
      permissions: [
        { id: "dashboard_view", name: "查看仪表盘", checked: true },
      ],
    },
    {
      module: "住户管理",
      permissions: [
        { id: "resident_view", name: "查看住户", checked: true },
        { id: "resident_add", name: "新增住户", checked: true },
        { id: "resident_edit", name: "编辑住户", checked: true },
        { id: "resident_delete", name: "删除住户", checked: false },
      ],
    },
    {
      module: "收费管理",
      permissions: [
        { id: "fee_view", name: "查看账单", checked: true },
        { id: "fee_generate", name: "生成账单", checked: true },
        { id: "fee_payment", name: "记录缴费", checked: true },
        { id: "fee_refund", name: "退费操作", checked: false },
      ],
    },
    {
      module: "客户服务",
      permissions: [
        { id: "service_view", name: "查看工单", checked: true },
        { id: "service_assign", name: "派单", checked: true },
        { id: "service_process", name: "处理工单", checked: true },
        { id: "service_close", name: "关闭工单", checked: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="搜索用户、角色..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="logs">操作日志</TabsTrigger>
        </TabsList>

        {/* 用户管理 */}
        <TabsContent value="users">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新增用户
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新增系统用户</DialogTitle>
                    <DialogDescription>
                      填写用户信息并分配角色
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>用户名</Label>
                      <Input placeholder="请输入用户名" />
                    </div>
                    <div className="space-y-2">
                      <Label>真实姓名</Label>
                      <Input placeholder="请输入真实姓名" />
                    </div>
                    <div className="space-y-2">
                      <Label>手机号</Label>
                      <Input placeholder="请输入手机号" />
                    </div>
                    <div className="space-y-2">
                      <Label>邮箱</Label>
                      <Input placeholder="请输入邮箱" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label>角色</Label>
                      <Input placeholder="选择角色" />
                    </div>
                    <div className="space-y-2">
                      <Label>初始密码</Label>
                      <Input placeholder="请输入初始密码" type="password" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddUserOpen(false)}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsAddUserOpen(false)}
                    >
                      确定
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户名</TableHead>
                    <TableHead>真实姓名</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>最后登录</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.realName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "启用" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Key className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>

        {/* 角色管理 */}
        <TabsContent value="roles">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新增角色
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>新增角色</DialogTitle>
                    <DialogDescription>
                      创建角色并配置权限
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>角色名称</Label>
                        <Input placeholder="请输入角色名称" />
                      </div>
                      <div className="space-y-2">
                        <Label>角色编码</Label>
                        <Input placeholder="请输入角色编码" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>角色描述</Label>
                      <Input placeholder="请输入角色描述" />
                    </div>
                    <div className="space-y-4">
                      <Label>权限配置</Label>
                      {permissions.map((module, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <h4 className="text-gray-900">{module.module}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {module.permissions.map((perm) => (
                              <div
                                key={perm.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={perm.id}
                                  defaultChecked={perm.checked}
                                />
                                <label
                                  htmlFor={perm.id}
                                  className="text-sm cursor-pointer"
                                >
                                  {perm.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddRoleOpen(false)}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsAddRoleOpen(false)}
                    >
                      确定
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>角色名称</TableHead>
                    <TableHead>角色编码</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>用户数</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          {role.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.code}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {role.description}
                      </TableCell>
                      <TableCell>{role.userCount}人</TableCell>
                      <TableCell>
                        <Badge variant="default">{role.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {role.createTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            权限
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>

        {/* 操作日志 */}
        <TabsContent value="logs">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>真实姓名</TableHead>
                  <TableHead>模块</TableHead>
                  <TableHead>操作</TableHead>
                  <TableHead>详情</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead>操作时间</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operationLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.realName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.module}</Badge>
                    </TableCell>
                    <TableCell>{log.operation}</TableCell>
                    <TableCell className="max-w-xs truncate text-gray-500">
                      {log.detail}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {log.ip}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {log.time}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{log.status}</Badge>
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
