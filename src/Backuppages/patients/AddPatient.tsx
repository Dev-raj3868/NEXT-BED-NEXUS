import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, User, Phone, Heart, Crown, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AddPatient = () => {
  const [isVip, setIsVip] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Patient Added",
      description: "Patient information has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Patient</h1>
          <p className="text-muted-foreground">Register a new patient in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-secondary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name *</Label>
              <Input id="patient_name" placeholder="Enter full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="Enter phone number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input id="age" type="number" placeholder="Enter age" min="0" max="150" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter full address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin_code">Pin Code</Label>
              <Input id="pin_code" placeholder="Enter pin code" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone2">Secondary Phone</Label>
              <Input id="phone2" type="tel" placeholder="Enter alternate number" />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Section */}
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5 text-destructive" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_name">Contact Name *</Label>
              <Input id="emergency_name" placeholder="Emergency contact name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relation">Relation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_phone">Contact Number *</Label>
              <Input id="emergency_phone" type="tel" placeholder="Emergency phone" required />
            </div>
          </CardContent>
        </Card>

        {/* Other Info Section */}
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-accent-foreground" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chronic_disease">Chronic Diseases</Label>
              <Input id="chronic_disease" placeholder="e.g., Diabetes, Hypertension" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a+">A+</SelectItem>
                  <SelectItem value="a-">A-</SelectItem>
                  <SelectItem value="b+">B+</SelectItem>
                  <SelectItem value="b-">B-</SelectItem>
                  <SelectItem value="ab+">AB+</SelectItem>
                  <SelectItem value="ab-">AB-</SelectItem>
                  <SelectItem value="o+">O+</SelectItem>
                  <SelectItem value="o-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="special_instructions">Special Instructions</Label>
              <Textarea
                id="special_instructions"
                placeholder="Any special medical instructions or notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* VIP Section */}
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="w-5 h-5 text-warning" />
              VIP Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="is_vip" className="text-base font-medium">Mark as VIP Patient</Label>
                <p className="text-sm text-muted-foreground">Enable special treatment and priority services</p>
              </div>
              <Switch
                id="is_vip"
                checked={isVip}
                onCheckedChange={setIsVip}
              />
            </div>
            {isVip && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="vip_notes">VIP Notes</Label>
                  <Textarea id="vip_notes" placeholder="Special VIP preferences..." rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic_notes">Clinic Notes</Label>
                  <Textarea id="clinic_notes" placeholder="Internal clinic notes..." rows={2} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Preferences Section */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-primary" />
              Billing Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_percentage">Discount %</Label>
              <Input id="discount_percentage" type="number" placeholder="0" min="0" max="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount_reason">Discount Reason</Label>
              <Input id="discount_reason" placeholder="Reason for discount" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit_limit">Credit Limit</Label>
              <Input id="credit_limit" type="number" placeholder="0.00" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_terms">Payment Terms</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="net15">Net 15</SelectItem>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="net60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" variant="gradient" className="px-8">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
