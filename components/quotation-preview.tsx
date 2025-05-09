"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatCurrency } from "@/lib/utils";
import { Logo } from "./logo";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuotationPreviewProps {
  data: {
    clientInfo: {
      name: string;
      mobile: string;
      email: string;
      nationality: string;
    };
    businessSetup: {
      type: string;
      emirates: string;
      businessActivities: string[];
      officeSpace: string;
      shareholders: string;
      visas: string;
    };
    pricing: {
      basePrice: number;
      visaPrice: number;
      totalPrice: number;
      disclaimer?: string;
    };
    date: string;
    quotationNumber: string;
  };
  onBack: () => void;
}

export default function QuotationPreview({
  data,
  onBack,
}: QuotationPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const isMobile = useIsMobile();

  const downloadPDF = async () => {
    setIsGenerating(true);
    const quotationElement = document.getElementById("quotation-preview");

    if (!quotationElement) {
      setIsGenerating(false);
      return;
    }

    try {
      const canvas = await html2canvas(quotationElement, {
        scale: 3,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById("quotation-preview");
          if (element) {
            element.style.padding = "20px";
            element.style.margin = "0";
            element.style.width = "1200px";
          }
        },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();

      if (isMobile) {
        // Create a single optimized page for mobile
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add image with high quality settings
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
      } else {
        // Desktop version - single page
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
      }

      // Add metadata
      pdf.setProperties({
        title: `G12 Business Setup Quotation - ${data.clientInfo.name}`,
        subject: "Business Setup Quotation",
        author: "G12 Business Services",
        keywords: "business setup, UAE, quotation",
        creator: "G12 Quote Generator",
      });

      const clientName = data.clientInfo.name.replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`G12_Quotation_${clientName}_${data.quotationNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }

    setIsGenerating(false);
  };

  return (
    <div className="md:col-span-2">
      
      {/* Success Section - Moved to top */}
      <div className="md:col-span-2 flex flex-col gap-4 mb-6">
        <h3 className="text-lg font-semibold text-center">
          Here are the next steps to{" "}
          <span className="text-[#d6a456]">#GENERATE SUCCESS</span> in the UAE:
        </h3>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md md:max-w-4xl md:mx-auto">
          <div className="flex justify-between items-center gap-2 sm:gap-4">
            <Button onClick={onBack} variant="outline">
              Back to Form
            </Button>
            <div className="flex items-center gap-1 md:gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#d6a456]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <Button
                className="bg-[#d6a456] hover:bg-[#ab8134] text-white px-3 sm:px-6"
                onClick={downloadPDF}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating PDF..." : "Download Quotation"}
              </Button>
            </div>
          </div>
          <div class="hidden md:block text-gray-600 font-medium">OR</div>

          <div className="flex items-center gap-4">
            <div className="rounded-full border-2 border-[#d6a456] overflow-hidden h-[80px] w-[80px]">
              <Image
                src="/sonia.png"
                alt="Sonia Shareef"
                width={80}
                height={80}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Sonia Shareef
                </h4>
                <p className="text-sm text-gray-600">Your Success Manager</p>
              </div>
              <Button
                className="bg-[#d6a456] hover:bg-[#ab8134] text-white px-2 sm:px-4 py-2 rounded-full shadow-lg"
                onClick={() => {
                  const message = encodeURIComponent(
                    `Hello Sonia, I would like to discuss my AI-generated business setup quotation further.`
                  );
                  const whatsappUrl = `https://wa.me/971525850087?text=${message}`;
                  window.open(whatsappUrl, "_blank");
                }}
              >
                Speak to me NOW
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-between items-center mb-4">
        <Button onClick={onBack} variant="outline">
          Back to Form
        </Button>
        <Button
          onClick={downloadPDF}
          disabled={isGenerating}
          className="bg-[#d6a456] hover:bg-[#ab8134] text-white"
        >
          {isGenerating ? "Generating PDF..." : "Download Quotation"}
        </Button>
      </div> */}

      <Card className="overflow-hidden" id="quotation-preview">
        <div className="bg-[#000] sm:p-6 p-4 text-white">
          <div className="flex justify-between items-center">
            <Logo size="small" href="https://g12.ae"  customLogoUrl="Logo.png" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">QUOTATION</h3>
              <p className="text-sm">#{data.quotationNumber}</p>
              <p className="text-sm">Date: {data.date}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 md:p-6">
          {/* Client and Business Info */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div>
              <h3 className="text-lg font-semibold text-[#131313] mb-3">
                Client Information
              </h3>
              <div className="sm:space-y-2 space-y-1 sm:text-base text-sm">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {data.clientInfo.name}
                </p>
                <p>
                  <span className="font-semibold">Mobile:</span>{" "}
                  {data.clientInfo.mobile}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {data.clientInfo.email}
                </p>
                <p>
                  <span className="font-semibold">Nationality:</span>{" "}
                  {data.clientInfo.nationality}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131313] mb-3">
                Business Setup Details
              </h3>
              <div className="sm:space-y-2 space-y-1 sm:text-base text-sm">
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {data.businessSetup.type}
                </p>
                <p>
                  <span className="font-semibold">Emirates:</span>{" "}
                  {data.businessSetup.emirates}
                </p>
                <p>
                  <span className="font-semibold">Business Activities:</span>{" "}
                  {data.businessSetup.businessActivities.join(", ")}
                </p>
                <p>
                  <span className="font-semibold">Office Space Required:</span>{" "}
                  {data.businessSetup.officeSpace}
                </p>
                <p>
                  <span className="font-semibold">Number of Shareholders:</span>{" "}
                  {data.businessSetup.shareholders}
                </p>
                <p>
                  <span className="font-semibold">Number of Visas:</span>{" "}
                  {data.businessSetup.visas}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-[#131313] mb-4">
              Quotation Details
            </h3>

            {/* Services Section */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Services Included:</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {data.businessSetup.type === "Freezone" ? (
                    <>
                      <li>Freezone Company Registration</li>
                      <li>Trade License Issuance</li>
                      <li>Establishment Card</li>
                      <li>Share Certificate</li>
                      <li>Memorandum of Association (MOA)</li>
                      <li>Corporate Bank Account Assistance</li>
                      {Number.parseInt(data.businessSetup.visas) > 0 && (
                        <>
                          <li>Immigration Card</li>
                          <li>
                            Visa Processing for {data.businessSetup.visas}{" "}
                            {Number.parseInt(data.businessSetup.visas) === 1
                              ? "person"
                              : "people"}
                          </li>
                          <li>Medical Testing Assistance</li>
                          <li>Emirates ID Processing</li>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <li>Mainland Company Registration</li>
                      <li>Trade License Issuance</li>
                      <li>Initial Approval</li>
                      <li>MOA Attestation</li>
                      <li>Corporate Bank Account Assistance</li>
                      <li>Trade Name Reservation</li>
                      {data.businessSetup.officeSpace === "Yes" ? (
                        <li>Office Space Consultation</li>
                      ) : data.businessSetup.officeSpace === "No" ? (
                        <li>Virtual Office Setup Assistance</li>
                      ) : null}
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Cost Breakdown Section */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-md mb-4">
              <h4 className="font-semibold mb-2">Cost Breakdown:</h4>
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex justify-between flex-wrap">
                  <span>Base Setup Cost:</span>
                  <span>{formatCurrency(data.pricing.basePrice)}</span>
                </div>

                {Number.parseInt(data.businessSetup.visas) > 0 && (
                  <div className="flex justify-between flex-wrap">
                    <span>
                      Visa Cost ({data.businessSetup.visas} × AED 6,500):
                    </span>
                    <span>{formatCurrency(data.pricing.visaPrice)}</span>
                  </div>
                )}

                {data.businessSetup.type === "Mainland" && (
                  <div className="flex justify-between text-sm text-gray-600 italic">
                    <span>Government Fees:</span>
                    <span>As applicable</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
                  <span>Total Cost:</span>
                  <span className="text-[#d6a456]">
                    {formatCurrency(data.pricing.totalPrice)}
                  </span>
                </div>

                <div className="text-red-600 font-semibold sm:text-sm text-xs mt-2 border-t border-red-200 pt-2">
                  The above provided figure is an estimate cost only. For a more
                  accurate cost and possible promotional offers, please consult
                  directly with your dedicated Success Manager at G12.
                </div>
              </div>
            </div>

            {data.pricing.disclaimer && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 mb-4">
                <p className="font-semibold">Important Note:</p>
                <p>{data.pricing.disclaimer}</p>
              </div>
            )}

            {/* Timeline Section */}
            <div className="border p-4 rounded-md mb-6">
              <h4 className="font-semibold mb-2">Timeline:</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Initial Approval:</span> 3-5
                  working days
                </p>
                <p>
                  <span className="font-semibold">License Issuance:</span>{" "}
                  {data.businessSetup.type === "Freezone" ? "7-10" : "10-15"}{" "}
                  working days
                </p>
                {Number.parseInt(data.businessSetup.visas) > 0 && (
                  <p>
                    <span className="font-semibold">Visa Processing:</span>{" "}
                    15-20 working days per visa
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="border-t border-b py-4 my-4">
              <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                <li>
                  This is an AI-generated quotation, which serves to provide you
                  with pricing estimates. For an exact customised quotation,
                  please contact your dedicated Success Manager at G12.
                </li>
                <li>
                  50% advance payment is required to initiate the process.
                </li>
                <li>
                  Government fees are subject to change without prior notice.
                </li>
                <li>
                  Additional charges may apply for premium locations or special
                  approvals.
                </li>
                <li>
                  Processing times are estimates and may vary based on
                  government procedures.
                </li>
                <li>
                  Cancellation policy: 25% of the paid amount is non-refundable
                  if the process is cancelled after initiation.
                </li>
              </ul>
            </div>

            {/* Footer Section */}
            <div className="mt-6">
              <div className="flex justify-center al mb-2">
                <Logo size="small" href="https://g12.ae" customLogoUrl="Logo.png" />
              </div>
              <div className="text-sm text-center">
                <p>
                  Office 1906, Al Shafar Tower 1, Barsha Heights (Tecom), Dubai,
                  UAE
                </p>
                <div className="mt-2">
                  <Link
                    href="mailto:info@g12.ae"
                    className="text-[#d6a456] hover:underline mx-2"
                  >
                    info@g12.ae
                  </Link>
                  |
                  <Link
                    href="tel:+97145706451"
                    className="text-[#d6a456] hover:underline mx-2"
                  >
                    +971 4 570 6451
                  </Link>
                  |
                  <Link
                    href="https://www.g12.ae"
                    target="_blank"
                    className="text-[#d6a456] hover:underline mx-2"
                  >
                    www.g12.ae
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block border-t-2 border-[#d6a456] pt-2">
                <p className="text-sm text-[#131313]">
                  Thank you for choosing G12 for your business setup needs.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
