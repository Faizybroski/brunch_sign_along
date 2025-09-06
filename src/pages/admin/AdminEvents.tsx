import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ImageUpload from "@/components/admin/ImageUpload";

// Event form validation schema
const eventFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  date: z.date({ required_error: "Event date is required" }),
  time: z.string().min(1, { message: "Event time is required" }),
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters long" }),
  image_url: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const AdminEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      time: "",
      location: "1171 St Catherine St E, Montreal",
      image_url: "",
    },
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!showEventDialog) {
      form.reset();
      setIsEditing(false);
      setCurrentEventId(null);
    }
  }, [showEventDialog, form]);

  // Handle edit event
  const handleEditEvent = async (event: any) => {
    setCurrentEventId(event.id);
    setIsEditing(true);

    form.setValue("title", event.title);
    form.setValue("date", new Date(event.date));
    form.setValue("time", event.time);
    form.setValue("location", event.location);
    form.setValue("image_url", event.image_url || "");

    setShowEventDialog(true);
  };

  // Handle form submission
  const onSubmit = async (values: EventFormValues) => {
    try {
      setSubmitting(true);

      // Format date to YYYY-MM-DD
      const formattedDate = format(values.date, "yyyy-MM-dd");

      // Prepare data for Supabase
      const eventData = {
        title: values.title,
        date: formattedDate,
        time: values.time,
        location: values.location,
        image_url:
          values.image_url ||
          "/lovable-uploads/c87609a8-1047-4f60-b03a-bb078be8184f.png",
      };

      let result;

      if (isEditing && currentEventId) {
        // Update existing event
        result = await supabase
          .from("events")
          .update(eventData)
          .eq("id", currentEventId);

        if (result.error) throw result.error;
        toast.success("Event updated successfully");
      } else {
        // Create new event
        result = await supabase.from("events").insert([eventData]);

        if (result.error) throw result.error;
        toast.success("Event created successfully");
      }

      setShowEventDialog(false);
      fetchEvents(); // Refresh the list
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast.error(error.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeleteEvent = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This will also permanently delete all associated tickets, VIP inventory, and tier inventory."
    );

    if (!confirmed) return;

    try {
      const { error: ticketsError } = await supabase
        .from("event_tickets")
        .delete()
        .eq("event_id", id);

      if (ticketsError) throw ticketsError;

      const { error: vipError } = await supabase
        .from("event_vip_inventory")
        .delete()
        .eq("event_id", id);

      if (vipError) throw vipError;

      const { error: tierError } = await supabase
        .from("event_tier_inventory")
        .delete()
        .eq("event_id", id);

      if (tierError) throw tierError;

      const { error: eventError } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (eventError) throw eventError;

      toast.success(
        "Event, tickets, VIP inventory, and tier inventory deleted successfully"
      );
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Events Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, edit and manage your events
          </p>
        </div>
        <Button
          className="bg-brunch-purple hover:bg-brunch-purple-dark"
          onClick={() => setShowEventDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-brunch-purple" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No events found. Create your first event.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => {
                    const eventDate = new Date(event.date);
                    const isPastEvent = eventDate < new Date();

                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded overflow-hidden">
                              <img
                                src={event.image_url || "/placeholder.svg"}
                                alt={event.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.svg";
                                }}
                              />
                            </div>
                            <div>{event.title}</div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              {format(
                                new Date(event.date + "T00:00:00"),
                                "MMMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{event.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="truncate max-w-[200px]">
                              {event.location}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isPastEvent ? (
                            <Badge variant="outline" className="bg-gray-100">
                              Past
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800"
                            >
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Event Form Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[580px] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the event details below."
                : "Fill in the event details below to create a new event."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Titanic Brunch Experience"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a descriptive title for your event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMMM d, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input placeholder="12:00 PM - 2:30 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, New York, NY 10001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <ImageUpload
                      currentImageUrl={field.value}
                      onImageChange={field.onChange}
                      label="Event Image"
                      placeholder="Enter image URL or upload an image"
                    />
                    <FormDescription>
                      Upload an image or enter a URL for the event image. Leave
                      blank to use the default image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEventDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brunch-purple hover:bg-brunch-purple-dark"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditing ? "Update Event" : "Create Event"}</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEvents;
