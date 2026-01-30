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

const mockPayments = [
  { 
    id: "PAY001", 
    bookingId: "BOK001",
    otName: "OT-1", 
    doctorName: "Dr. Sharma", 
    status: "Completed", 
    date: "2026-01-20", 
    patientName: "Rahul Kumar",
    age: 35,
    gender: "Male"
  },
  { 
    id: "PAY002", 
    bookingId: "BOK002",
    otName: "OT-2", 
    doctorName: "Dr. Patel", 
    status: "Pending", 
    date: "2026-01-19", 
    patientName: "Priya Singh",
    age: 28,
    gender: "Female"
  },
  { 
    id: "PAY003", 
    bookingId: "BOK003",
    otName: "OT-3", 
    doctorName: "Dr. Verma", 
    status: "Completed", 
    date: "2026-01-18", 
    patientName: "Amit Verma",
    age: 45,
    gender: "Male"
  },
  { 
    id: "PAY004", 
    bookingId: "BOK004",
    otName: "OT-1", 
    doctorName: "Dr. Das", 
    status: "Cancelled", 
    date: "2026-01-17", 
    patientName: "Sneha Das",
    age: 32,
    gender: "Female"
  },
  { 
    id: "PAY005", 
    bookingId: "BOK005",
    otName: "OT-2", 
    doctorName: "Dr. Rao", 
    status: "Completed", 
    date: "2026-01-16", 
    patientName: "Vikram Rao",
    age: 50,
    gender: "Male"
  },
];

const GetPayment = () => {
  const [searchData, setSearchData] = useState({
    bookingId: "",
    otName: "",
    doctorName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof mockPayments[0] | null>(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockPayments.length / itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search data:", searchData);
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchData({ bookingId: "", otName: "", doctorName: "" });
    setShowResults(false);
    setCurrentPage(1);
  };

  const handleViewPayment = (payment: typeof mockPayments[0]) => {
    setSelectedPayment(payment);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Get Payments</h1>
        <p className="text-muted-foreground">Search and view payment records</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookingId">Booking ID</Label>
                <Input
                  id="bookingId"
                  value={searchData.bookingId}
                  onChange={(e) => setSearchData({ ...searchData, bookingId: e.target.value })}
                  placeholder="Enter booking ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otName">OT Name</Label>
                <Input
                  id="otName"
                  value={searchData.otName}
                  onChange={(e) => setSearchData({ ...searchData, otName: e.target.value })}
                  placeholder="Enter OT name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  value={searchData.doctorName}
                  onChange={(e) => setSearchData({ ...searchData, doctorName: e.target.value })}
                  placeholder="Enter doctor name"
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
            <CardTitle className="text-lg">Payment Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>OT Name</TableHead>
                  <TableHead>Doctor Name</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.bookingId}</TableCell>
                    <TableCell>{payment.otName}</TableCell>
                    <TableCell>{payment.doctorName}</TableCell>
                    <TableCell>{payment.patientName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewPayment(payment)}>
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

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details - {selectedPayment?.id}</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Booking ID:</span>{" "}
                  <span className="font-medium">{selectedPayment.bookingId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">OT Name:</span>{" "}
                  <span className="font-medium">{selectedPayment.otName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Doctor Name:</span>{" "}
                  <span className="font-medium">{selectedPayment.doctorName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <Badge className={getStatusBadgeColor(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Patient Name:</span>{" "}
                  <span className="font-medium">{selectedPayment.patientName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span className="font-medium">{selectedPayment.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                <div>
                  <span className="text-muted-foreground">Age:</span>{" "}
                  <span className="font-medium">{selectedPayment.age} years</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>{" "}
                  <span className="font-medium">{selectedPayment.gender}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetPayment;
