import * as React from "react";

export interface ConsultationEmailProps {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  goals: string;
  additionalInfo?: string | null;
  scheduledDateTime?: string | null;
}

export const ConsultationEmailTemplate = ({
  fullName,
  email,
  phone,
  company,
  jobTitle,
  consultationType,
  preferredDate,
  preferredTime,
  goals,
  additionalInfo,
}: ConsultationEmailProps) => {
  // Format the date and time for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getConsultationTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      "career-transition": "Career Transition",
      "skill-development": "Skill Development",
      "course-selection": "Course Selection",
      "certification-guidance": "Certification Guidance",
      "general-inquiry": "General Inquiry",
    };
    return types[type] || type;
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #4338ca 100%)",
          padding: "40px 30px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px",
          }}
        >
          ProdDev Hub
        </h1>
        <p style={{ color: "#bfdbfe", fontSize: "14px", margin: "0" }}>
          Your Professional Development Journey
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px 30px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#1e293b",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          🎉 Consultation Confirmed!
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
          }}
        >
          Hi {fullName},
        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
          }}
        >
          Great news! Your consultation with our career development expert has
          been successfully scheduled. We are excited to help you advance your
          professional journey.
        </p>

        {/* Consultation Details */}
        <div
          style={{
            backgroundColor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
            margin: "24px 0",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0 0 15px 0",
            }}
          >
            📅 Consultation Details
          </h3>

          <div style={{ margin: "12px 0", fontSize: "14px" }}>
            <strong
              style={{
                fontWeight: "600",
                color: "#374151",
                minWidth: "140px",
                display: "inline-block",
              }}
            >
              Date & Time:
            </strong>
            <span style={{ color: "#6b7280" }}>
              {formatDate(preferredDate)} at {formatTime(preferredTime)} (30
              minutes)
            </span>
          </div>

          <div style={{ margin: "12px 0", fontSize: "14px" }}>
            <strong
              style={{
                fontWeight: "600",
                color: "#374151",
                minWidth: "140px",
                display: "inline-block",
              }}
            >
              Type:
            </strong>
            <span style={{ color: "#6b7280" }}>
              {getConsultationTypeLabel(consultationType)}
            </span>
          </div>

          <div style={{ margin: "12px 0", fontSize: "14px" }}>
            <strong
              style={{
                fontWeight: "600",
                color: "#374151",
                minWidth: "140px",
                display: "inline-block",
              }}
            >
              Meeting Link:
            </strong>
            <span style={{ color: "#6b7280" }}>
              Will be sent 24 hours before the meeting
            </span>
          </div>
        </div>

        {/* Personal Information */}
        <div
          style={{
            backgroundColor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
            margin: "24px 0",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0 0 15px 0",
            }}
          >
            👤 Your Information
          </h3>

          <div style={{ margin: "12px 0", fontSize: "14px" }}>
            <strong
              style={{
                fontWeight: "600",
                color: "#374151",
                minWidth: "140px",
                display: "inline-block",
              }}
            >
              Name:
            </strong>
            <span style={{ color: "#6b7280" }}>{fullName}</span>
          </div>

          <div style={{ margin: "12px 0", fontSize: "14px" }}>
            <strong
              style={{
                fontWeight: "600",
                color: "#374151",
                minWidth: "140px",
                display: "inline-block",
              }}
            >
              Email:
            </strong>
            <span style={{ color: "#6b7280" }}>{email}</span>
          </div>

          {phone && (
            <div style={{ margin: "12px 0", fontSize: "14px" }}>
              <strong
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  minWidth: "140px",
                  display: "inline-block",
                }}
              >
                Phone:
              </strong>
              <span style={{ color: "#6b7280" }}>{phone}</span>
            </div>
          )}

          {company && (
            <div style={{ margin: "12px 0", fontSize: "14px" }}>
              <strong
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  minWidth: "140px",
                  display: "inline-block",
                }}
              >
                Company:
              </strong>
              <span style={{ color: "#6b7280" }}>{company}</span>
            </div>
          )}

          {jobTitle && (
            <div style={{ margin: "12px 0", fontSize: "14px" }}>
              <strong
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  minWidth: "140px",
                  display: "inline-block",
                }}
              >
                Job Title:
              </strong>
              <span style={{ color: "#6b7280" }}>{jobTitle}</span>
            </div>
          )}
        </div>

        {/* Goals */}
        <div
          style={{
            backgroundColor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
            margin: "24px 0",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0 0 15px 0",
            }}
          >
            🎯 Your Goals
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: "#374151",
              fontStyle: "italic",
              margin: "0",
            }}
          >
            &quot;{goals}&quot;
          </p>

          {additionalInfo && (
            <>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1e293b",
                  margin: "20px 0 10px 0",
                }}
              >
                Additional Information:
              </h4>
              <p
                style={{
                  fontSize: "16px",
                  color: "#374151",
                  fontStyle: "italic",
                  margin: "0",
                }}
              >
                &quot;{additionalInfo}&quot;
              </p>
            </>
          )}
        </div>

        {/* What to Expect */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1e293b",
            margin: "30px 0 15px 0",
          }}
        >
          💡 What to Expect
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
          }}
        >
          During our 30-minute consultation, we will:
        </p>
        <ul
          style={{
            color: "#475569",
            fontSize: "14px",
            lineHeight: "1.6",
            paddingLeft: "20px",
          }}
        >
          <li>Discuss your career goals and current challenges</li>
          <li>Identify skill gaps and learning opportunities</li>
          <li>Recommend personalized learning paths</li>
          <li>Answer questions about our courses and certifications</li>
          <li>Create an action plan for your professional development</li>
        </ul>

        {/* Need to Reschedule */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            padding: "16px",
            borderRadius: "8px",
            margin: "20px 0",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#92400e", fontSize: "14px", margin: "0" }}>
            Need to reschedule? Please email us at{" "}
            <a
              href="mailto:consultations@proddevhub.com"
              style={{ color: "#d97706" }}
            >
              consultations@proddevhub.com
            </a>{" "}
            at least 24 hours in advance.
          </p>
        </div>

        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
          }}
        >
          We look forward to speaking with you and helping you take the next
          step in your career!
        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
          }}
        >
          Best regards,
          <br />
          The ProdDev Hub Team
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "30px",
          textAlign: "center",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 15px 0" }}>
          Questions? Contact us at{" "}
          <a href="mailto:support@proddevhub.com" style={{ color: "#2563eb" }}>
            support@proddevhub.com
          </a>
        </p>

        <p style={{ color: "#94a3b8", fontSize: "12px", margin: "15px 0 0 0" }}>
          © 2024 ProdDev Hub. All rights reserved.
          <br />
          Professional Development | Expert Learning | Career Growth
        </p>
      </div>
    </div>
  );
};

export default ConsultationEmailTemplate;
