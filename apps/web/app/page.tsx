//make it for use client
'use client';


import { useState } from 'react';
import {createUserSchema} from "@repo/utils"
import axios from 'axios';
export default function Home() {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

      event.preventDefault();
      const result = createUserSchema.safeParse({ name, email, password });

      if (!result.success) {
        console.error('Validation failed:', result.error.format());
        console.log('Validation failed:', result.error.format());
        setError('Validation failed. Please check your input.');
        return;
      }

      console.log('Form submitted:', { name, email, password });
      try{
        const response = await axios.post('http://localhost:8000/users', { name, email, password });
         
        console.log('Form submission successful:', response.data);
      } catch (error) {
        console.error('Error submitting form:', error);
        setError('Failed to submit form. Please try again.');
      }


  }
  return (
    <main>
      <form  onSubmit={handleSubmit} noValidate={true}>
        <input type="text" name="name" placeholder="Enter your name"  value={name} onChange={(e) => setName(e.target.value)}  />
        <input type="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  )
}