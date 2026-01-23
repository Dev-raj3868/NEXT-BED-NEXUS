'use client';
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Printer, Eye, X } from "lucide-react";
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

const mockFinalBills = [
  { id: "FB001", patientName: "Rahul Kumar", phoneNumber: "9876543210", paymentStatus: "paid", totalNetAmount: 45000, totalPaid: 45000, balanceDue: 0, billingPeriod: "Jan 5-15, 2026", billStatus: "finalized", itemCounts: { bed: 3, ot: 2, medicine: 15, doctor: 4 } },
  { id: "FB002", patientName: "Priya Singh", phoneNumber: "9876543211", paymentStatus: "partial", totalNetAmount: 32000, totalPaid: 20000, balanceDue: 12000, billingPeriod: "Jan 10-14, 2026", billStatus: "finalized", itemCounts: { bed: 2, ot: 1, medicine: 8, doctor: 2 } },
  { id: "FB003", patientName: "Amit Verma", phoneNumber: "9876543212", paymentStatus: "pending", totalNetAmount: 78000, totalPaid: 0, balanceDue: 78000, billingPeriod: "Jan 8-18, 2026", billStatus: "finalized", itemCounts: { bed: 5, ot: 3, medicine: 25, doctor: 6 } },
  { id: "FB004", patientName: "Sneha Das", phoneNumber: "9876543213", paymentStatus: "paid", totalNetAmount: 15000, totalPaid: 15000, balanceDue: 0, billingPeriod: "Jan 12-14, 2026", billStatus: "finalized", itemCounts: { bed: 1, ot: 0, medicine: 5, doctor: 2 } },
];

const mockBillDetails = {
  patientInfo: {
    name: "Rahul Kumar",
    id: "PT001",
    phone: "9876543210",
    email: "rahul@email.com",
    admissionDoctor: "Dr. Sharma",
  },
  categories: {
    bedCharges: { items: 3, gross: 15000, discount: 1000, net: 14000 },
    otCharges: { items: 2, gross: 20000, discount: 2000, net: 18000 },
    medicineCharges: { items: 15, gross: 5000, discount: 0, net: 5000 },
    doctorCharges: { items: 4, gross: 8000, discount: 0, net: 8000 },
  },
  payment: {
    subtotal: 45000,
    additionalDiscountPercent: 0,
    additionalDiscountAmount: 0,
    additionalDiscountReason: "",
    totalNetAmount: 45000,
    roundingAdjustment: 0,
    finalPayableAmount: 45000,
    totalPaid: 45000,
    balanceDue: 0,
  },
};

