/**
 * Government Schemes Catalog
 * Static data for Indian agricultural schemes
 */

export const schemesData = [
    // ============ CENTRAL SCHEMES ============
    {
        schemeId: "pm-kisan",
        name: "PM-KISAN Samman Nidhi",
        level: "central",
        states: ["ALL"],
        category: "income",
        description: "Direct income support of ₹6,000 per year to farmer families",
        officialUrl: "https://pmkisan.gov.in",
        documentUrl: "https://pmkisan.gov.in/Guidelines.pdf"
    },
    {
        schemeId: "pmfby",
        name: "Pradhan Mantri Fasal Bima Yojana",
        level: "central",
        states: ["ALL"],
        category: "insurance",
        description: "Comprehensive crop insurance scheme for farmers",
        officialUrl: "https://pmfby.gov.in",
        documentUrl: "https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf"
    },
    {
        schemeId: "soil-health-card",
        name: "Soil Health Card Scheme",
        level: "central",
        states: ["ALL"],
        category: "soil",
        description: "Free soil testing and recommendations for balanced fertilizer use",
        officialUrl: "https://soilhealth.dac.gov.in",
        documentUrl: "https://soilhealth.dac.gov.in/Content/GUIDELINES.pdf"
    },
    {
        schemeId: "kisan-credit-card",
        name: "Kisan Credit Card (KCC)",
        level: "central",
        states: ["ALL"],
        category: "credit",
        description: "Subsidized credit facility for farmers' agricultural needs",
        officialUrl: "https://www.nabard.org/content.aspx?id=591",
        documentUrl: "https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=10610"
    },
    {
        schemeId: "pm-ksy",
        name: "PM Krishi Sinchai Yojana",
        level: "central",
        states: ["ALL"],
        category: "irrigation",
        description: "Water efficiency and micro-irrigation support for farmers",
        officialUrl: "https://pmksy.gov.in",
        documentUrl: "https://pmksy.gov.in/Guidelines.aspx"
    },
    {
        schemeId: "pm-kusum",
        name: "PM-KUSUM Solar Pump Scheme",
        level: "central",
        states: ["ALL"],
        category: "energy",
        description: "Subsidized solar pumps and grid-connected solar power for farmers",
        officialUrl: "https://pmkusum.mnre.gov.in",
        documentUrl: "https://pmkusum.mnre.gov.in/landing/guidelines"
    },
    {
        schemeId: "e-nam",
        name: "e-NAM National Agriculture Market",
        level: "central",
        states: ["ALL"],
        category: "market",
        description: "Online trading platform connecting farmers to national markets",
        officialUrl: "https://www.enam.gov.in",
        documentUrl: "https://www.enam.gov.in/web/docs/eNAM-Guidelines.pdf"
    },
    {
        schemeId: "paramparagat-organic",
        name: "Paramparagat Krishi Vikas Yojana",
        level: "central",
        states: ["ALL"],
        category: "soil",
        description: "Organic farming promotion with certification support",
        officialUrl: "https://pgsindia-ncof.gov.in/pkvy/Index.aspx",
        documentUrl: "https://agricoop.gov.in/en/PKVY"
    },

    // ============ STATE SCHEMES - PUNJAB ============
    {
        schemeId: "punjab-smart-kisan",
        name: "Punjab Smart Kisan Yojana",
        level: "state",
        states: ["Punjab"],
        category: "equipment",
        description: "Digital farming tools and smart agriculture equipment subsidies",
        officialUrl: "https://agri.punjab.gov.in",
        documentUrl: "https://agri.punjab.gov.in/schemes"
    },
    {
        schemeId: "punjab-farm-mechanization",
        name: "Punjab Farm Mechanization Subsidy",
        level: "state",
        states: ["Punjab"],
        category: "equipment",
        description: "40-50% subsidy on tractors, harvesters, and farm machinery",
        officialUrl: "https://agri.punjab.gov.in",
        documentUrl: "https://agri.punjab.gov.in/schemes"
    },
    {
        schemeId: "mera-pani-meri-virasat",
        name: "Mera Pani Meri Virasat",
        level: "state",
        states: ["Punjab", "Haryana"],
        category: "water",
        description: "₹7,000/acre incentive for shifting from paddy to water-efficient crops",
        officialUrl: "https://agri.punjab.gov.in/mpmv",
        documentUrl: "https://agri.punjab.gov.in/mpmv/guidelines"
    },

    // ============ STATE SCHEMES - MAHARASHTRA ============
    {
        schemeId: "maharashtra-jalyukt-shivar",
        name: "Jalyukt Shivar Abhiyan",
        level: "state",
        states: ["Maharashtra"],
        category: "water",
        description: "Drought-proofing through water conservation structures",
        officialUrl: "https://irrigation.maharashtra.gov.in",
        documentUrl: "https://irrigation.maharashtra.gov.in/en/jalyukt-shivar"
    },
    {
        schemeId: "maharashtra-crop-loan-waiver",
        name: "Maharashtra Farm Loan Waiver",
        level: "state",
        states: ["Maharashtra"],
        category: "credit",
        description: "Debt relief program for eligible farmers",
        officialUrl: "https://agri.maharashtra.gov.in",
        documentUrl: "https://agri.maharashtra.gov.in/schemes"
    },

    // ============ STATE SCHEMES - UTTAR PRADESH ============
    {
        schemeId: "up-kisan-samman-nidhi",
        name: "UP Kisan Samman Nidhi (State Top-up)",
        level: "state",
        states: ["Uttar Pradesh"],
        category: "income",
        description: "Additional ₹6,000 annual support in addition to PM-KISAN",
        officialUrl: "https://upagriculture.com",
        documentUrl: "https://upagriculture.com/schemes"
    },
    {
        schemeId: "up-solar-pump",
        name: "UP Mukhyamantri Solar Pump Yojana",
        level: "state",
        states: ["Uttar Pradesh"],
        category: "energy",
        description: "70% subsidy on solar pumps for irrigation",
        officialUrl: "https://upneda.org.in",
        documentUrl: "https://upneda.org.in/solar-pump"
    }
];

// Categories mapping
export const schemeCategories = {
    income: { name: "Income Support", emoji: "💰" },
    insurance: { name: "Crop Insurance", emoji: "🛡️" },
    soil: { name: "Soil Health", emoji: "🌱" },
    credit: { name: "Credit & Loans", emoji: "🏦" },
    irrigation: { name: "Irrigation", emoji: "💧" },
    energy: { name: "Solar & Energy", emoji: "☀️" },
    market: { name: "Market Linkage", emoji: "📈" },
    equipment: { name: "Equipment Subsidy", emoji: "🚜" },
    water: { name: "Water Conservation", emoji: "💦" }
};

// States list for filtering
export const availableStates = [
    "Punjab",
    "Haryana",
    "Maharashtra",
    "Uttar Pradesh",
    "Madhya Pradesh",
    "Rajasthan",
    "Gujarat",
    "Karnataka",
    "Tamil Nadu",
    "Andhra Pradesh",
    "Telangana",
    "Bihar",
    "West Bengal",
    "Odisha",
    "Chhattisgarh"
];

export default schemesData;
