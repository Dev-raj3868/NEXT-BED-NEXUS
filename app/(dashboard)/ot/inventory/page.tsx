'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableBody as TBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, PackageX } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";

interface InventoryItem {
  item_id: string;
  item_name: string;
  category: string;
  stock: number;
  unit: string;
  minimum_stock: number;
  average_purchase_rate: number;
}

const GetOTInventory = () => {
  const CLINIC_ID = "clinic001";
  const ITEMS_PER_PAGE = 10;

  /* ---------------- STATE MANAGEMENT ---------------- */
  const [searchInputs, setSearchInputs] = useState({
    itemName: "",
    itemCode: "", // Maps to backend data's item_id
  });
  
  // Active query parameters currently locking the table view
  const [activeFilters, setActiveFilters] = useState({
    itemName: "",
    itemCode: "",
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(true);

  /* ---------------- FETCH CALL INTEGRATION ---------------- */
  const fetchInventoryData = async (page: number, filters: typeof activeFilters) => {
    try {
      setLoading(true);
      const computedOffset = (page - 1) * ITEMS_PER_PAGE;

      const payload: any = {
        clinic_id: CLINIC_ID,
        limit: ITEMS_PER_PAGE,
        offset: computedOffset,
      };

      // Conditionally append parameter identifiers if specified by search filters
      if (filters.itemCode.trim()) {
        payload.item_id = filters.itemCode.trim();
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ot-modules/get_ot_inventory`,
        payload,
        { withCredentials: true }
      );

      if (response.data.resSuccess === 1) {
        let results = response.data.data || [];
        
        // Client side filtering backup specifically for case-insensitive partial names matching
        if (filters.itemName.trim()) {
          const lowerSearch = filters.itemName.toLowerCase();
          results = results.filter((item: InventoryItem) =>
            item.item_name?.toLowerCase().includes(lowerSearch)
          );
        }

        setInventory(results);
        setTotalCount(filters.itemName.trim() ? results.length : (response.data.count || 0));
      }
    } catch (error) {
      console.error("Error pulling OT inventory directory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Synchronizes fetching changes on page navigation or search locks
  useEffect(() => {
    fetchInventoryData(currentPage, activeFilters);
  }, [currentPage, activeFilters]);

  /* ---------------- EVENT ACTIONS ---------------- */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveFilters({
      itemName: searchInputs.itemName,
      itemCode: searchInputs.itemCode,
    });
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchInputs({ itemName: "", itemCode: "" });
    setActiveFilters({ itemName: "", itemCode: "" });
    setCurrentPage(1);
    setShowResults(true);
  };

  const calculateStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return "out-of-stock";
    if (stock <= minStock) return "low-stock";
    return "in-stock";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-none">In Stock</Badge>;
      case "low-stock":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 shadow-none border-none">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-none border-none">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">OT Inventory</h1>
        <p className="text-muted-foreground">Search and manage operational stock records</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={searchInputs.itemName}
                  onChange={(e) => setSearchInputs({ ...searchInputs, itemName: e.target.value })}
                  placeholder="Filter by item name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemCode">Item Unique ID</Label>
                <Input
                  id="itemCode"
                  value={searchInputs.itemCode}
                  onChange={(e) => setSearchInputs({ ...searchInputs, itemCode: e.target.value })}
                  placeholder="Enter specific item identifier"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="w-full md:w-auto" disabled={loading}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Dynamic Container */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stock Master Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm font-medium">Syncing live inventory records...</span>
              </div>
            ) : inventory.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center border border-dashed rounded-lg gap-3">
                <PackageX className="h-10 w-10 text-muted-foreground stroke-[1.5]" />
                <p className="text-sm text-muted-foreground font-medium">No inventory data logs match your selection.</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/70">
                      <TableRow>
                        <TableHead>Item ID</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Min Safety Level</TableHead>
                        <TableHead className="text-right">Rate Cost</TableHead>
                        <TableHead className="text-center">Availability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TBody>
                      {inventory.map((item) => {
                        const statusKey = calculateStatus(item.stock, item.minimum_stock);
                        return (
                          <TableRow key={item.item_id} className="hover:bg-slate-50/50">
                            <TableCell className="font-mono text-xs font-semibold text-slate-700">{item.item_id}</TableCell>
                            <TableCell className="font-medium text-slate-900">{item.item_name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{item.category || "OT-ITEM"}</TableCell>
                            <TableCell className="text-right font-mono font-bold">{item.stock}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{item.unit || "Pieces"}</TableCell>
                            <TableCell className="text-right font-mono text-muted-foreground">{item.minimum_stock}</TableCell>
                            <TableCell className="text-right font-mono font-medium">
                              ₹{(item.average_purchase_rate || 0).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">{getStatusBadge(statusKey)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TBody>
                  </Table>
                </div>

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
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GetOTInventory;