'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

const AddDepartment = () => {
  const { toast } = useToast();
  const [departmentName, setDepartmentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: departmentName,
      clinic_id: "clinic001", // Replace with actual clinic ID as needed
    };

    console.log("Adding new department payload:", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/floorsBeds/add_department`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log("Add Department Response:", response.data);

      if (response.data.resSuccess === 1) {
        toast({
          title: "Department Added",
          description: `Department "${departmentName}" has been added successfully.`,
        });
        setDepartmentName("");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add",
          description: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while connecting to the server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Department</h1>
        <p className="text-muted-foreground">Add a new department to the hospital</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="departmentName">Department Name</Label>
              <Input
                id="departmentName"
                placeholder="e.g. ICU, Cardiology"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Department"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDepartment;