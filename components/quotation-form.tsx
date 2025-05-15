"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { nationalities } from "@/lib/nationalities";
import { countryCodes } from "@/lib/country-codes";
import { generateQuotation } from "@/lib/generate-quotation";
import QuotationPreview from "./quotation-preview";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  countryCode: z.string().min(1, { message: "Please select a country code." }),
  mobile: z.string().min(8, { message: "Please enter a valid mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  nationality: z
    .string()
    .min(1, { message: "Please select your nationality." }),
  type: z.enum(["Freezone", "Mainland"]),
  emirate: z.enum([
    "Dubai",
    "Abu Dhabi",
    "Ajman",
    "Sharjah",
    "RAK",
    "Fujairah",
    "Umm Al Quwain",
  ]),
  businessActivities: z
    .array(z.enum(["Trading", "Manufacturing", "Services or Consultancy"]))
    .refine((activities) => activities.length > 0, {
      message: "Please select at least one business activity.",
    }),
  officeSpace: z.enum(["Yes", "No", "Not decided yet"]),
  shareholders: z.enum(["1", "2", "3", "4", "5", "6"]),
  visas: z.enum([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ]),
});

type FormValues = z.infer<typeof formSchema>;

const businessActivities = [
  { id: "Trading", label: "Trading" },
  { id: "Manufacturing", label: "Manufacturing" },
  { id: "Services or Consultancy", label: "Services or Consultancy" },
];

