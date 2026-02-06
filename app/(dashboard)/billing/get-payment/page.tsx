'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, RotateCcw, Loader2 } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
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
import { toast } from "@/hooks/use-toast";

const GetPayment = () => {
  const CLINIC_ID = "clinic001";

  // Create a ref for the entire search container
  const searchContainerRef = useRef<HTMLDivElement>(null);

  /* ---------------- SEARCH STATES ---------------- */
  const [searchData, setSearchData] = useState({
    billId: "",
    admissionId: "",
    patientId: "",
    fromDate: "",
    toDate: "",
  });

  /* ---------------- PATIENT SUGGESTION STATES ---------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* ---------------- DATA STATES ---------------- */
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is NOT within the searchContainerRef, close suggestions
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    // Attach listener to document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ---------------- FETCH PATIENT SUGGESTIONS ---------------- */
  useEffect(() => {
    const getSuggestions = async () => {
      if (searchQuery.length < 3) return;
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/name-suggestion-patient-information`, {
          patient_name: searchQuery,
          clinic_id: CLINIC_ID
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

  /* ---------------- API CALL: GET PAYMENTS ---------------- */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(true);

    const payload = {
      hospital_id: CLINIC_ID,
      bill_id: searchData.billId || undefined,
      admission_id: searchData.admissionId || undefined,
      patient_id: searchData.patientId || undefined,
      from_date: searchData.fromDate || undefined,
      to_date: searchData.toDate || undefined,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/billing/get_payment`,
        payload,
        { withCredentials: true }
      );

      if (response.data.resSuccess === 1) {
        setPayments(response.data.data || []);
      } else {
        setPayments([]);
        toast({ title: "No results", description: response.data.message });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast({ title: "Error", description: "Failed to fetch records", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchData({ billId: "", admissionId: "", patientId: "", fromDate: "", toDate: "" });
    setSearchQuery("");
    setShowResults(false);
    setPayments([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const paginatedPayments = payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment Records</h1>
        <p className="text-muted-foreground">Search and audit all hospital transaction records</p>
      </div>

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="text-lg">Filter Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Patient Autocomplete */}
              <div className="space-y-2 relative" ref={searchContainerRef}>
                <Label>Patient Name Search</Label>
                <Input 
                  placeholder="Type name..." 
                  value={searchQuery} 
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.length >= 3) setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto border-slate-200">
                    {suggestions.map((p) => (
                      <div 
                        key={p._id} 
                        className="p-2 hover:bg-slate-100 cursor-pointer border-b last:border-0 text-sm" 
                        onClick={() => {
                          setSearchData({ ...searchData, patientId: p._id });
                          setSearchQuery(p.patient_name);
                          setShowSuggestions(false); // Close after selection
                        }}
                      >
                        <div className="font-bold">{p.patient_name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.phone_number}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Admission ID</Label>
                <Input value={searchData.admissionId} onChange={(e) => setSearchData({...searchData, admissionId: e.target.value})} placeholder="ADM-..." />
              </div>

              <div className="space-y-2">
                <Label>From Date</Label>
                <Input type="date" value={searchData.fromDate} onChange={(e) => setSearchData({...searchData, fromDate: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Input type="date" value={searchData.toDate} onChange={(e) => setSearchData({...searchData, toDate: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                ) : paginatedPayments.length > 0 ? (
                  paginatedPayments.map((pay) => (
                    <TableRow key={pay._id}>
                      <TableCell className="font-mono text-xs">{pay.payment_id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{pay.patient_id?.patient_name}</div>
                        <div className="text-[10px] text-muted-foreground">{pay.patient_id?.phone_number}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{pay.payment_method}</Badge></TableCell>
                      <TableCell className="text-xs">{pay.payment_type}</TableCell>
                      <TableCell className="font-bold text-green-700">₹{pay.amount_paid}</TableCell>
                      <TableCell>{format(new Date(pay.payment_date), "dd MMM yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(pay)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={7} className="text-center py-10">No records found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} />
                    </PaginationItem>
                    <PaginationItem><PaginationLink isActive>{currentPage}</PaginationLink></PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Payment Summary</DialogTitle></DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">Receipt No:</span>
                <span className="font-mono font-bold text-sm">{selectedPayment.payment_id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] uppercase text-muted-foreground">Patient</Label>
                  <p className="text-sm font-semibold">{selectedPayment.patient_id?.patient_name}</p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase text-muted-foreground">Amount Paid</Label>
                  <p className="text-lg font-bold text-green-600">₹{selectedPayment.amount_paid}</p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase text-muted-foreground">Admission ID</Label>
                  <p className="text-xs font-mono">{selectedPayment.admission_id}</p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase text-muted-foreground">Method</Label>
                  <p className="text-sm">{selectedPayment.payment_method}</p>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-md text-xs">
                <strong>Transaction Date:</strong> {format(new Date(selectedPayment.payment_date), "PPPP p")}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetPayment;