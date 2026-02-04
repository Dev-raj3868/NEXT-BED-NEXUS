'use client';

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Printer, Eye, RotateCcw, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

const GetFinalBill = () => {
  const CLINIC_ID = "clinic001";

  /* ---------------- SEARCH STATES ---------------- */
  const [searchData, setSearchData] = useState({
    finalBillId: "",
    patientName: "",
    phoneNumber: "",
    paymentStatus: "",
    patientId: "", 
  });

  /* ---------------- DATA STATES ---------------- */
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  /* ---------------- SUGGESTIONS STATES ---------------- */
  const [phoneSuggestions, setPhoneSuggestions] = useState<any[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<any[]>([]);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [showNameDropdown, setShowNameDropdown] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(bills.length / itemsPerPage);

  const fetchSuggestions = async (query: string, type: 'phone' | 'name') => {
    if (query.length < 3) return;
    try {
      const payload = type === 'phone' 
        ? { phone_number: query, clinic_id: CLINIC_ID } 
        : { patient_name: query, clinic_id: CLINIC_ID };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`,
        payload,
        { withCredentials: true }
      );

      if (response.data.resSuccess === 1) {
        if (type === 'phone') {
          setPhoneSuggestions(response.data.data || []);
          setShowPhoneDropdown(true);
        } else {
          setNameSuggestions(response.data.data || []);
          setShowNameDropdown(true);
        }
      }
    } catch (error) {
      console.error("Suggestion fetch error:", error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(true);

    try {
      const payload = {
        final_bill_id: searchData.finalBillId || undefined,
        patient_id: searchData.patientId || undefined,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/billing/get_final_bill_table`,
        payload,
        { withCredentials: true }
      );

      if (response.data.resSuccess === 1) {
        setBills(response.data.data || []);
      } else {
        setBills([]);
      }
    } catch (error) {
      console.error("Fetch bills error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchData({ finalBillId: "", patientName: "", phoneNumber: "", paymentStatus: "", patientId: "" });
    setShowResults(false);
    setBills([]);
    setCurrentPage(1);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `FinalBill-${selectedBill?.final_bill_id}`,
  });

  const getPaymentStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "paid": return <Badge className="bg-green-500/10 text-green-600">Paid</Badge>;
      case "partial": return <Badge className="bg-yellow-500/10 text-yellow-600">Partial</Badge>;
      case "pending": return <Badge className="bg-red-500/10 text-red-600">Pending</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const paginatedBills = bills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Get Final Bills</h1>
        <p className="text-muted-foreground">Search and view final billing records</p>
      </div>

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="text-lg">Search Final Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="finalBillId">Final Bill ID</Label>
                <Input
                  id="finalBillId"
                  value={searchData.finalBillId}
                  onChange={(e) => setSearchData({ ...searchData, finalBillId: e.target.value })}
                  placeholder="Enter bill ID"
                />
              </div>

              {/* Patient Name Search */}
              <div className="space-y-2 relative">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={searchData.patientName}
                  onChange={(e) => {
                    setSearchData({ ...searchData, patientName: e.target.value });
                    fetchSuggestions(e.target.value, 'name');
                  }}
                  placeholder="Enter patient name"
                />
                {showNameDropdown && nameSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                    {nameSuggestions.map((p) => (
                      <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer border-b text-sm" onClick={() => {
                        setSearchData({ ...searchData, patientName: p.patient_name, phoneNumber: p.phone_number, patientId: p._id });
                        setShowNameDropdown(false);
                      }}>
                        <div className="font-bold">{p.patient_name}</div>
                        <div className="text-xs text-muted-foreground">{p.phone_number}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Number Search */}
              <div className="space-y-2 relative">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={searchData.phoneNumber}
                  onChange={(e) => {
                    setSearchData({ ...searchData, phoneNumber: e.target.value });
                    fetchSuggestions(e.target.value, 'phone');
                  }}
                  placeholder="Enter phone number"
                />
                {showPhoneDropdown && phoneSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                    {phoneSuggestions.map((p) => (
                      <div key={p._id} className="p-2 hover:bg-slate-100 cursor-pointer border-b text-sm" onClick={() => {
                        setSearchData({ ...searchData, phoneNumber: p.phone_number, patientName: p.patient_name, patientId: p._id });
                        setShowPhoneDropdown(false);
                      }}>
                        <div className="font-bold">{p.phone_number}</div>
                        <div className="text-xs text-muted-foreground">{p.patient_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={searchData.paymentStatus}
                  onValueChange={(value) => setSearchData({ ...searchData, paymentStatus: value })}
                >
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Final Bill Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className="text-right">Net Amount</TableHead>
                  <TableHead className="text-right">Total Paid</TableHead>
                  <TableHead className="text-right">Balance Due</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                ) : bills.length > 0 ? (
                  paginatedBills.map((bill) => (
                    <TableRow key={bill._id}>
                      <TableCell className="font-medium font-mono text-xs">{bill.final_bill_id}</TableCell>
                      <TableCell>{bill.patient_id?.patient_name}</TableCell>
                      <TableCell>{bill.patient_id?.phone_number}</TableCell>
                      <TableCell>{getPaymentStatusBadge(bill.payment_status)}</TableCell>
                      <TableCell className="text-right font-medium">₹{bill.total_net_amount?.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">₹{bill.total_paid?.toLocaleString()}</TableCell>
                      <TableCell className={`text-right font-bold ${bill.balance_due > 0 ? "text-red-600" : "text-green-600"}`}>
                        ₹{bill.balance_due?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedBill(bill)}><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedBill(bill); setTimeout(() => handlePrint(), 100); }}><Printer className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No billing records found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Bill View Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-4xl">
          <div ref={printRef} className="p-8 space-y-6">
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold uppercase">Final Invoice</h1>
              <p className="font-mono text-xs">{selectedBill?.final_bill_id}</p>
            </div>
            <div className="grid grid-cols-2 text-sm">
              <p><strong>Patient:</strong> {selectedBill?.patient_id?.patient_name}</p>
              <p className="text-right"><strong>Phone:</strong> {selectedBill?.patient_id?.phone_number}</p>
            </div>
            <div className="space-y-2 border-t pt-4 text-right">
              <div className="flex justify-between"><span>Net Amount:</span><span>₹{selectedBill?.total_net_amount?.toLocaleString()}</span></div>
              <div className="flex justify-between text-green-600"><span>Amount Paid:</span><span>₹{selectedBill?.total_paid?.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold border-t pt-2 text-lg">
                <span>Balance Due:</span>
                <span className={selectedBill?.balance_due > 0 ? "text-red-600" : ""}>₹{selectedBill?.balance_due?.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-8 pb-8">
            <Button variant="outline" onClick={() => setSelectedBill(null)}>Close</Button>
            <Button onClick={() => handlePrint()}><Printer className="w-4 h-4 mr-2" /> Print PDF</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetFinalBill;