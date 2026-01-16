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

interface Room {
  _id: string;
  room_number: string;
  room_category: string;
}

const AddBed = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [formData, setFormData] = useState({
    roomId: "",
    bedNumber: "",
    position: "",
    features: "",
    status: "AVAILABLE",
  });

  // Fetch rooms to populate the select dropdown
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/get_all_rooms`,
          { clinic_id: "clinic123" },
          { withCredentials: true }
        );
        if (response.data.resSuccess === 1) {
          setRooms(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      room_id: formData.roomId,
      bed_number: formData.bedNumber,
      position: formData.position,
      features: formData.features,
      status: formData.status,
      clinic_id: "clinic123", // Replace with actual clinic ID as needed
    };

    console.log("Adding Bed - Payload:", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/add_beds`,
        payload,
        { withCredentials: true }
      );

      console.log("Add Bed - Response:", response.data);

      if (response.data.resSuccess === 1) {
        toast({
          title: "Bed Added",
          description: `Bed ${formData.bedNumber} has been added successfully.`,
        });
        setFormData({
          roomId: "",
          bedNumber: "",
          position: "",
          features: "NOTHING",
          status: "AVAILABLE",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message || "Failed to add bed.",
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
        <h1 className="text-2xl font-bold text-foreground">Add Bed</h1>
        <p className="text-muted-foreground">Assign a new bed to a specific room</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Bed Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomId">Select Room</Label>
                <Select
                  value={formData.roomId}
                  onValueChange={(value) => setFormData({ ...formData, roomId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room._id} value={room._id}>
                        Room {room.room_number} ({room.room_category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedNumber">Bed Number</Label>
                <Input
                  id="bedNumber"
                  placeholder="e.g. 10"
                  value={formData.bedNumber}
                  onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="e.g. Top Left"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="OCCUPIED">Occupied</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features / Remarks</Label>
              <Textarea
                id="features"
                placeholder="e.g. Oxygen Port, Near Window"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Bed...
                </>
              ) : (
                "Create Bed"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBed;