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
  room: string;
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
  room: string;
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
  building: string;
  unit: string;
  room: string;
  complaintType: string;
  description: string;
  status: string;
  submitTime: string;
  processedBy?: string;
  processedTime?: string;
  response?: string;
}

export interface ComplaintRequest {
  building: string;
  unit: string;
  room: string;
  complaintType: string;
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

// 房产单元类型
export interface PropertyUnit {
  id: number;
  building: string;
  unit: string;
  room: string;
  area: number;
  propertyType: string;
  status: string;
  ownerName?: string;
  ownerPhone?: string;
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
