// API 响应包装类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 登录相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  displayName: string;
  roles: string[];
}

// 仪表盘数据类型
export interface DashboardSummary {
  totalResidents: number;
  pendingRepairs: number;
  pendingComplaints: number;
  monthlyIncome: number;
  occupancyRate: number;
  paymentRate: number;
}

// 住户相关类型
export interface Resident {
  id: number;
  name: string;
  phone: string;
  idCard: string;
  building: string;
  unit: string;
  roomNumber: string;
  area?: string;
  residenceType: string;
  moveInDate: string;
  status: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  remark?: string;
}

export interface ResidentRequest {
  name: string;
  phone: string;
  idCard: string;
  building: string;
  unit: string;
  roomNumber: string;
  area?: string;
  residenceType: string;
  moveInDate: string;
  status: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  remark?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 报修工单类型
export interface RepairOrder {
  id: number;
  building: string;
  unit: string;
  room: string;
  repairType: string;
  description: string;
  status: string;
  submitTime: string;
  assignedTo?: string;
  completedTime?: string;
  remark?: string;
}

export interface RepairOrderRequest {
  building: string;
  unit: string;
  room: string;
  repairType: string;
  description: string;
}

export interface RepairStatusUpdateRequest {
  status: string;
  remark?: string;
}

// 投诉类型
export interface Complaint {
  id: number;
  ownerName: string;
  phone: string;
  type: string;
  description: string;
  status: string; // RECEIVED, PROCESSING, COMPLETED, CLOSED
  processedBy?: string;
  reply?: string;
  feedbackDeadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplaintRequest {
  ownerName: string;
  phone: string;
  type: string;
  description: string;
}

// 公告类型
export interface Announcement {
  id?: number;
  title: string;
  content: string;
  targetScope?: string;
  publishAt?: string;
  // 扩展字段（用于前端显示）
  category?: string;
  publisher?: string;
  important?: boolean;
}

export interface AnnouncementRequest {
  title: string;
  content: string;
  targetScope?: string;
}

// 车辆类型
export interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: string;
  ownerName: string;
  ownerPhone: string;
  parkingSpace?: string;
  building: string;
  unit: string;
  room: string;
  registrationDate: string;
}

// 账单类型
export interface FeeBill {
  id: number;
  building: string;
  unit: string;
  room: string;
  billType: string;
  amount: number;
  billingPeriod: string;
  dueDate: string;
  status: string;
  paymentTime?: string;
  remark?: string;
}

// 公共设施类型
export interface Facility {
  id: number;
  name: string;
  type: string;
  location: string;
  status: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  responsible?: string;
}

export interface FacilityRequest {
  name: string;
  type: string;
  location: string;
  status: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  responsible?: string;
}

// 停车位类型
export interface ParkingSpace {
  id: number;
  spaceNumber: string;
  area?: string;
  type?: string;
  owner?: string;
  building?: string;
  plateNumber?: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

export interface ParkingSpaceRequest {
  spaceNumber: string;
  area?: string;
  type?: string;
  owner?: string;
  building?: string;
  plateNumber?: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'announcement' | 'complaint' | 'system';
  title: string;
  content: string;
  time: string;
  read: boolean;
  icon?: any;
  color?: string;
  bg?: string;
  sourceId?: number; // 原始数据的ID（公告ID或投诉ID）
}

// 用户管理类型
export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  phone?: string;
  email?: string;
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // Resident info
  residentId?: number;
  residentName?: string;
  residentPhone?: string;
  building?: string;
  unit?: string;
  roomNumber?: string;
  // Role info
  roleCode?: string;
  roleName?: string;
}

export interface UserRequest {
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  email?: string;
  residentId: number;
  roleId: number;
  active?: boolean;
}

// 角色类型
export interface Role {
  id: number;
  code: string;
  name: string;
  description?: string;
}

// 角色响应类型（包含统计信息）
export interface RoleResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

// 角色请求类型
export interface RoleRequest {
  code: string;
  name: string;
  description?: string;
}

// 报修订单类型（完整）
export interface RepairOrder {
  id: number;
  orderNumber: string;
  ownerName: string;
  phone: string;
  building: string;
  unit: string;
  roomNumber: string;
  type: string;
  description: string;
  priority: string; // NORMAL, URGENT
  status: string; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  assignedWorker?: string;
  startedAt?: string;
  finishedAt?: string;
  evaluationScore?: number;
  evaluationRemark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepairOrderRequest {
  ownerName: string;
  phone: string;
  building: string;
  unit: string;
  roomNumber: string;
  type: string;
  description: string;
  priority?: string;
}

export interface RepairStatusUpdateRequest {
  status: string;
  assignedWorker?: string;
  evaluationScore?: number;
  evaluationRemark?: string;
}

// 收费账单类型
export interface Bill {
  id: number;
  billNumber: string;
  ownerName: string;
  building: string;
  type: string;
  amount: number;
  billingPeriod: string;
  status: string; // PAID, PENDING, OVERDUE
  paidAt?: string;
  payMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillRequest {
  ownerName: string;
  building: string;
  type: string;
  amount: number;
  billingPeriod: string;
}

export interface GenerateBillsRequest {
  billingPeriod: string;
}

// 缴费记录类型
export interface Payment {
  id: number;
  orderNumber: string;
  billId?: number;
  ownerName: string;
  building: string;
  amount: number;
  type: string;
  payMethod: string;
  status: string; // SUCCESS, FAILED, PENDING
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  billId: number;
  payMethod: string;
}

// 收费项目类型
export interface FeeItem {
  id: number;
  name: string;
  unit: string;
  price: number;
  description?: string;
  status: string; // ACTIVE, INACTIVE
  createdAt: string;
  updatedAt: string;
}

export interface FeeItemRequest {
  name: string;
  unit: string;
  price: number;
  description?: string;
}

// 财务统计类型
export interface FeeStatistics {
  monthlyReceivable: number;  // 本月应收
  monthlyReceived: number;    // 本月实收
  totalArrears: number;       // 欠费总额
  paymentRate: number;        // 缴费率
}
