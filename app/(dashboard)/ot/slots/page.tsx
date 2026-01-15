'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockOTSlots = [
  { id: "BK001", otName: "OT-1", doctorName: "Dr. Sharma", status: "scheduled", date: "2026-01-10", patientName: "Rahul Kumar", age: 45, gender: "Male" },
  { id: "BK002", otName: "OT-2", doctorName: "Dr. Patel", status: "completed", date: "2026-01-09", patientName: "Priya Singh", age: 32, gender: "Female" },
  { id: "BK003", otName: "OT-1", doctorName: "Dr. Gupta", status: "in-progress", date: "2026-01-09", patientName: "Amit Verma", age: 58, gender: "Male" },
  { id: "BK004", otName: "OT-3", doctorName: "Dr. Sharma", status: "cancelled", date: "2026-01-08", patientName: "Sneha Das", age: 28, gender: "Female" },
  { id: "BK005", otName: "OT-2", doctorName: "Dr. Reddy", status: "scheduled", date: "2026-01-11", patientName: "Vikram Rao", age: 62, gender: "Male" },
];

const GetOTSlot = () => {
  const [searchData, setSearchData] = useState({
    bookingId: "",
    otName: "",
    doctorId: "",
  });
  const [dateOfOT, setDateOfOT] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockOTSlots.length / itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search data:", { ...searchData, dateOfOT });
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchData({ bookingId: "", otName: "", doctorId: "" });
    setDateOfOT(undefined);
    setShowResults(false);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">In Progress</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Get OT Slots</h1>
        <p className="text-muted-foreground">Search and view OT slot bookings</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search OT Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Label htmlFor="doctorId">Doctor ID</Label>
                <Input
                  id="doctorId"
                  value={searchData.doctorId}
                  onChange={(e) => setSearchData({ ...searchData, doctorId: e.target.value })}
                  placeholder="Enter doctor ID"
                />
              </div>

              <div className="space-y-2">
                <Label>Date of OT</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfOT && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfOT ? format(dateOfOT, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfOT}
                      onSelect={setDateOfOT}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
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
            <CardTitle className="text-lg">OT Slot Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>OT Name</TableHead>
                  <TableHead>Doctor Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOTSlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">{slot.id}</TableCell>
                    <TableCell>{slot.otName}</TableCell>
                    <TableCell>{slot.doctorName}</TableCell>
                    <TableCell>{getStatusBadge(slot.status)}</TableCell>
                    <TableCell>{slot.date}</TableCell>
                    <TableCell>{slot.patientName}</TableCell>
                    <TableCell>{slot.age}</TableCell>
                    <TableCell>{slot.gender}</TableCell>
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
    </div>
  );
};

export default GetOTSlot;
