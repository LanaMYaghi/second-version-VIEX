import UsersCrudPage from "../components/UsersCrudPage";
import { getTeacherFormFields } from "../constants/formConfigs.js";

const columns = [
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "number_phone", label: "Phone" },
  { key: "gender", label: "Gender" },
  { key: "nationality", label: "Nationality" },
  { key: "specialization", label: "Specialization" },
  { key: "salary", label: "Salary ($)" },
];

export default function TeachersPage() {
  return (
    <UsersCrudPage
      type="teachers"
      title="Teachers"
      singular="Teacher"
      getFields={getTeacherFormFields}
      columns={columns}
    />
  );
}
