import { useEffect, useState } from "react";
import axios from "axios";
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
import { useToast } from "@/hooks/use-toast";

const AddRoom = () => {
  const { toast } = useToast();
  const CLINIC_ID = "clinic001";
  const [floors, setFloors] = useState<{ _id: string; floor_name: string }[]>([]);
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    floorId: "",
    department: "",
    roomCategory: "",
    roomNumber: "",
    ratePerDay: "",
    amenities: "",
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [floorRes, deptRes] = await Promise.all([
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_floors`, { clinic_id: CLINIC_ID }, { withCredentials: true }),
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_departments`, { clinic_id: CLINIC_ID }, { withCredentials: true }),
        ]);

        if (floorRes.data.resSuccess === 1) setFloors(floorRes.data.data || []);
        if (deptRes.data.resSuccess === 1) setDepartments(deptRes.data.data || []);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };

    fetchMasterData();
  }, []);

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
                    {floors.map((floor) => (
                      <SelectItem key={floor._id} value={floor._id}>
                        {floor.floor_name}
                      </SelectItem>
                    ))}
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
                    {departments.map((department) => (
                      <SelectItem key={department._id} value={department._id}>
                        {department.name}
                      </SelectItem>
                    ))}
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
