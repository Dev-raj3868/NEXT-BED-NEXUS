import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AddDepartment = () => {
  const { toast } = useToast();
  const [departmentName, setDepartmentName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Department Added",
      description: `Department "${departmentName}" has been added successfully.`,
    });
    setDepartmentName("");
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
                placeholder="Enter department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Add Department
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDepartment;
