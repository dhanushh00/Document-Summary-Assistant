export interface SampleDoc {
  id: string;
  name: string;
  category: string;
  description: string;
  pageCount: number;
  wordCount: number;
  extractedText: string;
  previewSnippet: string;
}

export const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    id: 'sample-nda-agreement',
    name: 'Mutual_Non_Disclosure_Agreement_2025.pdf',
    category: 'Legal Contract',
    description: 'Bilateral confidentiality agreement between Apex Global Technologies and Horizon Ventures Corp.',
    pageCount: 3,
    wordCount: 780,
    previewSnippet: 'MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT\nThis Mutual Non-Disclosure Agreement ("Agreement") is made effective as of January 15, 2025...',
    extractedText: `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This Mutual Non-Disclosure and Confidentiality Agreement (the "Agreement") is entered into as of January 15, 2025 (the "Effective Date"), by and between:
Party A: Apex Global Technologies Inc., a Delaware corporation having its principal office at 450 Innovation Parkway, Suite 800, San Francisco, CA 94105 ("Discloser/Recipient"), and
Party B: Horizon Ventures Corp., a Cayman Islands corporation with registered address at Harbor Point Tower, Level 4, George Town, Cayman Islands ("Discloser/Recipient").

1. PURPOSE OF DISCLOSURE
The Parties wish to explore potential business synergies, strategic acquisitions, and joint technology development in the realm of decentralized cloud infrastructure (the "Authorized Purpose"). In connection with the Authorized Purpose, each party may disclose to the other confidential proprietary technical and financial information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" encompasses any non-public data, source code, neural network model weights, system architectures, customer lists, pricing strategies, product roadmaps, financial projections, and trade secrets disclosed either orally, visually, or in tangible document form marked "Confidential" or which reasonably should be understood to be confidential given the context of disclosure.

3. OBLIGATIONS OF RECEIVING PARTY
(a) The Receiving Party agrees to maintain the Confidential Information in strict confidence using at least the same degree of care it uses for its own sensitive data, but in no event less than a reasonable standard of care.
(b) Access shall be restricted strictly to employees, contractors, and legal advisors with a direct "need-to-know" who have signed confidentiality obligations at least as restrictive as this Agreement.
(c) The Receiving Party shall not reverse engineer, decompile, disassemble, or copy any software binaries or hardware prototypes provided by the Disclosing Party.

4. EXCLUSIONS FROM CONFIDENTIALITY
Confidentiality obligations do not apply to information that:
- Is or becomes publicly known through no breach of this Agreement by Receiving Party.
- Was already lawfully in the Receiving Party's possession prior to disclosure without restriction.
- Is independently developed by the Receiving Party without reference to or reliance upon Disclosing Party's Confidential Information.
- Is required to be disclosed by statutory subpoena or court order, provided prompt written notice is served to Disclosing Party to allow protective injunctive relief.

5. TERM AND SURVIVAL
This Agreement shall govern disclosures made within two (2) years from the Effective Date. The duty of confidentiality for disclosed Proprietary Materials shall survive for a period of five (5) years following termination, except for Trade Secrets and Source Code which shall remain confidential in perpetuity.

6. REMEDIES AND GOVERNING LAW
Any breach of this Agreement may result in irreparable harm for which monetary damages alone would be inadequate. Therefore, the Disclosing Party shall be entitled to seek equitable injunctive relief in addition to all other legal remedies. This Agreement shall be governed by the laws of the State of Delaware, without regard to conflicts of law principles.`
  },
  {
    id: 'sample-ai-research',
    name: 'Research_Paper_LLM_Compression_Quantum.pdf',
    category: 'Academic Research',
    description: 'Peer-reviewed research manuscript on sub-4-bit quantization and pruning for edge LLM deployment.',
    pageCount: 6,
    wordCount: 840,
    previewSnippet: 'ABSTRACT: Efficient Quantization and Sparse Attention Pruning for On-Device Large Language Model Inference...',
    extractedText: `RESEARCH MANUSCRIPT: IEEE TRANSACTIONS ON COMPUTATIONAL INTELLIGENCE (PREPRINT)

TITLE: High-Throughput Sub-4-Bit Quantization and Dynamic Sparse Attention for Edge-Native Foundation Models
AUTHORS: Dr. Elena Vance, Marcus Thorne, PhD, Sarah Al-Mansoor
INSTITUTION: Center for Autonomous Neural Architectures, Zurich / Stanford AI Lab

ABSTRACT
Modern Large Language Models (LLMs) exceeding 70 billion parameters exhibit remarkable zero-shot reasoning capabilities but present prohibitive memory bandwidth and energy constraints on consumer edge hardware. In this paper, we propose QUANTA-Prune, a hybrid quantization framework combining 2.85-bit non-uniform vector quantization with dynamic entropy-guided sparse attention. Across benchmark evaluations on LLaMA-3-70B and Mistral-Large, our method achieves a 78.4% reduction in peak VRAM consumption while retaining 98.6% of full-precision MMLU and GSM8k benchmark accuracy. Crucially, inference latency on Apple M3 Max and Snapdragon X Elite chips improved by 3.2x, operating at 41 tokens per second on a single unified memory SOC.

1. INTRODUCTION & MOTIVATION
Deploying state-of-the-art transformer architectures in low-power edge scenarios (drones, robotics, mobile telemetry) necessitates overcoming the memory wall. While 4-bit integer quantization (INT4) has become the de-facto standard, dropping below 3 bits typically induces severe perplexity degradation and hallucinations due to outlier activation sensitivity. 

2. METHODOLOGY
Our proposed approach introduces three distinct innovations:
1. Outlier-Preserved Polar Vector Quantization (OP-PVQ): We isolate top 0.05% activation outliers in FP16 precision while quantizing remaining weights into non-linear geometric polar clusters.
2. Dynamic KV-Cache Eviction: Attention heads with low Shannon entropy across layers 12-32 are pruned during generation steps, reclaiming 4.2 GB of context window cache.
3. Hardware-Aware SIMD Kernel: Custom ARM Neon and Metal Shading Language kernels designed to minimize L2 cache misses during dequantization.

3. EMPIRICAL RESULTS & BENCHMARKS
- Perplexity on WikiText-2: Baseline FP16 = 3.12 | Standard INT3 = 6.45 | QUANTA-Prune (2.85-bit) = 3.24.
- GSM8k Reasoning Accuracy: Retained 92.1% score compared to 93.4% FP16 baseline.
- Power Consumption: Average power draw dropped from 142W on desktop RTX 4090 to 28W on embedded edge silicon.

4. LIMITATIONS & FUTURE WORK
While inference throughput is vastly accelerated, fine-tuning quantized weights with Low-Rank Adaptation (LoRA) remains computationally expensive due to gradient dequantization overhead. Future iterations will explore direct 2-bit weight update formulas and neuromorphic spike-based matrix multiplications.`
  },
  {
    id: 'sample-business-pitch',
    name: 'Series_A_Pitch_Deck_CloudScale_AI.pdf',
    category: 'Business & Finance',
    description: 'Quarterly financial report and Series A investor deck for enterprise cloud optimization platform.',
    pageCount: 4,
    wordCount: 710,
    previewSnippet: 'CLOUDSCALE AI - SERIES A INVESTMENT MEMORANDUM\nEmpowering Fortune 500 Enterprises to Reduce Cloud & GPU Compute Waste by 65%...',
    extractedText: `INVESTMENT MEMORANDUM: CLOUDSCALE AI INC.
Series A Funding Round - Confidentially Prepared for Tier-1 Venture Capital Partners

EXECUTIVE SUMMARY
CloudScale AI is an autonomous cloud infrastructure optimization engine that prevents Kubernetes and GPU cluster waste in real-time. By leveraging predictive workload scheduling and kernel-level memory compaction, we reduce cloud hosting expenditures by an average of 58% for enterprise clients across AWS, Azure, and Google Cloud Platform.

KEY FINANCIAL & BUSINESS TRACTION (Q4 2024 - Q2 2025)
- Annual Recurring Revenue (ARR): Scaled from $820K in Jan 2024 to $4.6M in June 2025 (460% YoY growth).
- Net Revenue Retention (NRR): 142% net expansion across existing tier-1 enterprise cohort.
- Customer Base: 38 enterprise contracts including Stripe, Shopify, Datadog ecosystem partners, and 3 global banks.
- Gross Margin: 86.4% SaaS software margin with zero manual professional service overhead.
- Customer Acquisition Cost (CAC) Payback: 6.2 months against an industry average of 14 months.

MARKET OPPORTUNITY & PROBLEM
Global enterprise cloud expenditure is projected to surpass $680 Billion by 2026. However, industry audits indicate that over 32% of enterprise cloud compute and 54% of reserved GPU memory remains idle due to static over-provisioning and fear of downtime. CloudScale AI eliminates this friction without requiring application code changes.

THE ASK & USE OF PROCEEDS
We are raising $15,000,000 in Series A Preferred Equity at a pre-money valuation of $65,000,000.
Capital Allocation Strategy:
- 50% Engineering & AI Research: Expanding our reinforcement learning scheduling models for multi-region H100/B200 clusters.
- 35% Go-To-Market & Enterprise Sales: Hiring 8 Account Executives and expanding enterprise partner channels in EMEA & APAC.
- 15% Operational Runway, Security Certifications (SOC-2 Type II, FedRAMP High), and General Corporate Reserves.

RISK MITIGATION
- Hyperscaler Competition: We operate across multi-cloud topologies where native tools (AWS Compute Optimizer) cannot provide cross-cloud arbitrage.
- Platform Lock-in: Zero-downtime agent deployment via single Helm chart in < 5 minutes ensures minimal friction.`
  },
  {
    id: 'sample-scanned-medical',
    name: 'Scanned_Clinical_Trial_Summary_OCR.png',
    category: 'OCR Scanned Document',
    description: 'Scanned image document simulation of medical laboratory results with diagnostic markers.',
    pageCount: 1,
    wordCount: 520,
    previewSnippet: '[SCANNED CLINICAL REPORT / OCR EXTRACTION]\nPATIENT ID: #MED-88492-X | CLINICAL PROTOCOL: PHASE III BIO-THERAPEUTIC TRIAL...',
    extractedText: `[SCANNED MEDICAL & CLINICAL TRIAL LAB REPORT - OCR EXTRACTED DATA]

PATIENT PROTOCOL REF: #MED-88492-X
CLINICAL TRIAL STUDY: CARDIO-VASCULAR REGEN-7 COMPOUND EVALUATION
INVESTIGATOR: Dr. Arthur Pendelton, MD, FACS | Department of Cardiology, St. Jude Academic Medical Center
DATE OF OBSERVATION: FEBRUARY 12, 2025

PATIENT METRICS & BASELINE VITALS:
- Patient Age: 58 | Gender: Male | Weight: 84.2 kg | Height: 178 cm
- Resting Blood Pressure: 128/82 mmHg (Pre-treatment baseline: 154/98 mmHg)
- Resting Heart Rate: 68 bpm (Sinus rhythm, normal ECG intervals)
- Left Ventricular Ejection Fraction (LVEF): Improved from 41% to 54% over 12-week dosing cycle.

LABORATORY BLOOD SERUM BIOMARKERS:
1. High-Sensitivity C-Reactive Protein (hs-CRP): 1.1 mg/L (Normal range: < 2.0 mg/L) - Decreased by 64% indicating marked systemic inflammation resolution.
2. N-Terminal Pro-B-type Natriuretic Peptide (NT-proBNP): 142 pg/mL (Normal: < 300 pg/mL) - Normalized from severe baseline elevation (920 pg/mL).
3. Fasting Serum Glucose: 94 mg/dL | HbA1c: 5.4% (Non-diabetic glycemic profile maintained).
4. Liver Panel (ALT/AST): ALT 22 U/L, AST 19 U/L - Zero hepatotoxic anomalies detected during trial regimen.
5. Renal Function (eGFR): 96 mL/min/1.73m² (Normal renal filtration rate).

CLINICAL IMPRESSION & RECOMMENDATIONS:
Patient exhibits remarkable cardiovascular therapeutic response with zero adverse drug interactions. Myocardial compliance and contractile efficiency showed significant recovery.
- Recommendation 1: Transition patient to low-maintenance dosage (25mg QD).
- Recommendation 2: Schedule follow-up Echocardiogram and 24-hour Holter monitor in 60 days.
- Recommendation 3: Discontinue secondary beta-blocker adjunct therapy upon cardiologist sign-off.`
  }
];
