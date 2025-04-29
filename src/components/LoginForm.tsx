
import React, { useState } from 'react';
import { User } from '../types/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  onLogin: (user: User) => Promise<void>;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ rollNumber?: string; name?: string }>({});
  const { toast } = useToast();

  const validate = (): boolean => {
    const newErrors: { rollNumber?: string; name?: string } = {};
    
    if (!rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await onLogin({ rollNumber, name });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Could not log in with the provided details.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Student Login</CardTitle>
        <CardDescription>Enter your details to proceed to the form</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter your roll number"
              data-testid="roll-number-input"
              className={errors.rollNumber ? "border-red-500" : ""}
            />
            {errors.rollNumber && <p className="text-sm text-red-500">{errors.rollNumber}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              data-testid="name-input"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            data-testid="login-button"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
