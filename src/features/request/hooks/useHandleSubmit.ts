import { useState } from "react";
import { api } from "@shared/api/axios";

interface ApplicationData {
    applicant: {
        id: string;
    };
    source: {
        id: string;
    };
    address: string;
    dogs_count: number;
    behavior: string;
    urgency: string;
    contact_person: string;
}

export const useHandleSubmit = (initialFormData: ApplicationData) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<ApplicationData>(initialFormData);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSubmitError(null);
  };

  const handleSelectChange = (field: string) => (selectedValue: string) => {
    if (field === "applicant") {
      setFormData((prev) => ({
        ...prev,
        applicant: { id: selectedValue },
      }));
    } else if (field === "source") {
      setFormData((prev) => ({
        ...prev,
        source: { id: selectedValue },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: selectedValue,
      }));
    }
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const submissionData = {
        applicant_id: formData.applicant.id,
        ter_otdel_id: formData.source.id,
        address: formData.address,
        dogs_count: Number(formData.dogs_count),
        behavior: formData.behavior,
        urgency: formData.urgency,
        contact_person: formData.contact_person,
      };

      await api.post("/requests", submissionData);

      setSubmitSuccess(true);
      handleClear();

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      if (error.response?.data) {
        const serverError = error.response.data;
        if (typeof serverError === "object") {
          const errorMessages = Object.values(serverError).flat();
          setSubmitError(
            errorMessages.join(", ") || "Ошибка при отправке заявки"
          );
        } else if (typeof serverError === "string") {
          setSubmitError(serverError);
        } else {
          setSubmitError("Ошибка при отправке заявки. Попробуйте позже.");
        }
      } else {
        setSubmitError(
          error.message ||
            "Произошла ошибка при отправке заявки. Попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  return {
    loading,
    submitError,
    submitSuccess,
    formData,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClear,
    setFormData,
  };
};