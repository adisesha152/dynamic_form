
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import DynamicForm from '../components/DynamicForm';
import { createUser, getFormStructure } from '../services/api';
import { FormResponse, User } from '../types/form';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (userData: User) => {
    setIsLoading(true);
    try {
      // Create user or login existing user
      const createResult = await createUser(userData);
      
      if (!createResult.success) {
        toast({
          title: "Login Failed",
          description: createResult.message,
          variant: "destructive",
        });
        return;
      }
      
      // Fetch form structure
      const formStructure = await getFormStructure(userData.rollNumber);
      
      if (!formStructure) {
        toast({
          title: "Error",
          description: "Failed to fetch form structure. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setUser(userData);
      setFormData(formStructure);
      
      toast({
        title: "Login Successful",
        description: "You've been logged in successfully.",
      });
    } catch (error) {
      console.error('Login process failed:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-900">Dynamic Form Builder</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {!user ? (
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        ) : formData ? (
          <DynamicForm formData={formData} />
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading form...</p>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Dynamic Form Builder Application
        </div>
      </footer>
    </div>
  );
};

export default Index;
