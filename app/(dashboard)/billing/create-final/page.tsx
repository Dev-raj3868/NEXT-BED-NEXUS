'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Calculator } from "lucide-react";
import axios from "axios";

const AddFinalBill = () => {
  const CLINIC_ID = "clinic001";
  const [loading, setLoading] = useState(false);
  
  // Refs for click-outside logic
  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    hospitalId: CLINIC_ID,
    admissionId: "",
    patientId: "",
    patientName: "",
    phoneNumber: "",
    email: "",
    admissionDoctorId: "",
    admissionDoctorName: "",
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
    billStatus: "Draft",
    notes: "",
  });

  /* ---------------- SUGGESTION STATES ---------------- */
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);

  /* ---------------- CLICK OUTSIDE LOGIC ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) setShowNameDropdown(false);
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) setShowPhoneDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- FETCH SUGGESTIONS (ADMISSION API) ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchName.length >= 3) fetchSuggestions(searchName, 'name');
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchPhone.length >= 3) fetchSuggestions(searchPhone, 'phone');
    }, 500);
    return () => clearTimeout(timer);
  }, [searchPhone]);

  const fetchSuggestions = async (query: string, type: 'name' | 'phone') => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/patientAdmission/get_admitted_patient_profile_suggestion`, 
        { search: query, hospital_id: CLINIC_ID }, 
        { withCredentials: true }
      );
      if (res.data.resSuccess === 1) {
        setSuggestions(res.data.data);
        if (type === 'name') setShowNameDropdown(true);
        else setShowPhoneDropdown(true);
      }
    } catch (err) { console.error(err); }
  };

  const handleSelectPatient = (p: any) => {
    setFormData({ 
      ...formData, 
      patientName: p.patient_name, 
      patientId: p.patient_id, 
      admissionId: p._id, // Mapping the admission document ID
      phoneNumber: p.phone_number 
    });
    setSearchName(p.patient_name);
    setSearchPhone(p.phone_number);
    setShowNameDropdown(false);
    setShowPhoneDropdown(false);
  };

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
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      hospital_id: CLINIC_ID,
      admission_id: formData.admissionId,
      patient_id: formData.patientId,
      patient_name: formData.patientName,
      phone_number: formData.phoneNumber,
      admission_doctor_id: formData.admissionDoctorId,
      admission_doctor_name: formData.admissionDoctorName,
      admission_date: formData.admissionDate,
      discharge_date: formData.dischargeDate,

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/billing/create_final_bill`,
        payload, 
        {
          withCredentials: true
        }
      );
      if (response.data.resSuccess === 1) {
        toast({ title: "Success", description: "Bill created successfully!" });
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
        {/* Patient Search */}
        <Card className="overflow-visible">
          <CardHeader><CardTitle className="text-sm">Patient & Admission Link</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 relative" ref={nameRef}>
              <Label>Patient Name</Label>
              <Input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Search name..." />
              {showNameDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border shadow-lg max-h-40 overflow-auto rounded-md">
                  {suggestions.map((p) => (
                    <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer text-xs border-b" onClick={() => handleSelectPatient(p)}>
                      <div className="font-bold">{p.patient_name}</div>
                      <div className="text-[10px] text-muted-foreground">ADM: {p.admission_id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 relative" ref={phoneRef}>
              <Label>Phone Number</Label>
              <Input value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} placeholder="Search phone..." />
              {showPhoneDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border shadow-lg max-h-40 overflow-auto rounded-md">
                  {suggestions.map((p) => (
                    <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer text-xs border-b" onClick={() => handleSelectPatient(p)}>
                      <div className="font-bold">{p.phone_number}</div>
                      <div className="text-[10px] text-muted-foreground">{p.patient_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2"><Label>Admission ID</Label><Input value={formData.admissionId} readOnly className="bg-muted" /></div>
            <div className="space-y-2"><Label>Patient ID</Label><Input value={formData.patientId} readOnly className="bg-muted" /></div>
            <div className="space-y-2"><Label>Admission Date</Label><Input type="date" value={formData.admissionDate} onChange={(e) => setFormData({...formData, admissionDate: e.target.value})} /></div>
            <div className="space-y-2"><Label>Discharge Date</Label><Input type="date" value={formData.dischargeDate} onChange={(e) => setFormData({...formData, dischargeDate: e.target.value})} /></div>
          </CardContent>
        </Card>

        {/* Itemized Charges */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Itemized Charges</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {['bed', 'doctor', 'medicine', 'ot', 'misc'].map((key) => (
              <div key={key} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 border rounded-md items-end bg-muted/10">
                <div className="space-y-1"><Label className="capitalize font-bold text-xs">{key} Gross (₹)</Label>
                  <Input type="number" className="h-8" value={(formData as any)[`${key}Gross`]} onChange={(e) => setFormData({...formData, [`${key}Gross`]: Number(e.target.value)})} />
                </div>
                <div className="space-y-1"><Label className="text-xs">Discount (₹)</Label>
                  <Input type="number" className="h-8" value={(formData as any)[`${key}Disc`]} onChange={(e) => setFormData({...formData, [`${key}Disc`]: Number(e.target.value)})} />
                </div>
                <div className="space-y-1"><Label className="text-xs">Count</Label>
                  <Input type="number" className="h-8" value={(formData as any)[`${key}Count`]} onChange={(e) => setFormData({...formData, [`${key}Count`]: Number(e.target.value)})} />
                </div>
                <div className="text-right pb-1 text-[10px] font-mono font-bold">Net: ₹{(formData as any)[`${key}Gross`] - (formData as any)[`${key}Disc`]}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-slate-50 border-2 border-primary/20 shadow-inner">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Total Gross:</span><span>₹{totals.totalGross}</span></div>
                <div className="flex justify-between text-red-600"><span>Item Discounts:</span><span>-₹{totals.totalItemDisc}</span></div>
                <div className="flex justify-between border-t pt-2 font-bold text-lg"><span>Subtotal:</span><span>₹{totals.subtotal}</span></div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1"><Label className="text-xs">Additional Discount</Label><Input type="number" value={formData.additionalDiscountAmount} onChange={(e) => setFormData({...formData, additionalDiscountAmount: Number(e.target.value)})} /></div>
                   <div className="space-y-1"><Label className="text-xs">Total Paid (Adv)</Label><Input type="number" value={formData.totalPaid} onChange={(e) => setFormData({...formData, totalPaid: Number(e.target.value)})} /></div>
                </div>
                <Input placeholder="Reason for discount" className="h-8 text-xs" value={formData.additionalDiscountReason} onChange={(e) => setFormData({...formData, additionalDiscountReason: e.target.value})} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white rounded-lg border shadow-sm gap-4">
               <div className="text-center md:text-left">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Balance Due</p>
                  <p className={`text-3xl font-black ${totals.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{totals.balanceDue}</p>
               </div>
               <div className="flex gap-4 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Bill Status</Label>
                    <Select value={formData.billStatus} onValueChange={(v:any) => setFormData({...formData, billStatus: v})}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Finalized">Finalized</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Payment Status</Label>
                    <Select value={formData.paymentStatus} onValueChange={(v:any) => setFormData({...formData, paymentStatus: v})}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Partial">Partial</SelectItem>
                        <SelectItem value="Refund">Refund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground font-bold">FINAL PAYABLE</p>
                    <p className="text-xl font-bold text-primary">₹{totals.finalPayable}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-2"><Label className="text-xs">Billing Notes</Label><Textarea className="min-h-[60px] text-xs" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} /></div>

            <Button type="submit" size="lg" className="w-full font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Calculator className="mr-2" />}
              Finalize & Generate Bill
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddFinalBill;