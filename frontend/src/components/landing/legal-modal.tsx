"use client";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy" | null;
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FFFFFF] border border-[#E8F3E6] rounded-xl p-6 text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E8F3E6]">
          <h2 className="text-xl font-semibold text-[#0F2F1E]">
            {type === "terms" ? "Terms of Service" : "Privacy Policy"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#E7E9E1] text-[#1A1A1A] hover:bg-[#CBD2C4] text-sm font-semibold"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="pt-4 text-sm leading-relaxed text-[#5C645C] space-y-4">
          {type === "terms" ? (
            <>
              <p>
                <strong>1. Operational Service Scope:</strong> PeoplePay360 provides an integrated HR and payroll calculation management platform. By accessing this platform, enterprise clients and authorized personnel agree to adhere to compliant payroll scheduling, contract governance, and authorized operational workflows.
              </p>
              <p>
                <strong>2. Calculation Engine and Audit Trails:</strong> All salary calculations, rule evaluations, and What-If simulation records are provided based on the configured inputs. While our calculation engine provides mathematical traceability and sequenced execution, client organizations remain responsible for verifying jurisdictional statutory filings.
              </p>
              <p>
                <strong>3. Simulation Isolation:</strong> Any calculations performed in What-If mode represent isolated sandbox evaluations. They do not constitute official accounting books or finalized disbursements until explicitly committed by an authorized Payroll Manager.
              </p>
              <p>
                <strong>4. Account and Role Permissions:</strong> Platform users must safeguard credentials and access permissions in accordance with defined roles (Employee, HR Manager, Payroll Manager, Administrator).
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Data Collection and Processing:</strong> PeoplePay360 collects and processes organizational employee data, including contract parameters, attendance timestamps, approved leave balances, and compensation rules strictly to execute verified payroll runs.
              </p>
              <p>
                <strong>2. Data Encryption and Privacy:</strong> All personally identifiable information (PII) and compensation figures are encrypted in transit and at rest. Access is governed by strict role-based access controls and row-level database policies.
              </p>
              <p>
                <strong>3. Data Retention and Portability:</strong> Organizations retain absolute ownership of their employee rosters, historical payruns, and calculation traces. Export utilities are available to administrative users at any time in standardized formats.
              </p>
              <p>
                <strong>4. Compliance Contact:</strong> For inquiries regarding data protection policies or audit verification records, contact our security administration desk.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#E8F3E6] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0F2F1E] text-white text-sm font-medium hover:bg-[#1F4D32]"
          >
            Acknowledge and Close
          </button>
        </div>
      </div>
    </div>
  );
}
