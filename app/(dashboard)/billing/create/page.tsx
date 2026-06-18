'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { billingPost, getBillingMessage, toISODate } from "../billing-api";
import axios from "axios";

interface SingleBillItem {
  category: "Bed Charge" | "Doctor Charge" | "Medicine" | "OT Doctor Charge" | "OT Equipment" | "OT Room Charge" | "OT Other Charge" | "";
  quantity: string;
  unitRate: string;
  discountAmount: string;
  discountReason: string;
  itemDate: Date | undefined;
  doctorName?: string;
  specialization?: string;
  visitDate?: Date | undefined;
  consultationType?: string;
  medicineName?: string;
  medicineCode?: string;
  quantityDispensed?: string;
  unitOfMeasurement?: string;
  issueDate?: Date | undefined;
  issueReason?: string;
  roomName?: string;
  floor?: string;
  department?: string;
  roomType?: string;
  durationDays?: string;
  checkInDate?: Date | undefined;
  checkOutDate?: Date | undefined;
  otRoomName?: string;
  durationHours?: string;
  hourlyRate?: string;
  otDate?: Date | undefined;
  procedureName?: string;
  equipmentName?: string;
  quantityUsed?: string;
  description?: string;
}

const AddBill = () => {
  const CLINIC_ID = "clinic001";
  const [loading, setLoading] = useState(false);

  /* ================= PATIENT SEARCH STATES ================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<'name' | 'phone'>('name');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* ================= FORM STATES ================= */
  const [formData, setFormData] = useState({
    admissionId: "",
    patientId: "",
    patientName: "",
    patientMobileNumber: "",
  });

  const [billItem, setBillItem] = useState<SingleBillItem>({
    category: "",
    quantity: "",
    unitRate: "",
    discountAmount: "",
    discountReason: "",
    itemDate: undefined,
  });

  const categories = [
    "Bed Charge",
    "Doctor Charge",
    "Medicine",
    "OT Doctor Charge",
    "OT Equipment",
    "OT Room Charge",
    "OT Other Charge",
  ];

  /* ================= SUGGESTIONS FETCH LOGIC ================= */
  useEffect(() => {
    const getSuggestions = async () => {
      if (searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const payload: any = {};
        if (searchType === 'name') {
          payload.patient_name = searchQuery;
        } else {
          payload.phone_number = searchQuery;
        }

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/patientAdmission/get_admitted_patient_profile_suggestion`,
          payload,
          { withCredentials: true }
        );

        if (res.data.resSuccess === 1) {
          setSuggestions(res.data.data || []);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Error fetching admitted patient suggestions:", err);
      }
    };

    const timeout = setTimeout(getSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, searchType]);

  const updateBillItem = (field: keyof SingleBillItem, value: any) => {
    setBillItem((prev) => ({ ...prev, [field]: value }));
  };

  const getItemQuantity = () => {
    switch (billItem.category) {
      case "Medicine":
        return Number(billItem.quantityDispensed || billItem.quantity) || 1;
      case "Bed Charge":
        return Number(billItem.durationDays || billItem.quantity) || 1;
      case "OT Room Charge":
        return Number(billItem.durationHours || billItem.quantity) || 1;
      case "OT Equipment":
        return Number(billItem.quantityUsed || billItem.quantity) || 1;
      default:
        return Number(billItem.quantity) || 1;
    }
  };

  const getItemUnitPrice = () => {
    if (billItem.category === "OT Room Charge") {
      return Number(billItem.hourlyRate || billItem.unitRate) || 0;
    }
    return Number(billItem.unitRate) || 0;
  };

  const getItemAmount = () => {
    const grossAmount = getItemQuantity() * getItemUnitPrice();
    const discount = Number(billItem.discountAmount) || 0;
    return Math.max(grossAmount - discount, 0);
  };

  const getItemDescription = () => {
    return (
      billItem.medicineName ||
      billItem.doctorName ||
      billItem.roomName ||
      billItem.otRoomName ||
      billItem.equipmentName ||
      billItem.description ||
      billItem.category ||
      ""
    );
  };

  /* ================= SUBMIT ACTION ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.admissionId || !formData.patientId) {
      toast({ title: "Validation Error", description: "Please search and select an active admitted patient first.", variant: "destructive" });
      return;
    }
    if (!billItem.category) {
      toast({ title: "Validation Error", description: "Please select a category.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const metadataPayload: Record<string, any> = {
      doctor_name: billItem.doctorName || undefined,
      specialization: billItem.specialization || undefined,
      consultation_type: billItem.consultationType || undefined,
      medicine_code: billItem.medicineCode || undefined,
      unit_of_measurement: billItem.unitOfMeasurement || undefined,
      room_name: billItem.roomName || undefined,
      floor: billItem.floor || undefined,
      department: billItem.department || undefined,
      room_type: billItem.roomType || undefined,
      procedure_name: billItem.procedureName || undefined,
      equipment_name: billItem.equipmentName || undefined,
    };

    if (billItem.category === "Bed Charge") {
      metadataPayload.duration_days = Number(billItem.durationDays) || getItemQuantity();
      metadataPayload.check_in_date = toISODate(billItem.checkInDate);
      metadataPayload.check_out_date = toISODate(billItem.checkOutDate);
    } else if (billItem.category === "Doctor Charge") {
      metadataPayload.visit_date = toISODate(billItem.visitDate || new Date());
    } else if (billItem.category === "Medicine") {
      metadataPayload.quantity_dispensed = Number(billItem.quantityDispensed) || getItemQuantity();
      metadataPayload.issue_date = toISODate(billItem.issueDate);
    } else if (["OT Doctor Charge", "OT Equipment", "OT Room Charge"].includes(billItem.category)) {
      metadataPayload.procedure_name = billItem.procedureName || "Operational Procedure";
      metadataPayload.ot_date = toISODate(billItem.otDate);
    }

    // Single item payload structure mapping root levels to match your exact backend handler requirements
    const payload = {
      hospital_id: CLINIC_ID,
      admission_id: formData.admissionId,
      patient_id: formData.patientId,
      category: billItem.category,
      item_description: getItemDescription(),
      quantity: getItemQuantity(),
      unit_rate: getItemUnitPrice(),
      discount_amount: Number(billItem.discountAmount) || 0,
      discount_remark: billItem.discountReason || undefined,
      metadata: metadataPayload,
      item_date: billItem.itemDate || billItem.visitDate || billItem.issueDate || billItem.checkInDate || billItem.otDate || new Date(),
      created_by: "Admin",
    };

    try {
      console.log("Submitting bill item payload format:", payload);

      const response = await billingPost("add_bill_items", payload);

      if (response.apiSuccess === 1) {
        toast({
          title: "Success",
          description: response.message || "Bill item added successfully.",
        });
        
        setFormData({ admissionId: "", patientId: "", patientName: "", patientMobileNumber: "" });
        setSearchQuery("");
        setBillItem({ category: "", quantity: "", unitRate: "", discountAmount: "", discountReason: "", itemDate: undefined });
      } else {
        toast({
          title: response.apiSuccess === -1 ? "Server error" : "Invalid bill",
          description: getBillingMessage(response, "Unable to add bill item."),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Unable to connect to billing API.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryFields = () => {
    switch (billItem.category) {
      case "OT Doctor Charge":
        return (
          <>
            <div className="space-y-2">
              <Label>Doctor Name</Label>
              <Input value={billItem.doctorName || ""} onChange={(e) => updateBillItem("doctorName", e.target.value)} placeholder="Enter Doctor Name" required />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input value={billItem.specialization || ""} onChange={(e) => updateBillItem("specialization", e.target.value)} placeholder="Enter Specialization" />
            </div>
            <div className="space-y-2">
              <Label>Procedure Name *</Label>
              <Input value={billItem.procedureName || ""} onChange={(e) => updateBillItem("procedureName", e.target.value)} placeholder="e.g. Appendectomy" required />
            </div>
            <div className="space-y-2">
              <Label>Visit Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !billItem.visitDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billItem.visitDate ? format(billItem.visitDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={billItem.visitDate} onSelect={(date) => updateBillItem("visitDate", date)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Consultation Type</Label>
              <Input value={billItem.consultationType || ""} onChange={(e) => updateBillItem("consultationType", e.target.value)} placeholder="Enter Consultation Type" />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹) *</Label>
              <Input type="number" value={billItem.unitRate || ""} onChange={(e) => updateBillItem("unitRate", e.target.value)} placeholder="0.00" required />
            </div>
          </>
        );
      case "Medicine":
        return (
          <>
            <div className="space-y-2">
              <Label>Medicine Name</Label>
              <Input value={billItem.medicineName || ""} onChange={(e) => updateBillItem("medicineName", e.target.value)} placeholder="Enter Medicine Name" required />
            </div>
            <div className="space-y-2">
              <Label>Medicine Code</Label>
              <Input value={billItem.medicineCode || ""} onChange={(e) => updateBillItem("medicineCode", e.target.value)} placeholder="Enter Medicine Code" />
            </div>
            <div className="space-y-2">
              <Label>Quantity Dispensed *</Label>
              <Input type="number" value={billItem.quantityDispensed || ""} onChange={(e) => updateBillItem("quantityDispensed", e.target.value)} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label>Unit of Measurement</Label>
              <Input value={billItem.unitOfMeasurement || ""} onChange={(e) => updateBillItem("unitOfMeasurement", e.target.value)} placeholder="e.g., Tablets, ml" />
            </div>
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !billItem.issueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billItem.issueDate ? format(billItem.issueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={billItem.issueDate} onSelect={(date) => updateBillItem("issueDate", date)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Issue Reason</Label>
              <Input value={billItem.issueReason || ""} onChange={(e) => updateBillItem("issueReason", e.target.value)} placeholder="Enter Issue Reason" />
            </div>
            <div className="space-y-2">
              <Label>Unit Rate (₹) *</Label>
              <Input type="number" value={billItem.unitRate || ""} onChange={(e) => updateBillItem("unitRate", e.target.value)} placeholder="0.00" required />
            </div>
          </>
        );
      case "Doctor Charge":
        return (
          <>
            <div className="space-y-2">
              <Label>Doctor Name</Label>
              <Input value={billItem.doctorName || ""} onChange={(e) => updateBillItem("doctorName", e.target.value)} placeholder="Enter Doctor Name" required />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input value={billItem.specialization || ""} onChange={(e) => updateBillItem("specialization", e.target.value)} placeholder="Enter Specialization" />
            </div>
            <div className="space-y-2">
              <Label>Visit Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !billItem.visitDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billItem.visitDate ? format(billItem.visitDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={billItem.visitDate} onSelect={(date) => updateBillItem("visitDate", date)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Consultation Type</Label>
              <Input value={billItem.consultationType || ""} onChange={(e) => updateBillItem("consultationType", e.target.value)} placeholder="Enter Consultation Type" />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹) *</Label>
              <Input type="number" value={billItem.unitRate || ""} onChange={(e) => updateBillItem("unitRate", e.target.value)} placeholder="0.00" required />
            </div>
          </>
        );
      case "Bed Charge":
        return (
          <>
            <div className="space-y-2">
              <Label>Room Name</Label>
              <Input value={billItem.roomName || ""} onChange={(e) => updateBillItem("roomName", e.target.value)} placeholder="Enter Room Name" required />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Input value={billItem.floor || ""} onChange={(e) => updateBillItem("floor", e.target.value)} placeholder="Enter Floor" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={billItem.department || ""} onChange={(e) => updateBillItem("department", e.target.value)} placeholder="Enter Department" />
            </div>
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Input value={billItem.roomType || ""} onChange={(e) => updateBillItem("roomType", e.target.value)} placeholder="Enter Room Type" />
            </div>
            <div className="space-y-2">
              <Label>Duration (Days) *</Label>
              <Input type="number" value={billItem.durationDays || ""} onChange={(e) => updateBillItem("durationDays", e.target.value)} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !billItem.checkInDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billItem.checkInDate ? format(billItem.checkInDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={billItem.checkInDate} onSelect={(date) => updateBillItem("checkInDate", date)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !billItem.checkOutDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billItem.checkOutDate ? format(billItem.checkOutDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={billItem.checkOutDate} onSelect={(date) => updateBillItem("checkOutDate", date)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Daily Rate (₹) *</Label>
              <Input type="number" value={billItem.unitRate || ""} onChange={(e) => updateBillItem("unitRate", e.target.value)} placeholder="0.00" required />
            </div>
          </>
        );
      case "OT Room Charge":
        return (
          <>
            <div className="space-y-2">
              <Label>OT Room Name</Label>
              <Input value={billItem.otRoomName || ""} onChange={(e) => updateBillItem("otRoomName", e.target.value)} placeholder="Enter OT Room Name" required />
            </div>
            <div className="space-y-2">
              <Label>Procedure Name *</Label>
              <Input value={billItem.procedureName || ""} onChange={(e) => updateBillItem("procedureName", e.target.value)} placeholder="e.g. Laparoscopic Appendectomy" required />
            </div>
            <div className="space-y-2">
              <Label>Duration (Hours) *</Label>
              <Input type="number" value={billItem.durationHours || ""} onChange={(e) => updateBillItem("durationHours", e.target.value)} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label>Hourly Rate (₹) *</Label>
              <Input type="number" value={billItem.hourlyRate || ""} onChange={(e) => updateBillItem("hourlyRate", e.target.value)} placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label>OT Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !billItem.otDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billItem.otDate ? format(billItem.otDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={billItem.otDate} onSelect={(date) => updateBillItem("otDate", date)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </>
        );
      case "OT Equipment":
        return (
          <>
            <div className="space-y-2">
              <Label>Equipment Name</Label>
              <Input value={billItem.equipmentName || ""} onChange={(e) => updateBillItem("equipmentName", e.target.value)} placeholder="Enter Equipment Name" required />
            </div>
            <div className="space-y-2">
              <Label>Procedure Name *</Label>
              <Input value={billItem.procedureName || ""} onChange={(e) => updateBillItem("procedureName", e.target.value)} placeholder="Procedure Identifier" required />
            </div>
            <div className="space-y-2">
              <Label>Quantity Used *</Label>
              <Input type="number" value={billItem.quantityUsed || ""} onChange={(e) => updateBillItem("quantityUsed", e.target.value)} placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label>Unit Rate (₹) *</Label>
              <Input type="number" value={billItem.unitRate || ""} onChange={(e) => updateBillItem("unitRate", e.target.value)} placeholder="0.00" required />
            </div>
          </>
        );
      case "OT Other Charge":
        return (
          <>
            <div className="space-y-2 md:col-span-2">
              <Label>Description *</Label>
              <Input value={billItem.description || ""} onChange={(e) => updateBillItem("description", e.target.value)} placeholder="Enter charge description" required />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹) *</Label>
              <Input type="number" value={billItem.unitRate || ""} onChange={(e) => updateBillItem("unitRate", e.target.value)} placeholder="0.00" required />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const isFormIncomplete = !formData.admissionId || !billItem.category || !getItemDescription();

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Bill</h1>
        <p className="text-muted-foreground">Add a single billing item for a patient admission</p>
      </div>

      {/* Admitted Patient Live Search Block */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            Search Active Admitted Patient
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search Method</Label>
              <Select value={searchType} onValueChange={(val: 'name' | 'phone') => { setSearchType(val); setSearchQuery(""); setSuggestions([]); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Search Filter Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Patient Name Search</SelectItem>
                  <SelectItem value="phone">Phone Number Search</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2 relative">
              <Label>Search Input</Label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'name' ? "Type patient's name to lookup..." : "Type phone number to lookup..."}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-[calc(100%+4px)] z-50 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((p) => (
                    <div
                      key={p._id}
                      className="p-3 hover:bg-slate-100 cursor-pointer text-sm flex flex-col border-b last:border-0"
                      onClick={() => {
                        setFormData({
                          admissionId: p._id, 
                          patientId: p.patient_id,
                          patientName: p.patient_name,
                          patientMobileNumber: p.phone_number,
                        });
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="font-semibold text-slate-900">{p.patient_name} ({p.phone_number})</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">Admission Tracking ID: {p.admission_id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
        {/* Read-Only Patient Information Overview */}
        <Card suppressHydrationWarning>
          <CardHeader>
            <CardTitle className="text-lg">Patient Information</CardTitle>
          </CardHeader>
          <CardContent suppressHydrationWarning>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admissionId">Admission ID</Label>
                <Input id="admissionId" value={formData.admissionId} readOnly className="bg-slate-50 cursor-not-allowed font-mono text-xs" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input id="patientId" value={formData.patientId} readOnly className="bg-slate-50 cursor-not-allowed font-mono text-xs" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" value={formData.patientName} readOnly className="bg-slate-50 cursor-not-allowed" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientMobileNumber">Patient Mobile Number</Label>
                <Input id="patientMobileNumber" value={formData.patientMobileNumber} readOnly className="bg-slate-50 cursor-not-allowed" required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Singular Dynamic Billing Charge Card */}
        <Card suppressHydrationWarning>
          <CardHeader>
            <CardTitle className="text-lg">Billing Charge Details</CardTitle>
          </CardHeader>
          <CardContent suppressHydrationWarning className="space-y-6">
            <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={billItem.category}
                    onValueChange={(value: any) => setBillItem({ ...billItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {billItem.category && renderCategoryFields()}
              </div>

              {billItem.category && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label>Discount Amount (₹)</Label>
                    <Input
                      type="number"
                      value={billItem.discountAmount}
                      onChange={(e) => updateBillItem("discountAmount", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Reason</Label>
                    <Input
                      value={billItem.discountReason}
                      onChange={(e) => updateBillItem("discountReason", e.target.value)}
                      placeholder="Enter reason if discount applied"
                    />
                  </div>
                </div>
              )}

              {billItem.category && (
                <div className="flex justify-end border-t pt-4">
                  <div className="text-base font-bold text-emerald-700">
                    Total Amount to Charge: ₹{getItemAmount().toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="sm" disabled={loading || isFormIncomplete}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Add Line Item
        </Button>
      </form>
    </div>
  );
};

export default AddBill;