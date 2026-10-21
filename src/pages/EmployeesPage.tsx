import UsersCrudPage from "../components/UsersCrudPage";
import { getEmployeeFormFields } from "../constants/formConfigs.js";

const columns = [
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "number_phone", label: "Phone" },
  { key: "position", label: "Position" },
  { key: "salary", label: "Salary" },
  { key: "address", label: "Address" },
];

export default function EmployeesPage() {
  return (
    <UsersCrudPage
      type="employees"
      title="Employees"
      singular="Employee"
      getFields={getEmployeeFormFields}
      columns={columns}
    />
  );
}
