import axiosSubmissions from './axiosOffice';

const fetchUserSubmissionStatus = async (userId) => {
  console.log("Fetching submission status for User ID:", userId);
  try {
      const response = await axiosSubmissions.get(`/submissions/status/${userId}`);
      console.log('Full response:', response);

      return response.data || null;
  } catch (error) {
      console.error('Error fetching submission status:', error.response || error.message);
      return null;
  }
};


  
export default fetchUserSubmissionStatus;