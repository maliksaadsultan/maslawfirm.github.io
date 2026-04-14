#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re
import subprocess
from textwrap import wrap
from xml.sax.saxutils import escape


ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "infographics"

IGNORED_ASSETS = {
    "/assets/shared/maslawfirm-logo.png",
    "/assets/shared/site-mark.png",
    "/assets/shared/site-logo.png",
    "/assets/shared/site-favicon.png",
    "/assets/pages/contact/MAS_LAW_FIRM_MAP.png",
}

PROFILES = {
    "firm": {
        "title": "MAS Law Firm",
        "eyebrow": "Business and Tax Advisory",
        "summary": "Clearer visuals for registrations, filings, and legal support across the site.",
        "palette": ("#0d2742", "#144f66", "#f59e0b", "#e6f6ff"),
        "chips": ["Tax", "Legal", "Business Setup"],
        "overview": [("Registrations", "Entity setup and filing routes."), ("Compliance", "Returns, notices, and follow-through."), ("Protection", "Contracts and IP support.")],
        "benefits": [("Confidence", "A cleaner path from query to filing."), ("Clarity", "Key milestones surfaced visually."), ("Consistency", "One premium style across service pages.")],
        "process": [("Review Need", "Understand the matter and filing route."), ("Prepare Pack", "Collect forms, IDs, and evidence."), ("Deliver", "Submit, monitor, and advise.")],
        "documents": [("Identity", "CNIC and contact details."), ("Records", "Business and tax background."), ("Authority", "Forms, declarations, and approvals.")],
    },
    "company": {
        "title": "Company Registration",
        "eyebrow": "SECP Incorporation",
        "summary": "Private limited, growth-ready setup visuals with clearer steps and eligibility.",
        "palette": ("#112c59", "#2563eb", "#22c55e", "#dbeafe"),
        "chips": ["SECP", "Directors", "Shareholding"],
        "overview": [("Choose Structure", "Match the entity to ownership and growth plans."), ("Reserve Name", "Secure availability before incorporation."), ("Register Company", "Complete the incorporation pack and tax profile.")],
        "benefits": [("Limited Liability", "Separate company risk from personal assets."), ("Funding Ready", "A stronger base for investors and scale."), ("Credibility", "A more formal business presence.")],
        "process": [("Create Login", "Set up the SECP user profile."), ("Reserve Name", "Obtain availability approval."), ("File Pack", "Submit forms, MOA, AOA, and fee.")],
        "documents": [("CNIC Copies", "Details for proposed directors."), ("Name Letter", "Approved name reservation."), ("Formation Docs", "Form II, memorandum, and articles.")],
    },
    "trademark": {
        "title": "Trademark Registration",
        "eyebrow": "Brand Protection",
        "summary": "Sharper filing visuals for mark search, class selection, and protection scope.",
        "palette": ("#40115c", "#8b5cf6", "#ec4899", "#f3e8ff"),
        "chips": ["Word Mark", "Classes", "Protection"],
        "overview": [("Search First", "Reduce conflict before filing."), ("Pick Class", "Cover the correct goods or services."), ("Protect Brand", "Support long-term ownership and enforcement.")],
        "benefits": [("Ownership", "Build a formal claim over the mark."), ("Trust", "Create a stronger market identity."), ("Enforcement", "Support action against copycats.")],
        "process": [("Review Mark", "Assess the name or logo."), ("Select Class", "Define the filing scope."), ("Submit and Track", "File, publish, and respond if needed.")],
        "documents": [("Applicant", "Owner information and authority."), ("Mark File", "Word mark or logo artwork."), ("Class Notes", "Goods and services details.")],
    },
    "income_tax": {
        "title": "Income Tax Filing",
        "eyebrow": "Annual Return Compliance",
        "summary": "Cleaner return visuals focused on filer status, records, and submission readiness.",
        "palette": ("#0b3b22", "#16a34a", "#84cc16", "#dcfce7"),
        "chips": ["Income", "Assets", "Return"],
        "overview": [("Gather Records", "Pull together income and asset details."), ("Prepare Return", "Translate records into filing entries."), ("Stay Filer", "Maintain compliance year after year.")],
        "benefits": [("Filer Status", "Avoid common non-filer disadvantages."), ("Penalty Control", "Reduce exposure from late compliance."), ("Readiness", "Keep records in stronger order.")],
        "process": [("Review Profile", "Check taxpayer information and prior status."), ("Compile Data", "Income, assets, and deductions."), ("Submit Return", "File and retain proof.")],
        "documents": [("Income Proof", "Salary, business, rent, or profit records."), ("Bank Data", "Statements and withholding details."), ("Asset Notes", "Property, vehicle, and investment data.")],
    },
    "appeals": {
        "title": "Tax Appeals and Litigation",
        "eyebrow": "Dispute Resolution",
        "summary": "A stronger editorial system for notices, objections, hearings, and escalation.",
        "palette": ("#501113", "#b91c1c", "#fb923c", "#fee2e2"),
        "chips": ["Notice", "Reply", "Hearing"],
        "overview": [("Read the Issue", "Identify the tax position and deadline."), ("Build the Reply", "Support objections with facts and records."), ("Represent", "Manage hearings and appellate steps.")],
        "benefits": [("Case Clarity", "Focus on the defensible points."), ("Deadline Control", "Reduce missed procedural steps."), ("Evidence Flow", "Keep documents tied to each issue.")],
        "process": [("Assess Exposure", "Review demand, tax year, and penalties."), ("Draft Response", "Prepare objection or reply."), ("Escalate", "Proceed to hearing or appeal if needed.")],
        "documents": [("Notice Pack", "Orders, notices, and department letters."), ("Financial Records", "Books, invoices, and statements."), ("Representation", "Authority letters and replies.")],
    },
    "pra": {
        "title": "Punjab Revenue Authority",
        "eyebrow": "Services Tax Workflow",
        "summary": "Enrollment, registration, and return-filing visuals tailored for service providers.",
        "palette": ("#0f2a44", "#0ea5e9", "#14b8a6", "#e0f2fe"),
        "chips": ["Enroll", "Register", "Return"],
        "overview": [("Create Access", "Open the PRA e-services profile."), ("Register Service", "Link the taxable service activity."), ("File Returns", "Stay current with reporting and payment.")],
        "benefits": [("Registration Clarity", "Know the service-tax route."), ("Regularity", "Support a cleaner filing cycle."), ("Operational Order", "Keep business and portal data aligned.")],
        "process": [("Enroll", "Set up account access."), ("Register", "Enter business and service details."), ("File and Reconcile", "Report, review, and pay on time.")],
        "documents": [("Tax IDs", "CNIC, NTN, and business details."), ("Service Scope", "Description of taxable services."), ("Portal Access", "Login credentials and filing support.")],
    },
    "sales_tax": {
        "title": "Sales Tax Registration",
        "eyebrow": "FBR Compliance",
        "summary": "Modernized registration visuals for STRN setup, invoices, and return cycles.",
        "palette": ("#0a3241", "#0891b2", "#f97316", "#cffafe"),
        "chips": ["STRN", "Invoices", "Returns"],
        "overview": [("Register First", "Set up the federal sales tax profile."), ("Issue Correctly", "Keep invoice data compliant."), ("File Returns", "Report activity on schedule.")],
        "benefits": [("Formal Setup", "Operate with a recognized tax profile."), ("Record Control", "Improve transaction discipline."), ("Compliance Rhythm", "Support periodic reporting.")],
        "process": [("Apply", "Provide taxpayer and business data."), ("Verify", "Complete checks and profile review."), ("File Cycle", "Submit returns and reconcile.")],
        "documents": [("Business Proof", "Ownership, address, and activity data."), ("Tax References", "Core registration identifiers."), ("Sales Records", "Invoices and transaction summaries.")],
    },
    "weboc": {
        "title": "WEBOC Registration",
        "eyebrow": "Import and Export Access",
        "summary": "Premium customs visuals focused on onboarding, verification, and platform access.",
        "palette": ("#0a3047", "#0284c7", "#f59e0b", "#e0f2fe"),
        "chips": ["Trader", "Clearance", "Tracking"],
        "overview": [("Create User", "Begin the trader onboarding route."), ("Verify Identity", "Complete appearance and profile checks."), ("Activate Access", "Receive credentials for customs filing.")],
        "benefits": [("Trade Access", "Open the path to import and export activity."), ("Faster Clearance", "Support digital customs processing."), ("Visibility", "Improve filing and shipment tracking.")],
        "process": [("Apply", "Submit the registration request."), ("Verify", "Complete identity and profile review."), ("Start Filing", "Receive access and proceed digitally.")],
        "documents": [("CNIC", "Identity and applicant details."), ("Business Proof", "Entity and authority documents."), ("Application Form", "The user registration pack.")],
    },
    "copyright": {
        "title": "Copyright Registration",
        "eyebrow": "Creative Rights",
        "summary": "More polished creative-rights visuals for protected work, filing, and ownership.",
        "palette": ("#1f2937", "#4f46e5", "#f43f5e", "#e0e7ff"),
        "chips": ["Works", "Claim", "Ownership"],
        "overview": [("Identify Work", "Classify the content to be protected."), ("File Claim", "Prepare ownership and work details."), ("Secure Rights", "Support use, licensing, and disputes.")],
        "benefits": [("Ownership Signal", "Make authorship more explicit."), ("Licensing Support", "Strengthen use and permission control."), ("Evidence", "Keep a clearer rights trail.")],
        "process": [("Classify", "Confirm the type of work."), ("Submit", "File the application and sample."), ("Track", "Monitor outcomes and responses.")],
        "documents": [("Owner Data", "Applicant identity and address."), ("Work Sample", "Representative copy or description."), ("Declarations", "Authorization and supporting statements.")],
    },
    "contracts": {
        "title": "Legal Agreements",
        "eyebrow": "Contract Drafting",
        "summary": "A sharper document-driven visual system for terms, risk, and signoff flow.",
        "palette": ("#312924", "#57534e", "#f59e0b", "#fef3c7"),
        "chips": ["Scope", "Clauses", "Signoff"],
        "overview": [("Define Terms", "Set the commercial and legal baseline."), ("Control Risk", "Clarify payment, liability, and exit."), ("Finalize", "Review, negotiate, and execute.")],
        "benefits": [("Alignment", "Make obligations easier to understand."), ("Risk Reduction", "Close common contract gaps."), ("Record Strength", "Keep commercial terms documented.")],
        "process": [("Collect Inputs", "Understand the deal structure."), ("Draft Clauses", "Turn terms into enforceable language."), ("Approve and Sign", "Refine and execute the agreement.")],
        "documents": [("Parties", "Names, addresses, and roles."), ("Commercial Terms", "Pricing, timing, and deliverables."), ("Schedules", "Attachments and annexures.")],
    },
    "ntn": {
        "title": "NTN Registration",
        "eyebrow": "Tax Identity Setup",
        "summary": "Cleaner step-led visuals for taxpayer profile creation and activation.",
        "palette": ("#15377b", "#2563eb", "#10b981", "#dbeafe"),
        "chips": ["Profile", "Verify", "Activate"],
        "overview": [("Create Profile", "Start the tax registration route."), ("Verify Details", "Link identity and contact information."), ("Activate NTN", "Prepare for future returns and filings.")],
        "benefits": [("Tax Identity", "Enter the system formally."), ("Compliance Access", "Open the route to filing."), ("Utility", "Support other registrations and accounts.")],
        "process": [("Start Online", "Open the taxpayer registration flow."), ("Enter Details", "Provide identity, address, and contact data."), ("Confirm", "Finish verification and activation.")],
        "documents": [("CNIC", "Identity and contact details."), ("Address Proof", "Residence or business location data."), ("Business Data", "If registering for a firm or company.")],
    },
    "llp": {
        "title": "LLP Registration",
        "eyebrow": "Limited Liability Partnership",
        "summary": "Refined partner-structure visuals for agreement, filings, and launch readiness.",
        "palette": ("#164e63", "#0891b2", "#f59e0b", "#cffafe"),
        "chips": ["Partners", "Agreement", "Register"],
        "overview": [("Define Partners", "Clarify control, profit, and roles."), ("Draft Agreement", "Capture governance and operating rules."), ("Register Entity", "File and activate the LLP.")],
        "benefits": [("Flexibility", "Blend partnership control with limited liability."), ("Clarity", "Set expectations between partners."), ("Professional Presence", "Use a more formal structure.")],
        "process": [("Plan", "Decide governance and contributions."), ("Prepare", "Build the agreement and file pack."), ("Register", "Submit and begin operations.")],
        "documents": [("Partner IDs", "Identity and address data."), ("Office Proof", "Business address evidence."), ("LLP Agreement", "Core governing document.")],
    },
    "partnership": {
        "title": "Partnership Registration",
        "eyebrow": "Firm Formation",
        "summary": "Partnership deed, rights, and filing visuals redesigned with a stronger editorial tone.",
        "palette": ("#3f3f46", "#52525b", "#22c55e", "#e4e4e7"),
        "chips": ["Partners", "Deed", "Registrar"],
        "overview": [("Agree Terms", "Define ownership and roles."), ("Prepare Deed", "Set profit share and authority."), ("Register Firm", "Complete the filing route.")],
        "benefits": [("Simple Setup", "A direct option for co-founders."), ("Role Clarity", "Make commercial responsibilities explicit."), ("Legal Support", "Document terms for disputes and continuity.")],
        "process": [("Set Terms", "Agree the commercial arrangement."), ("Draft Deed", "Prepare the partnership instrument."), ("File", "Register with the relevant office.")],
        "documents": [("Partner Data", "CNIC and contact details."), ("Business Name", "Firm identity and purpose."), ("Deed Pack", "Agreement and supporting papers.")],
    },
    "sole": {
        "title": "Sole Proprietorship",
        "eyebrow": "Single Owner Business",
        "summary": "Owner-led setup visuals with a lighter, cleaner compliance story.",
        "palette": ("#365314", "#65a30d", "#f59e0b", "#ecfccb"),
        "chips": ["Owner", "NTN", "Banking"],
        "overview": [("Start Quickly", "Choose the simplest business path."), ("Register Identity", "Build the tax profile around the owner."), ("Operate", "Run the business with compliant records.")],
        "benefits": [("Low Complexity", "Minimal setup friction."), ("Direct Control", "One owner manages all decisions."), ("Fast Launch", "Begin trading with fewer steps.")],
        "process": [("Create Profile", "Set up the owner tax identity."), ("Prepare Proof", "Collect business and address records."), ("Begin Trading", "Use the profile in day-to-day operations.")],
        "documents": [("Owner Details", "CNIC and contact information."), ("Business Proof", "Address, letterhead, or shop data."), ("Supporting Records", "Banking and activity details.")],
    },
    "manufacturing": {
        "title": "Manufacturing Company",
        "eyebrow": "Industrial Setup",
        "summary": "More premium registration visuals for production businesses and operational readiness.",
        "palette": ("#431407", "#c2410c", "#fbbf24", "#ffedd5"),
        "chips": ["Factory", "Licenses", "Operations"],
        "overview": [("Set Structure", "Choose the entity for the plant or unit."), ("Prepare Site", "Align operations with location and records."), ("Register", "Complete corporate and tax setup.")],
        "benefits": [("Scalable Base", "Start with a structure built for operations."), ("Regulatory Order", "Surface approval needs earlier."), ("Commercial Confidence", "Look stronger to suppliers and buyers.")],
        "process": [("Plan", "Confirm industrial activity and ownership."), ("Document", "Compile site and corporate records."), ("Register", "Move through filings and activation.")],
        "documents": [("Factory Details", "Site and operational information."), ("Promoters", "Owner and director details."), ("Core Filings", "Company and tax applications.")],
    },
    "real_estate": {
        "title": "Real Estate and Construction",
        "eyebrow": "Project Entity Setup",
        "summary": "Sharper project-setup visuals for development, compliance, and baseline requirements.",
        "palette": ("#422006", "#ca8a04", "#0ea5e9", "#fef3c7"),
        "chips": ["Projects", "Compliance", "Execution"],
        "overview": [("Choose Model", "Align structure with project risk."), ("Prepare Records", "Build the entity and project pack."), ("Register", "Proceed with tax and sector setup.")],
        "benefits": [("Structured Delivery", "Keep development activity better organized."), ("Professional Presence", "Strengthen the developer profile."), ("Requirement Visibility", "Surface minimum conditions early.")],
        "process": [("Assess", "Choose builder, developer, or contractor model."), ("Prepare", "Collect project and entity data."), ("Launch", "Register and start operations.")],
        "documents": [("Project Data", "Site, scope, and ownership."), ("Entity Records", "Registration and taxpayer details."), ("Compliance Pack", "Approvals and supporting papers.")],
    },
    "it_company": {
        "title": "IT Company Registration",
        "eyebrow": "PSEB and Digital Services",
        "summary": "Sector-specific visuals for software, call centers, incentives, and export positioning.",
        "palette": ("#111827", "#2563eb", "#06b6d4", "#dbeafe"),
        "chips": ["PSEB", "Exports", "Incentives"],
        "overview": [("Define Service", "Clarify software or call-center activity."), ("Register Entity", "Prepare core company and tax records."), ("Position Sectorally", "Strengthen the PSEB-ready profile.")],
        "benefits": [("Credibility", "Present a stronger digital-services profile."), ("Growth Story", "Support investment and export positioning."), ("Alignment", "Tie company setup to sector goals.")],
        "process": [("Structure", "Choose the right business vehicle."), ("Prepare Pack", "Compile entity and service records."), ("Register", "Proceed with company and sector positioning.")],
        "documents": [("Entity Data", "Company and taxpayer identifiers."), ("Service Profile", "Nature of software or BPO work."), ("Support Docs", "Ownership and operational proof.")],
    },
    "chamber": {
        "title": "Chamber Membership",
        "eyebrow": "Business Network Access",
        "summary": "Requirements and business-network value presented with a more premium chamber look.",
        "palette": ("#1f2937", "#0f766e", "#eab308", "#ccfbf1"),
        "chips": ["Membership", "Verification", "Visibility"],
        "overview": [("Check Eligibility", "Confirm business standing and route."), ("Prepare Application", "Assemble chamber documents and fees."), ("Activate Membership", "Access network and institutional support.")],
        "benefits": [("Visibility", "Strengthen local business presence."), ("Network", "Open more chamber opportunities."), ("Support", "Build an institutional business connection.")],
        "process": [("Review Criteria", "Choose the relevant chamber path."), ("Submit Pack", "File the application and records."), ("Receive Membership", "Start using chamber services.")],
        "documents": [("Business Proof", "Entity and tax records."), ("Applicant Data", "Owner or authorized person details."), ("Forms", "Membership application and fee support.")],
    },
    "audit": {
        "title": "Tax Notice and Audit",
        "eyebrow": "Response Management",
        "summary": "Stronger notice-response visuals focused on deadlines, records, and taxpayer action.",
        "palette": ("#450a0a", "#dc2626", "#f59e0b", "#fee2e2"),
        "chips": ["Notice", "Records", "Reply"],
        "overview": [("Read the Notice", "Understand the year, issue, and demand."), ("Organize Records", "Align books, invoices, and statements."), ("Respond", "Meet deadlines with a supported explanation.")],
        "benefits": [("Structure", "Reduce chaos under time pressure."), ("Evidence", "Tie records to the exact notice issue."), ("Risk Control", "Improve procedural discipline.")],
        "process": [("Review", "Assess the scope and implication."), ("Draft", "Prepare the written response."), ("Follow Up", "Attend and close the matter.")],
        "documents": [("Notice Copy", "Department communication and orders."), ("Financial Records", "Statements, ledgers, and invoices."), ("Support File", "Reconciliations and correspondence.")],
    },
    "feature_talk": {
        "title": "Business Discovery",
        "eyebrow": "Client Conversations",
        "summary": "A premium visual for understanding client needs before deciding the right filing route.",
        "palette": ("#0f172a", "#4f46e5", "#14b8a6", "#e0e7ff"),
        "chips": ["Listen", "Map", "Advise"],
        "overview": [("Discuss", "Clarify the business issue."), ("Map Needs", "Match the right service path."), ("Plan Action", "Agree the next practical step.")],
        "benefits": [("Clarity", "Identify the real issue sooner."), ("Fit", "Match needs to the right service."), ("Momentum", "Move quickly into execution.")],
        "process": [("Listen", "Capture context."), ("Diagnose", "Separate legal and tax needs."), ("Recommend", "Outline the next step.")],
        "documents": [("Context", "Current goals and constraints."), ("Facts", "What is missing today."), ("Action", "Immediate next steps.")],
    },
    "feature_discuss": {
        "title": "Ongoing Discussion",
        "eyebrow": "Advisory Collaboration",
        "summary": "A cleaner recurring-check-in visual for priorities, updates, and steady progress.",
        "palette": ("#134e4a", "#0f766e", "#22c55e", "#ccfbf1"),
        "chips": ["Review", "Align", "Advance"],
        "overview": [("Review Progress", "Track open issues and outcomes."), ("Align Priorities", "Refocus on the current need."), ("Advance Work", "Keep filings moving.")],
        "benefits": [("Continuity", "Reduce drop-off between milestones."), ("Context", "Advice stays linked to the latest facts."), ("Progress", "Create a steadier delivery rhythm.")],
        "process": [("Check In", "Update open matters."), ("Refine", "Adjust next steps."), ("Proceed", "Continue execution.")],
        "documents": [("Open Items", "Pending actions and status."), ("Updates", "New facts and obligations."), ("Next Steps", "Who does what next.")],
    },
    "feature_solve": {
        "title": "Problem Solving",
        "eyebrow": "Execution Path",
        "summary": "A more polished closing-stage visual for turning advice into completed outcomes.",
        "palette": ("#052e16", "#15803d", "#eab308", "#dcfce7"),
        "chips": ["Resolve", "File", "Complete"],
        "overview": [("Structure Work", "Translate advice into tasks."), ("Execute", "Complete filings and documentation."), ("Confirm", "Check the result and next risk.")],
        "benefits": [("Action", "Advice turns into concrete delivery."), ("Ownership", "Tasks and timing stay visible."), ("Outcome", "Keep business goals in view.")],
        "process": [("Prioritize", "Select the highest-value step."), ("Implement", "Handle forms and follow-through."), ("Close", "Confirm resolution.")],
        "documents": [("Tasks", "Action list and owners."), ("Filings", "Submissions and proofs."), ("Outcome", "Completion or next milestone.")],
    },
}


