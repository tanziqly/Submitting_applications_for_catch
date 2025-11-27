import { useState } from "react";
import { api } from "@shared/api/axios";
import { SourceOptions } from "@shared/config/selectOptions";

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
  const [customSourceName, setCustomSourceName] = useState("");
  const [showCustomSource, setShowCustomSource] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSubmitError(null);
  };

  const handleSelectChange = (field: string) => (selectedValue: string) => {
    console.log(`handleSelectChange: ${field} = ${selectedValue}`);
    
    if (field === "applicant") {
      setFormData((prev) => ({
        ...prev,
        applicant: {
          id: selectedValue,
        },
      }));
    } else if (field === "source") {
      if (!showCustomSource) {
        setFormData((prev) => ({
          ...prev,
          source: {
            id: selectedValue,
          },
        }));
      }
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
      let sourceName = "";
      
      if (showCustomSource) {
        sourceName = customSourceName;
        console.log("Using CUSTOM source name:", sourceName);
      } else {
        const selectedSource = SourceOptions.find(option => option.value === formData.source.id);
        console.log("Looking for source with ID:", formData.source.id, "Available options:", SourceOptions);
        
        if (selectedSource) {
          sourceName = selectedSource.label;
          console.log("Using SELECTED source from options:", selectedSource.label);
        } else {
          sourceName = formData.source.id;
          console.log("Using source ID as name (not found in options):", formData.source.id);
        }
      }

      console.log("DEBUG - Final values:", {
        showCustomSource,
        customSourceName,
        sourceId: formData.source.id,
        finalSourceName: sourceName
      });

      if (!sourceName) {
        throw new Error("Не заполнены сведения о заявителе");
      }

      const submissionData = {
        applicant: {
          id: formData.applicant.id,
          name: ""
        },
        source: {
          id: "",
          name: sourceName
        },
        address: formData.address,
        dogs_count: Number(formData.dogs_count),
        behavior: formData.behavior,
        urgency: formData.urgency,
        contact_person: formData.contact_person,
      };

      console.log("Отправка данных на /requests:", submissionData);

      const response = await api.post("/requests", submissionData);

      console.log("Успешный ответ от сервера:", response.data);

      setSubmitSuccess(true);
      handleClear();

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error("Ошибка при отправке заявки:", error);

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
    setCustomSourceName("");
    setShowCustomSource(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const toggleCustomSource = () => {
    const newShowCustomSource = !showCustomSource;
    setShowCustomSource(newShowCustomSource);
    
    if (newShowCustomSource) {
      setFormData(prev => ({ ...prev, source: { id: "" } }));
    } else {
      setCustomSourceName("");
    }
  };

  return {
    loading,
    submitError,
    submitSuccess,
    formData,
    customSourceName,
    setCustomSourceName,
    showCustomSource,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClear,
    toggleCustomSource,
    setFormData,
  };
};