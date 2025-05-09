"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "@/hooks/use-toast";

// Define validation schema
const createFormValidation = (form) => {
  const errors = {};
  
  // Validate firstName
  if (!form.firstName || form.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  }
  
  // Validate lastName
  if (!form.lastName || form.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  }
  
  // Validate countryCode
  if (!form.countryCode) {
    errors.countryCode = "Please select a country code.";
  }
  
  // Validate mobile
  if (!form.mobile || form.mobile.length < 8) {
    errors.mobile = "Please enter a valid mobile number.";
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  
  // Validate nationality
  if (!form.nationality) {
    errors.nationality = "Please select your nationality.";
  }
  
  // Validate businessActivities
  if (!form.businessActivities || form.businessActivities.length === 0) {
    errors.businessActivities = "Please select at least one business activity.";
  }
  
  return errors;
};

// Debugging utility function
function debugZohoForm() {
  // Get the form element
  const formEl = document.getElementById('zoho-react-form');
  
  if (!formEl) {
    console.error("Zoho form element not found");
    return {
      formExists: false,
      error: "Form element not found"
    };
  }
  
  console.log("Zoho Form Details:");
  console.log("Form Action:", formEl.action);
  console.log("Form Method:", formEl.method);
  console.log("Form Target:", formEl.target);
  
  // Check all form inputs
  const inputs = formEl.querySelectorAll('input');
  const formData = {};
  
  inputs.forEach(input => {
    console.log(`Input: ${input.name}, Value: ${input.value}, Type: ${input.type}`);
    formData[input.name] = input.value;
  });
  
  console.log("Form Data:", formData);
  
  // Check if iframe exists
  const iframe = document.querySelector('iframe[name="zoho_iframe"]');
  if (iframe) {
    console.log("Zoho iframe found:", iframe);
  } else {
    console.error("Zoho iframe not found");
  }
  
  return {
    formExists: !!formEl,
    iframeExists: !!iframe,
    formData
  };
}

export default function QuotationForm() {
  const [quotationData, setQuotationData] = useState(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const defaultFormValues = {
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
  };

  const form = useForm({
    defaultValues: defaultFormValues
  });

  const type = form.watch("type");

  // Log when iframe loads
  useEffect(() => {
    const iframe = document.getElementById('zoho_iframe');
    if (iframe) {
      iframe.onload = () => {
        console.log('Zoho iframe loaded/updated');
        try {
          // Try to access iframe content
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            console.log('Iframe content accessible:', iframeDoc.body?.innerHTML?.substring(0, 200) + '...');
          }
        } catch (e) {
          console.log('Cannot access iframe content due to same-origin policy');
        }
      };
    }
  }, []);

  async function onSubmit(data) {
    try {
      // Clear any previous errors
      setValidationErrors({});
      setSubmitError(null);
      
      // Validate form manually
      const errors = createFormValidation(data);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        
        // Show first validation error to the user
        const firstError = Object.values(errors)[0];
        toast({
          title: "Validation Error",
          description: firstError,
          variant: "destructive",
        });
        return;
      }
      
      setIsSubmitting(true);
      console.log("Form submitted with data:", data);

      const fullData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        mobile: `${data.countryCode} ${data.mobile}`,
        emirates: data.emirate,
      };

      const quotation = generateQuotation(fullData);
      setQuotationData(quotation);

      try {
        // Get the form element
        const formEl = document.getElementById('zoho-react-form');
        
        if (formEl) {
          // Debug form state before submission
          console.log("Zoho form found, preparing to submit...");
          
          // Set input values directly
          const inputs = {
            'First Name': data.firstName,
            'Last Name': data.lastName,
            'Email': data.email,
            'Mobile': `${data.countryCode} ${data.mobile}`,
            'LEADCF6': data.nationality,
            'LEADCF1': data.emirate,
            'LEADCF4': data.type,
            'LEADCF3': data.businessActivities.join(', '),
            'LEADCF5': data.officeSpace,
            'LEADCF2': data.shareholders,
            'LEADCF7': data.visas
          };
          
          // Set values for all inputs
          Object.entries(inputs).forEach(([name, value]) => {
            const input = formEl.querySelector(`[name="${name}"]`);
            if (input) {
              input.value = value;
              console.log(`Set ${name} to: ${value}`);
            } else {
              console.error(`Input field [name="${name}"] not found in the form`);
            }
          });
          
          // Debug logging before submission
          const debugInfo = debugZohoForm();
          console.log("Form state before submission:", debugInfo);
          
          // Submit the form - using the submit button instead of the form method
          const submitButton = formEl.querySelector('input[type="submit"]');
          if (submitButton) {
            console.log("Submitting via button click...");
            submitButton.click();
          } else {
            console.log("No submit button found, using form.submit() method...");
            formEl.submit();
          }
          
          console.log("Zoho form submission triggered");
          
          toast({
            title: 'Success',
            description: 'Your quotation has been generated and submitted to our team.',
            variant: 'default',
          });

          setShowQuotation(true);
        } else {
          console.error("Zoho form element not found");
          setSubmitError("Form element not found. Please try again or contact support.");
          throw new Error("Zoho form element not found");
        }
      } catch (error) {
        console.error("Error submitting to Zoho CRM:", error);
        toast({
          title: "Error",
          description: "Failed to submit your information to our CRM system. Please try again or contact support.",
          variant: "destructive",
        });
        setSubmitError(error.message || "Unknown error submitting form");
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast({
        title: "Error",
        description: "There was a problem generating your quotation. Please try again.",
        variant: "destructive",
      });
      setSubmitError(error.message || "Unknown error processing form");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleBackToForm = () => {
    setShowQuotation(false);
  };

  function testZohoSubmission() {
    // Set test values
    const testData = {
      'First Name': 'Test',
      'Last Name': 'User',
      'Email': 'test@example.com',
      'Mobile': '+971 55 123 4567',
      'LEADCF6': 'United Arab Emirates',
      'LEADCF1': 'Dubai',
      'LEADCF4': 'Freezone',
      'LEADCF3': 'Trading',
      'LEADCF5': 'Yes',
      'LEADCF2': '1',
      'LEADCF7': '2'
    };
    
    // Get the form
    const formEl = document.getElementById('zoho-react-form');
    if (!formEl) {
      console.error("Test failed: Zoho form not found");
      return;
    }
    
    // Set test values on form
    Object.entries(testData).forEach(([name, value]) => {
      const input = formEl.querySelector(`[name="${name}"]`);
      if (input) {
        input.value = value;
        console.log(`Test: Set ${name} to ${value}`);
      } else {
        console.error(`Test: Input ${name} not found`);
      }
    });
    
    // Log form state before submission
    debugZohoForm();
    
    // Submit the form
    try {
      formEl.submit();
      console.log("Test form submitted");
    } catch (error) {
      console.error("Error submitting test form:", error);
    }
  }

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
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...form.register("firstName")}
                            />
                          </FormControl>
                          {validationErrors.firstName && (
                            <FormMessage>{validationErrors.firstName}</FormMessage>
                          )}
                        </FormItem>

                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...form.register("lastName")}
                            />
                          </FormControl>
                          {validationErrors.lastName && (
                            <FormMessage>{validationErrors.lastName}</FormMessage>
                          )}
                        </FormItem>
                      </div>

                      {/* Mobile Number - full width on mobile, split on desktop */}
                      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
                        <FormItem className="w-full">
                          <FormLabel>Country Code</FormLabel>
                          <Select
                            onValueChange={(value) => form.setValue("countryCode", value)}
                            defaultValue={form.getValues("countryCode")}
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
                          {validationErrors.countryCode && (
                            <FormMessage>{validationErrors.countryCode}</FormMessage>
                          )}
                        </FormItem>

                        <FormItem className="w-full md:col-span-2">
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="XX XXX XXXX" 
                              {...form.register("mobile")} 
                            />
                          </FormControl>
                          {validationErrors.mobile && (
                            <FormMessage>{validationErrors.mobile}</FormMessage>
                          )}
                        </FormItem>
                      </div>

                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            {...form.register("email")}
                          />
                        </FormControl>
                        {validationErrors.email && (
                          <FormMessage>{validationErrors.email}</FormMessage>
                        )}
                      </FormItem>

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
                                {form.getValues("nationality")
                                  ? nationalities.find(
                                      (nationality) =>
                                        nationality === form.getValues("nationality")
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
                                          form.getValues("nationality") === nationality
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
                        {validationErrors.nationality && (
                          <FormMessage>{validationErrors.nationality}</FormMessage>
                        )}
                      </FormItem>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-[#d6a456]">
                        Business Setup Details
                      </h2>

                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={(value) => form.setValue("type", value)}
                          defaultValue={form.getValues("type")}
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
                      </FormItem>

                      <FormItem>
                        <FormLabel>Emirate</FormLabel>
                        <Select
                          onValueChange={(value) => form.setValue("emirate", value)}
                          defaultValue={form.getValues("emirate")}
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
                      </FormItem>

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
                        {["Trading", "Manufacturing", "Services or Consultancy"].map((activity) => (
                          <FormItem
                            key={activity}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={form.getValues("businessActivities")?.includes(activity)}
                                onCheckedChange={(checked) => {
                                  const currentActivities = form.getValues("businessActivities") || [];

                                  if (type === "Mainland") {
                                    // For Mainland, only allow one selection
                                    if (checked) {
                                      form.setValue("businessActivities", [activity]);
                                    } else {
                                      form.setValue("businessActivities", []);
                                    }
                                  } else {
                                    // For Freezone, allow multiple selections
                                    if (checked) {
                                      form.setValue("businessActivities", [
                                        ...currentActivities,
                                        activity,
                                      ]);
                                    } else {
                                      form.setValue(
                                        "businessActivities",
                                        currentActivities.filter(
                                          (value) => value !== activity
                                        )
                                      );
                                    }
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {activity}
                            </FormLabel>
                          </FormItem>
                        ))}
                        {validationErrors.businessActivities && (
                          <FormMessage>{validationErrors.businessActivities}</FormMessage>
                        )}
                      </FormItem>

                      <FormItem>
                        <FormLabel>Office Space Requirement</FormLabel>
                        <Select
                          onValueChange={(value) => form.setValue("officeSpace", value)}
                          defaultValue={form.getValues("officeSpace")}
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
                      </FormItem>

                      {/* Shareholders and Visas - full width on mobile, split on desktop */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel>Number of Shareholders</FormLabel>
                          <Select
                            onValueChange={(value) => form.setValue("shareholders", value)}
                            defaultValue={form.getValues("shareholders")}
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
                        </FormItem>

                        <FormItem>
                          <FormLabel>Number of Visas</FormLabel>
                          <Select
                            onValueChange={(value) => form.setValue("visas", value)}
                            defaultValue={form.getValues("visas")}
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
                        </FormItem>
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
                  
                  {/* Error display */}
                  {submitError && (
                    <div className="text-red-500 text-center mt-2">
                      Error: {submitError}
                    </div>
                  )}
                  
                  {/* Test button - Remove in production */}
                  {process.env.NODE_ENV !== 'production' && (
                    <div className="mt-4 text-center">
                      <Button
                        type="button"
                        onClick={testZohoSubmission}
                        className="bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        Test Zoho Submission
                      </Button>
                    </div>
                  )}
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

      {/* Updated Zoho form embedded for lead submission */}
      <form
        id="zoho-react-form"
        action="https://crm.zoho.com/crm/WebToLeadForm"
        name="WebToLeads"
        method="POST"
        acceptCharset="UTF-8"
        encType="multipart/form-data"
        target="zoho_iframe"
        style={{ display: "none" }}
      >
        {/* Required Zoho CRM fields */}
        <input type="hidden" name="xnQsjsdp" value="eb7d36638cf2303463f51439dcd88af43be59e4c1a1ce0761d60600d51efd674" />
        <input type="hidden" name="xmIwtLD" value="2161250700834bef045f4363e15f682c703e0d73b480216eefc4217ffc1fb588a32d46fe56efb3afa208d5cc247c2945" />
        <input type="hidden" name="actionType" value="TGVhZHM=" />
        <input type="hidden" name="returnURL" value="https://quote.g12.ae/" />
        
        {/* Lead information fields - changed from hidden to text type */}
        <input type="text" name="First Name" />
        <input type="text" name="Last Name" />
        <input type="text" name="Email" />
        <input type="text" name="Mobile" />
        <input type="text" name="LEADCF6" /> {/* Nationality */}
        <input type="text" name="LEADCF1" /> {/* Emirate */}
        <input type="text" name="LEADCF4" /> {/* Type */}
        <input type="text" name="LEADCF3" /> {/* Business Activities */}
        <input type="text" name="LEADCF5" /> {/* Office Space */}
        <input type="text" name="LEADCF2" /> {/* Shareholders */}
        <input type="text" name="LEADCF7" /> {/* Visas */}
        <input type="hidden" name="Lead Source" value="Cost Calculator" />
        <input type="hidden" name="Campaign Name" value="UAE-Google-GoldenVisa-March25" />
        
        {/* Submit button */}
        <input type="submit" style={{ display: "none" }} value="Submit" />
      </form>
      
      {/* Capturing form submission response */}
      <iframe 
        name="zoho_iframe" 
        id="zoho_iframe"
        style={{ display: "none" }} 
        title="Zoho CRM Response"
      />
    </div>
  );
}