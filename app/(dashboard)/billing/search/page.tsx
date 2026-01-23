'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
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

const mockBills = [
  { id: "BILL001", admissionId: "ADM001", patientId: "PT001", patientName: "Rahul Kumar", totalItems: 5, grossAmount: 15000, discount: 1500, netAmount: 13500, createdDate: "2026-01-15" },
  { id: "BILL002", admissionId: "ADM002", patientId: "PT002", patientName: "Priya Singh", totalItems: 3, grossAmount: 8500, discount: 500, netAmount: 8000, createdDate: "2026-01-14" },
  { id: "BILL003", admissionId: "ADM003", patientId: "PT003", patientName: "Amit Verma", totalItems: 8, grossAmount: 25000, discount: 2000, netAmount: 23000, createdDate: "2026-01-13" },
  { id: "BILL004", admissionId: "ADM004", patientId: "PT004", patientName: "Sneha Das", totalItems: 2, grossAmount: 5000, discount: 0, netAmount: 5000, createdDate: "2026-01-12" },
  { id: "BILL005", admissionId: "ADM005", patientId: "PT005", patientName: "Vikram Rao", totalItems: 6, grossAmount: 18000, discount: 1000, netAmount: 17000, createdDate: "2026-01-11" },
];

const mockBillDetails = {
  items: [
    { category: "Bed Charges", description: "ICU Room - 3 days", quantity: 3, unitRate: 3000, discount: 0, total: 9000 },
    { category: "Doctor Charge", description: "Consultation - Dr. Sharma", quantity: 2, unitRate: 500, discount: 0, total: 1000 },
    { category: "Medicine", description: "Paracetamol 500mg", quantity: 10, unitRate: 10, discount: 0, total: 100 },
    { category: "OT Room Charges", description: "OT-1 - 2 hours", quantity: 2, unitRate: 2000, discount: 500, total: 3500 },
    { category: "OT Doctor Charge", description: "Surgery - Dr. Patel", quantity: 1, unitRate: 5000, discount: 1000, total: 4000 },
  ],
};

const GetBill = () => {
  const [searchData, setSearchData] = useState({
    billId: "",
    admissionId: "",
    patientId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [selectedBill, setSelectedBill] = useState<typeof mockBills[0] | null>(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockBills.length / itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search data:", searchData);
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchData({ billId: "", admissionId: "", patientId: "" });
    setShowResults(false);
    setCurrentPage(1);
  };

  const handleViewBill = (bill: typeof mockBills[0]) => {
    setSelectedBill(bill);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Get Bills</h1>
        <p className="text-muted-foreground">Search and view billing records</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billId">Bill ID</Label>
                <Input
                  id="billId"
                  value={searchData.billId}
                  onChange={(e) => setSearchData({ ...searchData, billId: e.target.value })}
                  placeholder="Enter bill ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionId">Admission ID</Label>
                <Input
                  id="admissionId"
                  value={searchData.admissionId}
                  onChange={(e) => setSearchData({ ...searchData, admissionId: e.target.value })}
                  placeholder="Enter admission ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={searchData.patientId}
                  onChange={(e) => setSearchData({ ...searchData, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="w-full md:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="w-full md:w-auto">
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Table */}
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
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>{bill.admissionId}</TableCell>
                    <TableCell>{bill.patientName}</TableCell>
                    <TableCell>{bill.totalItems}</TableCell>
                    <TableCell>₹{bill.grossAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{bill.discount.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">₹{bill.netAmount.toLocaleString()}</TableCell>
                    <TableCell>{bill.createdDate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewBill(bill)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bill Details Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bill Details - {selectedBill?.id}</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Admission ID:</span>{" "}
                  <span className="font-medium">{selectedBill.admissionId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Patient:</span>{" "}
                  <span className="font-medium">{selectedBill.patientName}</span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBillDetails.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.unitRate}</TableCell>
                      <TableCell>₹{item.discount}</TableCell>
                      <TableCell className="font-medium">₹{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end pt-4 border-t">
                <div className="space-y-1 text-right">
                  <div className="text-sm text-muted-foreground">
                    Gross Amount: ₹{selectedBill.grossAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Discount: -₹{selectedBill.discount.toLocaleString()}
                  </div>
                  <div className="text-lg font-semibold">
                    Net Amount: ₹{selectedBill.netAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetBill;