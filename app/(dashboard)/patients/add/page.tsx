'use client';
import { useState } from "react";
import axios from "axios";
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
import { UserPlus, User, Phone, Heart, Crown, CreditCard, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AddPatient = () => {
  const [isVip, setIsVip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: "",
    phone_number: "",
    secondary_phone_number: "",
    age: 0,
    gender: "",
    address: "",
    pin_code: "",
    email: "",
    membership_id: "",
    membership_end_date: "",
    chronic_disease: "",
    created_by: "", // Assuming a user ID will be provided or fetched
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const CLINIC_ID = "clinic001"; // Mock clinic ID
    const CREATED_BY = "user001"; // Mock user ID

    try {
      const payload = {
        clinic_id: CLINIC_ID,
        patient_name: formData.patient_name,
        phone_number: formData.phone_number,
        secondary_phone_number: formData.secondary_phone_number || undefined,
        age: formData.age || undefined,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
        pin_code: formData.pin_code || undefined,
        email: formData.email || undefined,
        membership_id: formData.membership_id || undefined,
        membership_end_date: formData.membership_end_date || undefined,
        chronic_disease: formData.chronic_disease || undefined,
        created_by: CREATED_BY,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/profile/create-patient-profile`,
        payload,
        { withCredentials: true }
      );

      if (response.data.apiSuccess === 1) {
        toast({
          title: "Success",
          description: response.data.message || "Patient profile created successfully",
        });
        // Optionally reset form
        setFormData({
          patient_name: "",
          phone_number: "",
          secondary_phone_number: "",
          age: 0,
          gender: "",
          address: "",
          pin_code: "",
          email: "",
          membership_id: "",
          membership_end_date: "",
          chronic_disease: "",
          created_by: "", // Assuming a user ID will be provided or fetched
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to create patient profile",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating patient profile:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred while creating the profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <Input
                id="patient_name"
                placeholder="Enter full name"
                required
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                required
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                min="0"
                max="150"
                value={formData.age === 0 ? "" : formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin_code">Pin Code</Label>
              <Input
                id="pin_code"
                placeholder="Enter pin code"
                value={formData.pin_code}
                onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone2">Secondary Phone</Label>
              <Input
                id="phone2"
                type="tel"
                placeholder="Enter alternate number"
                value={formData.secondary_phone_number}
                onChange={(e) => setFormData({ ...formData, secondary_phone_number: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Section */}
        {/* <Card className="border-l-4 border-l-destructive">
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
        </Card> */}

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
              <Input
                id="chronic_disease"
                placeholder="e.g., Diabetes, Hypertension"
                value={formData.chronic_disease}
                onChange={(e) => setFormData({ ...formData, chronic_disease: e.target.value })}
              />
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

        {/* Membership Information Section */}
        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-info" />
              Membership Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membership_id">Membership ID</Label>
              <Input
                id="membership_id"
                placeholder="Enter membership ID"
                value={formData.membership_id}
                onChange={(e) => setFormData({ ...formData, membership_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="membership_end_date">Membership End Date</Label>
              <Input
                id="membership_end_date"
                type="date"
                value={formData.membership_end_date}
                onChange={(e) => setFormData({ ...formData, membership_end_date: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* VIP Section */}
        {/* <Card className="border-l-4 border-l-warning">
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
        </Card> */}

        {/* Billing Preferences Section */}
        {/* <Card className="border-l-4 border-l-primary">
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
        </Card> */}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="gradient" className="px-8" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Adding..." : "Add Patient"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
