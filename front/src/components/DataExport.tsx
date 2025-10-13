import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";

interface DataExportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataType: string;
}

export function DataExport({ open, onOpenChange, dataType }: DataExportProps) {
  const [exportFormat, setExportFormat] = useState("excel");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "basic",
    "contact",
    "address",
  ]);

  const fieldOptions = [
    { id: "basic", label: "基本信息", checked: true },
    { id: "contact", label: "联系方式", checked: true },
    { id: "address", label: "地址信息", checked: true },
    { id: "payment", label: "缴费记录", checked: false },
    { id: "repair", label: "报修记录", checked: false },
  ];

  const handleExport = () => {
    // 模拟导出功能
    console.log("导出数据:", {
      dataType,
      format: exportFormat,
      fields: selectedFields,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>导出数据</DialogTitle>
          <DialogDescription>
            选择导出格式和需要导出的字段
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 导出格式 */}
          <div className="space-y-3">
            <Label>导出格式</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="excel" id="excel" />
                <label
                  htmlFor="excel"
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm">Excel (.xlsx)</div>
                    <div className="text-xs text-gray-500">
                      适合数据分析和编辑
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="csv" id="csv" />
                <label
                  htmlFor="csv"
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm">CSV (.csv)</div>
                    <div className="text-xs text-gray-500">
                      通用格式，兼容性好
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="pdf" id="pdf" />
                <label
                  htmlFor="pdf"
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-sm">PDF (.pdf)</div>
                    <div className="text-xs text-gray-500">
                      适合打印和存档
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* 选择字段 */}
          <div className="space-y-3">
            <Label>选择导出字段</Label>
            <div className="space-y-2 border rounded-lg p-3">
              {fieldOptions.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    defaultChecked={field.checked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFields([...selectedFields, field.id]);
                      } else {
                        setSelectedFields(
                          selectedFields.filter((f) => f !== field.id)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={field.id}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
