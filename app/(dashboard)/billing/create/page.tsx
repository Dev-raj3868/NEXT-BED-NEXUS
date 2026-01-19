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
  itemDescription: string;
  quantity: string;
  unitRate: string;
  discountAmount: string;
  discountReason: string;
  itemDate: Date | undefined;
}

const AddBill = () => {
  const [formData, setFormData] = useState({
    admissionId: "",
    patientId: "",
  });

  const [billItems, setBillItems] = useState<BillItem[]>([
    {
      id: "1",
      category: "",
      itemDescription: "",
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
        itemDescription: "",
        quantity: "",
        unitRate: "",
        discountAmount: "",
        discountReason: "",
        itemDate: undefined,
      },
    ]);
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
      const quantity = parseFloat(item.quantity) || 0;
      const unitRate = parseFloat(item.unitRate) || 0;
      const discount = parseFloat(item.discountAmount) || 0;
      return total + (quantity * unitRate - discount);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Bill</h1>
        <p className="text-muted-foreground">Add billing items for a patient admission</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bill Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Bill Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addBillItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {billItems.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
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

                  <div className="space-y-2 md:col-span-2">
                    <Label>Item Description</Label>
                    <Input
                      value={item.itemDescription}
                      onChange={(e) => updateBillItem(item.id, "itemDescription", e.target.value)}
                      placeholder="Enter item description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateBillItem(item.id, "quantity", e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit Rate (₹)</Label>
                    <Input
                      type="number"
                      value={item.unitRate}
                      onChange={(e) => updateBillItem(item.id, "unitRate", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Item Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !item.itemDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {item.itemDate ? format(item.itemDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={item.itemDate}
                          onSelect={(date) => updateBillItem(item.id, "itemDate", date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Discount Amount (₹)</Label>
                    <Input
                      type="number"
                      value={item.discountAmount}
                      onChange={(e) => updateBillItem(item.id, "discountAmount", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Discount Reason</Label>
                    <Input
                      value={item.discountReason}
                      onChange={(e) => updateBillItem(item.id, "discountReason", e.target.value)}
                      placeholder="Enter discount reason (if any)"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="text-sm text-muted-foreground">
                    Item Total: ₹
                    {(
                      (parseFloat(item.quantity) || 0) * (parseFloat(item.unitRate) || 0) -
                      (parseFloat(item.discountAmount) || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t">
              <div className="text-lg font-semibold">
                Grand Total: ₹{calculateTotal().toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Create Bill
        </Button>
      </form>
    </div>
  );
};

export default AddBill;