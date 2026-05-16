// Report API Functions
// Add these to frontend/src/services/api.js
// Or create separate file: frontend/src/services/reportApi.js

import API from './api';
export const downloadTransactionReport = async () => {
  try {
    const response = await API.post('/reports/download', {}, {
      responseType: 'blob' // Important: receive as blob (file)
    });

    // Create URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finance-report-${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('✅ Report downloaded successfully');
    return true;

  } catch (error) {
    console.error('❌ Error downloading report:', error.message);
    throw {
      message: error.response?.data?.message || 'Failed to download report',
      code: error.response?.data?.code || 'DOWNLOAD_FAILED'
    };
  }
};

/**
 * Send transaction report via email
 * Backend generates PDF and sends it to user's email
 */
export const sendTransactionReportByEmail = async () => {
  try {
    const response = await API.post('/reports/email');
    
    console.log('✅ Report sent by email successfully');
    return response.data; // Returns { message, stats }

  } catch (error) {
    console.error('❌ Error sending report:', error.message);
    throw {
      message: error.response?.data?.message || 'Failed to send report',
      code: error.response?.data?.code || 'EMAIL_FAILED'
    };
  }
};
