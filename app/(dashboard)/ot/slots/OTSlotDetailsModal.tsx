'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OTSlotDetails {
  _id: string;
  booking_id: string;
  hospital_id: string;
  patient_id: string; // Changed to string based on your response
  admission_id: string;
  ot_id: string;
  ot_name: string;
  doctor_id: string;
  doctor_name: string;
  surgery_type: string;
  procedure_name: string;
  slot_date: string;
  slot_start_time: string;
  slot_end_time: string;
  status: string;
  blood_required: boolean;
  booked_by: string;
}

// Added to handle the patient name display
interface PatientInfo {
  patient_name: string;
  age?: number;
  gender?: string;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotId: string | null;
  onUpdated?: () => void;
};

export default function OTSlotDetailsModal({ open, onOpenChange, slotId, onUpdated }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [slot, setSlot] = useState<OTSlotDetails | null>(null);
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [editForm, setEditForm] = useState<Partial<OTSlotDetails>>({});

  const canSubmitUpdate = useMemo(() => {
    return !!slot && mode === 'edit' && !saving && !loading;
  }, [slot, mode, saving, loading]);

  const resetLocalState = () => {
    setMode('view');
    setLoading(false);
    setSaving(false);
    setDeleting(false);
    setSlot(null);
    setPatient(null);
    setEditForm({});
  };

  const fetchDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/ot-modules/get_single_ot_slots`,
        { id },
        { withCredentials: true }
      );

      if (response.data?.resSuccess !== 1) {
        toast({
          title: 'Error',
          description: response.data?.resMessage || 'Failed to fetch slot details.',
          variant: 'destructive',
        });
        setSlot(null);
        return;
      }

      const details: OTSlotDetails = response.data?.data;
      setSlot(details);
      
      // Initialize edit form
      setEditForm({
        ot_name: details.ot_name,
        doctor_name: details.doctor_name,
        surgery_type: details.surgery_type,
        procedure_name: details.procedure_name,
        slot_date: details.slot_date ? new Date(details.slot_date).toISOString().split('T')[0] : '',
        slot_start_time: details.slot_start_time,
        slot_end_time: details.slot_end_time,
        status: details.status,
      });

      // Optional: Fetch patient name if your API provides a way to get patient by ID
      // Since the single slot response only returns patient_id as a string.
      if (details.patient_id) {
         fetchPatientName(details.patient_id);
      }

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to fetch slot details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientName = async (patientId: string) => {
    try {
        // Assuming you have this existing endpoint from your previous code
        const res = await axios.post(`${baseUrl}/profile/name-suggestion-patient-information`, 
            { clinic_id: "clinic001", patient_id: patientId }, 
            { withCredentials: true }
        );
        if (res.data.resSuccess === 1 && res.data.data.length > 0) {
            const p = res.data.data.find((item: any) => item._id === patientId);
            if (p) setPatient({ patient_name: p.patient_name, age: p.age, gender: p.gender });
        }
    } catch (err) { console.error("Could not fetch patient name", err); }
  };

  useEffect(() => {
    if (!open) {
      resetLocalState();
      return;
    }
    if (open && slotId) {
      fetchDetails(slotId);
    }
  }, [open, slotId]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleUpdate = async () => {
    if (!slot?.booking_id) return;

    setSaving(true);
    try {
      const payload = {
        bookingId: slot.booking_id,
        updateData: editForm,
      };

      const response = await axios.post(
        `${baseUrl}/ot-modules/update_ot_slots`,
        payload,
        { withCredentials: true }
      );

      if (response.data?.resSuccess === 1) {
        toast({ title: 'Updated', description: 'OT slot updated successfully.' });
        setMode('view');
        await fetchDetails(slotId!);
        onUpdated?.();
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Update failed.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!slot?.booking_id) return;
    setDeleting(true);
    try {
      const response = await axios.post(
        `${baseUrl}/ot-modules/delete_ot_slots`,
        { bookingId: slot.booking_id },
        { withCredentials: true }
      );
      if (response.data?.resSuccess === 1) {
        toast({ title: 'Deleted', description: 'OT slot deleted successfully.' });
        onUpdated?.();
        handleClose();
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Delete failed.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) resetLocalState(); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle className="text-xl">OT Slot Details</DialogTitle>
              <div className="text-xs font-mono text-muted-foreground">
                Booking: {slot?.booking_id || slotId || '-'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn('capitalize', mode === 'edit' && 'border-primary text-primary')}>
                {mode}
              </Badge>
              {mode === 'view' ? (
                <Button onClick={() => setMode('edit')} disabled={loading || !slot} size="sm">Edit</Button>
              ) : (
                <Button variant="outline" onClick={() => setMode('view')} size="sm">Cancel</Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16" /><Skeleton className="h-16" />
              <Skeleton className="h-16" /><Skeleton className="h-16" />
            </div>
          </div>
        ) : !slot ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No data found.</div>
        ) : mode === 'view' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 bg-muted/20">
                <Label className="text-muted-foreground text-[10px] uppercase">Status</Label>
                <div className="text-sm font-semibold capitalize">{slot.status}</div>
              </div>
              <div className="rounded-lg border p-3 bg-muted/20">
                <Label className="text-muted-foreground text-[10px] uppercase">Surgery Type</Label>
                <div className="text-sm font-semibold">{slot.surgery_type}</div>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-muted-foreground text-[10px] uppercase">OT Name</Label>
                <div className="text-sm font-medium">{slot.ot_name}</div>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-muted-foreground text-[10px] uppercase">Surgeon</Label>
                <div className="text-sm font-medium">{slot.doctor_name}</div>
              </div>
              <div className="rounded-lg border p-3 col-span-full">
                <Label className="text-muted-foreground text-[10px] uppercase">Procedure</Label>
                <div className="text-sm font-medium">{slot.procedure_name}</div>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-muted-foreground text-[10px] uppercase">Date</Label>
                <div className="text-sm font-medium">
                  {slot.slot_date ? format(new Date(slot.slot_date), 'PPP') : '-'}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <Label className="text-muted-foreground text-[10px] uppercase">Time Slot</Label>
                <div className="text-sm font-medium">{slot.slot_start_time} - {slot.slot_end_time}</div>
              </div>
            </div>

            {/* <div className="rounded-lg border p-4 bg-primary/5">
              <Label className="text-primary text-[10px] uppercase font-bold">Patient Information</Label>
              <div className="text-base font-semibold mt-1">
                {patient?.patient_name || 'Loading...'}
              </div>
              <div className="text-xs text-muted-foreground">
                {patient ? `${patient.age} yrs | ${patient.gender}` : `ID: ${slot.patient_id}`}
              </div>
            </div> */}

            <Separator />
            <div className="flex justify-between items-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deleting}>Delete Booking</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently remove the booking {slot.booking_id}.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" onClick={handleClose} size="sm">Close</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>OT Name</Label>
                <Input value={editForm.ot_name ?? ''} onChange={(e) => setEditForm({ ...editForm, ot_name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Doctor Name</Label>
                <Input value={editForm.doctor_name ?? ''} onChange={(e) => setEditForm({ ...editForm, doctor_name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Surgery Type</Label>
                <Select value={editForm.surgery_type ?? ''} onValueChange={(v) => setEditForm({ ...editForm, surgery_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={editForm.status ?? ''} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-full">
                <Label>Procedure Name</Label>
                <Input value={editForm.procedure_name ?? ''} onChange={(e) => setEditForm({ ...editForm, procedure_name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Slot Date</Label>
                <Input type="date" value={editForm.slot_date ?? ''} onChange={(e) => setEditForm({ ...editForm, slot_date: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Start</Label>
                  <Input type="time" value={editForm.slot_start_time ?? ''} onChange={(e) => setEditForm({ ...editForm, slot_start_time: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>End</Label>
                  <Input type="time" value={editForm.slot_end_time ?? ''} onChange={(e) => setEditForm({ ...editForm, slot_end_time: e.target.value })} />
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMode('view')}>Discard</Button>
              <Button onClick={handleUpdate} disabled={!canSubmitUpdate}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}