'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

type Nullable<T> = T | null;

interface OTSlotDetails {
  _id: string;
  booking_id?: string;
  ot_name?: string;
  doctor_name?: string;
  status?: string;
  slot_date?: string;
  surgery_type?: string;
  procedure_name?: string;
  slot_start_time?: string;
  slot_end_time?: string;
  admission_id?: string;
  doctor_id?: string;
  ot_id?: string;
  authorized_by?: string;
  patient_id?: {
    _id?: string;
    patient_name?: string;
    age?: number;
    gender?: string;
    phone_number?: string;
  };
}

export default function OTSlotDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [slot, setSlot] = useState<Nullable<OTSlotDetails>>(null);
  const [editForm, setEditForm] = useState<Partial<OTSlotDetails>>({});

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const canSave = useMemo(() => {
    if (!slot) return false;
    if (mode !== 'edit') return false;
    return true;
  }, [slot, mode]);

  useEffect(() => {
    let cancelled = false;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/ot-modules/get_single_ot_slots`,
          { id: params.id },
          { withCredentials: true }
        );

        if (cancelled) return;

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
        setEditForm({
          ot_name: details?.ot_name,
          doctor_name: details?.doctor_name,
          surgery_type: details?.surgery_type,
          procedure_name: details?.procedure_name,
          slot_date: details?.slot_date,
          slot_start_time: details?.slot_start_time,
          slot_end_time: details?.slot_end_time,
          status: details?.status,
        });
      } catch (error: any) {
        if (cancelled) return;
        toast({
          title: 'Error',
          description: error?.message || 'Failed to fetch slot details.',
          variant: 'destructive',
        });
        setSlot(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [params.id, baseUrl]);

  const handleUpdate = async () => {
    if (!slot) return;

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

      if (response.data?.resSuccess !== 1) {
        toast({
          title: 'Error',
          description: response.data?.resMessage || 'Update failed.',
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Updated', description: 'OT slot updated successfully.' });
      setMode('view');

      // Refresh details so the plain view is up-to-date.
      const refreshed = await axios.post(
        `${baseUrl}/ot-modules/get_single_ot_slots`,
        { id: params.id },
        { withCredentials: true }
      );
      if (refreshed.data?.resSuccess === 1) {
        const details: OTSlotDetails = refreshed.data?.data;
        setSlot(details);
        setEditForm({
          ot_name: details?.ot_name,
          doctor_name: details?.doctor_name,
          surgery_type: details?.surgery_type,
          procedure_name: details?.procedure_name,
          slot_date: details?.slot_date,
          slot_start_time: details?.slot_start_time,
          slot_end_time: details?.slot_end_time,
          status: details?.status,
        });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Update failed.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">OT Slot</h1>
          <p className="text-muted-foreground text-sm">Slot ID: {params.id}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          {mode === 'view' ? (
            <Button onClick={() => setMode('edit')} disabled={loading || !slot}>
              Edit
            </Button>
          ) : (
            <Button variant="outline" onClick={() => {
              setMode('view');
              // reset edits back to current slot values
              if (slot) {
                setEditForm({
                  ot_name: slot?.ot_name,
                  doctor_name: slot?.doctor_name,
                  surgery_type: slot?.surgery_type,
                  procedure_name: slot?.procedure_name,
                  slot_date: slot?.slot_date,
                  slot_start_time: slot?.slot_start_time,
                  slot_end_time: slot?.slot_end_time,
                  status: slot?.status,
                });
              }
            }}>
              Cancel edits
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
              <Separator />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !slot ? (
            <div className="text-sm text-muted-foreground">No slot details found.</div>
          ) : mode === 'view' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Booking ID</div>
                <div className="font-mono text-sm">{slot.booking_id || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="text-sm capitalize">{slot.status || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">OT</div>
                <div className="text-sm">{slot.ot_name || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Doctor</div>
                <div className="text-sm">{slot.doctor_name || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Surgery Type</div>
                <div className="text-sm">{slot.surgery_type || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Procedure</div>
                <div className="text-sm">{slot.procedure_name || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="text-sm">{slot.slot_date || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="text-sm">
                  {(slot.slot_start_time || '-') + ' - ' + (slot.slot_end_time || '-')}
                </div>
              </div>
              <div className="md:col-span-2">
                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground">Patient</div>
                <div className="text-sm">
                  {slot.patient_id?.patient_name || '-'}
                  {slot.patient_id?.age != null ? `, ${slot.patient_id.age}` : ''}
                  {slot.patient_id?.gender ? `, ${slot.patient_id.gender}` : ''}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>OT Name</Label>
                  <Input
                    value={editForm.ot_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, ot_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Doctor Name</Label>
                  <Input
                    value={editForm.doctor_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, doctor_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Surgery Type</Label>
                  <Select
                    value={editForm.surgery_type || ''}
                    onValueChange={(v) => setEditForm({ ...editForm, surgery_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Procedure Name</Label>
                  <Input
                    value={editForm.procedure_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, procedure_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slot Date</Label>
                  <Input
                    type="date"
                    value={editForm.slot_date || ''}
                    onChange={(e) => setEditForm({ ...editForm, slot_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editForm.status || ''}
                    onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={editForm.slot_start_time || ''}
                    onChange={(e) => setEditForm({ ...editForm, slot_start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={editForm.slot_end_time || ''}
                    onChange={(e) => setEditForm({ ...editForm, slot_end_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMode('view')}>
                  View
                </Button>
                <Button onClick={handleUpdate} disabled={!canSave || saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
