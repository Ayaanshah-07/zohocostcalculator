export function generateQuotation(formData: any) {
  // Calculate pricing based on the business setup type and other factors
  let basePrice = 0
  let visaPrice = 0
  let disclaimer = ""

  // Mainland pricing
  if (formData.type === "Mainland") {
    basePrice = 13000

    if (formData.officeSpace === "Yes") {
      disclaimer = "The cost of the license is dependent on the rental fee. The price shown is a starting price."
    } else if (formData.officeSpace === "No") {
      disclaimer = "You might need a virtual rental contract. The price shown is a starting price."
    }

    // Calculate visa costs for Mainland
    if (Number.parseInt(formData.visas) > 0) {
      visaPrice = Number.parseInt(formData.visas) * 6500
    }
  }
  // Freezone pricing
  else if (formData.type === "Freezone") {
    // Dubai Freezone
    if (formData.emirates === "Dubai") {
      basePrice = 15000
    }
    // Other Emirates Freezone
    else {
      basePrice = 6000
    }

    // Calculate visa costs for Freezone
    if (Number.parseInt(formData.visas) > 0) {
      visaPrice = Number.parseInt(formData.visas) * 6500
    }
  }

  // Calculate total price
  const totalPrice = basePrice + visaPrice

  // Generate a unique quotation number
  const quotationNumber = generateQuotationNumber()

  // Get current date in DD/MM/YYYY format
  const currentDate = new Date().toLocaleDateString("en-GB")

  return {
    clientInfo: {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      nationality: formData.nationality,
    },
    businessSetup: {
      type: formData.type,
      emirates: formData.emirates,
      businessActivities: formData.businessActivities,
      officeSpace: formData.officeSpace,
      shareholders: formData.shareholders,
      visas: formData.visas,
    },
    pricing: {
      basePrice,
      visaPrice,
      totalPrice,
      disclaimer,
    },
    date: currentDate,
    quotationNumber,
  }
}

function generateQuotationNumber() {
  const prefix = "G12"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}-${timestamp}-${random}`
}
