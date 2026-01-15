'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AddRoomType = () => {
  const { toast } = useToast();
  const [typeName, setTypeName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Room Type Added",
      description: `Room type "${typeName}" has been added successfully.`,
    });
    setTypeName("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Room Type</h1>
        <p className="text-muted-foreground">Add a new room type to the hospital</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Room Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="typeName">Type Name</Label>
              <Input
                id="typeName"
                placeholder="Enter room type name"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Add Room Type
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoomType;