def run_git_show(path: pathlib.Path) -> str | None:
    rel = path.relative_to(ROOT).as_posix()
    result = subprocess.run(
        ["git", "show", f"HEAD:{rel}"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    return result.stdout if result.returncode == 0 else None


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def extract_asset_refs(html_text: str) -> list[str]:
    refs: list[str] = []
    patterns = (
        r'''src=["'](/assets/(?:shared|pages)/[^"']+\.(?:png|jpg|jpeg|svg|webp))["']''',
        r'''content=["'](/assets/(?:shared|pages)/[^"']+\.(?:png|jpg|jpeg|svg|webp))["']''',
        r'''url\((["']?)(/assets/(?:shared|pages)/[^)"']+\.(?:png|jpg|jpeg|svg|webp))\1\)''',
    )
    for pattern in patterns[:2]:
        refs.extend(match.group(1) for match in re.finditer(pattern, html_text, re.IGNORECASE))
    refs.extend(match.group(2) for match in re.finditer(patterns[2], html_text, re.IGNORECASE))
    seen: set[str] = set()
    ordered: list[str] = []
    for ref in refs:
        if ref not in seen and ref not in IGNORED_ASSETS:
            seen.add(ref)
            ordered.append(ref)
    return ordered


def detect_variant(ref: str) -> str:
    lowered = ref.lower()
    if "consultant-lahore" in lowered:
        return "hero"
    if "page-breadcrumb" in lowered:
        return "breadcrumb"
    if "benefit" in lowered or "advantage" in lowered:
        return "benefits"
    if "process" in lowered or "procedure" in lowered:
        return "process"
    if "document" in lowered or "required" in lowered or "form" in lowered or "things-protected" in lowered or "minimum-requirements" in lowered:
        return "documents"
    if "example" in lowered:
        return "documents"
    return "overview"


def detect_topic(ref: str) -> str:
    lowered = ref.lower()
    name = pathlib.Path(lowered).name
    if "page-breadcrumb" in lowered:
        return "firm"
    if "homepage-feature-1" in lowered:
        return "feature_talk"
    if "homepage-feature-2" in lowered:
        return "feature_discuss"
    if "homepage-feature-3" in lowered:
        return "feature_solve"
    if "trademark" in lowered:
        return "trademark"
    if "copyright" in lowered:
        return "copyright"
    if "legal_agreements" in lowered or "drafting-agreements" in lowered or "contracts" in lowered:
        return "contracts"
    if "weboc" in lowered or "import-and-export" in lowered:
        return "weboc"
    if "tax_appeals" in lowered or name == "law.jpg":
        return "appeals"
    if "tax_notice" in lowered or "notice-and-audits" in lowered:
        return "audit"
    if "it_company_registration" in lowered or "pseb" in lowered or "call-cent" in lowered:
        return "it_company"
    if "real_estate" in lowered or "construction-company" in lowered or "real-estate" in lowered:
        return "real_estate"
    if "manufacturing" in lowered:
        return "manufacturing"
    if "register_llp" in lowered or "llp-" in lowered:
        return "llp"
    if "partnership" in lowered:
        return "partnership"
    if "sole_proprietorship" in lowered or "proprietorship" in lowered or "sole-proprietor" in lowered:
        return "sole"
    if "company_registration" in lowered or name == "company-registration.jpg":
        return "company"
    if "ntn" in lowered:
        return "ntn"
    if "sales_tax_registration_sales_tax_return" in lowered or "sales-tax" in lowered:
        return "sales_tax"
    if "registration_return_filing" in lowered or "pra" in lowered:
        return "pra"
    if "income-tax" in lowered or "return_filing" in lowered or "tax-filer" in lowered or "become-tax-filer" in lowered or name == "income-tax-filing.jpg":
        return "income_tax"
    if "chamber" in lowered or "lcci" in lowered:
        return "chamber"
    if "consultant-lahore" in lowered or "about-hero" in lowered:
        return "firm"
    return "firm"


def target_ref_for(old_ref: str) -> str:
    topic = detect_topic(old_ref)
    variant = detect_variant(old_ref)
    stem = slugify(pathlib.Path(old_ref).stem)
    return f"/assets/infographics/{topic}-{variant}-{stem}.svg"


def wrap_lines(text: str, width: int) -> list[str]:
    return wrap(text, width=width, break_long_words=False, break_on_hyphens=False)


def svg_text(x: int, y: int, lines: list[str], size: int, fill: str, weight: int = 500, line_height: int = 30) -> str:
    spans = []
    for index, line in enumerate(lines):
        dy = "0" if index == 0 else str(line_height)
        spans.append(f'<tspan x="{x}" dy="{dy}">{escape(line)}</tspan>')
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" fill="{fill}" font-family="Arial, Helvetica, sans-serif">{"".join(spans)}</text>'


def render_overview(profile: dict[str, object], title: str, stem_label: str) -> str:
    bg, primary, accent, pale = profile["palette"]  # type: ignore[misc]
    cards = profile["overview"]  # type: ignore[assignment]
    chips = profile["chips"]  # type: ignore[assignment]
    summary = wrap_lines(str(profile["summary"]), 36)

    chip_parts = []
    for index, chip in enumerate(chips):
        x = 96 + index * 166
        chip_parts.append(
            f'<rect x="{x}" y="382" width="146" height="46" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)"/>'
            f'<text x="{x + 73}" y="411" text-anchor="middle" font-size="19" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(str(chip))}</text>'
        )

    card_parts = []
    for index, (heading, detail) in enumerate(cards):
        top = 182 + index * 195
        card_parts.append(
            f'<rect x="896" y="{top}" width="580" height="150" rx="24" fill="rgba(255,255,255,0.92)"/>'
            f'<circle cx="946" cy="{top + 40}" r="18" fill="{accent}"/>'
            f'<text x="946" y="{top + 47}" text-anchor="middle" font-size="16" font-weight="700" fill="{bg}" font-family="Arial, Helvetica, sans-serif">{index + 1}</text>'
            f'<text x="982" y="{top + 46}" font-size="30" font-weight="800" fill="{bg}" font-family="Arial, Helvetica, sans-serif">{escape(heading)}</text>'
            f'{svg_text(930, top + 92, wrap_lines(detail, 33), 20, "#334155", 500, 26)}'
        )

    return f'''
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <circle cx="1320" cy="160" r="240" fill="{pale}" opacity="0.18"/>
  <circle cx="1240" cy="830" r="280" fill="#ffffff" opacity="0.07"/>
  <path d="M0 760 C220 700 320 640 470 560 C640 470 710 450 900 470 L900 1000 L0 1000 Z" fill="rgba(255,255,255,0.05)"/>
  <rect x="80" y="78" width="250" height="44" rx="16" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)"/>
  <text x="104" y="107" font-size="20" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(str(profile["eyebrow"]))}</text>
  <text x="92" y="220" font-size="70" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(title)}</text>
  {svg_text(94, 286, summary, 27, "#e5eef7", 500, 34)}
  {''.join(chip_parts)}
  <text x="94" y="510" font-size="22" font-weight="700" fill="{pale}" font-family="Arial, Helvetica, sans-serif">Service Snapshot</text>
  <line x1="94" y1="535" x2="750" y2="535" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
  <text x="94" y="610" font-size="26" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(stem_label)}</text>
  <text x="94" y="650" font-size="22" font-weight="500" fill="#dbeafe" font-family="Arial, Helvetica, sans-serif">Premium infographic refresh for this section.</text>
  <rect x="860" y="96" width="660" height="660" rx="36" fill="rgba(6,15,24,0.14)" stroke="rgba(255,255,255,0.16)"/>
  <text x="914" y="146" font-size="24" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Core Focus</text>
  {''.join(card_parts)}
'''


def render_benefits(profile: dict[str, object], title: str) -> str:
    bg, primary, accent, pale = profile["palette"]  # type: ignore[misc]
    cards = profile["benefits"]  # type: ignore[assignment]
    summary = wrap_lines(str(profile["summary"]), 34)
    rows = []
    widths = [360, 300, 420]
    for index, (heading, detail) in enumerate(cards):
        top = 282 + index * 180
        rows.append(
            f'<rect x="770" y="{top}" width="{widths[index]}" height="54" rx="20" fill="{accent}" opacity="0.88"/>'
            f'<text x="796" y="{top + 35}" font-size="24" font-weight="800" fill="{bg}" font-family="Arial, Helvetica, sans-serif">{escape(heading)}</text>'
            f'{svg_text(796, top + 96, wrap_lines(detail, 34), 21, "#f8fafc", 500, 26)}'
        )
    return f'''
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <rect x="0" y="0" width="1600" height="1000" fill="rgba(255,255,255,0.02)"/>
  <circle cx="1180" cy="210" r="290" fill="#ffffff" opacity="0.06"/>
  <circle cx="180" cy="780" r="220" fill="{pale}" opacity="0.12"/>
  <rect x="82" y="84" width="286" height="46" rx="16" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.16)"/>
  <text x="104" y="114" font-size="20" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Benefits Overview</text>
  <text x="92" y="222" font-size="68" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(title)}</text>
  {svg_text(94, 288, summary, 27, "#e5eef7", 500, 34)}
  <rect x="94" y="392" width="500" height="360" rx="32" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)"/>
  <text x="136" y="452" font-size="26" font-weight="700" fill="{pale}" font-family="Arial, Helvetica, sans-serif">What Improves</text>
  <text x="136" y="518" font-size="60" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">3</text>
  <text x="136" y="560" font-size="24" font-weight="700" fill="#dbeafe" font-family="Arial, Helvetica, sans-serif">clear reasons clients choose this route</text>
  <circle cx="180" cy="648" r="10" fill="{accent}"/>
  <text x="206" y="655" font-size="22" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Stronger protection and structure</text>
  <circle cx="180" cy="702" r="10" fill="{accent}"/>
  <text x="206" y="709" font-size="22" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">More confidence for investors and authorities</text>
  <circle cx="180" cy="756" r="10" fill="{accent}"/>
  <text x="206" y="763" font-size="22" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Cleaner compliance and operating discipline</text>
  {''.join(rows)}
'''


def render_process(profile: dict[str, object], title: str) -> str:
    bg, primary, accent, pale = profile["palette"]  # type: ignore[misc]
    cards = profile["process"]  # type: ignore[assignment]
    summary = wrap_lines(str(profile["summary"]), 35)
    steps = []
    for index, (heading, detail) in enumerate(cards):
        x = 112 + index * 470
        steps.append(
            f'<circle cx="{x}" cy="706" r="22" fill="{accent}"/>'
            f'<text x="{x}" y="713" text-anchor="middle" font-size="18" font-weight="700" fill="{bg}" font-family="Arial, Helvetica, sans-serif">{index + 1}</text>'
            f'<rect x="{x - 42}" y="756" width="330" height="150" rx="24" fill="rgba(255,255,255,0.92)"/>'
            f'<text x="{x - 12}" y="810" font-size="28" font-weight="800" fill="{bg}" font-family="Arial, Helvetica, sans-serif">{escape(heading)}</text>'
            f'{svg_text(x - 12, 854, wrap_lines(detail, 28), 20, "#334155", 500, 26)}'
        )
    return f'''
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <path d="M0 0 H1600 V360 C1350 460 1100 520 820 520 C580 520 250 430 0 290 Z" fill="rgba(255,255,255,0.06)"/>
  <circle cx="1360" cy="150" r="220" fill="{pale}" opacity="0.15"/>
  <rect x="82" y="82" width="230" height="46" rx="16" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.16)"/>
  <text x="104" y="112" font-size="20" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Process Map</text>
  <text x="92" y="220" font-size="68" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(title)}</text>
  {svg_text(94, 286, summary, 27, "#e5eef7", 500, 34)}
  <rect x="94" y="390" width="1408" height="220" rx="36" fill="rgba(6,15,24,0.12)" stroke="rgba(255,255,255,0.14)"/>
  <text x="138" y="452" font-size="28" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">How the filing route usually moves</text>
  <line x1="112" y1="706" x2="1410" y2="706" stroke="rgba(255,255,255,0.25)" stroke-width="6"/>
  {''.join(steps)}
'''


def render_documents(profile: dict[str, object], title: str) -> str:
    bg, primary, accent, pale = profile["palette"]  # type: ignore[misc]
    cards = profile["documents"]  # type: ignore[assignment]
    summary = wrap_lines(str(profile["summary"]), 35)
    blocks = []
    for index, (heading, detail) in enumerate(cards):
        x = 96 + index * 472
        blocks.append(
            f'<rect x="{x}" y="472" width="430" height="280" rx="30" fill="rgba(255,255,255,0.92)"/>'
            f'<rect x="{x + 34}" y="518" width="58" height="58" rx="18" fill="{accent}"/>'
            f'<text x="{x + 63}" y="555" text-anchor="middle" font-size="20" font-weight="800" fill="{bg}" font-family="Arial, Helvetica, sans-serif">{index + 1}</text>'
            f'<text x="{x + 114}" y="556" font-size="30" font-weight="800" fill="{bg}" font-family="Arial, Helvetica, sans-serif">{escape(heading)}</text>'
            f'{svg_text(x + 34, 620, wrap_lines(detail, 26), 21, "#334155", 500, 28)}'
            f'<line x1="{x + 34}" y1="684" x2="{x + 386}" y2="684" stroke="#d9e2ec" stroke-width="2"/>'
            f'<text x="{x + 34}" y="726" font-size="20" font-weight="700" fill="#64748b" font-family="Arial, Helvetica, sans-serif">Keep this part ready before filing.</text>'
        )
    return f'''
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <circle cx="1380" cy="138" r="230" fill="{pale}" opacity="0.14"/>
  <path d="M0 860 C220 760 460 720 700 740 C950 760 1200 860 1600 760 V1000 H0 Z" fill="rgba(255,255,255,0.05)"/>
  <rect x="82" y="84" width="278" height="46" rx="16" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.16)"/>
  <text x="104" y="114" font-size="20" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Document Checklist</text>
  <text x="92" y="220" font-size="66" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(title)}</text>
  {svg_text(94, 286, summary, 27, "#e5eef7", 500, 34)}
  <rect x="94" y="360" width="1408" height="84" rx="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)"/>
  <text x="128" y="412" font-size="26" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Prepare these items before you move forward.</text>
  {''.join(blocks)}
'''


def render_breadcrumb(profile: dict[str, object], title: str) -> str:
    bg, primary, accent, pale = profile["palette"]  # type: ignore[misc]
    chips = profile["chips"]  # type: ignore[assignment]
    summary = wrap_lines(str(profile["summary"]), 44)
    chip_parts = []
    for index, chip in enumerate(chips):
        x = 98 + index * 182
        chip_parts.append(
            f'<rect x="{x}" y="320" width="162" height="50" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.16)"/>'
            f'<text x="{x + 81}" y="352" text-anchor="middle" font-size="20" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(str(chip))}</text>'
        )
    return f'''
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <circle cx="1250" cy="220" r="330" fill="{pale}" opacity="0.14"/>
  <circle cx="1400" cy="780" r="250" fill="#ffffff" opacity="0.06"/>
  <path d="M0 1000 V690 C180 610 360 570 600 590 C900 615 1090 760 1600 690 V1000 Z" fill="rgba(255,255,255,0.05)"/>
  <rect x="84" y="86" width="248" height="46" rx="16" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.16)"/>
  <text x="106" y="116" font-size="20" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">Page Banner</text>
  <text x="96" y="224" font-size="74" font-weight="800" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(title)}</text>
  {svg_text(98, 282, summary, 28, "#e5eef7", 500, 35)}
  {''.join(chip_parts)}
'''


def render_hero(profile: dict[str, object]) -> str:
    bg, primary, accent, pale = profile["palette"]  # type: ignore[misc]
    chips = profile["chips"]  # type: ignore[assignment]
    chip_parts = []
    for index, chip in enumerate(chips):
        x = 1080 + index * 128
        chip_parts.append(
            f'<rect x="{x}" y="790" width="112" height="40" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.14)"/>'
            f'<text x="{x + 56}" y="816" text-anchor="middle" font-size="16" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(str(chip))}</text>'
        )
    return f'''
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <rect x="0" y="0" width="1600" height="1000" fill="rgba(6,15,24,0.12)"/>
  <circle cx="1290" cy="170" r="300" fill="{pale}" opacity="0.12"/>
  <circle cx="1330" cy="820" r="250" fill="#ffffff" opacity="0.06"/>
  <circle cx="260" cy="190" r="150" fill="#ffffff" opacity="0.04"/>
  <path d="M0 1000 V720 C180 620 360 560 650 560 C920 560 1140 640 1600 510 V1000 Z" fill="rgba(255,255,255,0.05)"/>
  <rect x="88" y="112" width="196" height="42" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)"/>
  <text x="110" y="140" font-size="18" font-weight="700" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">{escape(str(profile["eyebrow"]))}</text>
  <rect x="1050" y="146" width="430" height="650" rx="34" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)"/>
  <rect x="1090" y="220" width="310" height="108" rx="22" fill="rgba(255,255,255,0.9)"/>
  <rect x="1090" y="372" width="280" height="108" rx="22" fill="rgba(255,255,255,0.9)"/>
  <rect x="1090" y="524" width="330" height="108" rx="22" fill="rgba(255,255,255,0.9)"/>
  <text x="1130" y="262" font-size="26" font-weight="800" fill="{bg}" font-family="Arial, Helvetica, sans-serif">Registrations</text>
  <text x="1130" y="408" font-size="26" font-weight="800" fill="{bg}" font-family="Arial, Helvetica, sans-serif">Tax Filing</text>
  <text x="1130" y="560" font-size="26" font-weight="800" fill="{bg}" font-family="Arial, Helvetica, sans-serif">Legal Support</text>
  <line x1="92" y1="870" x2="940" y2="870" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
  {''.join(chip_parts)}
'''


def render_svg(topic: str, variant: str, old_ref: str) -> str:
    profile = PROFILES[topic]
    title = str(profile["title"])
    stem_label = pathlib.Path(old_ref).stem.replace("-", " ").replace("_", " ").title()
    bg, primary, accent, pale = profile["palette"]  # type: ignore[misc]

    if variant == "benefits":
        body = render_benefits(profile, title)
    elif variant == "process":
        body = render_process(profile, title)
    elif variant == "documents":
        body = render_documents(profile, title)
    elif variant == "hero":
        body = render_hero(profile)
    elif variant == "breadcrumb":
        body = render_breadcrumb(profile, title)
    else:
        body = render_overview(profile, title, stem_label)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-labelledby="title desc">
  <title id="title">{escape(title)}</title>
  <desc id="desc">{escape(str(profile["summary"]))}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="60%" stop-color="{primary}"/>
      <stop offset="100%" stop-color="{accent}"/>
    </linearGradient>
  </defs>
{body}
</svg>
'''


def replace_refs(base_html: str, replacements: dict[str, str]) -> str:
    updated = base_html
    for old_ref, new_ref in replacements.items():
        updated = re.sub(
            rf'''(src=["']){re.escape(old_ref)}(["'])''',
            rf"\1{new_ref}\2",
            updated,
            flags=re.IGNORECASE,
        )
        updated = re.sub(
            rf'''(content=["']){re.escape(old_ref)}(["'])''',
            rf"\1{new_ref}\2",
            updated,
            flags=re.IGNORECASE,
        )
        updated = re.sub(
            rf'''url\((["']?){re.escape(old_ref)}\1\)''',
            lambda match: f"url({match.group(1)}{new_ref}{match.group(1)})",
            updated,
            flags=re.IGNORECASE,
        )
    return updated


def add_infographic_class(html_text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        tag = match.group(0)
        if 'class="' in tag:
            return re.sub(r'class="([^"]*)"', lambda m: f'class="{m.group(1)} anjum-infographic"', tag, count=1)
        return tag.replace("<img", '<img class="anjum-infographic"', 1)

    return re.sub(r'<img\b[^>]*src=["\'](/assets/infographics/[^"\']+)["\'][^>]*>', repl, html_text, flags=re.IGNORECASE)


def main() -> None:
    html_files = sorted(ROOT.rglob("*.html"))
    all_replacements: dict[str, str] = {}

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for html_file in html_files:
        original = run_git_show(html_file) or html_file.read_text(encoding="utf-8", errors="ignore")
        refs = extract_asset_refs(original)
        replacements = {old_ref: target_ref_for(old_ref) for old_ref in refs}
        all_replacements.update(replacements)

        rewritten = replace_refs(original, replacements)
        rewritten = add_infographic_class(rewritten)
        html_file.write_text(rewritten, encoding="utf-8")

    for old_ref, new_ref in sorted(all_replacements.items()):
        out_path = ROOT / new_ref.lstrip("/")
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(
            render_svg(detect_topic(old_ref), detect_variant(old_ref), old_ref),
            encoding="utf-8",
        )

    print(f"Generated {len(all_replacements)} stable infographic assets and rewrote HTML from original page references.")


if __name__ == "__main__":
    main()