export default function QuotationForm() {
  const zohoFormRef = useRef(null);
  const [quotationData, setQuotationData] = useState<any>(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      countryCode: "+971",
      mobile: "",
      email: "",
      nationality: "",
      type: "Freezone",
      emirate: "Dubai",
      businessActivities: [],
      officeSpace: "Not decided yet",
      shareholders: "1",
      visas: "0",
    },
  });

  const type = form.watch("type");

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);
      
      // Combine first and last name for the quotation
      const fullData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        mobile: `${data.countryCode} ${data.mobile}`,
        emirates: data.emirate, // Map to the old field name for compatibility
      };

      // Generate the quotation
      const quotation = generateQuotation(fullData);
      setQuotationData(quotation);
      
      // Display success toast
      toast({
        title: "Success",
        description: "Your quotation has been generated successfully.",
        variant: "default",
      });
      
      // Show the quotation to the user
      setShowQuotation(true);

      // ✅ Populate Zoho form fields before submission
      const formElement = zohoFormRef.current;
      if (formElement) {
        formElement.querySelector('input[name="First Name"]').value = data.firstName;
        formElement.querySelector('input[name="Last Name"]').value = data.lastName;
        formElement.querySelector('input[name="Email"]').value = data.email;
        formElement.querySelector('input[name="Mobile"]').value = data.mobile;
        formElement.querySelector('input[name="LEADCF17"]').value = "Cost Calculator";
        formElement.querySelector('input[name="LEADCF23"]').value = data.type;
        formElement.querySelector('input[name="LEADCF22"]').value = data.emirate;
        formElement.querySelector('input[name="LEADCF21"]').value = data.businessActivities.join(", ");
        formElement.querySelector('input[name="LEADCF24"]').value = data.officeSpace;
        formElement.querySelector('input[name="LEADCF26"]').value = data.shareholders;
        formElement.querySelector('input[name="LEADCF25"]').value = data.visas;
        formElement.querySelector('input[name="Lead Source"]').value = "Cost Calculator";
        formElement.querySelector('input[name="LEADCF3"]').value = "25%";
        formElement.querySelector('input[name="LEADCF2"]').value = "G12 Quote AI";
        formElement.querySelector('input[name="LEADCF16"]').value = data.nationality;

        formElement.submit();
      }

      
    } catch (error) {
      console.error('Error during form submission:', error);
      toast({
        title: "Error",
        description: "There was a problem generating your quotation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleBackToForm = () => {
    setShowQuotation(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {!showQuotation ? (
        <>
          <div className="mb-8 text-center sm:col-span-2">
            <p className="text-[#6c757d] max-w-2xl mx-auto" id="description">
              Please fill in the details for your desired company structure below to
              generate an instant, AI-generated business setup quotation for your
              specific requirements.
            </p>
          </div>
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-[#d6a456]">
                        Your Information
                      </h2>

                      {/* First Name - full width on mobile, half width on desktop */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your first name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your last name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Mobile Number - full width on mobile, split on desktop */}
                      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
                        <FormField
                          control={form.control}
                          name="countryCode"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Country Code</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Code" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[200px]">
                                  {countryCodes.map((code) => (
                                    <SelectItem
                                      key={code.code}
                                      value={code.code}
                                    >
                                      {code.code} ({code.country})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mobile"
                          render={({ field }) => (
                            <FormItem className="w-full md:col-span-2">
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <Input placeholder="XX XXX XXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="email@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Nationality</FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                  >
                                    {field.value
                                      ? nationalities.find(
                                          (nationality) =>
                                            nationality === field.value
                                        )
                                      : "Select nationality"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search nationality..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No nationality found.
                                    </CommandEmpty>
                                    <CommandGroup className="max-h-[200px] overflow-auto">
                                      {nationalities.map((nationality) => (
                                        <CommandItem
                                          key={nationality}
                                          value={nationality}
                                          onSelect={() => {
                                            form.setValue(
                                              "nationality",
                                              nationality
                                            );
                                            setOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === nationality
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {nationality}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-[#d6a456]">
                        Business Setup Details
                      </h2>

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Freezone">
                                  Freezone
                                </SelectItem>
                                <SelectItem value="Mainland">
                                  Mainland
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emirate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emirate</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select emirate" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Dubai">Dubai</SelectItem>
                                <SelectItem value="Abu Dhabi">
                                  Abu Dhabi
                                </SelectItem>
                                <SelectItem value="Sharjah">Sharjah</SelectItem>
                                <SelectItem value="Ajman">Ajman</SelectItem>
                                <SelectItem value="RAK">
                                  Ras Al Khaimah
                                </SelectItem>
                                <SelectItem value="Fujairah">
                                  Fujairah
                                </SelectItem>
                                <SelectItem value="Umm Al Quwain">
                                  Umm Al Quwain
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessActivities"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">
                                Business Activities
                              </FormLabel>
                              <FormDescription>
                                {type === "Freezone"
                                  ? "You can select multiple activities for Freezone"
                                  : "You can select only one activity for Mainland"}
                              </FormDescription>
                            </div>
                            {businessActivities.map((activity) => (
                              <FormField
                                key={activity.id}
                                control={form.control}
                                name="businessActivities"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={activity.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            activity.id as any
                                          )}
                                          onCheckedChange={(checked) => {
                                            const currentActivities = [
                                              ...field.value,
                                            ];

                                            if (type === "Mainland") {
                                              // For Mainland, only allow one selection
                                              if (checked) {
                                                field.onChange([activity.id]);
                                              } else {
                                                field.onChange([]);
                                              }
                                            } else {
                                              // For Freezone, allow multiple selections
                                              if (checked) {
                                                field.onChange([
                                                  ...currentActivities,
                                                  activity.id,
                                                ]);
                                              } else {
                                                field.onChange(
                                                  currentActivities.filter(
                                                    (value) =>
                                                      value !== activity.id
                                                  )
                                                );
                                              }
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {activity.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="officeSpace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Office Space Requirement</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Not decided yet">
                                  Not decided yet
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Shareholders and Visas - full width on mobile, split on desktop */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="shareholders"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Shareholders</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select number" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {["1", "2", "3", "4", "5", "6"].map((num) => (
                                    <SelectItem key={num} value={num}>
                                      {num}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="visas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Visas</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select number" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 16 }, (_, i) =>
                                    i.toString()
                                  ).map((num) => (
                                    <SelectItem key={num} value={num}>
                                      {num}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#d6a456] hover:bg-[#ab8134] text-white px-8 py-2 uppercase"
                    >
                      {isSubmitting ? "Processing..." : "Generate Instant Quotation"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <QuotationPreview data={quotationData} onBack={handleBackToForm} />
        </>
      )}

      {/* Hidden Zoho Webform */}
      <>
        <form
          ref={zohoFormRef}
          action="https://crm.zoho.com/crm/WebToLeadForm"
          name="WebToLeads6537170000006521088"
          method="POST"
          target="hidden_iframe"
          style={{ display: "none" }}
        >
          <input type="hidden" name="xnQsjsdp" value="eb7d36638cf2303463f51439dcd88af43be59e4c1a1ce0761d60600d51efd674" />
          <input type="hidden" name="xmIwtLD" value="2161250700834bef045f4363e15f682c703e0d73b480216eefc4217ffc1fb588a32d46fe56efb3afa208d5cc247c2945" />
          <input type="hidden" name="actionType" value="TGVhZHM=" />
          <input type="hidden" name="returnURL" value="https://quote.g12.ae/" />

          <input name="First Name" value={form.getValues('firstName')} readOnly />
          <input name="Last Name" value={form.getValues('lastName')} readOnly />
          <input name="Email" value={form.getValues('email')} readOnly />
          <input name="Mobile" value={form.getValues('mobile')} readOnly />
          <input name="LEADCF17" value={form.getValues('inquiryType')} readOnly />
          <input name="LEADCF23" value={form.getValues('type')} readOnly />
          <input name="LEADCF22" value={form.getValues('emirate')} readOnly />
          <input name="LEADCF21" value={form.getValues('businessActivities')} readOnly />
          <input name="LEADCF24" value={form.getValues('officeSpace')} readOnly />
          <input name="LEADCF26" value={form.getValues('shareholders')} readOnly />
          <input name="LEADCF25" value={form.getValues('visas')} readOnly />
          <input name="Lead Source" value="Cost Calculator" readOnly />
          <input name="LEADCF3" value="25%" readOnly />
          <input name="LEADCF2" value={form.getValues('campaignName')} readOnly />
          <input name="LEADCF16" value={form.getValues('nationality')} readOnly />
        </form>

        <iframe name="hidden_iframe" style={{ display: "none" }}></iframe>
      </>
    </div>
  );
}