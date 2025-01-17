import axiosSubmissions from './axiosOffice';

const fetchUserSubmissionStatus = async (userId) => {
  console.log("Fetching submission status for User ID:", userId);
  try {
      const response = await axiosSubmissions.get(`/submissions/status/${userId}`);
      console.log('Full response:', response);

      // Zwróć response.data bez dalszej walidacji, ponieważ jest to string
      return response.data || null;
  } catch (error) {
      console.error('Error fetching submission status:', error.response || error.message);
      return null;
  }
};


  
export default fetchUserSubmissionStatus;