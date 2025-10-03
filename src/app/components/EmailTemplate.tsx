import * as React from 'react';
import { Html, Head, Body, Container, Text } from '@react-email/components';

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function EmailTemplate({firstName, lastName, email, phone, subject, message}: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#47302e' }}>
            New Contact Form Submission
          </Text>
          
          <Text style={{ fontSize: '16px', marginTop: '20px' }}>
            <strong>Name:</strong> {firstName} {lastName}
          </Text>
          
          <Text style={{ fontSize: '16px' }}>
            <strong>Email:</strong> {email}
          </Text>
          
          <Text style={{ fontSize: '16px' }}>
            <strong>Phone:</strong> {phone}
          </Text>
          
          <Text style={{ fontSize: '16px' }}>
            <strong>Subject:</strong> {subject}
          </Text>
          
          <Text style={{ fontSize: '16px', marginTop: '20px' }}>
            <strong>Message:</strong>
          </Text>
          
          <Text style={{ 
            fontSize: '14px', 
            padding: '15px', 
            backgroundColor: '#f9f9f9', 
            border: '1px solid #ddd',
            whiteSpace: 'pre-wrap'
          }}>
            {message}
          </Text>
          
          <Text style={{ 
            fontSize: '14px', 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#ffdeda'
          }}>
            This message was sent from the Merry Cookies contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}