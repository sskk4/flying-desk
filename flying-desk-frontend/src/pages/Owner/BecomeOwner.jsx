import React from "react";
import { Routes, Route } from "react-router-dom";
import Start from "./Submission/Start";
import TermsContainer from "./Submission/Terms";
import SubmissionsForm from "./Submission/AddSubmission";

const BecomeOwner = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/terms" element={<TermsContainer />} />
      <Route path="/add/submission" element={<SubmissionsForm />} />
    </Routes>
  );
};

export default BecomeOwner;