import React, { useState } from 'react';
import instance from '../../utils/axiosinstance';
import { useAuth } from '../../contexts/AuthContext';
import { useNotificationContext, Notification } from '../../contexts/NotificationContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminNewsletterSender = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { state: { user } } = useAuth();
  const { setNotifications } = useNotificationContext();

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title: type === 'success' ? 'Success' : 'Error',
      message,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium',
      category: 'system'
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center p-8 text-red-500">
        Access Denied. You must be an administrator to view this page.
      </div>
    );
  }

  const sendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await instance.post('/api/email/send', {
        subject,
        content: body,
        targetGroup
      });
      addNotification('Newsletter sent successfully!', 'success');
      console.log('Newsletter sent:', response.data);
      setSubject('');
      setBody('');
      setTargetGroup('all');
    } catch (error) {
      console.error('Error sending newsletter', error);
      addNotification('Failed to send newsletter.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">📢 Send Newsletter</h2>
      <form onSubmit={sendNewsletter}>
        {/* Subject */}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject <span className="text-xs text-gray-400">({subject.length}/100)</span>
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={100}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>

        {/* Target Group */}
        <div className="mb-4">
          <label htmlFor="group" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Group
          </label>
          <select
            id="group"
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">All Users</option>
            <option value="newsletter_subscribers">Newsletter Subscribers</option>
            <option value="admin_users">Admin Users</option>
          </select>
        </div>

        {/* Rich Text Editor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body</label>
          <ReactQuill
            theme="snow"
            value={body}
            onChange={setBody}
            className="bg-white dark:bg-gray-100"
          />
        </div>

        {/* Preview Toggle */}
        <div className="mb-4">
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isPreviewing}
              onChange={() => setIsPreviewing(!isPreviewing)}
            />
            <span className="text-gray-700 dark:text-gray-300">Preview before sending</span>
          </label>
        </div>

        {/* Preview Section */}
        {isPreviewing && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded border dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">📄 Preview</h3>
            <h4 className="font-bold">{subject}</h4>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSending}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-sm ${
            isSending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isSending ? 'Sending...' : 'Send Newsletter'}
        </button>
      </form>
    </div>
  );
};

export default AdminNewsletterSender;
