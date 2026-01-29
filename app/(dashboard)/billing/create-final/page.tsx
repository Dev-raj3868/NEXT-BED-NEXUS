'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
<<<<<<< HEAD
import { Loader2, Search, Calculator } from "lucide-react";
import axios from "axios";
=======
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Banknote, Building2, Wallet } from "lucide-react";

interface ChargeCategory {
  id: number;
  category: string;
  categoryCode: string;
  count: number;
  grossAmount: number;
  discount: number;
  netAmount: number;
}
>>>>>>> 130a76eeaba15a67cd99dd2a303a9dc6ad75ceeb

const AddFinalBill = () => {
  const CLINIC_ID = "clinic001";
  const [loading, setLoading] = useState(false);

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    hospitalId: CLINIC_ID,
    admissionId: "",
    patientName: "",
    phoneNumber: "",
    admissionDoctorId: "",
    admissionDoctorName: "",
<<<<<<< HEAD
    admissionDate: "",
    dischargeDate: "",
    // Charge Totals
    bedGross: 0, bedDisc: 0, bedCount: 1,
    doctorGross: 0, doctorDisc: 0, doctorCount: 1,
    medicineGross: 0, medicineDisc: 0, medicineCount: 1,
    otGross: 0, otDisc: 0, otCount: 0,
    miscGross: 0, miscDisc: 0, miscCount: 0,
    // Totals
    additionalDiscountAmount: 0,
    additionalDiscountReason: "",
    totalPaid: 0,
    paymentStatus: "Pending",
    billStatus: "Pending",
    notes: "",
  });

  /* ---------------- PATIENT SUGGESTIONS ---------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const getSuggestions = async () => {
      if (searchQuery.length < 3) return;
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`, {
          patient_name: searchQuery, clinic_id: CLINIC_ID
        }, { withCredentials: true });
        if (res.data.resSuccess === 1) {
          setSuggestions(res.data.data);
          setShowSuggestions(true);
        }
      } catch (err) { console.error(err); }
    };
    const timeout = setTimeout(getSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  /* ---------------- CALCULATION LOGIC ---------------- */
  const calculateTotals = () => {
    const categories = [
      { g: formData.bedGross, d: formData.bedDisc },
      { g: formData.doctorGross, d: formData.doctorDisc },
      { g: formData.medicineGross, d: formData.medicineDisc },
      { g: formData.otGross, d: formData.otDisc },
      { g: formData.miscGross, d: formData.miscDisc },
    ];

    const totalGross = categories.reduce((acc, curr) => acc + curr.g, 0);
    const totalItemDisc = categories.reduce((acc, curr) => acc + curr.d, 0);
    const subtotal = totalGross - totalItemDisc;
    const finalPayable = subtotal - formData.additionalDiscountAmount;
    const balanceDue = finalPayable - formData.totalPaid;

    return { totalGross, totalItemDisc, subtotal, finalPayable, balanceDue };
=======
  });

  const [charges, setCharges] = useState<ChargeCategory[]>([
    { id: 1, category: "Room Rent Services", categoryCode: "bed_charges", count: 0, grossAmount: 0, discount: 0, netAmount: 0 },
    { id: 2, category: "Doctor & Consultant Fees", categoryCode: "doctor_charges", count: 0, grossAmount: 0, discount: 0, netAmount: 0 },
    { id: 3, category: "Medicine & Consumables", categoryCode: "medicine_charges", count: 0, grossAmount: 0, discount: 0, netAmount: 0 },
    { id: 4, category: "OT & Procedure Charges", categoryCode: "ot_charges", count: 0, grossAmount: 0, discount: 0, netAmount: 0 },
    { id: 5, category: "Miscellaneous Charges", categoryCode: "misc_charges", count: 0, grossAmount: 0, discount: 0, netAmount: 0 },
  ]);

  const [discountPercent, setDiscountPercent] = useState(0);
  const [gstPercent, setGstPercent] = useState(5);
  const [insuranceCovered, setInsuranceCovered] = useState(80000);
  const [paymentMethod, setPaymentMethod] = useState("cashless");
  const [notes, setNotes] = useState("");

  const grossAmount = charges.reduce((sum, item) => sum + item.grossAmount, 0);
  const discountAmount = charges.reduce((sum, item) => sum + item.discount, 0);
  const netBillAmount = charges.reduce((sum, item) => sum + item.netAmount, 0);
  const gstAmount = (netBillAmount * gstPercent) / 100;
  const totalAmountDue = netBillAmount + gstAmount;
  const patientResponsibility = Math.max(0, totalAmountDue - insuranceCovered);

  const updateCharge = (id: number, field: keyof ChargeCategory, value: string | number) => {
    setCharges(charges.map(charge => {
      if (charge.id === id) {
        const updated = { ...charge, [field]: value };
        if (field === 'grossAmount' || field === 'discount') {
          updated.netAmount = updated.grossAmount - updated.discount;
        }
        return updated;
      }
      return charge;
    }));
  };

  const removeCharge = (id: number) => {
    if (charges.length > 1) {
      setCharges(charges.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Final Bill data:", {
      charges,
      grossAmount,
      discountPercent,
      discountAmount,
      netBillAmount,
      gstPercent,
      gstAmount,
      totalAmountDue,
      insuranceCovered,
      patientResponsibility,
      paymentMethod,
      notes
    });
    toast({
      title: "Success",
      description: "Final bill created successfully!",
    });
>>>>>>> 130a76eeaba15a67cd99dd2a303a9dc6ad75ceeb
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-IN')}`;
  };

  /* ---------------- API SUBMISSION ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      hospital_id: CLINIC_ID,
      admission_id: formData.admissionId,
      patient_id: formData.patientId,
      patient_name: formData.patientName,
      phone_number: formData.phoneNumber,
      email: formData.email,
      admission_doctor_id: formData.admissionDoctorId,
      admission_doctor_name: formData.admissionDoctorName,
      admission_date: formData.admissionDate,
      discharge_date: formData.dischargeDate,
      created_by: "RECEPTIONIST_001", // Hardcoded for now

      bed_charges_total: { gross: formData.bedGross, discount: formData.bedDisc, net: formData.bedGross - formData.bedDisc },
      doctor_charges_total: { gross: formData.doctorGross, discount: formData.doctorDisc, net: formData.doctorGross - formData.doctorDisc },
      medicine_charges_total: { gross: formData.medicineGross, discount: formData.medicineDisc, net: formData.medicineGross - formData.medicineDisc },
      ot_charges_total: { gross: formData.otGross, discount: formData.otDisc, net: formData.otGross - formData.otDisc },
      misc_charges_total: { gross: formData.miscGross, discount: formData.miscDisc, net: formData.miscGross - formData.miscDisc },

      item_counts: {
        bed_charges: formData.bedCount,
        doctor_charges: formData.doctorCount,
        medicine_charges: formData.medicineCount,
        ot_charges: formData.otCount,
        misc_charges: formData.miscCount,
      },

      total_gross_amount: totals.totalGross,
      total_item_discounts: totals.totalItemDisc,
      subtotal: totals.subtotal,
      additional_discount_amount: formData.additionalDiscountAmount,
      additional_discount_reason: formData.additionalDiscountReason,
      final_payable_amount: totals.finalPayable,
      total_paid: formData.totalPaid,
      payment_status: formData.paymentStatus,
      bill_status: formData.billStatus,
      notes: formData.notes
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/billing/create_final_bill`, payload, { withCredentials: true });
      if (response.data.resSuccess === 1) {
        toast({ title: "Success", description: "Bill created: " + response.data.message });
      } else {
        toast({ title: "Error", description: response.data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed", description: "API Connection Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generate Final Bill</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
<<<<<<< HEAD
        {/* Patient Search */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Patient & Admission Link</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 relative">
              <Label>Search Patient</Label>
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Name..." />
              {showSuggestions && (
                <div className="absolute z-50 w-full mt-1 bg-white border shadow-lg max-h-40 overflow-auto">
                  {suggestions.map((p) => (
                    <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer text-xs" onClick={() => {
                      setFormData({ 
                        ...formData, patientName: p.patient_name, patientId: p._id, 
                        admissionId: p.current_admission_id || "", phoneNumber: p.phone_number,
                        email: p.email || ""
                      });
                      setSearchQuery(p.patient_name); setShowSuggestions(false);
                    }}>{p.patient_name} ({p.phone_number})</div>
                  ))}
                </div>
              )}
