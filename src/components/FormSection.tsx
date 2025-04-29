
import React from 'react';
import { FormSection as FormSectionType, FormField as FormFieldType } from '../types/form';
import FormField from './FormField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface FormSectionProps {
  section: FormSectionType;
  values: Record<string, any>;
  errors: Record<string, string>;
  onChange: (fieldId: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  values,
  errors,
  onChange,
  onNext,
  onPrev,
  onSubmit,
  isFirst,
  isLast,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={values[field.fieldId]}
            onChange={onChange}
            error={errors[field.fieldId]}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isFirst && (
          <Button
            variant="outline"
            onClick={onPrev}
            data-testid={`section-${section.sectionId}-prev-button`}
          >
            Previous
          </Button>
        )}
        <div className="flex-grow"></div>
        {isLast ? (
          <Button 
            onClick={onSubmit}
            data-testid="form-submit-button"
          >
            Submit
          </Button>
        ) : (
          <Button 
            onClick={onNext}
            data-testid={`section-${section.sectionId}-next-button`}
          >
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FormSection;
