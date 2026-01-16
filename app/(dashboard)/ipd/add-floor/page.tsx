'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AddFloor = () => {
  const { toast } = useToast();
  const [floorName, setFloorName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("ADding new floor:", floorName);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/add_floors`, {
        floor_name: floorName,
        clinic_id: "clinic123",
      }, {
        withCredentials: true
      });
      console.log("Floor added successfully:", response.data);
      if(response.data.resSuccess === 1) {
        toast({
          title: "Floor Added",
          description: `Floor "${floorName}" has been added successfully.`,
        });
        setFloorName("");
      }
    } catch (error) {
      console.error("Error adding floor:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Floor</h1>
        <p className="text-muted-foreground">Add a new floor to the hospital</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Floor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="floorName">Floor Name</Label>
              <Input
                id="floorName"
                placeholder="Enter floor name"
                value={floorName}
                onChange={(e) => setFloorName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Add Floor
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFloor;
