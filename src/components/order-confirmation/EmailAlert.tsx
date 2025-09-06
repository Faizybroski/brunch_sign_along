
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle } from 'lucide-react';

interface EmailAlertProps {
  simulatedEmail: boolean;
  email?: string;
  orderType: string;
}

const EmailAlert: React.FC<EmailAlertProps> = ({ simulatedEmail, email, orderType }) => {
  return (
    <>
      {simulatedEmail ? (
        <Alert variant="default" className="bg-blue-50 border-blue-200 mb-6 text-blue-800">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm">
            This is a development environment. In production, receipt emails would be sent to {email}. 
            To enable real email sending, verify your domain in Resend.com and update the from address in the edge function.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              {orderType === 'ticket' 
                ? "Your tickets have been sent to your email. Please check your inbox and spam folder."
                : "Your order confirmation has been sent to your email. Please check your inbox and spam folder."
              }
              {" "}If you don't receive your {orderType === 'ticket' ? 'tickets' : 'receipt'} within 10 minutes, please contact support at tickets@brunchsingalong.com
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailAlert;
