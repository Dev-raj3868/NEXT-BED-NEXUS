'use client';

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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

const AddRoom = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const mockDeps = [

    { _id: "695bb7de67fbc7ab32baacdf", name: "ICU" },
    { _id: "695bb7de67fbc7ab32baacde", name: "Cardiology" },
  ];
  
  const [floors, setFloors] = useState<{ _id: string; floor_name: string }[]>([]);
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>(mockDeps);

  const [formData, setFormData] = useState({
    floorId: "",
    departmentId: "",
    roomCategory: "",
    roomNumber: "",
    ratePerDay: "",
    amenities: "",
  });

  // Fetch floors on mount to populate the dropdown
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_floors`, {
          clinic_id: "clinic123",
        }, {
          withCredentials: true
        });
        if (response.data.resSuccess === 1) {
          setFloors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };
    const fetchDepartments = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_departments`, {
          clinic_id: "clinic001",
        }, {
          withCredentials: true
        });
        console.log("Departments Response:", response.data);
        if (response.data.resSuccess === 1) {
          setDepartments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchFloors();
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedDept = departments.find(d => d._id === formData.departmentId);

    const payload = {
      floor_id: formData.floorId,
      room_category: formData.roomCategory,
      department_id: formData.departmentId,
      department_name: selectedDept?.name || "",
      room_number: formData.roomNumber,
      rate_per_day: Number(formData.ratePerDay),
      amenities: formData.amenities.split(",").map(item => item.trim()).filter(item => item !== ""),
      clinic_id: "clinic123",
    };

    console.log("Submitting Room Data:", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/add_rooms`,
        payload,
        { withCredentials: true }
      );

      console.log("Server Response:", response.data);

      if (response.data.resSuccess === 1) {
        toast({
          title: "Room Added",
          description: `Room "${formData.roomNumber}" has been added successfully.`,
        });
        
        // Reset form
        setFormData({
          floorId: "",
          departmentId: "",
          roomCategory: "",
          roomNumber: "",
          ratePerDay: "",
          amenities: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message || "Failed to add room",
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not reach the server.",
      });
    } finally {
      setLoading(false);
    }
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
                  value={formData.departmentId}
                  onValueChange={(value) => {
                    console.log("Selected Department ID:", value);
                    setFormData({ ...formData, departmentId: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name}
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
                    <SelectItem value="general-ward">General Ward</SelectItem>
                    <SelectItem value="semi-private">Semi-Private</SelectItem>
                    <SelectItem value="private-bed-1">Private Bed</SelectItem>
                    <SelectItem value="icu">ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g. A1"
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
                  placeholder="2000"
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
                placeholder="AC, TV, Refrigerator"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Separate items with commas</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Adding..." : "Add Room"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoom;