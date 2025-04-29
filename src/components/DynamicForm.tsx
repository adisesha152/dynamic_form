
import React, { useState } from 'react';
import { FormResponse, FormSection, FormValues } from '../types/form';
import FormSectionComponent from './FormSection';
import { useToast } from '@/components/ui/use-toast';

interface DynamicFormProps {
  formData: FormResponse;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const currentSection = formData.form.sections[currentSectionIndex];

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear error for this field when modified
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (section: FormSection): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];
      
      // Check required fields
      if (field.required && (value === undefined || value === '' || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.fieldId] = field.validation?.message || 'This field is required';
        isValid = false;
      }

      // Check min length
      if (field.minLength !== undefined && typeof value === 'string' && value.length < field.minLength) {
        newErrors[field.fieldId] = field.validation?.message || `Minimum length is ${field.minLength} characters`;
        isValid = false;
      }

      // Check max length
      if (field.maxLength !== undefined && typeof value === 'string' && value.length > field.maxLength) {
        newErrors[field.fieldId] = field.validation?.message || `Maximum length is ${field.maxLength} characters`;
        isValid = false;
      }
      
      // Email validation
      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value as string)) {
        newErrors[field.fieldId] = field.validation?.message || 'Please enter a valid email address';
        isValid = false;
      }
      
      // Tel validation (basic)
      if (field.type === 'tel' && value && !/^\+?[0-9\s()-]+$/.test(value as string)) {
        newErrors[field.fieldId] = field.validation?.message || 'Please enter a valid phone number';
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSectionIndex((prevIndex) => prevIndex + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleSubmit = () => {
    if (validateSection(currentSection)) {
      console.log('Form submitted with values:', formValues);
      toast({
        title: "Form Submitted",
        description: "Your form has been successfully submitted.",
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">{formData.form.formTitle}</h1>
        <div className="mt-2 flex justify-center">
          <div className="flex space-x-2">
            {formData.form.sections.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-6 rounded-full ${
                  index === currentSectionIndex 
                    ? 'bg-blue-600' 
                    : index < currentSectionIndex 
                    ? 'bg-blue-300' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </header>
      
      <FormSectionComponent
        section={currentSection}
        values={formValues}
        errors={formErrors}
        onChange={handleFieldChange}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        isFirst={currentSectionIndex === 0}
        isLast={currentSectionIndex === formData.form.sections.length - 1}
      />
    </div>
  );
};

export default DynamicForm;
