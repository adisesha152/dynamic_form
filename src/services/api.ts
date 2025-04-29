
import { FormResponse, User } from '../types/form';

const BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

export const createUser = async (user: User): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    
    // Treat 409 (Conflict - User already exists) as a success case
    if (response.status === 409) {
      const data = await response.json();
      return {
        success: true, // Consider this a successful login even though user already exists
        message: data.message || 'User already exists',
      };
    }
    
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || 'User created successfully',
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: 'Failed to create user. Please try again.',
    };
  }
};

export const getFormStructure = async (rollNumber: string): Promise<FormResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}/get-form?rollNumber=${rollNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch form');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching form:', error);
    return null;
  }
};
