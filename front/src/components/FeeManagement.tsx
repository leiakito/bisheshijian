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
import { Search, Plus, Download, CheckCircle, Clock, DollarSign, Edit, Trash2, CalendarPlus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  getAllBills,
  createBill,
  getAllPayments,
  createPayment,
  getAllFeeItems,
  createFeeItem,
  updateFeeItem,
  deleteFeeItem,
  toggleFeeItemStatus,
  generateBillsFromFeeItem,
  getStatistics
} from "../services/feeService";
import { getResidents } from "../services/residentService";
import type { Bill, BillRequest, Payment, PaymentRequest, FeeItem, FeeItemRequest, FeeStatistics, Resident } from "../types/api";
import { toast } from "sonner";

// 计费单位选项
const BILLING_UNITS = [
  { value: "元/㎡/月", label: "元/㎡/月" },
  { value: "元/月", label: "元/月" },
  { value: "元/㎡", label: "元/㎡" },
  { value: "元/次", label: "元/次" },
  { value: "元/年", label: "元/年" },
  { value: "元/户/月", label: "元/户/月" },
  { value: "元/辆/月", label: "元/辆/月" },
];

const getDefaultBillingPeriod = () => {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月`;
};

export function FeeManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  // 账单管理状态
  const [bills, setBills] = useState<Bill[]>([]);
  const [billsLoading, setBillsLoading] = useState(true);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isPayBillOpen, setIsPayBillOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // 缴费记录状态
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  // 收费项目状态
  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const [feeItemsLoading, setFeeItemsLoading] = useState(true);
  const [isAddFeeItemOpen, setIsAddFeeItemOpen] = useState(false);
  const [isEditFeeItemOpen, setIsEditFeeItemOpen] = useState(false);
  const [selectedFeeItem, setSelectedFeeItem] = useState<FeeItem | null>(null);
  const [isGenerateBillsOpen, setIsGenerateBillsOpen] = useState(false);
  const [targetFeeItem, setTargetFeeItem] = useState<FeeItem | null>(null);
  const [generateBillingPeriod, setGenerateBillingPeriod] = useState<string>(getDefaultBillingPeriod());

  // 统计数据
  const [statistics, setStatistics] = useState<FeeStatistics>({
    monthlyReceivable: 0,
    monthlyReceived: 0,
    totalArrears: 0,
    paymentRate: 0,
  });

  // 住户列表（用于选择）
  const [residents, setResidents] = useState<Resident[]>([]);

  // 账单表单数据
  const [billFormData, setBillFormData] = useState<BillRequest>({
    ownerName: "",
    building: "",
    type: "",
    amount: 0,
    billingPeriod: "",
  });

  // 缴费表单数据
  const [paymentFormData, setPaymentFormData] = useState({
    payMethod: "",
  });

  // 收费项目表单数据
  const [feeItemFormData, setFeeItemFormData] = useState<FeeItemRequest>({
    name: "",
    unit: "",
    price: 0,
    description: "",
  });

  // 加载数据
  useEffect(() => {
    loadBills();
    loadPayments();
    loadFeeItems();
    loadStatistics();
    loadResidents();
  }, []);

  const loadBills = async () => {
    try {
      setBillsLoading(true);
      const data = await getAllBills();
      setBills(data);
    } catch (err) {
      console.error("Failed to load bills:", err);
      toast.error("加载账单列表失败");
    } finally {
      setBillsLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      setPaymentsLoading(true);
      const data = await getAllPayments();
      setPayments(data);
    } catch (err) {
      console.error("Failed to load payments:", err);
      toast.error("加载缴费记录失败");
    } finally {
      setPaymentsLoading(false);
    }
  };

  const loadFeeItems = async () => {
    try {
      setFeeItemsLoading(true);
      const data = await getAllFeeItems();
      setFeeItems(data);
    } catch (err) {
      console.error("Failed to load fee items:", err);
      toast.error("加载收费项目失败");
    } finally {
      setFeeItemsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      console.log("开始加载统计数据...");
      const data = await getStatistics();
      console.log("统计数据加载成功:", data);
      setStatistics(data);
    } catch (err) {
      console.error("Failed to load statistics:", err);
      toast.error("加载统计数据失败");
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

  // ========== 账单管理 ==========

  const handleAddBill = async () => {
    if (!billFormData.ownerName || !billFormData.building || !billFormData.type ||
        !billFormData.amount || !billFormData.billingPeriod) {
      toast.error("请填写所有必填项");
      return;
    }

    try {
      await createBill(billFormData);
      toast.success("生成账单成功");
      setIsAddBillOpen(false);
      resetBillForm();
      loadBills();
      loadStatistics();
    } catch (err) {
      console.error("Failed to create bill:", err);
      toast.error(err instanceof Error ? err.message : "生成账单失败");
    }
  };

  const handlePayBill = async () => {
    if (!selectedBill || !paymentFormData.payMethod) {
      toast.error("请选择支付方式");
      return;
    }

    try {
      await createPayment({
        billId: selectedBill.id,
        payMethod: paymentFormData.payMethod,
      });
      toast.success("缴费成功");
      setIsPayBillOpen(false);
      setSelectedBill(null);
      setPaymentFormData({ payMethod: "" });
      loadBills();
      loadPayments();
      loadStatistics();
    } catch (err) {
      console.error("Failed to pay bill:", err);
      toast.error(err instanceof Error ? err.message : "缴费失败");
    }
  };

  const fillBillFromResident = (residentId: number) => {
    const resident = residents.find(r => r.id === residentId);
    if (resident) {
      setBillFormData({
        ...billFormData,
        ownerName: resident.name,
        building: `${resident.building} ${resident.unit} ${resident.roomNumber}`,
      });
    }
  };

  const resetBillForm = () => {
    setBillFormData({
      ownerName: "",
      building: "",
      type: "",
      amount: 0,
      billingPeriod: "",
    });
  };

  // ========== 收费项目 ==========

  const handleAddFeeItem = async () => {
    if (!feeItemFormData.name || !feeItemFormData.unit || !feeItemFormData.price) {
      toast.error("请填写所有必填项");
      return;
    }

    try {
      await createFeeItem(feeItemFormData);
      toast.success("添加收费项目成功");
      setIsAddFeeItemOpen(false);
      resetFeeItemForm();
      loadFeeItems();
    } catch (err) {
      console.error("Failed to create fee item:", err);
      toast.error(err instanceof Error ? err.message : "添加失败");
    }
  };

  const handleUpdateFeeItem = async () => {
    if (!selectedFeeItem) return;

    if (!feeItemFormData.name || !feeItemFormData.unit || !feeItemFormData.price) {
      toast.error("请填写所有必填项");
      return;
    }

    try {
      await updateFeeItem(selectedFeeItem.id, feeItemFormData);
      toast.success("更新收费项目成功");
      setIsEditFeeItemOpen(false);
      setSelectedFeeItem(null);
      resetFeeItemForm();
      loadFeeItems();
    } catch (err) {
      console.error("Failed to update fee item:", err);
      toast.error(err instanceof Error ? err.message : "更新失败");
    }
  };

  const handleDeleteFeeItem = async (id: number) => {
    if (!confirm("确定要删除这个收费项目吗？")) return;

    try {
      await deleteFeeItem(id);
      toast.success("删除成功");
      loadFeeItems();
    } catch (err) {
      console.error("Failed to delete fee item:", err);
      toast.error(err instanceof Error ? err.message : "删除失败");
    }
  };

  const handleToggleFeeItemStatus = async (item: FeeItem) => {
    try {
      await toggleFeeItemStatus(item.id);
      toast.success(item.status === "ACTIVE" ? "已停用" : "已启用");
      loadFeeItems();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      toast.error("操作失败");
    }
  };

  const openGenerateBillsDialog = (item: FeeItem) => {
    setTargetFeeItem(item);
    setGenerateBillingPeriod(getDefaultBillingPeriod());
    setIsGenerateBillsOpen(true);
  };

  const handleGenerateDialogChange = (open: boolean) => {
    setIsGenerateBillsOpen(open);
    if (!open) {
      setTargetFeeItem(null);
      setGenerateBillingPeriod(getDefaultBillingPeriod());
    }
  };

  const handleGenerateBills = async () => {
    if (!targetFeeItem) return;

    if (!generateBillingPeriod.trim()) {
      toast.error("请输入账期，例如 2025年1月");
      return;
    }

    try {
      const bills = await generateBillsFromFeeItem(targetFeeItem.id, {
        billingPeriod: generateBillingPeriod.trim(),
      });
      toast.success(`已生成 ${bills.length} 条账单`);
      handleGenerateDialogChange(false);
      loadBills();
      loadStatistics();
    } catch (err) {
      console.error("Failed to generate bills:", err);
      toast.error(err instanceof Error ? err.message : "批量生成账单失败");
    }
  };

  const openEditFeeItemDialog = (item: FeeItem) => {
    setSelectedFeeItem(item);
    setFeeItemFormData({
      name: item.name,
      unit: item.unit,
      price: item.price,
      description: item.description || "",
    });
    setIsEditFeeItemOpen(true);
  };

  const resetFeeItemForm = () => {
    setFeeItemFormData({
      name: "",
      unit: "",
      price: 0,
      description: "",
    });
  };

  // ========== 导出数据 ==========

  const handleExportData = () => {
    // 简单的CSV导出
    const csvData = bills.map(bill => ({
      账单号: bill.billNumber,
      业主: bill.ownerName,
      房屋地址: bill.building,
      费用类型: bill.type,
      金额: bill.amount,
      账期: bill.billingPeriod,
      状态: statusLabels[bill.status],
      缴费时间: bill.paidAt || "-",
      支付方式: bill.payMethod || "-",
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => headers.map(h => row[h as keyof typeof row]).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `账单数据_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("导出成功");
  };

  // ========== 搜索和过滤 ==========

  const filteredBills = useMemo(() => {
    if (!searchQuery.trim()) {
      return bills;
    }
    const query = searchQuery.toLowerCase();
    return bills.filter((bill) => {
      return (
        bill.billNumber?.toLowerCase().includes(query) ||
        bill.ownerName?.toLowerCase().includes(query) ||
        bill.building?.toLowerCase().includes(query) ||
        bill.type?.toLowerCase().includes(query)
      );
    });
  }, [bills, searchQuery]);

  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) {
      return payments;
    }
    const query = searchQuery.toLowerCase();
    return payments.filter((payment) => {
      return (
        payment.orderNumber?.toLowerCase().includes(query) ||
        payment.ownerName?.toLowerCase().includes(query) ||
        payment.building?.toLowerCase().includes(query) ||
        payment.type?.toLowerCase().includes(query)
      );
    });
  }, [payments, searchQuery]);

  const filteredFeeItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return feeItems;
    }
    const query = searchQuery.toLowerCase();
    return feeItems.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.unit?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    });
  }, [feeItems, searchQuery]);

  const occupiedResidentCount = useMemo(
    () => residents.filter((resident) => resident.status === "OCCUPIED").length,
    [residents],
  );

  // ========== 样式和标签 ==========

  const statusColors: Record<string, string> = {
    PAID: "default",
    PENDING: "secondary",
    OVERDUE: "destructive",
    SUCCESS: "default",
    FAILED: "destructive",
    ACTIVE: "default",
    INACTIVE: "secondary",
  };

  const statusLabels: Record<string, string> = {
    PAID: "已缴费",
    PENDING: "待缴费",
    OVERDUE: "逾期",
    SUCCESS: "成功",
    FAILED: "失败",
    ACTIVE: "启用",
    INACTIVE: "停用",
  };

  return (
    <div className="space-y-6">
      {/* 费用统计 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">财务统计</h2>
          <Button variant="outline" size="sm" onClick={loadStatistics}>
            刷新统计
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本月应收</p>
                <h3 className="text-2xl font-bold text-blue-600 mt-2">
                  ¥{statistics.monthlyReceivable.toLocaleString()}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">本月实收</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">
                ¥{statistics.monthlyReceived.toLocaleString()}
              </h3>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">欠费总额</p>
              <h3 className="text-2xl font-bold text-red-600 mt-2">
                ¥{statistics.totalArrears.toLocaleString()}
              </h3>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div>
            <p className="text-gray-500 text-sm">缴费率</p>
            <h3 className="text-2xl font-bold text-orange-600 mt-2">
              {statistics.paymentRate.toFixed(1)}%
            </h3>
            <Progress value={statistics.paymentRate} className="mt-3" />
          </div>
        </Card>
        </div>
      </div>

      {/* 操作栏 */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="搜索业主、房号、订单号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </Button>
            <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  生成账单
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>生成账单</DialogTitle>
                  <DialogDescription>
                    填写账单信息
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>选择住户（可选）</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      onChange={(e) => fillBillFromResident(Number(e.target.value))}
                    >
                      <option value={0}>请选择住户（自动填充信息）</option>
                      {residents.map((resident) => (
                        <option key={resident.id} value={resident.id}>
                          {resident.name} - {resident.building} {resident.unit} {resident.roomNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>业主姓名 *</Label>
                      <Input
                        placeholder="请输入业主姓名"
                        value={billFormData.ownerName}
                        onChange={(e) => setBillFormData({ ...billFormData, ownerName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>房屋地址 *</Label>
                      <Input
                        placeholder="如: 1号楼 2单元 301"
                        value={billFormData.building}
                        onChange={(e) => setBillFormData({ ...billFormData, building: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>费用类型 *</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={billFormData.type}
                        onChange={(e) => setBillFormData({ ...billFormData, type: e.target.value })}
                      >
                        <option value="">请选择类型</option>
                        <option value="物业费">物业费</option>
                        <option value="停车费">停车费</option>
                        <option value="电梯费">电梯费</option>
                        <option value="垃圾清运费">垃圾清运费</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>金额 *</Label>
                      <Input
                        type="number"
                        placeholder="请输入金额"
                        value={billFormData.amount || ""}
                        onChange={(e) => setBillFormData({ ...billFormData, amount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>账期 *</Label>
                    <Input
                      placeholder="如: 2025年1月"
                      value={billFormData.billingPeriod}
                      onChange={(e) => setBillFormData({ ...billFormData, billingPeriod: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddBillOpen(false);
                      resetBillForm();
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddBill}
                  >
                    生成
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* 标签页 */}
      <Tabs defaultValue="bills" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bills">账单管理</TabsTrigger>
          <TabsTrigger value="records">缴费记录</TabsTrigger>
          <TabsTrigger value="items">收费项目</TabsTrigger>
        </TabsList>

        {/* 账单管理 */}
        <TabsContent value="bills">
          <Card>
            {billsLoading ? (
              <div className="p-12 text-center text-gray-500">加载中...</div>
            ) : filteredBills.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                {searchQuery.trim() ? "没有找到匹配的账单" : "暂无账单数据"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>账单号</TableHead>
                    <TableHead>业主</TableHead>
                    <TableHead>房屋地址</TableHead>
                    <TableHead>费用类型</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>账期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>缴费时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="text-sm text-gray-500">
                        {bill.billNumber}
                      </TableCell>
                      <TableCell>{bill.ownerName}</TableCell>
                      <TableCell>{bill.building}</TableCell>
                      <TableCell>{bill.type}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ¥{bill.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{bill.billingPeriod}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[bill.status] as any}>
                          {bill.status === "PAID" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {bill.status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
                          {statusLabels[bill.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {bill.paidAt || "-"}
                      </TableCell>
                      <TableCell>
                        {bill.status !== "PAID" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                            onClick={() => {
                              setSelectedBill(bill);
                              setIsPayBillOpen(true);
                            }}
                          >
                            缴费
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* 缴费对话框 */}
          <Dialog open={isPayBillOpen} onOpenChange={setIsPayBillOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>缴费</DialogTitle>
                <DialogDescription>
                  为账单 {selectedBill?.billNumber} 记录缴费信息
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">账单信息</p>
                  <div className="bg-gray-50 p-4 rounded-md space-y-1">
                    <p><span className="text-gray-600">业主：</span>{selectedBill?.ownerName}</p>
                    <p><span className="text-gray-600">房屋：</span>{selectedBill?.building}</p>
                    <p><span className="text-gray-600">类型：</span>{selectedBill?.type}</p>
                    <p><span className="text-gray-600">金额：</span>
                      <span className="text-green-600 font-semibold">¥{selectedBill?.amount.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>支付方式 *</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={paymentFormData.payMethod}
                    onChange={(e) => setPaymentFormData({ payMethod: e.target.value })}
                  >
                    <option value="">请选择支付方式</option>
                    <option value="微信支付">微信支付</option>
                    <option value="支付宝">支付宝</option>
                    <option value="现金">现金</option>
                    <option value="银行转账">银行转账</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPayBillOpen(false);
                    setSelectedBill(null);
                    setPaymentFormData({ payMethod: "" });
                  }}
                >
                  取消
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handlePayBill}
                >
                  确认缴费
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 缴费记录 */}
        <TabsContent value="records">
          <Card>
            {paymentsLoading ? (
              <div className="p-12 text-center text-gray-500">加载中...</div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                {searchQuery.trim() ? "没有找到匹配的缴费记录" : "暂无缴费记录"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单号</TableHead>
                    <TableHead>业主</TableHead>
                    <TableHead>房屋地址</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>费用类型</TableHead>
                    <TableHead>支付方式</TableHead>
                    <TableHead>缴费时间</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-sm text-gray-500">
                        {payment.orderNumber}
                      </TableCell>
                      <TableCell>{payment.ownerName}</TableCell>
                      <TableCell>{payment.building}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ¥{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.payMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleString("zh-CN")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[payment.status] as any}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {statusLabels[payment.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        {/* 收费项目 */}
        <TabsContent value="items">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddFeeItemOpen} onOpenChange={setIsAddFeeItemOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新增收费项目
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新增收费项目</DialogTitle>
                    <DialogDescription>
                      填写收费项目信息
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>项目名称 *</Label>
                      <Input
                        placeholder="如: 物业费"
                        value={feeItemFormData.name}
                        onChange={(e) => setFeeItemFormData({ ...feeItemFormData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>计费单位 *</Label>
                        <Select
                          value={feeItemFormData.unit}
                          onValueChange={(value) => setFeeItemFormData({ ...feeItemFormData, unit: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="请选择计费单位" />
                          </SelectTrigger>
                          <SelectContent>
                            {BILLING_UNITS.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>单价 *</Label>
                        <Input
                          type="number"
                          placeholder="请输入单价"
                          value={feeItemFormData.price || ""}
                          onChange={(e) => setFeeItemFormData({ ...feeItemFormData, price: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>说明</Label>
                      <Input
                        placeholder="请输入说明"
                        value={feeItemFormData.description}
                        onChange={(e) => setFeeItemFormData({ ...feeItemFormData, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddFeeItemOpen(false);
                        resetFeeItemForm();
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddFeeItem}
                    >
                      添加
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              {feeItemsLoading ? (
                <div className="p-12 text-center text-gray-500">加载中...</div>
              ) : filteredFeeItems.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  {searchQuery.trim() ? "没有找到匹配的收费项目" : "暂无收费项目"}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>项目名称</TableHead>
                      <TableHead>单价</TableHead>
                      <TableHead>计费单位</TableHead>
                      <TableHead>说明</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeeItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          ¥{item.price.toLocaleString()}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-gray-500">
                          {item.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[item.status] as any}>
                            {statusLabels[item.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600"
                              onClick={() => openGenerateBillsDialog(item)}
                              disabled={item.status !== "ACTIVE"}
                            >
                              <CalendarPlus className="w-4 h-4 mr-1" />
                              生成账单
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditFeeItemDialog(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFeeItemStatus(item)}
                            >
                              {item.status === "ACTIVE" ? "停用" : "启用"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteFeeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            <Dialog open={isGenerateBillsOpen} onOpenChange={handleGenerateDialogChange}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>批量生成账单</DialogTitle>
                  <DialogDescription>
                    根据收费项目自动为已入住住户生成账单
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-gray-50 rounded-md p-4 space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="text-gray-500">收费项目：</span>
                      {targetFeeItem?.name ?? "-"}
                    </p>
                    <p>
                      <span className="text-gray-500">当前住户（已入住）：</span>
                      {occupiedResidentCount} 户
                    </p>
                    <p className="text-xs text-gray-500">
                      系统会跳过已存在相同账期账单的住户。
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>账期 *</Label>
                    <Input
                      placeholder="例如：2025年1月"
                      value={generateBillingPeriod}
                      onChange={(e) => setGenerateBillingPeriod(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateDialogChange(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleGenerateBills}
                    disabled={!targetFeeItem}
                  >
                    生成
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* 编辑收费项目对话框 */}
            <Dialog open={isEditFeeItemOpen} onOpenChange={setIsEditFeeItemOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>编辑收费项目</DialogTitle>
                  <DialogDescription>
                    修改收费项目信息
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>项目名称 *</Label>
                    <Input
                      placeholder="如: 物业费"
                      value={feeItemFormData.name}
                      onChange={(e) => setFeeItemFormData({ ...feeItemFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>计费单位 *</Label>
                      <Select
                        value={feeItemFormData.unit}
                        onValueChange={(value) => setFeeItemFormData({ ...feeItemFormData, unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择计费单位" />
                        </SelectTrigger>
                        <SelectContent>
                          {BILLING_UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>单价 *</Label>
                      <Input
                        type="number"
                        placeholder="请输入单价"
                        value={feeItemFormData.price || ""}
                        onChange={(e) => setFeeItemFormData({ ...feeItemFormData, price: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>说明</Label>
                    <Input
                      placeholder="请输入说明"
                      value={feeItemFormData.description}
                      onChange={(e) => setFeeItemFormData({ ...feeItemFormData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditFeeItemOpen(false);
                      setSelectedFeeItem(null);
                      resetFeeItemForm();
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleUpdateFeeItem}
                  >
                    保存
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
