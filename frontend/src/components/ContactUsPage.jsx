import React from "react";
import { FiMail, FiUser, FiPhone } from "react-icons/fi";

const ContactForm = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
      <div className="w-full max-w-md p-8 shadow-xl rounded-lg bg-base-100">
        <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
        <form className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <a
              type="text"
              placeholder="Your full name"
              className="input input-bordered"
              required
            />
          
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Mobile</span>
            </label>
            <input
              type="tel"
              placeholder="123-456-7890"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-primary w-full">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
