import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockInventory = [
  { id: "INV001", itemName: "Surgical Scalpel", itemCode: "SC-001", category: "Surgical Instruments", quantity: 150, unit: "Pieces", minStock: 50, unitPrice: 250, status: "in-stock" },
  { id: "INV002", itemName: "Surgical Gloves", itemCode: "SG-001", category: "Disposables", quantity: 500, unit: "Boxes", minStock: 100, unitPrice: 450, status: "in-stock" },
  { id: "INV003", itemName: "Anesthesia Mask", itemCode: "AM-001", category: "Anesthesia Supplies", quantity: 30, unit: "Pieces", minStock: 25, unitPrice: 1200, status: "low-stock" },
  { id: "INV004", itemName: "Suture Kit", itemCode: "SK-001", category: "Consumables", quantity: 80, unit: "Packs", minStock: 40, unitPrice: 850, status: "in-stock" },
  { id: "INV005", itemName: "IV Fluid Set", itemCode: "IV-001", category: "Consumables", quantity: 10, unit: "Boxes", minStock: 30, unitPrice: 320, status: "out-of-stock" },
];

const GetOTInventory = () => {
  const [searchData, setSearchData] = useState({
    itemName: "",
    itemCode: "",
    category: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockInventory.length / itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search data:", searchData);
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchData({ itemName: "", itemCode: "", category: "" });
    setShowResults(false);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">In Stock</Badge>;
      case "low-stock":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">OT Inventory</h1>
        <p className="text-muted-foreground">Search and manage OT inventory items</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={searchData.itemName}
                  onChange={(e) => setSearchData({ ...searchData, itemName: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemCode">Item Code</Label>
                <Input
                  id="itemCode"
                  value={searchData.itemCode}
                  onChange={(e) => setSearchData({ ...searchData, itemCode: e.target.value })}
                  placeholder="Enter item code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={searchData.category}
                  onValueChange={(value) => setSearchData({ ...searchData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="surgical-instruments">Surgical Instruments</SelectItem>
                    <SelectItem value="consumables">Consumables</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="disposables">Disposables</SelectItem>
                    <SelectItem value="medicines">Medicines</SelectItem>
                    <SelectItem value="anesthesia">Anesthesia Supplies</SelectItem>
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
            <CardTitle className="text-lg">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemCode}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
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

export default GetOTInventory;
