
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Reply, Mail, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  subject: string;
  created_at: string;
}

const AdminContactMessages = () => {
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch contact messages
  const { data: contactMessages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Send reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: async ({ messageId, reply }: { messageId: string, reply: string }) => {
      const message = contactMessages.find(m => m.id === messageId);
      if (!message) throw new Error("Message not found");

      console.log("Sending reply to contact message:", {
        messageId,
        to: message.email,
        name: message.name,
        originalMessage: message.message,
        replyMessage: reply
      });

      const { data, error } = await supabase.functions.invoke("reply-to-contact", {
        body: {
          to: message.email,
          name: message.name,
          originalMessage: message.message,
          replyMessage: reply
        }
      });

      console.log("Edge function response:", data);

      if (error) {
        console.error("Error from edge function:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log("Reply sent successfully:", data);
      if (data?.simulation) {
        toast.success("Reply sent successfully! (Simulation mode - check console for details)");
      } else {
        toast.success("Reply sent successfully!");
      }
      refetchMessages();
      setReplyMessage("");
      setReplyingTo(null);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error sending reply:', error);
      toast.error("Failed to send reply. Check console for details.");
    }
  });

  const handleReply = (message: ContactMessage) => {
    setReplyingTo(message);
    setReplyMessage("");
    setIsDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!replyingTo || !replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    sendReplyMutation.mutate({
      messageId: replyingTo.id,
      reply: replyMessage.trim()
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
            <p className="text-gray-600 mt-1">Manage and reply to customer inquiries</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contactMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contact messages found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={message.message}>
                          {message.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(message.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReply(message)}
                          disabled={sendReplyMutation.isPending}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Reply Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reply to Contact Message</DialogTitle>
            </DialogHeader>
            
            {replyingTo && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Original Message from {replyingTo.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">Email: {replyingTo.email}</p>
                  <p className="text-sm text-gray-600">Subject: {replyingTo.subject}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(replyingTo.created_at).toLocaleString()}</p>
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-gray-700">{replyingTo.message}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reply-message">Your Reply</Label>
                  <Textarea
                    id="reply-message"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={sendReplyMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendReply}
                    disabled={sendReplyMutation.isPending || !replyMessage.trim()}
                    className="bg-brunch-purple hover:bg-brunch-purple-dark"
                  >
                    {sendReplyMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Reply className="h-4 w-4 mr-1" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminContactMessages;
