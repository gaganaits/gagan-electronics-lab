export interface FAQItem {
  question: string;
  answer: string;
  category: "Files & Uploads" | "Materials & Quality" | "Pricing & Quotation" | "Turnaround & Shipping";
}

export const faqsList: FAQItem[] = [
  {
    category: "Files & Uploads",
    question: "What 3D file formats do you accept for quotation?",
    answer: "We accept .STL files (both ASCII and Binary format) as our primary CAD format. You can also upload 2D technical drawings in .PDF or reference images in .JPG, .PNG, or .WEBP to specify tolerances, critical dimensions, or threading locations. Alternatively, you can provide a public or shared Google Drive link."
  },
  {
    category: "Files & Uploads",
    question: "What is the maximum file size I can upload through the website?",
    answer: "The direct upload limit is 50 MB for STL files, 20 MB for PDF documentation, and 10 MB for images (up to 10 files per quote request). For larger CAD models or multi-part assembly archives, you can paste a Google Drive link in the quotation form."
  },
  {
    category: "Files & Uploads",
    question: "How do you ensure my CAD design files remain confidential?",
    answer: "All submitted designs are treated as strictly proprietary business confidential data. Uploaded files are stored in private, isolated storage buckets with encrypted transport (HTTPS/TLS) and are accessible only to authorized lab technicians for quotation and printing. We never share, publish, or index customer designs."
  },
  {
    category: "Materials & Quality",
    question: "Which material should I choose if I am unsure?",
    answer: "For general physical prototypes, fit tests, and non-heated indoor housings, PLA+ is ideal and cost-effective. For functional components exposed to moisture, light impact, or mild outdoor sun, PETG is the workhorse standard. For high heat or automotive exposure, choose ABS or ASA. If you need structural metal-like stiffness, choose PA12-CF. You can also mention your requirements in the project notes, and our engineering team will suggest the most suitable material."
  },
  {
    category: "Materials & Quality",
    question: "Can you install brass threaded heat-set inserts in printed parts?",
    answer: "Yes. We offer precision thermal installation of brass inserts ranging from M2 to M8. This allows enclosures and brackets to be repeatedly fastened and disassembled with standard machine screws without stripping plastic threads."
  },
  {
    category: "Pricing & Quotation",
    question: "How is the quotation price calculated?",
    answer: "Our quotations are based on part volume (material mass in grams), estimated machine print time, selected technology (FDM vs. MSLA Resin vs. Composite), post-processing requirements (support removal, thermal inserts, vapor smoothing), and batch quantity. We provide transparent itemized quotations within 24 hours of file review."
  },
  {
    category: "Pricing & Quotation",
    question: "Is there a minimum order quantity (MOQ)?",
    answer: "No. We have no minimum order quantity. We produce single prototype parts just as readily as production runs of 50 to 200 units."
  },
  {
    category: "Turnaround & Shipping",
    question: "What is your typical turnaround time?",
    answer: "Standard functional prototype orders typically print and ship within 2 to 4 business days depending on part size, print hours, and queue volume. Expedited same-day or next-day turnaround is available for urgent engineering milestones upon review."
  }
];
