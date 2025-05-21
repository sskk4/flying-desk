import axiosOffice from './axiosOffice';

const fetchUserSubmissionStatus = async (userId) => {
  console.log("Fetching submission status for User ID:", userId);
  
  if (!userId) {
    console.error('User ID is required for fetching submission status');
    return null;
  }
  
  try {
    const response = await axiosOffice.get(`/submissions/status/${userId}`);
    console.log('Full submission status response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching submission status:', error.response || error.message);
    return null;
  }
};

export default fetchUserSubmissionStatus;