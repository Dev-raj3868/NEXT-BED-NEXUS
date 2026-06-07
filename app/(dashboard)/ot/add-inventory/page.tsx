'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const AddOTInventory = () => {
  const CLINIC_ID = "clinic001";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "",
    minStock: "",
    maxStock: "",
    supplier: "",
    unitPrice: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const numericQuantity = Number(formData.quantity) || 0;
    const numericUnitPrice = Number(formData.unitPrice) || 0;

    // Payload tailored strictly to the core inventory schema layout
    const payload = {
      clinic_id: CLINIC_ID,
      item_name: formData.itemName,
      stock: numericQuantity,
      unit: formData.unit,
      minimum_stock: Number(formData.minStock) || 0,
      average_purchase_rate: numericUnitPrice,
      last_purchase_rate: numericUnitPrice,
      total_value: numericQuantity * numericUnitPrice,
      created_by: "Admin",
      updated_by: "Admin",
      is_batch: false, // Disables nested batch insertion logic entirely
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ot-modules/create_inventory_ot`,
        payload,
        { withCredentials: true }
      );

      if (response.data.resSuccess === 1) {
        toast({
          title: "Success",
          description: response.data.message || "Inventory item added successfully!",
        });

        // Reset Form State
        setFormData({
          itemName: "",
          category: "",
          quantity: "",
          unit: "",
          minStock: "",
          maxStock: "",
          supplier: "",
          unitPrice: "",
          description: "",
        });
      } else {
        toast({
          title: "Validation Error",
          description: response.data.message || "Failed to add inventory item.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Inventory creation error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Internal server connection failure.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add OT Inventory</h1>
        <p className="text-muted-foreground">Add new items to OT inventory stock</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Inventory Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surgical-instruments">Surgical Instruments</SelectItem>
                    <SelectItem value="consumables">Consumables</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="disposables">Disposables</SelectItem>
                    <SelectItem value="medicines">Medicines</SelectItem>
                    <SelectItem value="anesthesia">Anesthesia Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="packs">Packs</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Purchase Price (₹)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  placeholder="Enter unit price"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  placeholder="Enter min stock"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStock">Maximum Stock Level</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                  placeholder="Enter max stock"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Inventory Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOTInventory;