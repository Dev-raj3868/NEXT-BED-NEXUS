'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const AddFinalBill = () => {
  const [formData, setFormData] = useState({
    hospitalId: "",
    admissionId: "",
    patientId: "",
    patientName: "",
    phoneNumber: "",
    email: "",
    admissionDoctorId: "",
    admissionDoctorName: "",
    // Charge Totals
    bedChargesGross: "",
    bedChargesDiscount: "",
    bedChargesNet: "",
    doctorChargesGross: "",
    doctorChargesDiscount: "",
    doctorChargesNet: "",
    otChargesGross: "",
    otChargesDiscount: "",
    otChargesNet: "",
    miscChargesGross: "",
    miscChargesDiscount: "",
    miscChargesNet: "",
    // Totals
    totalGrossAmount: "",
    totalItemDiscounts: "",
    subtotal: "",
    additionalDiscountAmount: "",
    additionalDiscountReason: "",
    finalPayableAmount: "",
    paymentStatus: "",
    billStatus: "",
    notes: "",
  });

  const calculateTotals = () => {
    const bedNet = parseFloat(formData.bedChargesNet) || 0;
    const doctorNet = parseFloat(formData.doctorChargesNet) || 0;
    const otNet = parseFloat(formData.otChargesNet) || 0;
    const miscNet = parseFloat(formData.miscChargesNet) || 0;
    const additionalDiscount = parseFloat(formData.additionalDiscountAmount) || 0;

    const bedGross = parseFloat(formData.bedChargesGross) || 0;
    const doctorGross = parseFloat(formData.doctorChargesGross) || 0;
    const otGross = parseFloat(formData.otChargesGross) || 0;
    const miscGross = parseFloat(formData.miscChargesGross) || 0;

    const bedDiscount = parseFloat(formData.bedChargesDiscount) || 0;
    const doctorDiscount = parseFloat(formData.doctorChargesDiscount) || 0;
    const otDiscount = parseFloat(formData.otChargesDiscount) || 0;
    const miscDiscount = parseFloat(formData.miscChargesDiscount) || 0;

    const totalGross = bedGross + doctorGross + otGross + miscGross;
    const totalItemDiscounts = bedDiscount + doctorDiscount + otDiscount + miscDiscount;
    const subtotal = bedNet + doctorNet + otNet + miscNet;
    const finalPayable = subtotal - additionalDiscount;

    return {
      totalGrossAmount: totalGross,
      totalItemDiscounts: totalItemDiscounts,
      subtotal: subtotal,
      finalPayableAmount: Math.max(0, finalPayable),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totals = calculateTotals();
    console.log("Final Bill data:", { ...formData, ...totals });
    toast({
      title: "Success",
      description: "Final bill created successfully!",
    });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Final Bill</h1>
        <p className="text-muted-foreground">Generate the final consolidated bill for discharge</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient & Hospital Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient & Hospital Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospitalId">Hospital ID</Label>
                <Input
                  id="hospitalId"
                  value={formData.hospitalId}
                  onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                  placeholder="Enter hospital ID"
                  required
                />
              </div>
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
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionDoctorId">Admission Doctor ID</Label>
                <Input
                  id="admissionDoctorId"
                  value={formData.admissionDoctorId}
                  onChange={(e) => setFormData({ ...formData, admissionDoctorId: e.target.value })}
                  placeholder="Enter doctor ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionDoctorName">Admission Doctor Name</Label>
                <Input
                  id="admissionDoctorName"
                  value={formData.admissionDoctorName}
                  onChange={(e) => setFormData({ ...formData, admissionDoctorName: e.target.value })}
                  placeholder="Enter doctor name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charge Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Charge Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bed Charges */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-3">Bed Charges</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Gross (₹)</Label>
                  <Input
                    type="number"
                    value={formData.bedChargesGross}
                    onChange={(e) => setFormData({ ...formData, bedChargesGross: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.bedChargesDiscount}
                    onChange={(e) => setFormData({ ...formData, bedChargesDiscount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net (₹)</Label>
                  <Input
                    type="number"
                    value={formData.bedChargesNet}
                    onChange={(e) => setFormData({ ...formData, bedChargesNet: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Charges */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-3">Doctor Charges</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Gross (₹)</Label>
                  <Input
                    type="number"
                    value={formData.doctorChargesGross}
                    onChange={(e) => setFormData({ ...formData, doctorChargesGross: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.doctorChargesDiscount}
                    onChange={(e) => setFormData({ ...formData, doctorChargesDiscount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net (₹)</Label>
                  <Input
                    type="number"
                    value={formData.doctorChargesNet}
                    onChange={(e) => setFormData({ ...formData, doctorChargesNet: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* OT Charges */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-3">OT Charges</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Gross (₹)</Label>
                  <Input
                    type="number"
                    value={formData.otChargesGross}
                    onChange={(e) => setFormData({ ...formData, otChargesGross: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.otChargesDiscount}
                    onChange={(e) => setFormData({ ...formData, otChargesDiscount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net (₹)</Label>
                  <Input
                    type="number"
                    value={formData.otChargesNet}
                    onChange={(e) => setFormData({ ...formData, otChargesNet: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Misc Charges */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-3">Miscellaneous Charges</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Gross (₹)</Label>
                  <Input
                    type="number"
                    value={formData.miscChargesGross}
                    onChange={(e) => setFormData({ ...formData, miscChargesGross: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.miscChargesDiscount}
                    onChange={(e) => setFormData({ ...formData, miscChargesDiscount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net (₹)</Label>
                  <Input
                    type="number"
                    value={formData.miscChargesNet}
                    onChange={(e) => setFormData({ ...formData, miscChargesNet: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary & Additional Discount */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bill Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Gross Amount:</span>
                  <span className="font-medium">₹{totals.totalGrossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Item Discounts:</span>
                  <span className="font-medium text-destructive">-₹{totals.totalItemDiscounts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="additionalDiscountAmount">Additional Discount (₹)</Label>
                  <Input
                    id="additionalDiscountAmount"
                    type="number"
                    value={formData.additionalDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, additionalDiscountAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalDiscountReason">Discount Reason</Label>
                  <Input
                    id="additionalDiscountReason"
                    value={formData.additionalDiscountReason}
                    onChange={(e) => setFormData({ ...formData, additionalDiscountReason: e.target.value })}
                    placeholder="Enter reason for additional discount"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Final Payable Amount</span>
                <div className="text-2xl font-bold text-primary">
                  ₹{totals.finalPayableAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billStatus">Bill Status</Label>
                <Select
                  value={formData.billStatus}
                  onValueChange={(value) => setFormData({ ...formData, billStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bill status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="finalized">Finalized</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any additional notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Create Final Bill
        </Button>
      </form>
    </div>
  );
};

export default AddFinalBill;