import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  studentName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  contactNumber: z.string().trim().min(8, "Please enter a valid phone number").max(20, "Phone number is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long").optional().or(z.literal("")),
  subject: z.string().min(1, "Please select a subject"),
  preferredDate: z.date({ required_error: "Please select a preferred date" }),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  currentSchool: z.string().trim().max(100, "School name is too long").optional(),
  message: z.string().trim().max(500, "Message must be less than 500 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

const subjects = [
  "Principles of Accounting (POA)",
  "Management of Business (MOB)",
  "Mathematics (H1/H2)",
  "Economics (H1/H2)",
];

const timeSlots = [
  "Morning (9am - 12pm)",
  "Afternoon (12pm - 3pm)",
  "Late Afternoon (3pm - 6pm)",
  "Evening (6pm - 9pm)",
  "Flexible",
];

const TrialBookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      contactNumber: "",
      email: "",
      subject: "",
      preferredTime: "",
      currentSchool: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("trial_bookings").insert({
        student_name: data.studentName,
        contact_number: data.contactNumber,
        email: data.email || null,
        subject: data.subject,
        preferred_date: format(data.preferredDate, "yyyy-MM-dd"),
        preferred_time: data.preferredTime,
        current_school: data.currentSchool || null,
        message: data.message || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Booking submitted!",
        description: "We'll contact you within 24 hours to confirm your trial class.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-secondary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          Your trial class request has been submitted. We'll contact you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 91234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentSchool"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current School (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Millennia Institute" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Date *</FormLabel>
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
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any specific topics you'd like to cover or questions you have..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          variant="secondary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Book Trial Class
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TrialBookingForm;