const GetFinalBill = () => {
  const [searchData, setSearchData] = useState({
    finalBillId: "",
    patientName: "",
    phoneNumber: "",
    paymentStatus: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [selectedBill, setSelectedBill] = useState<typeof mockFinalBills[0] | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockFinalBills.length / itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search data:", searchData);
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchData({ finalBillId: "", patientName: "", phoneNumber: "", paymentStatus: "" });
    setShowResults(false);
    setCurrentPage(1);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `FinalBill-${selectedBill?.id}`,
  });

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Paid</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Partial</Badge>;
      case "pending":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Get Final Bills</h1>
        <p className="text-muted-foreground">Search and view final billing records</p>
      </div>

      {/* Search Form */}
      <Card>
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

              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={searchData.patientName}
                  onChange={(e) => setSearchData({ ...searchData, patientName: e.target.value })}
                  placeholder="Enter patient name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={searchData.phoneNumber}
                  onChange={(e) => setSearchData({ ...searchData, phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={searchData.paymentStatus}
                  onValueChange={(value) => setSearchData({ ...searchData, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
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
            <CardTitle className="text-lg">Final Bill Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Final Bill ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Total Net Amount</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Balance Due</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFinalBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>{bill.patientName}</TableCell>
                    <TableCell>{bill.phoneNumber}</TableCell>
                    <TableCell>{getPaymentStatusBadge(bill.paymentStatus)}</TableCell>
                    <TableCell>₹{bill.totalNetAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{bill.totalPaid.toLocaleString()}</TableCell>
                    <TableCell className={bill.balanceDue > 0 ? "text-destructive font-medium" : ""}>
                      ₹{bill.balanceDue.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBill(bill)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBill(bill)}>
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
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

      {/* Bill Details & Print Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Final Bill - {selectedBill?.id}</DialogTitle>
              <Button onClick={() => handlePrint()} className="gap-2">
                <Printer className="w-4 h-4" />
                Print Bill
              </Button>
            </div>
          </DialogHeader>
          
          {selectedBill && (
            <div ref={printRef} className="space-y-6 p-4 print:p-8">
              {/* Header for Print */}
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold">Nexus Bed Management</h1>
                <p className="text-muted-foreground">Hospital Final Bill</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Bill ID: {selectedBill.id}</span>
                  <span className="mx-2">|</span>
                  <span>Billing Period: {selectedBill.billingPeriod}</span>
                  <span className="mx-2">|</span>
                  <span>Status: {selectedBill.billStatus}</span>
                </div>
              </div>

              {/* Patient Info */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-medium">{mockBillDetails.patientInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Patient ID:</span>{" "}
                      <span className="font-medium">{mockBillDetails.patientInfo.id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{mockBillDetails.patientInfo.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Doctor:</span>{" "}
                      <span className="font-medium">{mockBillDetails.patientInfo.admissionDoctor}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Item Categories */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Items Category</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Items</TableHead>
                        <TableHead className="text-right">Gross</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Net</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Bed Charges</TableCell>
                        <TableCell className="text-center">{mockBillDetails.categories.bedCharges.items}</TableCell>
                        <TableCell className="text-right">₹{mockBillDetails.categories.bedCharges.gross.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{mockBillDetails.categories.bedCharges.discount.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{mockBillDetails.categories.bedCharges.net.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>OT Charges</TableCell>
                        <TableCell className="text-center">{mockBillDetails.categories.otCharges.items}</TableCell>
                        <TableCell className="text-right">₹{mockBillDetails.categories.otCharges.gross.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{mockBillDetails.categories.otCharges.discount.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{mockBillDetails.categories.otCharges.net.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medicine Charges</TableCell>
                        <TableCell className="text-center">{mockBillDetails.categories.medicineCharges.items}</TableCell>
                        <TableCell className="text-right">₹{mockBillDetails.categories.medicineCharges.gross.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{mockBillDetails.categories.medicineCharges.discount.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{mockBillDetails.categories.medicineCharges.net.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Doctor Charges</TableCell>
                        <TableCell className="text-center">{mockBillDetails.categories.doctorCharges.items}</TableCell>
                        <TableCell className="text-right">₹{mockBillDetails.categories.doctorCharges.gross.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{mockBillDetails.categories.doctorCharges.discount.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{mockBillDetails.categories.doctorCharges.net.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>₹{mockBillDetails.payment.subtotal.toLocaleString()}</span>
                    </div>
                    {mockBillDetails.payment.additionalDiscountAmount > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Additional Discount ({mockBillDetails.payment.additionalDiscountPercent}%):</span>
                          <span className="text-destructive">-₹{mockBillDetails.payment.additionalDiscountAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Reason: {mockBillDetails.payment.additionalDiscountReason}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Total Net Amount:</span>
                      <span className="font-medium">₹{mockBillDetails.payment.totalNetAmount.toLocaleString()}</span>
                    </div>
                    {mockBillDetails.payment.roundingAdjustment !== 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rounding Adjustment:</span>
                        <span>₹{mockBillDetails.payment.roundingAdjustment}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Final Payable Amount:</span>
                      <span className="text-primary">₹{mockBillDetails.payment.finalPayableAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Total Paid:</span>
                      <span className="text-green-600 font-medium">₹{mockBillDetails.payment.totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance Due:</span>
                      <span className={mockBillDetails.payment.balanceDue > 0 ? "text-destructive font-bold" : "font-medium"}>
                        ₹{mockBillDetails.payment.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Print Footer */}
              <div className="text-center text-xs text-muted-foreground border-t pt-4 print:mt-8">
                <p>This is a computer-generated bill. No signature required.</p>
                <p>Thank you for choosing Nexus Bed Management.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetFinalBill;