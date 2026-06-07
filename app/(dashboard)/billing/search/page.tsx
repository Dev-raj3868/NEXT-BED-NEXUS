'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Loader2, Save } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { billingPost, cleanPayload, getBillingMessage } from "../billing-api";

const currency = (value: any) => `INR ${Number(value || 0).toLocaleString()}`;

const getBillId = (bill: any) => bill?.bill_id || bill?.id || bill?._id || "";
const getItems = (bill: any) => bill?.items || bill?.bill_items || [];
const getPatientName = (bill: any) => bill?.patient_name || bill?.patient_id?.patient_name || bill?.patient?.patient_name || "-";
const getGrossAmount = (bill: any) => bill?.gross_amount || bill?.total_gross_amount || bill?.total_amount || 0;
const getDiscount = (bill: any) => bill?.discount || bill?.discount_amount || bill?.total_discount || 0;
const getNetAmount = (bill: any) => bill?.net_amount || bill?.total_net_amount || bill?.amount || getGrossAmount(bill) - getDiscount(bill);

const GetBill = () => {
  const [searchData, setSearchData] = useState({
    billId: "",
    admissionId: "",
    patientId: "",
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [updateFields, setUpdateFields] = useState({
    status: "",
    notes: "",
    discount: "",
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil((totalRecords || bills.length) / itemsPerPage);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(true);

    try {
      const response = await billingPost("get_bill", {
        filters: cleanPayload({
          bill_id: searchData.billId || undefined,
          admission_id: searchData.admissionId || undefined,
          patient_id: searchData.patientId || undefined,
          from_date: searchData.fromDate || undefined,
          to_date: searchData.toDate || undefined,
          pagination: { page: currentPage, limit: itemsPerPage },
        }),
      });

      if (response.apiSuccess === 1) {
        const data = response.data as any;
        const rows = data?.bill ? [data.bill] : data?.bills || data || [];
        setBills(Array.isArray(rows) ? rows : []);
        setTotalRecords(data?.total || rows.length || 0);
      } else {
        setBills([]);
        setTotalRecords(0);
        toast({
          title: response.apiSuccess === -1 ? "Server error" : "No results",
          description: getBillingMessage(response, "No bills found."),
          variant: response.apiSuccess === -1 ? "destructive" : undefined,
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch bills.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchData({ billId: "", admissionId: "", patientId: "", fromDate: "", toDate: "" });
    setShowResults(false);
    setBills([]);
    setTotalRecords(0);
    setCurrentPage(1);
  };

  const handleViewBill = (bill: any) => {
    setSelectedBill(bill);
    setUpdateFields({
      status: bill.status || "",
      notes: bill.notes || "",
      discount: String(bill.discount || bill.discount_amount || ""),
    });
  };

  const handleUpdateBill = async () => {
    const billId = getBillId(selectedBill);
    if (!billId) {
      toast({ title: "Invalid bill", description: "Bill ID is required to update.", variant: "destructive" });
      return;
    }

    const fields = cleanPayload({
      status: updateFields.status || undefined,
      notes: updateFields.notes || undefined,
      discount: updateFields.discount === "" ? undefined : Number(updateFields.discount),
    });

    if (!Object.keys(fields).length) {
      toast({ title: "Nothing to update", description: "Change status, notes, or discount first." });
      return;
    }

    setSaving(true);
    try {
      const response = await billingPost("update_bill", {
        bill_id: billId,
        ...fields,
      });

      if (response.apiSuccess === 1) {
        toast({ title: "Success", description: response.message || "Bill updated successfully." });
        setBills((prev) => prev.map((bill) => (getBillId(bill) === billId ? { ...bill, ...fields } : bill)));
        setSelectedBill((prev: any) => ({ ...prev, ...fields }));
      } else {
        toast({
          title: response.apiSuccess === -1 ? "Server error" : "Invalid update",
          description: getBillingMessage(response, "Unable to update bill."),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update bill.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const paginatedBills = bills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Get Bills</h1>
        <p className="text-muted-foreground">Search, view, and update billing records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billId">Bill ID</Label>
                <Input id="billId" value={searchData.billId} onChange={(e) => setSearchData({ ...searchData, billId: e.target.value })} placeholder="Enter bill ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionId">Admission ID</Label>
                <Input id="admissionId" value={searchData.admissionId} onChange={(e) => setSearchData({ ...searchData, admissionId: e.target.value })} placeholder="Enter admission ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input id="patientId" value={searchData.patientId} onChange={(e) => setSearchData({ ...searchData, patientId: e.target.value })} placeholder="Enter patient ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <Input id="fromDate" type="date" value={searchData.fromDate} onChange={(e) => setSearchData({ ...searchData, fromDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <Input id="toDate" type="date" value={searchData.toDate} onChange={(e) => setSearchData({ ...searchData, toDate: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="w-full md:w-auto">
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bill Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill ID</TableHead>
                  <TableHead>Admission ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Total Items</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                ) : paginatedBills.length > 0 ? (
                  paginatedBills.map((bill) => (
                    <TableRow key={getBillId(bill)}>
                      <TableCell className="font-medium">{getBillId(bill)}</TableCell>
                      <TableCell>{bill.admission_id || "-"}</TableCell>
                      <TableCell>{getPatientName(bill)}</TableCell>
                      <TableCell>{getItems(bill).length || bill.total_items || "-"}</TableCell>
                      <TableCell>{currency(getGrossAmount(bill))}</TableCell>
                      <TableCell>{currency(getDiscount(bill))}</TableCell>
                      <TableCell className="font-medium">{currency(getNetAmount(bill))}</TableCell>
                      <TableCell><Badge variant="outline">{bill.status || "Draft"}</Badge></TableCell>
                      <TableCell>{bill.created_date || bill.date || bill.createdAt || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleViewBill(bill)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={10} className="text-center py-10 text-muted-foreground">No billing records found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                    </PaginationItem>
                    <PaginationItem><PaginationLink isActive>{currentPage}</PaginationLink></PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bill Details - {getBillId(selectedBill)}</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Admission ID:</span> <span className="font-medium">{selectedBill.admission_id || "-"}</span></div>
                <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{getPatientName(selectedBill)}</span></div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getItems(selectedBill).length > 0 ? getItems(selectedBill).map((item: any, idx: number) => (
                    <TableRow key={item._id || idx}>
                      <TableCell><Badge variant="outline">{item.category || item.name || "-"}</Badge></TableCell>
                      <TableCell>{item.quantity || 0}</TableCell>
                      <TableCell>{currency(item.unit_price || item.unitRate)}</TableCell>
                      <TableCell>{currency(item.discount || 0)}</TableCell>
                      <TableCell className="font-medium">{currency(item.amount || item.total)}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No bill items returned.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={updateFields.status} onValueChange={(value) => setUpdateFields({ ...updateFields, status: value })}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Finalized">Finalized</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount</Label>
                  <Input type="number" value={updateFields.discount} onChange={(e) => setUpdateFields({ ...updateFields, discount: e.target.value })} placeholder="0" />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label>Notes</Label>
                  <Textarea value={updateFields.notes} onChange={(e) => setUpdateFields({ ...updateFields, notes: e.target.value })} placeholder="Update bill notes" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">
                <div className="space-y-1 text-sm">
                  <div className="text-muted-foreground">Gross Amount: {currency(getGrossAmount(selectedBill))}</div>
                  <div className="text-muted-foreground">Discount: {currency(getDiscount(selectedBill))}</div>
                  <div className="text-lg font-semibold">Net Amount: {currency(getNetAmount(selectedBill))}</div>
                </div>
                <Button onClick={handleUpdateBill} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Update Bill
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetBill;
