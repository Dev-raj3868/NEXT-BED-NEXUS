'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface BillItem {
  id: string;
  category: string;
  // Common fields
  quantity: string;
  unitRate: string;
  discountAmount: string;
  discountReason: string;
  itemDate: Date | undefined;
  // OT Doctor Charge fields
  otId?: string;
  doctorId?: string;
  doctorName?: string;
  specialization?: string;
  visitDate?: Date | undefined;
  consultationType?: string;
  // Medicine fields
  medicineId?: string;
  medicineName?: string;
  medicineCode?: string;
  quantityDispensed?: string;
  unitOfMeasurement?: string;
  issueDate?: Date | undefined;
  issueReason?: string;
  // Bed Charges fields
  bedId?: string;
  roomId?: string;
  roomName?: string;
  floor?: string;
  department?: string;
  roomType?: string;
  durationDays?: string;
  checkInDate?: Date | undefined;
  checkOutDate?: Date | undefined;
  // OT Room Charges fields
  otRoomId?: string;
  otRoomName?: string;
  durationHours?: string;
  hourlyRate?: string;
  otDate?: Date | undefined;
  procedureName?: string;
  // OT Equipment fields
  equipmentId?: string;
  equipmentName?: string;
  quantityUsed?: string;
  // OT Other Charge
  description?: string;
}

const AddBill = () => {
  const [formData, setFormData] = useState({
    admissionId: "",
    patientName: "",
    patientMobileNumber: "",
  });

  const [billItems, setBillItems] = useState<BillItem[]>([
    {
      id: "1",
      category: "",
      quantity: "",
      unitRate: "",
      discountAmount: "",
      discountReason: "",
      itemDate: undefined,
    },
  ]);

  const categories = [
    "OT Doctor Charge",
    "Medicine",
    "Doctor Charge",
    "OT Other Charge",
    "OT Equipment",
    "Bed Charges",
    "OT Room Charges",
  ];

  const addBillItem = () => {
    setBillItems([
      ...billItems,
      {
        id: Date.now().toString(),
        category: "",
        quantity: "",
        unitRate: "",
        discountAmount: "",
        discountReason: "",
        itemDate: undefined,
      },
    ]);
  };

  const renderCategoryFields = (item: BillItem) => {
    switch (item.category) {
      case "OT Doctor Charge":
        return (
          <>
            <div className="space-y-2">
              <Label>OT ID</Label>
              <Input value={item.otId || ""} onChange={(e) => updateBillItem(item.id, "otId", e.target.value)} placeholder="Enter OT ID" />
            </div>
            <div className="space-y-2">
              <Label>Doctor ID</Label>
              <Input value={item.doctorId || ""} onChange={(e) => updateBillItem(item.id, "doctorId", e.target.value)} placeholder="Enter Doctor ID" />
            </div>
            <div className="space-y-2">
              <Label>Doctor Name</Label>
              <Input value={item.doctorName || ""} onChange={(e) => updateBillItem(item.id, "doctorName", e.target.value)} placeholder="Enter Doctor Name" />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input value={item.specialization || ""} onChange={(e) => updateBillItem(item.id, "specialization", e.target.value)} placeholder="Enter Specialization" />
            </div>
            <div className="space-y-2">
              <Label>Visit Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !item.visitDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {item.visitDate ? format(item.visitDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={item.visitDate} onSelect={(date) => updateBillItem(item.id, "visitDate", date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Consultation Type</Label>
              <Input value={item.consultationType || ""} onChange={(e) => updateBillItem(item.id, "consultationType", e.target.value)} placeholder="Enter Consultation Type" />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" value={item.unitRate || ""} onChange={(e) => updateBillItem(item.id, "unitRate", e.target.value)} placeholder="0.00" />
            </div>
          </>
        );
      case "Medicine":
        return (
          <>
            <div className="space-y-2">
              <Label>Medicine ID</Label>
              <Input value={item.medicineId || ""} onChange={(e) => updateBillItem(item.id, "medicineId", e.target.value)} placeholder="Enter Medicine ID" />
            </div>
            <div className="space-y-2">
              <Label>Medicine Name</Label>
              <Input value={item.medicineName || ""} onChange={(e) => updateBillItem(item.id, "medicineName", e.target.value)} placeholder="Enter Medicine Name" />
            </div>
            <div className="space-y-2">
              <Label>Medicine Code</Label>
              <Input value={item.medicineCode || ""} onChange={(e) => updateBillItem(item.id, "medicineCode", e.target.value)} placeholder="Enter Medicine Code" />
            </div>
            <div className="space-y-2">
              <Label>Quantity Dispensed</Label>
              <Input type="number" value={item.quantityDispensed || ""} onChange={(e) => updateBillItem(item.id, "quantityDispensed", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Unit of Measurement</Label>
              <Input value={item.unitOfMeasurement || ""} onChange={(e) => updateBillItem(item.id, "unitOfMeasurement", e.target.value)} placeholder="e.g., Tablets, ml" />
            </div>
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !item.issueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {item.issueDate ? format(item.issueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={item.issueDate} onSelect={(date) => updateBillItem(item.id, "issueDate", date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Issue Reason</Label>
              <Input value={item.issueReason || ""} onChange={(e) => updateBillItem(item.id, "issueReason", e.target.value)} placeholder="Enter Issue Reason" />
            </div>
            <div className="space-y-2">
              <Label>Unit Rate (₹)</Label>
              <Input type="number" value={item.unitRate || ""} onChange={(e) => updateBillItem(item.id, "unitRate", e.target.value)} placeholder="0.00" />
            </div>
          </>
        );
      case "Doctor Charge":
        return (
          <>
            <div className="space-y-2">
              <Label>Doctor ID</Label>
              <Input value={item.doctorId || ""} onChange={(e) => updateBillItem(item.id, "doctorId", e.target.value)} placeholder="Enter Doctor ID" />
            </div>
            <div className="space-y-2">
              <Label>Doctor Name</Label>
              <Input value={item.doctorName || ""} onChange={(e) => updateBillItem(item.id, "doctorName", e.target.value)} placeholder="Enter Doctor Name" />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input value={item.specialization || ""} onChange={(e) => updateBillItem(item.id, "specialization", e.target.value)} placeholder="Enter Specialization" />
            </div>
            <div className="space-y-2">
              <Label>Visit Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !item.visitDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {item.visitDate ? format(item.visitDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={item.visitDate} onSelect={(date) => updateBillItem(item.id, "visitDate", date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Consultation Type</Label>
              <Input value={item.consultationType || ""} onChange={(e) => updateBillItem(item.id, "consultationType", e.target.value)} placeholder="Enter Consultation Type" />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" value={item.unitRate || ""} onChange={(e) => updateBillItem(item.id, "unitRate", e.target.value)} placeholder="0.00" />
            </div>
          </>
        );
      case "Bed Charges":
        return (
          <>
            <div className="space-y-2">
              <Label>Bed ID</Label>
              <Input value={item.bedId || ""} onChange={(e) => updateBillItem(item.id, "bedId", e.target.value)} placeholder="Enter Bed ID" />
            </div>
            <div className="space-y-2">
              <Label>Room ID</Label>
              <Input value={item.roomId || ""} onChange={(e) => updateBillItem(item.id, "roomId", e.target.value)} placeholder="Enter Room ID" />
            </div>
            <div className="space-y-2">
              <Label>Room Name</Label>
              <Input value={item.roomName || ""} onChange={(e) => updateBillItem(item.id, "roomName", e.target.value)} placeholder="Enter Room Name" />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Input value={item.floor || ""} onChange={(e) => updateBillItem(item.id, "floor", e.target.value)} placeholder="Enter Floor" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={item.department || ""} onChange={(e) => updateBillItem(item.id, "department", e.target.value)} placeholder="Enter Department" />
            </div>
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Input value={item.roomType || ""} onChange={(e) => updateBillItem(item.id, "roomType", e.target.value)} placeholder="Enter Room Type" />
            </div>
            <div className="space-y-2">
              <Label>Duration (Days)</Label>
              <Input type="number" value={item.durationDays || ""} onChange={(e) => updateBillItem(item.id, "durationDays", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !item.checkInDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {item.checkInDate ? format(item.checkInDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={item.checkInDate} onSelect={(date) => updateBillItem(item.id, "checkInDate", date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !item.checkOutDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {item.checkOutDate ? format(item.checkOutDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={item.checkOutDate} onSelect={(date) => updateBillItem(item.id, "checkOutDate", date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Daily Rate (₹)</Label>
              <Input type="number" value={item.unitRate || ""} onChange={(e) => updateBillItem(item.id, "unitRate", e.target.value)} placeholder="0.00" />
            </div>
          </>
        );
      case "OT Room Charges":
        return (
          <>
            <div className="space-y-2">
              <Label>OT Room ID</Label>
              <Input value={item.otRoomId || ""} onChange={(e) => updateBillItem(item.id, "otRoomId", e.target.value)} placeholder="Enter OT Room ID" />
            </div>
            <div className="space-y-2">
              <Label>OT Room Name</Label>
              <Input value={item.otRoomName || ""} onChange={(e) => updateBillItem(item.id, "otRoomName", e.target.value)} placeholder="Enter OT Room Name" />
            </div>
            <div className="space-y-2">
              <Label>Duration (Hours)</Label>
              <Input type="number" value={item.durationHours || ""} onChange={(e) => updateBillItem(item.id, "durationHours", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Hourly Rate (₹)</Label>
              <Input type="number" value={item.hourlyRate || ""} onChange={(e) => updateBillItem(item.id, "hourlyRate", e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>OT Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !item.otDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {item.otDate ? format(item.otDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={item.otDate} onSelect={(date) => updateBillItem(item.id, "otDate", date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Procedure Name</Label>
              <Input value={item.procedureName || ""} onChange={(e) => updateBillItem(item.id, "procedureName", e.target.value)} placeholder="Enter Procedure Name" />
            </div>
          </>
        );
      case "OT Equipment":
        return (
          <>
            <div className="space-y-2">
              <Label>Equipment ID</Label>
              <Input value={item.equipmentId || ""} onChange={(e) => updateBillItem(item.id, "equipmentId", e.target.value)} placeholder="Enter Equipment ID" />
            </div>
            <div className="space-y-2">
              <Label>Equipment Name</Label>
              <Input value={item.equipmentName || ""} onChange={(e) => updateBillItem(item.id, "equipmentName", e.target.value)} placeholder="Enter Equipment Name" />
            </div>
            <div className="space-y-2">
              <Label>Quantity Used</Label>
              <Input type="number" value={item.quantityUsed || ""} onChange={(e) => updateBillItem(item.id, "quantityUsed", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Unit Rate (₹)</Label>
              <Input type="number" value={item.unitRate || ""} onChange={(e) => updateBillItem(item.id, "unitRate", e.target.value)} placeholder="0.00" />
            </div>
          </>
        );
      case "OT Other Charge":
        return (
          <>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Input value={item.description || ""} onChange={(e) => updateBillItem(item.id, "description", e.target.value)} placeholder="Enter charge description" />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" value={item.unitRate || ""} onChange={(e) => updateBillItem(item.id, "unitRate", e.target.value)} placeholder="0.00" />
            </div>
          </>
        );
      default:
        return null;
      }
    };

  const removeBillItem = (id: string) => {
    if (billItems.length > 1) {
      setBillItems(billItems.filter((item) => item.id !== id));
    }
  };

  const updateBillItem = (id: string, field: keyof BillItem, value: any) => {
    setBillItems(
      billItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return billItems.reduce((total, item) => {
      let amount = 0;
      switch (item.category) {
        case "OT Doctor Charge":
        case "Doctor Charge":
        case "OT Other Charge":
          amount = parseFloat(item.unitRate) || 0;
          break;
        case "Medicine":
          const medQty = parseFloat(item.quantityDispensed || item.quantity) || 0;
          const medRate = parseFloat(item.unitRate) || 0;
          amount = medQty * medRate;
          break;
        case "Bed Charges":
          const bedDays = parseFloat(item.durationDays || item.quantity) || 0;
          const bedRate = parseFloat(item.unitRate) || 0;
          amount = bedDays * bedRate;
          break;
        case "OT Room Charges":
          const otHours = parseFloat(item.durationHours || item.quantity) || 0;
          const otRate = parseFloat(item.hourlyRate || item.unitRate) || 0;
          amount = otHours * otRate;
          break;
        case "OT Equipment":
          const equipQty = parseFloat(item.quantityUsed || item.quantity) || 0;
          const equipRate = parseFloat(item.unitRate) || 0;
          amount = equipQty * equipRate;
          break;
        default:
          const qty = parseFloat(item.quantity) || 0;
          const rate = parseFloat(item.unitRate) || 0;
          amount = qty * rate;
      }
      const discount = parseFloat(item.discountAmount) || 0;
      return total + (amount - discount);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bill data:", { ...formData, billItems });
    toast({
      title: "Success",
      description: "Bill created successfully!",
    });
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Bill</h1>
        <p className="text-muted-foreground">Add billing items for a patient admission</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
        {/* Patient Info */}
        <Card suppressHydrationWarning>
          <CardHeader>
            <CardTitle className="text-lg">Patient Information</CardTitle>
          </CardHeader>
          <CardContent suppressHydrationWarning>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" suppressHydrationWarning>
              <div className="space-y-2">
                <Label htmlFor="admissionId">Admission ID</Label>
                <Input
                  id="admissionId"
                  value={formData.admissionId}
                  onChange={(e) => setFormData({ ...formData, admissionId: e.target.value })}
                  placeholder="Enter admission ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientMobileNumber">Patient Mobile Number</Label>
                <Input
                  id="patientMobileNumber"
                  value={formData.patientMobileNumber}
                  onChange={(e) => setFormData({ ...formData, patientMobileNumber: e.target.value })}
                  placeholder="Enter patient mobile number"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bill Items */}
        <Card suppressHydrationWarning>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Bill Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addBillItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent suppressHydrationWarning className="space-y-6">
            {billItems.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-4 bg-muted/30" suppressHydrationWarning>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {billItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBillItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={item.category}
                      onValueChange={(value) => updateBillItem(item.id, "category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {item.category && (
                    <>
                      {renderCategoryFields(item)}
                    </>
                  )}
                </div>

                {item.category && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label>Discount Amount (₹)</Label>
                      <Input
                        type="number"
                        value={item.discountAmount}
                        onChange={(e) => updateBillItem(item.id, "discountAmount", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Reason</Label>
                      <Input
                        value={item.discountReason}
                        onChange={(e) => updateBillItem(item.id, "discountReason", e.target.value)}
                        placeholder="Enter discount reason (if any)"
                      />
                    </div>
                  </div>
                )}

                {item.category && (
                  <div className="flex justify-end border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        let amount = 0;
                        switch (item.category) {
                          case "OT Doctor Charge":
                          case "Doctor Charge":
                          case "OT Other Charge":
                            amount = parseFloat(item.unitRate) || 0;
                            break;
                          case "Medicine":
                            const medQty = parseFloat(item.quantityDispensed || item.quantity) || 0;
                            const medRate = parseFloat(item.unitRate) || 0;
                            amount = medQty * medRate;
                            break;
                          case "Bed Charges":
                            const bedDays = parseFloat(item.durationDays || item.quantity) || 0;
                            const bedRate = parseFloat(item.unitRate) || 0;
                            amount = bedDays * bedRate;
                            break;
                          case "OT Room Charges":
                            const otHours = parseFloat(item.durationHours || item.quantity) || 0;
                            const otRate = parseFloat(item.hourlyRate || item.unitRate) || 0;
                            amount = otHours * otRate;
                            break;
                          case "OT Equipment":
                            const equipQty = parseFloat(item.quantityUsed || item.quantity) || 0;
                            const equipRate = parseFloat(item.unitRate) || 0;
                            amount = equipQty * equipRate;
                            break;
                          default:
                            amount = 0;
                        }
                        const discount = parseFloat(item.discountAmount) || 0;
                        return `Item Total: ₹${(amount - discount).toFixed(2)}`;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t">
              <div className="text-lg font-semibold">
                Grand Total: ₹{calculateTotal().toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="sm">
          Create Bill
        </Button>
      </form>
    </div>
  );
};

export default AddBill;
