import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosinstance";

interface EmailLog {
  _id: string;
  subject: string;
  sentBy?: {
    email: string;
  };
  sentAt: string;
  recipients: string[];
}

const NewsletterLogs: React.FC = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get<{ logs: EmailLog[] }>("/api/email/logs");
        setLogs(res.data.logs);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📬 Newsletter Logs</h2>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 border"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {log.subject}
              </h3>
              <p className="text-sm text-gray-700">
                <strong>Sent by:</strong>{" "}
                <span className="text-gray-900">
                  {log.sentBy?.email || "N/A"}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <strong>Time:</strong>{" "}
                {new Date(log.sentAt).toLocaleString()}
              </p>
              <p className="text-sm mt-2">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  Recipients: {log.recipients.length}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsletterLogs;
