'use client';

import { useState, useEffect } from 'react';
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

  /* ---------------- PATIENT SUGGESTIONS LOGIC ---------------- */
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (query: string, type: 'name' | 'phone') => {
    if (query.length < 3) return;
    try {
      const payload = type === 'name' 
        ? { patient_name: query, clinic_id: CLINIC_ID } 
        : { phone_number: query, clinic_id: CLINIC_ID };

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`, 
        payload, 
        { withCredentials: true }
      );
      if (res.data.resSuccess === 1) {
        setSuggestions(res.data.data);
        setShowSuggestions(true);
      }
    } catch (err) { console.error(err); }
  };

  const handleChange = (field: keyof PaymentForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Submitting Payment Data:", formData);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/billing/add_payment`,
        formData,
        { withCredentials: true }
      );
      console.log("Payment Response:", response.data);

      if (response.data.resSuccess === 1) {
        toast({ title: "Success", description: "Payment recorded successfully" });
        setFormData({
          hospital_id: CLINIC_ID, bill_id: '', admission_id: '', patient_id: '',
          amount_paid: 0, payment_method: '', reference_id: '',
          payment_notes: '', payment_type: '', created_by: 'RECEPTIONIST_001',
        });
        setSearchName("");
        setSearchPhone("");
      } else {
        toast({ title: "Error", description: response.data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to connect to server", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Processing</h1>
        <p className="text-muted-foreground mt-2">Manage patient transactions and advance deposits</p>
      </div>

      <Card className="overflow-visible shadow-sm border-muted">
        <CardHeader>
          <CardTitle>Transaction Entry</CardTitle>
          <CardDescription>Search patient to auto-fill Patient ID</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Patient Name Search */}
              <div className="space-y-2 relative">
                <Label>Patient Name Search</Label>
                <Input 
                  placeholder="Type name..." 
                  value={searchName} 
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    fetchSuggestions(e.target.value, 'name');
                  }} 
                />
                {showSuggestions && searchName.length >= 3 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-xl max-h-48 overflow-auto">
                    {suggestions.map((p) => (
                      <div key={p._id} className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0" onClick={() => {
                        setFormData({ ...formData, patient_id: p._id, admission_id: p.current_admission_id || "" });
                        setSearchName(p.patient_name);
                        setSearchPhone(p.phone_number);
                        setShowSuggestions(false);
                      }}>
                        <div className="font-bold text-sm">{p.patient_name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.phone_number} | ID: {p._id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Search */}
              <div className="space-y-2">
                <Label>Phone Number Search</Label>
                <Input 
                  placeholder="Type phone..." 
                  value={searchPhone} 
                  onChange={(e) => {
                    setSearchPhone(e.target.value);
                    fetchSuggestions(e.target.value, 'phone');
                  }} 
                />
              </div>

              {/* Patient ID (Auto-filled but Editable) */}
              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input 
                  value={formData.patient_id} 
                  onChange={(e) => handleChange('patient_id', e.target.value)} 
                  placeholder="Enter or select patient"
                  required
                />
              </div>

              {/* Admission ID (Editable) */}
              <div className="space-y-2">
                <Label>Admission ID</Label>
                <Input 
                  value={formData.admission_id} 
                  onChange={(e) => handleChange('admission_id', e.target.value)} 
                  placeholder="ADM-..." 
                />
              </div>

              {/* Bill ID (Editable) */}
              <div className="space-y-2">
                <Label>Bill ID</Label>
                <Input 
                  value={formData.bill_id} 
                  onChange={(e) => handleChange('bill_id', e.target.value)} 
                  placeholder="BILL-..." 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Amount Paid (₹)</Label>
                <Input
                  type="number"
                  value={formData.amount_paid || ""}
                  onChange={(e) => handleChange('amount_paid', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(v) => handleChange('payment_method', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
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
                <Label>Reference ID (Txn No.)</Label>
                <Input
                  value={formData.reference_id}
                  onChange={(e) => handleChange('reference_id', e.target.value)}
                  placeholder="Transaction ID"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label>Payment Notes</Label>
                <Input
                  value={formData.payment_notes}
                  onChange={(e) => handleChange('payment_notes', e.target.value)}
                  placeholder="Remarks..."
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12">
              {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Complete Transaction"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}