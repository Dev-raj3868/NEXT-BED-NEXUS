import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AddRoom = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    floorId: "",
    department: "",
    roomCategory: "",
    roomNumber: "",
    ratePerDay: "",
    amenities: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Room Added",
      description: `Room "${formData.roomNumber}" has been added successfully.`,
    });
    setFormData({
      floorId: "",
      department: "",
      roomCategory: "",
      roomNumber: "",
      ratePerDay: "",
      amenities: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Room</h1>
        <p className="text-muted-foreground">Add a new room to the hospital</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floorId">Floor</Label>
                <Select
                  value={formData.floorId}
                  onValueChange={(value) => setFormData({ ...formData, floorId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FL001">Ground Floor</SelectItem>
                    <SelectItem value="FL002">First Floor</SelectItem>
                    <SelectItem value="FL003">Second Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="general">General Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomCategory">Room Category</Label>
                <Select
                  value={formData.roomCategory}
                  onValueChange={(value) => setFormData({ ...formData, roomCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Ward</SelectItem>
                    <SelectItem value="semi-private">Semi-Private</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="icu">ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="Enter room number"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratePerDay">Rate Per Day (₹)</Label>
                <Input
                  id="ratePerDay"
                  type="number"
                  placeholder="Enter rate per day"
                  value={formData.ratePerDay}
                  onChange={(e) => setFormData({ ...formData, ratePerDay: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Textarea
                id="amenities"
                placeholder="Enter amenities (comma separated)"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full">
              Add Room
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoom;
