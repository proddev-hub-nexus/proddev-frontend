"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/general/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/general/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/general/components/ui/form";
import { Input } from "@/general/components/ui/input";
import { Textarea } from "@/general/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/general/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Briefcase,
  MessageSquare,
  Send,
  CalendarDays,
} from "lucide-react";

const consultationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  consultationType: z.string().min(1, "Please select a consultation type"),
  preferredDate: z.string().min(1, "Please select a date"),
  preferredTime: z.string().min(1, "Please select a time slot"),
  goals: z
    .string()
    .min(10, "Please describe your goals (minimum 10 characters)"),
  additionalInfo: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface ScheduleConsultationFormProps {
  children: React.ReactNode;
}

// Generate available dates (excluding weekends)
const getAvailableDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
    }

    if (dates.length >= 10) break;
  }

  return dates;
};

const getAvailableTimeSlots = () => {
  return [
    { value: "09:00", label: "9:00 AM - 9:30 AM" },
    { value: "10:00", label: "10:00 AM - 10:30 AM" },
    { value: "11:00", label: "11:00 AM - 11:30 AM" },
    { value: "14:00", label: "2:00 PM - 2:30 PM" },
    { value: "15:00", label: "3:00 PM - 3:30 PM" },
    { value: "16:00", label: "4:00 PM - 4:30 PM" },
    { value: "17:00", label: "5:00 PM - 5:30 PM" },
  ];
};

const consultationTypes = [
  { value: "career-transition", label: "Career Transition" },
  { value: "skill-development", label: "Skill Development" },
  { value: "course-selection", label: "Course Selection" },
  { value: "certification-guidance", label: "Certification Guidance" },
  { value: "general-inquiry", label: "General Inquiry" },
];

const ScheduleConsultationForm: React.FC<ScheduleConsultationFormProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDates] = useState(getAvailableDates());
  const [availableTimeSlots] = useState(getAvailableTimeSlots());

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      consultationType: "",
      preferredDate: "",
      preferredTime: "",
      goals: "",
      additionalInfo: "",
    },
  });

  // In your consultation form component, update the onSubmit function:

  const onSubmit = async (values: ConsultationFormData) => {
    setIsLoading(true);

    try {
      // Call the real API instead of simulation
      const response = await fetch("/api/email/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          scheduledDateTime: `${values.preferredDate} ${values.preferredTime}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to schedule consultation");
      }

      // Get formatted date/time for success message
      const selectedDate = availableDates.find(
        (d) => d.value === values.preferredDate
      );
      const selectedTime = availableTimeSlots.find(
        (t) => t.value === values.preferredTime
      );

      toast.success(
        `Consultation scheduled for ${selectedDate?.label} at ${
          selectedTime?.label.split(" - ")[0]
        }. Check your email for confirmation!`
      );

      form.reset();
      setIsOpen(false);

      // Log success for debugging
      console.log("Consultation scheduled successfully:", result.data);
    } catch (error) {
      console.error("Error scheduling consultation:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-600 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Schedule Your Consultation
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-sm leading-relaxed">
            Book a free 30-minute consultation with our career development
            experts. We&apos;ll discuss your goals and create a personalized
            learning path.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      Full Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200 flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Phone Number (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200 flex items-center gap-2">
                      <Briefcase className="w-3 h-3" />
                      Company (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your company name"
                        className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-200">
                    Current Job Title (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Software Developer, Marketing Manager"
                      className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            {/* Consultation Details Section */}
            <FormField
              control={form.control}
              name="consultationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-200">
                    Consultation Type *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {consultationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200 flex items-center gap-2">
                      <CalendarDays className="w-3 h-3" />
                      Available Dates *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select a date" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600 max-h-[200px]">
                        {availableDates.map((date) => (
                          <SelectItem key={date.value} value={date.value}>
                            {date.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Available Times *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {availableTimeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Goals and Additional Information */}
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    What are your learning goals? *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your career goals, skills you want to develop, or challenges you're facing..."
                      className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20 min-h-[80px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-200">
                    Additional Information (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific topics you'd like to discuss or questions you have..."
                      className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20 min-h-[60px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-600/30">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Scheduling...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Schedule Consultation
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleConsultationForm;
