'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

const AddRoomType = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    describe: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      describe: formData.describe,
      clinic_id: "clinic001", // Replace with actual clinic ID as needed
    };

    console.log("Adding Room Type - Payload:", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/add_rooms_types`,
        payload,
        { withCredentials: true }
      );

      console.log("Add Room Type - Response:", response.data);

      if (response.data.resSuccess === 1) {
        toast({
          title: "Room Type Added",
          description: `Room type "${formData.name}" has been added successfully.`,
        });
        setFormData({ name: "", describe: "" }); // Reset form
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message || "Failed to add room type.",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Room Type</h1>
        <p className="text-muted-foreground">Define different categories for hospital rooms</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Room Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Type Name</Label>
              <Input
                id="name"
                placeholder="e.g. privet-bed-1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="describe">Description</Label>
              <Textarea
                id="describe"
                placeholder="Enter description here..."
                value={formData.describe}
                onChange={(e) => setFormData({ ...formData, describe: e.target.value })}
                className="min-h-[100px]"
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Room Type"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoomType;