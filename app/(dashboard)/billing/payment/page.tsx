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

interface PaymentForm {
  hospital_id: string;
  bill_id: string;
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
  const CLINIC_ID = "clinic001";
  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<PaymentForm>({
    hospital_id: CLINIC_ID,
    bill_id: '',
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

  // Suggestion States
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

  /* ---------------- DEBOUNCED FETCH LOGIC ---------------- */
  // Unified debounce for both name and phone search using the Admission API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchName.length >= 3) fetchAdmissionSuggestions(searchName, 0); // type 0 for general search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchPhone.length >= 3) fetchAdmissionSuggestions(searchPhone, 0); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchPhone]);

  const fetchAdmissionSuggestions = async (query: string, type: number) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/patientAdmission/get_admitted_patient_profile_suggestion`, 
        { 
          search: query, 
          type: type, 
          hospital_id: CLINIC_ID 
        }, 
        { withCredentials: true }
      );
      
      if (res.data.resSuccess === 1) {
        setSuggestions(res.data.data);
        // Determine which dropdown to show based on what user is typing
        if (searchName.length >= 3 && document.activeElement === nameRef.current?.querySelector('input')) {
          setShowNameDropdown(true);
        }
        if (searchPhone.length >= 3 && document.activeElement === phoneRef.current?.querySelector('input')) {
          setShowPhoneDropdown(true);
        }
      }
    } catch (err) { console.error("Fetch suggestions error", err); }
  };

  /* ---------------- SELECTION LOGIC ---------------- */
  const handleSelectPatient = (p: any) => {
    setSearchName(p.patient_name);
    setSearchPhone(p.phone_number);
    setShowNameDropdown(false);
    setShowPhoneDropdown(false);
    
    // Auto-fill IDs from the admission suggestion response
    setFormData(prev => ({ 
      ...prev, 
      patient_id: p.patient_id, 
      admission_id: p._id // Based on your handler, _id is the internal Admission document ID
    }));
  };

  const handleChange = (field: keyof PaymentForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/billing/add_payment`,
        formData, { withCredentials: true }
      );
      console.log("Payment API response", response.data);
      if (response.data.resSuccess === 1) {
        toast({ title: "Success", description: "Payment recorded successfully" });
        setFormData({
          hospital_id: CLINIC_ID, bill_id: '', admission_id: '', patient_id: '',
          amount_paid: 0, payment_method: '', reference_id: '',
          payment_notes: '', payment_type: '', created_by: 'RECEPTIONIST_001',
        });
        setSearchName(""); setSearchPhone("");
      } else {
        toast({ title: "Error", description: response.data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Server Error", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Payment Processing</h1>

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
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-xl max-h-48 overflow-auto">
                    {suggestions.map((p) => (
                      <div key={p._id} className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0" onClick={() => handleSelectPatient(p)}>
                        <div className="font-bold text-sm">{p.patient_name}</div>
                        <div className="text-[10px] text-muted-foreground">ID: {p.admission_id} | {p.phone_number}</div>
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
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-xl max-h-48 overflow-auto">
                    {suggestions.map((p) => (
                      <div key={p._id} className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0" onClick={() => handleSelectPatient(p)}>
                        <div className="font-bold text-sm">{p.phone_number}</div>
                        <div className="text-[10px] text-muted-foreground">{p.patient_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input value={formData.patient_id} onChange={(e) => handleChange('patient_id', e.target.value)} placeholder="Auto-filled" required />
              </div>

              <div className="space-y-2">
                <Label>Admission ID</Label>
                <Input value={formData.admission_id} onChange={(e) => handleChange('admission_id', e.target.value)} placeholder="Auto-filled" required />
              </div>

              <div className="space-y-2">
                <Label>Bill ID</Label>
                <Input value={formData.bill_id} onChange={(e) => handleChange('bill_id', e.target.value)} placeholder="Enter Bill ID" required />
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

            <Button type="submit" disabled={isLoading} className="w-full h-12">
              {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Record Payment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}