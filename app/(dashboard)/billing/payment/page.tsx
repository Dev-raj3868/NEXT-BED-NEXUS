'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { billingPost, CLINIC_ID, getBillingMessage } from '../billing-api';

interface PaymentForm {
  bill_id: string;
  final_bill_id: string;
  admission_id: string;
  patient_id: string;
  amount_paid: number;
  payment_method: string;
  reference_id: string;
  payment_notes: string;
  payment_type: string;
  created_by: string;
}

export default function PaymentPage() {
  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const billIdRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<PaymentForm>({
    bill_id: '',
    final_bill_id: '',
    admission_id: '',
    patient_id: '',
    amount_paid: 0,
    payment_method: '',
    reference_id: '',
    payment_notes: '',
    payment_type: '',
    created_by: 'RECEPTIONIST_001',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fetchingBill, setFetchingBill] = useState(false);

  // Suggestion States
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [fetchedBillIds, setFetchedBillIds] = useState<string[]>([]);
  
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showBillDropdown, setShowBillDropdown] = useState(false);

  /* ---------------- CLICK OUTSIDE LOGIC ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) setShowNameDropdown(false);
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) setShowPhoneDropdown(false);
      if (billIdRef.current && !billIdRef.current.contains(e.target as Node)) setShowBillDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- DEBOUNCED FETCH LOGIC ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchName.length >= 3) fetchAdmissionSuggestions(searchName, 'name');
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchPhone.length >= 3) fetchAdmissionSuggestions(searchPhone, 'phone'); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchPhone]);

  const fetchAdmissionSuggestions = async (query: string, searchMode: 'name' | 'phone') => {
    try {
      const payload: any = {};
      if (searchMode === 'name') {
        payload.patient_name = query;
      } else {
        payload.phone_number = query;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/patientAdmission/get_admitted_patient_profile_suggestion`, 
        payload, 
        { withCredentials: true }
      );
      
      console.log("Suggestions API response data log:", res.data);

      if (res.data.resSuccess === 1) {
        setSuggestions(res.data.data || []);
        if (searchMode === 'name' && document.activeElement === nameRef.current?.querySelector('input')) {
          setShowNameDropdown(true);
        }
        if (searchMode === 'phone' && document.activeElement === phoneRef.current?.querySelector('input')) {
          setShowPhoneDropdown(true);
        }
      }
    } catch (err) { 
      console.error("Fetch suggestions failure connection exception:", err); 
    }
  };

  /* ---------------- CASCADING BILL RETRIEVAL LOGIC ---------------- */
  const fetchPatientBillDetails = async (admissionTrackingId: string) => {
    try {
      setFetchingBill(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/billing/get_bill`,
        { admission_id: admissionTrackingId },
        { withCredentials: true }
      );

      console.log("Billing Lookup API response data log:", res.data);

      if (res.data.resSuccess === 1 && Array.isArray(res.data.data)) {
        // Extract unique bill_ids from the array of line items
        const uniqueBillIds: string[] = Array.from(
          new Set(res.data.data.map((item: any) => item.bill_id).filter(Boolean))
        );

        setFetchedBillIds(uniqueBillIds);

        if (uniqueBillIds.length > 0) {
          // Prefill with the first bill_id found as a default choice
          setFormData(prev => ({ ...prev, bill_id: uniqueBillIds[0] }));
          
          toast({
            title: "Bills Discovered",
            description: `Found ${uniqueBillIds.length} active bill reference(s) for this admission.`
          });
        } else {
          setFormData(prev => ({ ...prev, bill_id: "" }));
          toast({
            title: "No Bills Found",
            description: "This admission has no pending or billed line items.",
            variant: "destructive"
          });
        }
      }
    } catch (err) {
      console.error("Error retrieving active bill context summary mapping:", err);
    } finally {
      setFetchingBill(false);
    }
  };

  /* ---------------- SELECTION LOGIC ---------------- */
  const handleSelectPatient = (p: any) => {
    console.log("Selected target patient record log entity:", p);
    
    setSearchName(p.patient_name || "");
    setSearchPhone(p.phone_number || "");
    setShowNameDropdown(false);
    setShowPhoneDropdown(false);
    
    // Auto-fill form fields using the internal response '_id' as 'admission_id'
    setFormData(prev => ({ 
      ...prev, 
      patient_id: p.patient_id || "", 
      admission_id: p._id || "" 
    }));

    // Trigger secondary cascading ledger bills retrieval using internal _id
    if (p._id) {
      fetchPatientBillDetails(p._id);
    }
  };

  const handleChange = (field: keyof PaymentForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bill_id && !formData.final_bill_id) {
      toast({ title: "Invalid payment", description: "Enter or select a Bill ID or Final Bill ID.", variant: "destructive" });
      return;
    }
    if (formData.amount_paid <= 0) {
      toast({ title: "Invalid payment", description: "Payment amount must be greater than 0.", variant: "destructive" });
      return;
    }
    if (!formData.payment_method) {
      toast({ title: "Invalid payment", description: "Select a payment method.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    const submissionPayload = {
      bill_id: formData.bill_id || undefined,
      final_bill_id: formData.final_bill_id || undefined,
      admission_id: formData.admission_id || undefined,
      patient_id: formData.patient_id || undefined,
      amount_paid: formData.amount_paid,
      payment_method: formData.payment_method,
      transaction_id: formData.reference_id || undefined,
      received_by: formData.created_by || undefined,
      date: new Date().toISOString().slice(0, 10),
      notes: formData.payment_notes || undefined,
      payment_type: formData.payment_type || undefined,
    };

    console.log("Submitting transaction runtime payment line parameter payload:", submissionPayload);

    try {
      const response = await billingPost("add_payment", submissionPayload);

      console.log("Transaction Recording submission response data log:", response);

      if (response.apiSuccess === 1) {
        toast({ title: "Success", description: response.message || "Payment recorded successfully." });
        setFormData({
          bill_id: '', final_bill_id: '', admission_id: '', patient_id: '',
          amount_paid: 0, payment_method: '', reference_id: '',
          payment_notes: '', payment_type: '', created_by: 'RECEPTIONIST_001',
        });
        setSearchName(""); 
        setSearchPhone("");
        setFetchedBillIds([]);
      } else {
        toast({
          title: response.apiSuccess === -1 ? "Server error" : "Invalid payment",
          description: getBillingMessage(response, "Unable to record payment."),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment registration submission exception error:", error);
      toast({ title: "Error", description: "Server Error", variant: "destructive" });
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Processing</h1>
        {fetchingBill && (
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Syncing statement balances...
          </div>
        )}
      </div>

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Receive Payment</CardTitle>
          <CardDescription>Search admitted patients to auto-fill details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Name Search */}
              <div className="space-y-2 relative" ref={nameRef}>
                <Label>Patient Name</Label>
                <Input 
                  placeholder="Type name..." 
                  value={searchName} 
                  onChange={(e) => setSearchName(e.target.value)} 
                />
                {showNameDropdown && suggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+4px)] z-50 w-full bg-white border rounded-md shadow-xl max-h-48 overflow-y-auto">
                    {suggestions.map((p) => (
                      <div key={p._id} className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 flex flex-col gap-0.5" onClick={() => handleSelectPatient(p)}>
                        <div className="font-bold text-sm text-slate-900">{p.patient_name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">Internal ID: {p._id} | {p.phone_number}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Search */}
              <div className="space-y-2 relative" ref={phoneRef}>
                <Label>Phone Number</Label>
                <Input 
                  placeholder="Type phone..." 
                  value={searchPhone} 
                  onChange={(e) => setSearchPhone(e.target.value)} 
                />
                {showPhoneDropdown && suggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+4px)] z-50 w-full bg-white border rounded-md shadow-xl max-h-48 overflow-y-auto">
                    {suggestions.map((p) => (
                      <div key={p._id} className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 flex flex-col gap-0.5" onClick={() => handleSelectPatient(p)}>
                        <div className="font-bold text-sm text-slate-900">{p.phone_number}</div>
                        <div className="text-[10px] text-muted-foreground">{p.patient_name} (Internal ID: {p._id})</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input value={formData.patient_id} readOnly className="bg-slate-50 font-mono text-xs cursor-not-allowed" placeholder="Auto-filled via search" required />
              </div>

              <div className="space-y-2">
                <Label>Admission ID</Label>
                <Input value={formData.admission_id} readOnly className="bg-slate-50 font-mono text-xs cursor-not-allowed" placeholder="Auto-filled via search" required />
              </div>

              {/* Bill ID Field with dropdown suggestions from get_bill response array */}
              <div className="space-y-2 relative" ref={billIdRef}>
                <Label>Bill ID</Label>
                <Input 
                  value={formData.bill_id} 
                  onChange={(e) => handleChange('bill_id', e.target.value)} 
                  onFocus={() => setShowBillDropdown(true)}
                  placeholder="Enter or choose discovered Bill ID" 
                />
                {showBillDropdown && fetchedBillIds.length > 0 && (
                  <div className="absolute top-[calc(100%+4px)] z-50 w-full bg-white border rounded-md shadow-lg max-h-36 overflow-y-auto">
                    {fetchedBillIds.map((id) => (
                      <div 
                        key={id} 
                        className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs font-mono font-medium text-slate-800 border-b last:border-0"
                        onClick={() => {
                          handleChange('bill_id', id);
                          setShowBillDropdown(false);
                        }}
                      >
                        {id}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Final Bill ID</Label>
                <Input value={formData.final_bill_id} onChange={(e) => handleChange('final_bill_id', e.target.value)} placeholder="Optional final bill ID" />
              </div>

              <div className="space-y-2">
                <Label>Amount Paid (₹)</Label>
                <Input type="number" value={formData.amount_paid || ""} onChange={(e) => handleChange('amount_paid', parseFloat(e.target.value) || 0)} required />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(v) => handleChange('payment_method', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                  <SelectContent>
                    {["Cash", "Card", "Cheque", "UPI", "Bank Transfer", "Insurance"].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select value={formData.payment_type} onValueChange={(v) => handleChange('payment_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advance Payment">Advance Payment</SelectItem>
                    <SelectItem value="Due Payment">Due Payment</SelectItem>
                    <SelectItem value="Final Bill Payment">Final Bill Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reference ID</Label>
                <Input value={formData.reference_id} onChange={(e) => handleChange('reference_id', e.target.value)} placeholder="Txn ID / Ref" />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label>Payment Notes</Label>
                <Input value={formData.payment_notes} onChange={(e) => handleChange('payment_notes', e.target.value)} placeholder="Remarks..." />
              </div>
            </div>

            <Button type="submit" disabled={isLoading || fetchingBill} className="w-full h-12">
              {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Record Payment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}