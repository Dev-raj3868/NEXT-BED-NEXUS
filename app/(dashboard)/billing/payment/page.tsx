'use client';

import { useState } from 'react';
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

interface PaymentForm {
  invoice_id: string;
  patient_id: string;
  amount_paid: number;
  payment_method: string;
  payment_notes: string;
  reference_str: string;
  payment_notes_str: string;
  payment_type_str: string;
  created_by: string;
}

export default function PaymentPage() {
  const [formData, setFormData] = useState<PaymentForm>({
    invoice_id: '',
    patient_id: '',
    amount_paid: 0,
    payment_method: '',
    payment_notes: '',
    reference_str: '',
    payment_notes_str: '',
    payment_type_str: '',
    created_by: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (field: keyof PaymentForm, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || 'Failed to process payment'}`);
      } else {
        setMessage('Payment processed successfully!');
        setFormData({
          invoice_id: '',
          patient_id: '',
          amount_paid: 0,
          payment_method: '',
          payment_notes: '',
          reference_str: '',
          payment_notes_str: '',
          payment_type_str: '',
          created_by: '',
        });
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Processing</h1>
        <p className="text-gray-500 mt-2">Process payments for invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Payment</CardTitle>
          <CardDescription>Enter payment details to process a payment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Invoice ID */}
              <div className="space-y-2">
                <Label htmlFor="invoice_id">Invoice ID</Label>
                <Input
                  id="invoice_id"
                  value={formData.invoice_id}
                  onChange={(e) => handleChange('invoice_id', e.target.value)}
                  placeholder="Enter invoice ID"
                  required
                />
              </div>

              {/* Patient ID */}
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient ID</Label>
                <Input
                  id="patient_id"
                  value={formData.patient_id}
                  onChange={(e) => handleChange('patient_id', e.target.value)}
                  placeholder="Enter patient ID"
                  required
                />
              </div>

              {/* Amount Paid */}
              <div className="space-y-2">
                <Label htmlFor="amount_paid">Amount Paid</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  value={formData.amount_paid}
                  onChange={(e) => handleChange('amount_paid', parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount paid"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(value) => handleChange('payment_method', value)}>
                  <SelectTrigger id="payment_method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="online">Online Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Type */}
              <div className="space-y-2">
                <Label htmlFor="payment_type_str">Payment Type</Label>
                <Select value={formData.payment_type_str} onValueChange={(value) => handleChange('payment_type_str', value)}>
                  <SelectTrigger id="payment_type_str">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advance">Advance</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reference String */}
              <div className="space-y-2">
                <Label htmlFor="reference_str">Reference</Label>
                <Input
                  id="reference_str"
                  value={formData.reference_str}
                  onChange={(e) => handleChange('reference_str', e.target.value)}
                  placeholder="Enter reference (e.g., transaction ID)"
                />
              </div>

              {/* Created By */}
              <div className="space-y-2">
                <Label htmlFor="created_by">Created By</Label>
                <Input
                  id="created_by"
                  value={formData.created_by}
                  onChange={(e) => handleChange('created_by', e.target.value)}
                  placeholder="Enter user name"
                  required
                />
              </div>

              {/* Payment Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="payment_notes">Payment Notes</Label>
                <Input
                  id="payment_notes"
                  value={formData.payment_notes}
                  onChange={(e) => handleChange('payment_notes', e.target.value)}
                  placeholder="Enter payment notes"
                />
              </div>

              {/* Payment Notes String */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="payment_notes_str">Additional Notes</Label>
                <Input
                  id="payment_notes_str"
                  value={formData.payment_notes_str}
                  onChange={(e) => handleChange('payment_notes_str', e.target.value)}
                  placeholder="Enter additional notes"
                />
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-md ${
                  message.startsWith('Error')
                    ? 'bg-red-50 text-red-800'
                    : 'bg-green-50 text-green-800'
                }`}
              >
                {message}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Processing...' : 'Process Payment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