=======
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
                <Label htmlFor="phoneNumber">Patient Mobile Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter patient mobile number"
                  required
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
>>>>>>> 130a76eeaba15a67cd99dd2a303a9dc6ad75ceeb
            </div>
            <div className="space-y-2"><Label>Admission ID</Label><Input value={formData.admissionId} readOnly className="bg-muted" /></div>
            <div className="space-y-2"><Label>Admission Date</Label><Input type="date" value={formData.admissionDate} onChange={(e) => setFormData({...formData, admissionDate: e.target.value})} /></div>
            <div className="space-y-2"><Label>Discharge Date</Label><Input type="date" value={formData.dischargeDate} onChange={(e) => setFormData({...formData, dischargeDate: e.target.value})} /></div>
          </CardContent>
        </Card>

<<<<<<< HEAD
        {/* Charge Grid */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Itemized Charges</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {['bed', 'doctor', 'medicine', 'ot', 'misc'].map((key) => (
              <div key={key} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 border rounded-md items-end">
                <div className="space-y-1"><Label className="capitalize font-bold">{key} Gross (₹)</Label>
                  <Input type="number" value={(formData as any)[`${key}Gross`]} onChange={(e) => setFormData({...formData, [`${key}Gross`]: Number(e.target.value)})} />
                </div>
                <div className="space-y-1"><Label>Discount (₹)</Label>
                  <Input type="number" value={(formData as any)[`${key}Disc`]} onChange={(e) => setFormData({...formData, [`${key}Disc`]: Number(e.target.value)})} />
                </div>
                <div className="space-y-1"><Label>Item Count</Label>
                  <Input type="number" value={(formData as any)[`${key}Count`]} onChange={(e) => setFormData({...formData, [`${key}Count`]: Number(e.target.value)})} />
                </div>
                <div className="text-right pb-2 text-xs font-mono">Net: ₹{(formData as any)[`${key}Gross`] - (formData as any)[`${key}Disc`]}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Final Calculation & Submission */}
        <Card className="bg-slate-50 border-2 border-primary/20">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex justify-between"><span>Total Gross:</span><span>₹{totals.totalGross}</span></div>
                <div className="flex justify-between text-red-600"><span>Item Discounts:</span><span>-₹{totals.totalItemDisc}</span></div>
                <div className="flex justify-between border-t pt-2 font-bold text-lg"><span>Subtotal:</span><span>₹{totals.subtotal}</span></div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1"><Label>Additional Discount</Label><Input type="number" value={formData.additionalDiscountAmount} onChange={(e) => setFormData({...formData, additionalDiscountAmount: Number(e.target.value)})} /></div>
                   <div className="space-y-1"><Label>Total Paid (Adv)</Label><Input type="number" value={formData.totalPaid} onChange={(e) => setFormData({...formData, totalPaid: Number(e.target.value)})} /></div>
                </div>
                <Input placeholder="Reason for discount" value={formData.additionalDiscountReason} onChange={(e) => setFormData({...formData, additionalDiscountReason: e.target.value})} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white rounded-lg border shadow-sm">
               <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground uppercase">Balance Due</p>
                  <p className={`text-3xl font-black ${totals.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{totals.balanceDue}</p>
               </div>
               <div className="flex gap-4 mt-4 md:mt-0">
                  <div className="space-y-1">
                    <Label>Bill Status</Label>
                    <Select value={formData.billStatus} onValueChange={(v:any) => setFormData({...formData, billStatus: v})}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Paid">Paid</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Final Payable</p>
                    <p className="text-2xl font-bold">₹{totals.finalPayable}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-2"><Label>Billing Notes</Label><Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} /></div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Calculator className="mr-2" />}
              Generate Final Bill & Finalize Discharge
            </Button>
          </CardContent>
        </Card>
=======
        {/* Charges Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bill Particulars - Charges Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 dark:bg-slate-900 hover:bg-slate-800 dark:hover:bg-slate-900">
                    <TableHead className="text-white font-semibold w-20 text-center py-3">S.No</TableHead>
                    <TableHead className="text-white font-semibold min-w-[300px] py-3">Charge Category</TableHead>
                    <TableHead className="text-white font-semibold w-24 text-center py-3">Count</TableHead>
                    <TableHead className="text-white font-semibold w-32 text-right py-3">Gross Amount</TableHead>
                    <TableHead className="text-white font-semibold w-28 text-right py-3">Discount</TableHead>
                    <TableHead className="text-white font-semibold w-32 text-right py-3 bg-green-700">Net Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {charges.map((charge, index) => (
                    <TableRow key={charge.id} className="border-b">
                      <TableCell className="text-center font-medium py-4">{index + 1}</TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-sm">{charge.category}</div>
                          <div className="text-xs text-muted-foreground">Category: {charge.categoryCode}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Input
                          type="number"
                          value={charge.count}
                          onChange={(e) => updateCharge(charge.id, 'count', parseInt(e.target.value) || 0)}
                          className="w-20 text-center mx-auto"
                          min={0}
                        />
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Input
                          type="number"
                          value={charge.grossAmount}
                          onChange={(e) => updateCharge(charge.id, 'grossAmount', parseFloat(e.target.value) || 0)}
                          className="w-28 text-right ml-auto"
                          min={0}
                        />
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Input
                          type="number"
                          value={charge.discount}
                          onChange={(e) => updateCharge(charge.id, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-24 text-right ml-auto"
                          min={0}
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold py-4 bg-green-50 dark:bg-green-950">
                        {formatCurrency(charge.netAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-slate-100 dark:bg-slate-800 font-semibold">
                    <TableCell colSpan={2} className="text-right py-4 font-bold">
                      TOTAL
                    </TableCell>
                    <TableCell className="text-center py-4">
                      {charges.reduce((sum, item) => sum + item.count, 0)}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {formatCurrency(grossAmount)}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {formatCurrency(discountAmount)}
                    </TableCell>
                    <TableCell className="text-right py-4 bg-green-600 text-white">
                      {formatCurrency(netBillAmount)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <div className="flex justify-end">
          <Card className="w-full max-w-md">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gross Amount:</span>
                <span className="font-medium">{formatCurrency(grossAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">Discount (</span>
                  <Input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-14 h-6 text-center text-xs p-1"
                    min={0}
                    max={100}
                  />
                  <span className="text-emerald-600 dark:text-emerald-400">%):</span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">- {formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Net Bill Amount:</span>
                <span className="font-semibold text-lg">{formatCurrency(netBillAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">GST (</span>
                  <Input
                    type="number"
                    value={gstPercent}
                    onChange={(e) => setGstPercent(parseFloat(e.target.value) || 0)}
                    className="w-14 h-6 text-center text-xs p-1"
                    min={0}
                    max={100}
                  />
                  <span className="text-muted-foreground">%):</span>
                </div>
                <span className="font-medium">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="border-2 border-primary rounded-lg p-3 bg-primary/10">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">TOTAL AMOUNT DUE:</span>
                  <span className="font-bold text-xl">{formatCurrency(totalAmountDue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary & Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">PAYMENT SUMMARY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Bill Amount:</span>
                <span className="font-medium">{formatCurrency(totalAmountDue)}</span>
              </div>
              <div className="flex justify-between items-center bg-primary/10 p-3 rounded-lg border border-primary/30">
                <span className="text-muted-foreground">Insurance Covered:</span>
                <Input
                  type="number"
                  value={insuranceCovered}
                  onChange={(e) => setInsuranceCovered(parseFloat(e.target.value) || 0)}
                  className="w-32 text-right font-medium"
                />
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold">Patient Responsibility:</span>
                <span className="font-bold text-xl text-destructive">{formatCurrency(patientResponsibility)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">PAYMENT METHOD</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="cashless" id="cashless" />
                  <Label htmlFor="cashless" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Cashless (Insurance)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                    <Banknote className="h-4 w-4 text-accent-foreground" />
                    Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="cheque" id="cheque" />
                  <Label htmlFor="cheque" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Cheque
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4 text-primary" />
                    Card
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes or remarks..."
              rows={3}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg">
          Create Final Bill
        </Button>
>>>>>>> 130a76eeaba15a67cd99dd2a303a9dc6ad75ceeb
      </form>
    </div>
  );
};

export default AddFinalBill;
