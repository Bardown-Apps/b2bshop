import { useSelector } from "react-redux";
import Input from "@/components/Input";

const ContactInformation = ({ control }) => {
  const authToken = useSelector((s) => s?.auth?.token);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">Contact information</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="userName"
          label="First Name"
          control={control}
          required
          rules={{
            required: "First Name is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "First Name is required";
              }
              return true;
            },
          }}
          placeholder="Enter your first name"
        />
        <Input
          name="userLastName"
          label="Last Name"
          control={control}
          required
          rules={{
            required: "Last Name is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "Last Name is required";
              }
              return true;
            },
          }}
          placeholder="Enter your last name"
        />

        <Input
          name="email"
          label="Email"
          type="email"
          control={control}
          disabled={!!authToken}
          required
          rules={{
            required: "Email is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "Email is required";
              }
              return true;
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          placeholder="Enter email"
        />

        <Input
          name="phone"
          label="Phone"
          type="number"
          control={control}
          required
          rules={{
            required: "Phone is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "Phone is required";
              }
              return true;
            },
            pattern: {
              value: /^\+?\d{10,15}$/,
              message: "Invalid phone number",
            },
          }}
          placeholder="Enter phone"
        />
      </div>
    </section>
  );
};

export default ContactInformation;
