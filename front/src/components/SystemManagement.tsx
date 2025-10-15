import { useState, useEffect, useMemo } from "react";
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
import { getUsers, createUser, updateUser, toggleUserStatus, getAvailableRoles, resetUserPassword } from "../services/userService";
import { getResidents } from "../services/residentService";
import { getAllRoles, createRole, updateRole, deleteRole } from "../services/roleService";
import type { UserResponse, UserRequest, Resident, Role, RoleResponse, RoleRequest } from "../types/api";
import { toast } from "sonner";

type OperationLog = {
  id: string;
  user: string;
  realName: string;
  module: string;
  operation: string;
  detail: string;
  ip: string;
  time: string;
  status: string;
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad = (value: number) => value.toString().padStart(2, "0");

const formatDateTime = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const randomElement = <T,>(list: T[]): T => list[randomInt(0, list.length - 1)];

const createRandomIP = () => `192.168.${randomInt(0, 254)}.${randomInt(1, 254)}`;

const randomPastDate = () => {
  const now = Date.now();
  const offsetMinutes = randomInt(5, 7 * 24 * 60); // 最近 7 天内
  return new Date(now - offsetMinutes * 60 * 1000);
};

const operationTemplates = [
  {
    module: "用户管理",
    operation: "新增用户",
    detail: (target: string) => `新增用户 [${target}]`,
  },
  {
    module: "用户管理",
    operation: "禁用账号",
    detail: (target: string) => `禁用用户 [${target}] 的登录权限`,
  },
  {
    module: "角色管理",
    operation: "修改角色权限",
    detail: (target: string) => `调整角色 [${target}] 的菜单访问权限`,
  },
  {
    module: "系统设置",
    operation: "更新系统参数",
    detail: (target: string) => `更新参数 [${target}]`,
  },
  {
    module: "日志审计",
    operation: "导出操作日志",
    detail: (target: string) => `导出最近 ${target} 条日志记录`,
  },
  {
    module: "通知中心",
    operation: "发布公告",
    detail: (target: string) => `发布公告《${target}》`,
  },
  {
    module: "客户服务",
    operation: "分派工单",
    detail: (target: string) => `将工单分派给 [${target}]`,
  },
];

const actorAccounts = [
  { username: "admin", realName: "系统管理员" },
  { username: "ops_lee", realName: "运维李强" },
  { username: "service_wang", realName: "客服王丽" },
  { username: "security_zhang", realName: "安保张伟" },
  { username: "engineer_liu", realName: "工程刘洋" },
];

const targetNames = ["客服小李", "业主张敏", "维修老王", "安保刘强", "物业前台", "小区公告", "安全巡检", "访客登记"];

const detailNumbers = ["50", "100", "200", "全部", "本周", "本月"];

const statusPool: OperationLog["status"][] = ["成功", "成功", "成功", "成功", "失败"];

const generateOperationLogs = (count = 8): OperationLog[] =>
  Array.from({ length: count }, (_, index) => {
    const template = randomElement(operationTemplates);
    const actor = randomElement(actorAccounts);
    const targetName = template.operation === "导出操作日志" ? randomElement(detailNumbers) : randomElement(targetNames);
    const status = randomElement(statusPool);
    const date = randomPastDate();

    return {
      id: `${index + 1}-${date.getTime()}-${randomInt(100, 999)}`,
      user: actor.username,
      realName: actor.realName,
      module: template.module,
      operation: template.operation,
      detail: template.detail(targetName),
      ip: createRandomIP(),
      time: formatDateTime(date),
      status,
    };
  });

export function SystemManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // 用户列表状态
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);

  // 角色列表状态
  const [rolesList, setRolesList] = useState<RoleResponse[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);

  // 住户列表（用于选择）
  const [residents, setResidents] = useState<Resident[]>([]);

  // 可用角色列表
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // 新增用户表单数据
  const [formData, setFormData] = useState<UserRequest>({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    email: "",
    residentId: 0,
    roleId: 0,
    active: true,
  });

  // 重置密码表单数据
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: 0,
    newPassword: "",
    confirmPassword: "",
  });

  // 角色表单数据
  const [roleFormData, setRoleFormData] = useState<RoleRequest>({
    code: "",
    name: "",
    description: "",
  });

  // 加载数据
  useEffect(() => {
    loadUsers();
    loadResidents();
    loadAvailableRoles();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers({ page: 0, size: 100 });
      console.log("获取到的用户数据:", data);
      console.log("用户数量:", data.content?.length || 0);
      setUsers(data.content);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("加载用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  const loadResidents = async () => {
    try {
      const data = await getResidents({ page: 0, size: 1000 });
      setResidents(data.content);
    } catch (err) {
      console.error("Failed to load residents:", err);
    }
  };

  const loadAvailableRoles = async () => {
    try {
      const roles = await getAvailableRoles();
      setAvailableRoles(roles);
    } catch (err) {
      console.error("Failed to load roles:", err);
    }
  };

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const roles = await getAllRoles();
      setRolesList(roles);
    } catch (err) {
      console.error("Failed to load roles:", err);
      toast.error("加载角色列表失败");
    } finally {
      setRolesLoading(false);
    }
  };

  const handleAddUser = async () => {
    // 验证表单
    if (!formData.username || !formData.password || !formData.fullName || !formData.residentId || !formData.roleId) {
      toast.error("请填写所有必填项");
      return;
    }

    try {
      await createUser(formData);
      toast.success("新增用户成功");
      setIsAddUserOpen(false);
      resetForm();
      loadUsers();
    } catch (err) {
      console.error("Failed to create user:", err);
      toast.error(err instanceof Error ? err.message : "新增用户失败");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleUserStatus(id);
      toast.success("用户状态已更新");
      loadUsers();
    } catch (err) {
      console.error("Failed to toggle user status:", err);
      toast.error("更新用户状态失败");
    }
  };

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "", // 编辑时密码为空，表示不修改
      fullName: user.fullName,
      phone: user.phone || "",
      email: user.email || "",
      residentId: user.residentId || 0,
      roleId: availableRoles.find(r => r.code === user.roleCode)?.id || 0,
      active: user.active,
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    // 验证表单
    if (!formData.fullName || !formData.residentId || !formData.roleId) {
      toast.error("请填写所有必填项");
      return;
    }

    try {
      await updateUser(editingUser.id, formData);
      toast.success("更新用户成功");
      setIsEditUserOpen(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error(err instanceof Error ? err.message : "更新用户失败");
    }
  };

  const handleOpenResetPassword = (user: UserResponse) => {
    setResetPasswordData({
      userId: user.id,
      newPassword: "",
      confirmPassword: "",
    });
    setEditingUser(user);
    setIsResetPasswordOpen(true);
  };

  const handleResetPassword = async () => {
    if (!resetPasswordData.newPassword) {
      toast.error("请输入新密码");
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      toast.error("密码长度至少为6位");
      return;
    }

    try {
      await resetUserPassword(resetPasswordData.userId, resetPasswordData.newPassword);
      toast.success("重置密码成功");
      setIsResetPasswordOpen(false);
      setResetPasswordData({ userId: 0, newPassword: "", confirmPassword: "" });
      setEditingUser(null);
      // 清空搜索框，确保显示所有数据
      setSearchQuery("");
      // 重置密码后刷新用户列表
      loadUsers();
    } catch (err) {
      console.error("Failed to reset password:", err);
      toast.error(err instanceof Error ? err.message : "重置密码失败");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      fullName: "",
      phone: "",
      email: "",
      residentId: 0,
      roleId: 0,
      active: true,
    });
    setEditingUser(null);
  };

  const resetRoleForm = () => {
    setRoleFormData({
      code: "",
      name: "",
      description: "",
    });
    setEditingRole(null);
  };

  const handleAddRole = async () => {
    // 验证表单
    if (!roleFormData.code || !roleFormData.name) {
      toast.error("请填写角色编码和角色名称");
      return;
    }

    try {
      await createRole(roleFormData);
      toast.success("新增角色成功");
      setIsAddRoleOpen(false);
      resetRoleForm();
      loadRoles();
      loadAvailableRoles(); // 刷新可用角色列表
    } catch (err) {
      console.error("Failed to create role:", err);
      toast.error(err instanceof Error ? err.message : "新增角色失败");
    }
  };

  const handleEditRole = (role: RoleResponse) => {
    setEditingRole(role);
    setRoleFormData({
      code: role.code,
      name: role.name,
      description: role.description || "",
    });
    setIsEditRoleOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    // 验证表单
    if (!roleFormData.code || !roleFormData.name) {
      toast.error("请填写角色编码和角色名称");
      return;
    }

    try {
      await updateRole(editingRole.id, roleFormData);
      toast.success("更新角色成功");
      setIsEditRoleOpen(false);
      setEditingRole(null);
      resetRoleForm();
      loadRoles();
      loadAvailableRoles(); // 刷新可用角色列表
    } catch (err) {
      console.error("Failed to update role:", err);
      toast.error(err instanceof Error ? err.message : "更新角色失败");
    }
  };

  const handleDeleteRole = async (role: RoleResponse) => {
    // 确认删除
    if (!confirm(`确定要删除角色 "${role.name}" 吗？`)) {
      return;
    }

    try {
      await deleteRole(role.id);
      toast.success("删除角色成功");
      loadRoles();
      loadAvailableRoles(); // 刷新可用角色列表
    } catch (err) {
      console.error("Failed to delete role:", err);
      toast.error(err instanceof Error ? err.message : "删除角色失败");
    }
  };

  // 操作日志动态生成
  const operationLogs = useMemo(() => generateOperationLogs(10), []);

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

  // 过滤用户
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }
    const query = searchQuery.toLowerCase();
    return users.filter((user) => {
      return (
        user.username?.toLowerCase().includes(query) ||
        user.fullName?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.residentName?.toLowerCase().includes(query) ||
        user.roleName?.toLowerCase().includes(query) ||
        user.building?.toLowerCase().includes(query) ||
        user.unit?.toLowerCase().includes(query) ||
        user.roomNumber?.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  // 过滤角色
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) {
      return rolesList;
    }
    const query = searchQuery.toLowerCase();
    return rolesList.filter((role) => {
      return (
        role.name?.toLowerCase().includes(query) ||
        role.code?.toLowerCase().includes(query) ||
        role.description?.toLowerCase().includes(query)
      );
    });
  }, [rolesList, searchQuery]);

  // 过滤操作日志
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) {
      return operationLogs;
    }
    const query = searchQuery.toLowerCase();
    return operationLogs.filter((log) => {
      return (
        log.user?.toLowerCase().includes(query) ||
        log.realName?.toLowerCase().includes(query) ||
        log.module?.toLowerCase().includes(query) ||
        log.operation?.toLowerCase().includes(query) ||
        log.detail?.toLowerCase().includes(query) ||
        log.ip?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, operationLogs]);

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="搜索用户、角色、操作日志..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // 触发搜索（实际上搜索是实时的，这里只是为了用户体验）
                  e.currentTarget.blur();
                }
              }}
              className="pl-10"
              autoComplete="off"
              name="search-query"
            />
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // 触发搜索（实际上搜索是实时的，这里只是为了用户体验）
              if (searchQuery.trim()) {
                toast.success(`搜索: ${searchQuery}`);
              }
            }}
          >
            <Search className="w-4 h-4 mr-2" />
            搜索
          </Button>
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
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>新增系统用户</DialogTitle>
                    <DialogDescription>
                      填写用户信息并关联住户（只能添加工程人员和客服人员）
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>用户名 *</Label>
                        <Input
                          placeholder="请输入用户名"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>真实姓名 *</Label>
                        <Input
                          placeholder="请输入真实姓名"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>初始密码 *</Label>
                      <Input
                        placeholder="请输入初始密码"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>手机号</Label>
                        <Input
                          placeholder="请输入手机号"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>邮箱</Label>
                        <Input
                          placeholder="请输入邮箱"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>关联住户 *</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={formData.residentId}
                        onChange={(e) => setFormData({ ...formData, residentId: Number(e.target.value) })}
                      >
                        <option value={0}>请选择住户</option>
                        {residents.map((resident) => (
                          <option key={resident.id} value={resident.id}>
                            {resident.name} - {resident.building} {resident.unit} {resident.roomNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>角色 *</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={formData.roleId}
                        onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                      >
                        <option value={0}>请选择角色</option>
                        {availableRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-sm text-gray-500">注意：只能添加普通用户或工程人员</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddUserOpen(false);
                        resetForm();
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddUser}
                    >
                      确定
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 编辑用户对话框 */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>编辑用户</DialogTitle>
                  <DialogDescription>
                    修改用户信息（编辑时不修改密码，如需重置密码请使用重置密码功能）
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>用户名 *</Label>
                      <Input
                        placeholder="请输入用户名"
                        value={formData.username}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">用户名不可修改</p>
                    </div>
                    <div className="space-y-2">
                      <Label>真实姓名 *</Label>
                      <Input
                        placeholder="请输入真实姓名"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>手机号</Label>
                      <Input
                        placeholder="请输入手机号"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>邮箱</Label>
                      <Input
                        placeholder="请输入邮箱"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>关联住户 *</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.residentId}
                      onChange={(e) => setFormData({ ...formData, residentId: Number(e.target.value) })}
                    >
                      <option value={0}>请选择住户</option>
                      {residents.map((resident) => (
                        <option key={resident.id} value={resident.id}>
                          {resident.name} - {resident.building} {resident.unit} {resident.roomNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>角色 *</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.roleId}
                      onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                    >
                      <option value={0}>请选择角色</option>
                      {availableRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditUserOpen(false);
                      resetForm();
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleUpdateUser}
                  >
                    保存
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* 重置密码对话框 */}
            <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>重置密码</DialogTitle>
                  <DialogDescription>
                    为用户 "{editingUser?.fullName}" 重置密码
                  </DialogDescription>
                </DialogHeader>
                <form autoComplete="off">
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>新密码 *</Label>
                      <Input
                        type="password"
                        placeholder="请输入新密码（至少6位）"
                        value={resetPasswordData.newPassword}
                        onChange={(e) =>
                          setResetPasswordData({
                            ...resetPasswordData,
                            newPassword: e.target.value,
                          })
                        }
                        autoComplete="new-password"
                        name="new-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>确认密码 *</Label>
                      <Input
                        type="password"
                        placeholder="请再次输入新密码"
                        value={resetPasswordData.confirmPassword}
                        onChange={(e) =>
                          setResetPasswordData({
                            ...resetPasswordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        autoComplete="new-password"
                        name="confirm-password"
                      />
                    </div>
                  </div>
                </form>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsResetPasswordOpen(false);
                      setResetPasswordData({
                        userId: 0,
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleResetPassword}
                  >
                    确认重置
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Card>
              {loading ? (
                <div className="p-12 text-center text-gray-500">加载中...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  {searchQuery.trim() ? "没有找到匹配的用户" : "暂无用户数据"}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户名</TableHead>
                      <TableHead>真实姓名</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>关联住户</TableHead>
                      <TableHead>手机号</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>最后登录</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.roleName || "-"}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.residentName ? (
                            <div>
                              <div>{user.residentName}</div>
                              <div className="text-gray-500 text-xs">
                                {user.building} {user.unit} {user.roomNumber}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{user.phone || "-"}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {user.email || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.active}
                              onCheckedChange={() => handleToggleStatus(user.id)}
                            />
                            <span className="text-sm">
                              {user.active ? "启用" : "停用"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("zh-CN") : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              title="编辑"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              title="重置密码"
                              onClick={() => handleOpenResetPassword(user)}
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
                        <Label>角色名称 *</Label>
                        <Input
                          placeholder="请输入角色名称"
                          value={roleFormData.name}
                          onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>角色编码 *</Label>
                        <Input
                          placeholder="请输入角色编码（如:CUSTOMER_SERVICE）"
                          value={roleFormData.code}
                          onChange={(e) => setRoleFormData({ ...roleFormData, code: e.target.value.toUpperCase() })}
                        />
                        <p className="text-xs text-gray-500">建议使用大写字母和下划线</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>角色描述</Label>
                      <Input
                        placeholder="请输入角色描述"
                        value={roleFormData.description}
                        onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddRoleOpen(false);
                        resetRoleForm();
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddRole}
                    >
                      确定
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 编辑角色对话框 */}
            <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>编辑角色</DialogTitle>
                  <DialogDescription>
                    修改角色信息（系统预设角色不可修改）
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>角色名称 *</Label>
                      <Input
                        placeholder="请输入角色名称"
                        value={roleFormData.name}
                        onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>角色编码 *</Label>
                      <Input
                        placeholder="请输入角色编码"
                        value={roleFormData.code}
                        onChange={(e) => setRoleFormData({ ...roleFormData, code: e.target.value.toUpperCase() })}
                        disabled={editingRole?.code === "ADMIN" || editingRole?.code === "USER" || editingRole?.code === "ENGINEER"}
                        className={editingRole?.code === "ADMIN" || editingRole?.code === "USER" || editingRole?.code === "ENGINEER" ? "bg-gray-100" : ""}
                      />
                      {(editingRole?.code === "ADMIN" || editingRole?.code === "USER" || editingRole?.code === "ENGINEER") && (
                        <p className="text-xs text-gray-500">系统预设角色编码不可修改</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>角色描述</Label>
                    <Input
                      placeholder="请输入角色描述"
                      value={roleFormData.description}
                      onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditRoleOpen(false);
                      resetRoleForm();
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleUpdateRole}
                  >
                    保存
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Card>
              {rolesLoading ? (
                <div className="p-12 text-center text-gray-500">加载中...</div>
              ) : filteredRoles.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  {searchQuery.trim() ? "没有找到匹配的角色" : "暂无角色数据"}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>角色名称</TableHead>
                      <TableHead>角色编码</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>用户数</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          {role.name}
                          {(role.code === "ADMIN" || role.code === "USER" || role.code === "ENGINEER") && (
                            <Badge variant="secondary" className="ml-2 text-xs">系统角色</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.code}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {role.description || "-"}
                      </TableCell>
                      <TableCell>{role.userCount}人</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(role.createdAt).toLocaleDateString("zh-CN")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="编辑"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {role.code !== "ADMIN" && role.code !== "USER" && role.code !== "ENGINEER" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="删除"
                              onClick={() => handleDeleteRole(role)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              删除
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* 操作日志 */}
        <TabsContent value="logs">
          <Card>
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                {searchQuery.trim() ? "没有找到匹配的日志" : "暂无操作日志"}
              </div>
            ) : (
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
                  {filteredLogs.map((log) => (
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
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
