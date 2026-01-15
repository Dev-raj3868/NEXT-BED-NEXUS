import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const AddOTRoom = () => {
  const [formData, setFormData] = useState({
    otName: "",
    floor: "",
    costPerDay: "",
    costPerHour: "",
    status: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OT Room data:", formData);
    toast({
      title: "Success",
      description: "OT Room added successfully!",
    });
    setFormData({
      otName: "",
      floor: "",
      costPerDay: "",
      costPerHour: "",
      status: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add OT Room</h1>
        <p className="text-muted-foreground">Add a new operating theatre room to the system</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">OT Room Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otName">OT Name</Label>
              <Input
                id="otName"
                value={formData.otName}
                onChange={(e) => setFormData({ ...formData, otName: e.target.value })}
                placeholder="Enter OT name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Select
                value={formData.floor}
                onValueChange={(value) => setFormData({ ...formData, floor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Floor 1</SelectItem>
                  <SelectItem value="2">Floor 2</SelectItem>
                  <SelectItem value="3">Floor 3</SelectItem>
                  <SelectItem value="4">Floor 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPerDay">Cost Per Day</Label>
              <Input
                id="costPerDay"
                type="number"
                value={formData.costPerDay}
                onChange={(e) => setFormData({ ...formData, costPerDay: e.target.value })}
                placeholder="Enter cost per day"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPerHour">Cost Per Hour</Label>
              <Input
                id="costPerHour"
                type="number"
                value={formData.costPerHour}
                onChange={(e) => setFormData({ ...formData, costPerHour: e.target.value })}
                placeholder="Enter cost per hour"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Add OT Room
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOTRoom;
